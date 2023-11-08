/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";

export default class AnchorEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the Anchor attribute.
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
          ['data-anchor']: modelAttributeValue,
        });
      },
    });

    // Conversion from a view element to a model attribute
    conversion.for("upcast").elementToAttribute({
      view: {
        name: "span",
        attributes: ["data-anchor"],
      },
      model: {
        key: "Span",

        // Callback function provides access to the view element
        value: (viewElement) => {
          const dataAnchor = viewElement.getAttribute("data-anchor");
          return dataAnchor;
        },
      },
    });
  }
}
