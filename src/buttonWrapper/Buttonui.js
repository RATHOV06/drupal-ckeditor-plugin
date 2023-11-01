/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import { ButtonView, ContextualBalloon, clickOutsideHandler } from "@ckeditor/ckeditor5-ui";
import FormView from "./ButtonView";
import "../styles.css";

export default class ButtonUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    const editor = this.editor;

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add("Button", () => {
      const button = new ButtonView();

      button.label = "Add Button";
      button.tooltip = true;
      button.withText = true;

      // Show the UI on button click.
      this.listenTo(button, "execute", () => {
        this._showUI();
      });

      return button;
    });
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView(editor.locale);

    // Execute the command after clicking the "Save" button.
    this.listenTo(formView, "submit", () => {
      // Grab values from the Button and title input fields.
      const title = formView.titleInputView.fieldView.element.value;
      const bgColor = formView.backgroundInputColorView.fieldView.element.value;
      const textColor = formView.titleInputColorView.fieldView.element.value;

      // Validation 1: Check if values are not empty.
      if (!title || !bgColor || !textColor) {
        alert("Please fill in all fields");
        return;
      }

      // Validation 2: Check if bgColor and textColor are valid hex color codes.
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexColorRegex.test(bgColor) || !hexColorRegex.test(textColor)) {
        alert("Please enter valid hex color codes for background and text");
        return;
      }

      editor.model.change((writer) => {
        editor.model.insertContent(writer.createText(title, { Button: `color:${textColor}; background-color: ${bgColor}` }));
      });

      // Hide the form view after submit.
      this._hideUI();
    });

    // Hide the form view after clicking the "Cancel" button.
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
    this.formView.backgroundInputColorView.fieldView.value = "";
    this.formView.titleInputColorView.fieldView.value = "";
    this.formView.element.reset();

    this._balloon.remove(this.formView);

    // Focus the editing view after inserting the Button so the user can start typing the content
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
