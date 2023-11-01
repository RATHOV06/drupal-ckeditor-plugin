/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";

export default class ButtonEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the Button attribute.
    schema.extend("$text", {
      allowAttributes: ["Button"],
    });
  }
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Conversion from a model attribute to a view element
    conversion.for("downcast").attributeToElement({
      model: "Button",

      // Callback function provides access to the model attribute value
      // and the DowncastWriter
      view: (modelAttributeValue, conversionApi) => {
        const { writer } = conversionApi;
        return writer.createAttributeElement("abbr", {
          title: modelAttributeValue,
        });
      },
    });

    // Conversion from a view element to a model attribute
    conversion.for("upcast").elementToAttribute({
      view: {
        name: "abbr",
        attributes: ["title"],
      },
      model: {
        key: "Button",

        // Callback function provides access to the view element
        value: (viewElement) => {
          const title = viewElement.getAttribute("title");
          return title;
        },
      },
    });
  }
}
