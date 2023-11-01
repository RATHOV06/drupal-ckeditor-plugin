/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import ButtonEditing from "./Buttonediting";
import ButtonUI from "./Buttonui";

export default class Button extends Plugin {
  static get requires() {
    return [ButtonEditing, ButtonUI];
  }
}
