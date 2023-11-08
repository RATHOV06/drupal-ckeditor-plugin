/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import ButtonEditing from "./ButtonEditing";
import ButtonUI from "./ButtonUi";

export default class Button extends Plugin {
  static get requires() {
    return [ButtonEditing, ButtonUI];
  }
}
