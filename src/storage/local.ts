/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { StateStorage } from "../core/storage.js";
import { State } from "../core/types.js";

export interface LocalStorageOptions {
	/**
	 * Local storage key.
	 * 
	 * @default "theme"
	 */
	key?: string;
}

/**
 * Simple local storage implementation that uses the browser's native `localStorage`.
 */
export class LocalStorage implements StateStorage {
	readonly key: string;
	
	constructor(options: LocalStorageOptions = {}) {
		this.key = options.key ?? "theme";
	}
	
	get(): State | null {
		try {
			return localStorage.getItem(this.key) as State | null;
		} catch {
			return null;
		}
	}

	set(state: State): void {
		try {
			localStorage.setItem(this.key, state);
		} catch {
			console.warn("[LOCAL] Failed to write theme state.");
		}
	}

	remove(): void {
		try {
			localStorage.removeItem(this.key);
		} catch {}
	}
}