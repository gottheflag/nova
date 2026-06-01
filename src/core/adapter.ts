/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Controller } from "./controller.js";

export interface Adapter<Options = undefined> {
	name: string;

	/**
	 * Setup the adapter.
	 * Used to initiate any one-time setup.
	 * 
	 * ---
	 * @remarks
	 * Called once, when the controller is instantiated.
	 * 
	 * ---
	 * @param ctl Controller instance
	 * @param options Adapter options
	 */
	setup?(ctl: Controller, options: Options): void;
	
	/**
	 * Discover themes that are available to this adapter. \
	 * Used to validate, or for example do a one-time setup.
	 * 
	 * ---
	 * @remarks
	 * Called once, when the controller is instantiated.
	 * 
	 * ---
	 * @param ctl the controller instance
	 * @returns a list of themes that are available to this adapter
	 */
	discover?(ctl: Controller): void;

	/**
	 * Define the theme selection mechanism.
	 * 
	 * ---
	 * @remarks
	 * Called every time the controller is instantiated.
	 * 
	 * ---
	 * @param ctl the controller instance
	 */
	bind?(ctl: Controller): void;

	/**
	 * Sync theme adapter state with the controller.
	 * 
	 * ---
	 * @remarks
	 * Called every time the controller is instantiated.
	 * 
	 * ---
	 * @param ctl the controller instance
	 */
	sync?(ctl: Controller): void;
}