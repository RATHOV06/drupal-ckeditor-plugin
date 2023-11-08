/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import { ButtonView } from "@ckeditor/ckeditor5-ui";

export default class RemovebuttonUI extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("removebutton", () => {
      const button = new ButtonView();

      button.label = "Remove Button";
      button.tooltip = true;
      button.withText = true;

      // Show the UI on button click.
      this.listenTo(button, "execute", () => {
        const selection = editor.model.document.selection;
        //console.log(selection);
        const range = selection.getFirstRange();

        for (const item of range.getItems()) {
          editor.model.change((writer) => {
            if (item.textNode._attrs.has("Button")) {
              writer.remove(item);
            }
          });
        }
      });

      return button;
    });
  }
}
