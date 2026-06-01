/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { Adapter } from "./adapter.js";
import { RawConfig, ResolvedConfig } from "./config.js";
import { System } from "./system.js";
import { Name, State } from "./types.js";
import { resolveRoot, resolveStateOf } from "./utils.js";

/**
 * Theme controller logic.
 */
export class Controller {
	/**
	 * Resolved configuration.
	 */
	config: ResolvedConfig;
	/**
	 * System theme proxy.
	 */
	private system: System;

	private adapters: Adapter<any>[] = [];

	constructor(
		private _root: Document | ParentNode = document,
		cfg: RawConfig = {}
	) {
		this.config = {
			attribute: cfg.attribute ?? "data-theme",
			storage: {
				key: cfg.storage?.key ?? "theme",
			},
			system: cfg.system ?? "system",
			light: cfg.light ?? "light",
			dark: cfg.dark ?? "dark",
			initial: cfg.initial
		};

		this.system = new System(this);

		this.syncSystemListener();
	}

	/**
	 * The root element to apply theme to.
	 */
	get root(): HTMLElement {
		return resolveRoot(this._root);
	}

	/**
	 * @param resolved resolve state and effective themes to their values.
	 * 
	 * @example
	 * 
	 * system = config.system;
	 * light = config.light;
	 * dark = config.dark;
	 * 
	 * resolved = true;
	 * [
	 * 		"system": light | dark,
	 * 		"light": light,
	 * 		"dark": dark
	 * ]
	 * resolved = false;
	 * [
	 * 		"system": system,
	 * 		"light": light,
	 * 		"dark": dark
	 * ]
	 */
	active(resolved: boolean = false): State | Name | null {
		const state = this.state;

		if (!state) {
			return this.config.initial || null;
		}

		const theme = resolveStateOf(state, this.system, this.config);

		if (!theme) return null;


		return resolved ? theme : state;
	}

	/**
	 * Register an adapter.
	 * 
	 * @description
	 * Adapters are toys used to change themes.
	 * They define where themes lives and how they work with the controller.
	 * 
	 * @param adapter Adapter instance
	 * @param options Adapter options
	 */
	use<T extends Adapter<any>>(adapter: T, options?: T extends Adapter<infer O> ? O : never) {
		if (this.adapters.includes(adapter)) {
			console.warn(`Adapter <${adapter.name}> is already installed.`);
			return this;
		}

		this.adapters.push(adapter);

		try {
			adapter.setup?.(this, options as any);
			adapter.discover?.(this);
			adapter.bind?.(this);
			adapter.sync?.(this);
		} catch (err) {
			console.warn(`Adapter <${adapter.name}> failed to install.`, err);
		}

		return this;
	}
	
	/**
	 * Set the effective theme from a theme state.
	 * 
	 * @see {@link State}
	 * @param state Theme State
	 */
	set(state: State) {
		const theme = resolveStateOf(state, this.system, this.config);
		if (!theme) {
			return;
		}

		this.write(state);

		this.syncSystemListener();

		this.apply(theme);

		for (const a of this.adapters) {
			a.sync?.(this);
		}
	}

	/**
	 * Read the stored theme state from local storage.
	 */
	get state(): State | null {
		try {
			return localStorage.getItem(this.config.storage.key) as State | null;
		} catch { return null; }
	}

	/**
	 * Sync the system listener.
	 */
	private syncSystemListener() {
		const state = this.active();

		if (state === this.config.system) {
			this.system.start(_state => {
				const theme = resolveStateOf(
					"system",
					this.system,
					this.config
				);
				if (!theme) return;

				this.apply(theme);

				for (const a of this.adapters) {
					a.sync?.(this);
				}
			});
		} else {
			this.system.stop();
		}
	}

	/**
	 * Applies the effective theme name to the root.
	 * 
	 * @param theme Effective theme name (e.g. `<dark>`, `<light>`, `mint`)
	 */
	private apply(theme: Name) {
		this.root.setAttribute(this.config.attribute, theme);
	}

	/**
	 * Write theme state to local storage.
	 * 
	 * @param theme Theme state
	 */
	private write(theme: State) {
		try {
			localStorage.setItem(this.config.storage.key, theme);
		} catch {
			console.warn(`Failed to write theme state to local storage.`);
		}
	}
}