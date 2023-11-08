/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";

export default class PopupEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the Popup attribute.
    schema.extend("$text", {
      allowAttributes: ["Span"],
    });
  }
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Conversion from a model attribute to a view element
    conversion.for("downcast").attributeToElement({
      model: "Span",

      // Callback function provides access to the model attribute value
      // and the DowncastWriter
      view: (modelAttributeValue, conversionApi) => {
        const { writer } = conversionApi;
        return writer.createAttributeElement("span", {
          ['data-popup']: modelAttributeValue,
        });
      },
    });

    // Conversion from a view element to a model attribute
    conversion.for("upcast").elementToAttribute({
      view: {
        name: "span",
        attributes: ["data-popup"],
      },
      model: {
        key: "Span",

        // Callback function provides access to the view element
        value: (viewElement) => {
          const dataPopup = viewElement.getAttribute("data-popup");
          return dataPopup;
        },
      },
    });
  }
}
