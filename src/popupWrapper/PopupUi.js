/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import { ButtonView, ContextualBalloon, clickOutsideHandler } from "@ckeditor/ckeditor5-ui";
import FormView from "./PopupView";
import "../styles.css";

export default class PopupUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    const editor = this.editor;

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add("Popup", () => {
      const popup = new ButtonView();

      popup.label = "Add Popup";
      popup.tooltip = true;
      popup.withText = true;

      // Show the UI on popup click.
      this.listenTo(popup, "execute", () => {
        this._showUI();
      });

      return popup;
    });
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView(editor.locale);

    // Execute the command after clicking the "Save" popup.
    this.listenTo(formView, "submit", () => {
      // Grab values from the Popup and title input fields.
      const title = formView.titleInputView.fieldView.element.value;
      const attribute = formView.attributeInputView.fieldView.element.value;

      // Validation 1: Check if values are not empty.
      if (!title || !attribute) {
        alert("Please fill in all fields");
        return;
      }

      editor.model.change((writer) => {
        editor.model.insertContent(
          writer.createText(title, { Span: attribute })
        );
      });

      // Hide the form view after submit.
      this._hideUI();
    });

    // Hide the form view after clicking the "Cancel" popup.
    this.listenTo(formView, "cancel", () => {
      this._hideUI();
    });

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });

    return formView;
  }

  _showUI() {
    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData(),
    });

    this.formView.focus();
  }

  _hideUI() {
    // Clear the input field values and reset the form.
    this.formView.titleInputView.fieldView.value = "";
    this.formView.attributeInputView.fieldView.value = "";
    this.formView.element.reset();

    this._balloon.remove(this.formView);

    // Focus the editing view after inserting the Popup so the user can start typing the content
    // right away and keep the editor focused.
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM
    target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

    return {
      target,
    };
  }
}
