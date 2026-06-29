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

export function parseValue(value: string, prefix: string): string {
	return value.startsWith(prefix)
		? value.slice(prefix.length)
		: value;
}