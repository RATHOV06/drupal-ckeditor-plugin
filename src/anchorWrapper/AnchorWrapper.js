/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import AnchorEditing from "./Anchorediting";
import AnchorUI from "./Anchorui";

export default class Anchor extends Plugin {
  static get requires() {
    return [AnchorEditing, AnchorUI];
  }
}
