/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import RemovebuttonUI from './removebuttonui';

export default class Removebutton extends Plugin {
	static get requires() {
		return [ RemovebuttonUI ];
	}
}
