/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Controller } from "./controller.js";

export interface AdapterDefinition<
	E extends Element,
	O = void
> {
	name: string;

	/** Default options — merged with options passed to `ctl.use()`. */
	defaults?: Partial<O>;

	/** CSS selector string, or a function that returns one given resolved options. */
	selector: string | ((options: O) => string);

	/**
	 * Attach event listeners to a single element.
	 * Called once per element — at `use()` time, or when a new element is observed.
	 */
	bind?(ctl: Controller, element: E, options: O): void;

	/**
	 * Sync element UI state with the controller's current theme.
	 * Called after every `ctl.set()` and on initial `use()`.
	 */
	sync?(ctl: Controller, element: E, options: O): void;
}

/**
 * Type helper for defining adapters with full inference.
 * Zero runtime cost — returns the definition unchanged.
 * 
 * @example
 * export const MyAdapter = defineAdapter<HTMLButtonElement, MyOptions>({
 *   name: "my-adapter",
 *   defaults: { prefix: "theme:" },
 *   selector: (o) => `button[value="${o.prefix}"]`,
 *   bind(ctl, el, options) { ... },
 *   sync(ctl, el, options) { ... },
 * });
 */
export function defineAdapter<
	E extends Element,
	O = void
>(
	definition: AdapterDefinition<E, O>
): AdapterDefinition<E, O> {
	return definition;
}