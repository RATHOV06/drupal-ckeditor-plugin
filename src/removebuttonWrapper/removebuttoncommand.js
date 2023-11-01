/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Command } from '@ckeditor/ckeditor5-core';
import { findAttributeRange } from '@ckeditor/ckeditor5-typing';
import { toMap } from '@ckeditor/ckeditor5-utils';
import getRangeText from './utils.js';

export default class RemovebuttonCommand extends Command {
    refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const firstRange = selection.getFirstRange();

		// When the selection is collapsed, the command has a value if the caret is in an removebutton.
		if ( firstRange.isCollapsed ) {
			if ( selection.hasAttribute( 'removebutton' ) ) {
				const attributeValue = selection.getAttribute( 'removebutton' );

				// Find the entire range containing the removebutton under the caret position.
				const removebuttonRange = findAttributeRange( selection.getFirstPosition(), 'removebutton', attributeValue, model );

				this.value = {
					abbr: getRangeText( removebuttonRange ),
					title: attributeValue,
					range: removebuttonRange
				};
			} else {
				this.value = null;
			}
		}
		// When the selection is not collapsed, the command has a value if the selection contains a subset of a single removebutton
		// or an entire removebutton.
		else {
			if ( selection.hasAttribute( 'removebutton' ) ) {
				const attributeValue = selection.getAttribute( 'removebutton' );

				// Find the entire range containing the removebutton under the caret position.
				const removebuttonRange = findAttributeRange( selection.getFirstPosition(), 'removebutton', attributeValue, model );

				if ( removebuttonRange.containsRange( firstRange, true ) ) {
					this.value = {
						abbr: getRangeText( firstRange ),
						title: attributeValue,
						range: firstRange
					};
				} else {
					this.value = null;
				}
			} else {
				this.value = null;
			}
		}

		// The command is enabled when the "removebutton" attribute can be set on the current model selection.
		this.isEnabled = model.schema.checkAttributeInSelection( selection, 'removebutton' );
	}

	execute( { abbr, title } ) {
		const model = this.editor.model;
		const selection = model.document.selection;

		model.change( writer => {
			// If selection is collapsed then update the selected removebutton or insert a new one at the place of caret.
			if ( selection.isCollapsed ) {
				// When a collapsed selection is inside text with the "removebutton" attribute, update its text and title.
				if ( this.value ) {
					const { end: positionAfter } = model.insertContent(
						writer.createText( abbr, { removebutton: title } ),
						this.value.range
					);
					// Put the selection at the end of the inserted removebutton.
					writer.setSelection( positionAfter );
				}
				// If the collapsed selection is not in an existing removebutton, insert a text node with the "removebutton" attribute
				// in place of the caret. Because the selection is collapsed, the attribute value will be used as a data for text.
				// If the removebutton is empty, do not do anything.
				else if ( abbr !== '' ) {
					const firstPosition = selection.getFirstPosition();

					// Collect all attributes of the user selection (could be "bold", "italic", etc.)
					const attributes = toMap( selection.getAttributes() );

					// Put the new attribute to the map of attributes.
					attributes.set( 'removebutton', title );

					// Inject the new text node with the removebutton text with all selection attributes.
					const { end: positionAfter } = model.insertContent( writer.createText( abbr, attributes ), firstPosition );

					// Put the selection at the end of the inserted removebutton. Using an end of a range returned from
					// insertContent() just in case nodes with the same attributes were merged.
					writer.setSelection( positionAfter );
				}

				// Remove the "removebutton" attribute attribute from the selection. It stops adding a new content into the removebutton
				// if the user starts to type.
				writer.removeSelectionAttribute( 'removebutton' );
			} else {
				// If the selection has non-collapsed ranges, change the attribute on nodes inside those ranges
				// omitting nodes where the "removebutton" attribute is disallowed.
				const ranges = model.schema.getValidRanges( selection.getRanges(), 'removebutton' );

				for ( const range of ranges ) {
					writer.setAttribute( 'removebutton', title, range );
				}
			}
		} );
	}
}
