/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { StateStorage } from "../core/storage.js";
import { State } from "../core/types.js";

export interface CookieStorageOptions {
	/**
	 * Cookie name.
	 * 
	 * @default "theme"
	 */
	key?: string;

	/**
	 * Cookie path.
	 * 
	 * @default "/"
	 */
	path?: string;

	/**
	 * Cookie domain.
	 * 
	 * Example: ".nova.sa"
	 */
	domain?: string;

	/**
	 * Cookie lifetime in seconds.
	 * 
	 * @default 31536000 (1 year)
	 */
	maxAge?: number;

	/**
	 * SameSite policy.
	 * 
	 * @default "Lax"
	 */
	sameSite?: "Strict" | "Lax" | "None";

	/**
	 * Marks the cookie as secure.
	 *
	 * @default true if the page is served over HTTPS.
	 */
	secure?: boolean;
}

/**
 * A storage implementation that uses cookies to store the theme state.
 * 
 * @description
 * This storage implementation is suitable for use in a web application that
 * wants to persist the theme state across sub-domains or across multiple
 * applications on the same domain.
 */
export class CookieStorage implements StateStorage {
	readonly key: string;
	
	constructor(
		private readonly options: CookieStorageOptions = {}
	) {
		this.key = options.key ?? "theme";
	}

	get(): State | null {
		const prefix = `${encodeURIComponent(this.key)}=`;

		for (const cookie of document.cookie.split(";")) {
			const c = cookie.trim();
			
			if (c.startsWith(prefix)) {
				return decodeURIComponent(c.slice(prefix.length)) as State;
			}
		}

		return null;
	}

	set(state: State): void {
		const {
			path = '/',
			domain,
			maxAge = 60 * 60 * 24 * 365,
			sameSite = "Lax",
			secure = location.protocol === "https:"
		} = this.options;

		const parts = [
			`${encodeURIComponent(this.key)}=${encodeURIComponent(state)}`,
			`Path=${path}`,
			`Max-Age=${maxAge}`,
			`SameSite=${sameSite}`,
		];

		if (domain) {
			parts.push(`Domain=${domain}`);
		}

		if (secure) {
			parts.push(`Secure`);
		}

		document.cookie = parts.join("; ");
	}

	remove(): void {
		const { path = '/', domain } = this.options;

		const parts = [
			`${encodeURIComponent(this.key)}=`,
			`Max-Age=0`,
			`Path=${path}`,
		];

		if (domain) {
			parts.push(`Domain=${domain}`);
		}

		document.cookie = parts.join("; ");
	}
}