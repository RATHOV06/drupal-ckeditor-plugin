/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { View, LabeledFieldView, createLabeledInputText, ButtonView, submitHandler } from "@ckeditor/ckeditor5-ui";
import { icons } from "@ckeditor/ckeditor5-core";

export default class FormView extends View {
  constructor(locale) {
    super(locale);

    this.titleInputView = this._createInput("Anchor text");
    this.attributeInputView = this._createInput("Anchor attribute");
    this.saveButtonView = this._createButton("Save", icons.check, "ck-button-save");
    // Submit type of the anchor will trigger the submit event on entire form when clicked
    // (see submitHandler() in render() below).
    this.saveButtonView.type = "submit";

    this.cancelButtonView = this._createButton("Cancel", icons.cancel, "ck-button-cancel");

    // Delegate ButtonView#execute to FormView#cancel
    this.cancelButtonView.delegate("execute").to(this, "cancel");

    this.childViews = this.createCollection([this.titleInputView,this.attributeInputView, this.saveButtonView, this.cancelButtonView]);

    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-abbr-form", "ck-two-row"],
        tabindex: "-1",
      },
      children: this.childViews,
    });
  }

  render() {
    super.render();

    // Submit the form when the user clicked the save anchor or pressed enter in the input.
    submitHandler({
      view: this,
    });
  }

  focus() {
    this.childViews.first.focus();
  }

  _createInput(label) {
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);

    labeledInput.label = label;

    return labeledInput;
  }

  _createButton(label, icon, className) {
    const button = new ButtonView();

    button.set({
      label,
      icon,
      tooltip: true,
      class: className,
    });

    return button;
  }
}
