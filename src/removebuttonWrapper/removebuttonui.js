/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import { ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui';
import FormView from './removebuttonview';
import getRangeText from './utils.js';
import '../styles.css';

export default class RemovebuttonUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
		const editor = this.editor;

        // Create the balloon and the form view.
		this._balloon = this.editor.plugins.get( ContextualBalloon );
		this.formView = this._createFormView();

		editor.ui.componentFactory.add( 'removebutton', () => {
			const button = new ButtonView();

			button.label = 'Remove Colored Button';
			button.tooltip = true;
			button.withText = true;

			// Show the UI on button click.
			this.listenTo( button, 'execute', () => {
				const selection = editor.model.document.selection;
				//console.log(selection);
				const range = selection.getFirstRange();

				for (const item of range.getItems()) {
					console.log(item.data) //return the selected text
					editor.model.change( writer => {
						writer.remove(item);
					});
				}  

				// editorDocument.on('change:data', (event) => {
				// 	console.log('3');
				// 	let root = editorDocument.getRoot();
				// 	let children = root.getChildren();

				// 	for(let child of children){
				// 			editorModel.change(writer => {
				// 			writer.remove(child);
				// 			});
						
				// 	}
				// });
			} );

			return button;
		} );
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new FormView( editor.locale );

		// Execute the command after clicking the "Save" button.
		this.listenTo( formView, 'submit', () => {
			// Grab values from the abbreviation and title input fields.
			const value = {
				abbr: formView.abbrInputView.fieldView.element.value,
				title: formView.titleInputView.fieldView.element.value
			};
			editor.execute( 'addRemovebutton', value );

            // Hide the form view after submit.
			this._hideUI();
		} );

		// Hide the form view after clicking the "Cancel" button.
		this.listenTo( formView, 'cancel', () => {
			this._hideUI();
		} );

		// Hide the form view when clicking outside the balloon.
		clickOutsideHandler( {
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideUI()
		} );

		return formView;
	}

	_hideUI() {
		// Clear the input field values and reset the form.
		this.formView.abbrInputView.fieldView.value = '';
		this.formView.titleInputView.fieldView.value = '';
		this.formView.element.reset();

		this._balloon.remove( this.formView );

		// Focus the editing view after inserting the abbreviation so the user can start typing the content
		// right away and keep the editor focused.
		this.editor.editing.view.focus();
	}

	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		let target = null;

		// Set a target position by converting view selection range to DOM
		target = () => view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );

		return {
			target
		};
	}
}
