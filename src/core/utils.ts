/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResolvedConfig } from "./config.js";
import { System } from "./system.js";
import { State, type Name } from "./types.js";

export const DEFAULT_PREFIX = "theme:";

/**
 * Resolve a theme state to an effective theme name.
 * 
 * @see {@link State}
 * 
 * @param theme Theme state
 * @param system System instance.
 * @param config Resolved set of configuration.
 * @returns 
 */
export function resolveStateOf(state: State, system: System, config: ResolvedConfig): Name | null {
	if (state === config.system) {
		return system.prefers;
	}

	if (state === config.light || state === config.dark) {
		return state;
	}

	return typeof state === "string" ? state : null;
}

/**
 * Resolve a root element from a given value.
 * 
 * @description
 * This function takes a root value and returns the corresponding
 * HTMLElement. If the value is already an HTMLElement, it is returned
 * directly. If the value is a Document, it returns the documentElement.
 * If the value is a ShadowRoot, it returns the host element.
 * 
 * @param root Root value
 */
export function resolveRoot(root: unknown): HTMLElement {
	if (root instanceof HTMLElement) {
		return root
	} else if (root instanceof Document) {
		return root.documentElement
	} else if (root instanceof ShadowRoot && root.host instanceof HTMLElement) {
		return root.host
	};

	return document.documentElement;
}

/**
 * Parse a value with a prefix.
 * 
 * @description
 * This function takes a value and a prefix. If the value starts with
 * the prefix, it is sliced from the beginning. Otherwise, the value is
 * returned as-is.
 * 
 * @param value Value to parse
 * @param prefix Prefix to check
 */
export function parseValue(value: string, prefix: string): string {
	return value.startsWith(prefix)
		? value.slice(prefix.length)
		: value;
}