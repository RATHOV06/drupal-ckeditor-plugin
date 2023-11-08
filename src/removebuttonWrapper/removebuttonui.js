/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import { ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui';
import '../styles.css';

export default class RemovebuttonUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add( 'removebutton', () => {
			const button = new ButtonView();

			button.label = 'Remove Button';
			button.tooltip = true;
			button.withText = true;

			// Show the UI on button click.
			this.listenTo( button, 'execute', () => {
				const selection = editor.model.document.selection;
				//console.log(selection);
				const range = selection.getFirstRange();

				for (const item of range.getItems()) {
					editor.model.change( writer => {
						console.log(item.textNode._attrs);
						writer.remove(item);
					});
				}
			} );

			return button;
		} );
	}
}
