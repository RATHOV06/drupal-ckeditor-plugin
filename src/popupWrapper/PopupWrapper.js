/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import PopupEditing from "./PopupEditing";
import PopupUI from "./PopupUi";

export default class Popup extends Plugin {
  static get requires() {
    return [PopupEditing, PopupUI];
  }
}
