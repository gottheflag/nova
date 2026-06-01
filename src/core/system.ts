/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { Controller } from "./controller.js";
import { Name, State } from "./types.js";

/**
 * System theme proxy.
 * 
 * Used to detect system theme preference and listen for changes.
 */
export class System {
	/**
	 * Media query list instance.
	 */
	private mql?: MediaQueryList;
	/**
	 * Handles the media query list listener.
	 */
	private handler?: (e: MediaQueryListEvent) => void;
	/**
	 * Controller instance.
	 */

	constructor(private ctl: Controller) { }

	/**
	 * Get the effective theme by system preference.
	 */
	get prefers(): Name {
		return matchMedia?.("(prefers-color-scheme: dark)").matches
			? this.ctl.config.dark
			: this.ctl.config.light;
	}

	/**
	 * Check if the effective theme is dark.
	 */
	get prefersDark(): boolean {
		return this.prefers === this.ctl.config.dark;
	}

	/**
	 * Check if the effective theme is light.
	 */
	get prefersLight(): boolean {
		return this.prefers === this.ctl.config.light;
	}

	/**
	 * Start listening for system theme changes.
	 * 
	 * @param onChange Callback to be called when the system theme changes.
	 */
	start(onChange: (state: Exclude<State, "system">) => void) {
		if (this.handler) return;

		this.mql = matchMedia("(prefers-color-scheme: dark)");
		this.handler = e => onChange(e.matches ? "dark" : "light");

		this.mql.addEventListener?.("change", this.handler);
	}

	/**
	 * Stop listening for system theme changes.
	 */
	stop() {
		if (!this.mql || !this.handler) return;

		this.mql.removeEventListener?.("change", this.handler);
		
		this.mql = this.handler = undefined;
	}
}