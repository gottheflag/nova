/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocalStorage } from "../storage/local.js";
import { AdapterDefinition } from "./adapter.js";
import { RawConfig, ResolvedConfig } from "./config.js";
import { EventEmitter } from "./event.js";
import { System } from "./system.js";
import { Name, NEvents, State } from "./types.js";
import { resolveRoot, resolveStateOf } from "./utils.js";

interface RegisteredAdapter {
	def: AdapterDefinition<any, any>;
	options: any;
	selector: string;
}

/**
 * Theme controller logic.
 */
export class Controller extends EventEmitter<NEvents> {
	/**
	 * Resolved configuration.
	 */
	config: ResolvedConfig;
	/**
	 * System theme proxy.
	 */
	private system: System;

	private _adapters: RegisteredAdapter[] = [];
	private _observer?: MutationObserver;

	constructor(
		private _root: Document | ParentNode = document,
		cfg: RawConfig = {}
	) {
		super();
		
		this.config = {
			attribute: cfg.attribute ?? "data-theme",
			storage: cfg.storage ?? new LocalStorage(),
			system: cfg.system ?? "system",
			light: cfg.light ?? "light",
			dark: cfg.dark ?? "dark",
			initial: cfg.initial,
			observe: cfg.observe ?? false
		};

		this.system = new System(this);

		this.syncSystemListener();

		if (this.config.observe) {
			this.startObserver();
		}
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

		const theme = resolveStateOf(
			state,
			this.system,
			this.config
		);

		if (!theme) return null;

		return resolved
			? theme
			: state;
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
	use<O>(
		def: AdapterDefinition<any, O>,
		options?: Partial<O>
	): this {
		const resolved = { ...def.defaults, ...options } as O;

		const selector = typeof def.selector === "function"
			? def.selector(resolved)
			: def.selector;
		
		for (const el of this.root.querySelectorAll(selector)) {
			def.bind?.(this, el, resolved);
			def.sync?.(this, el, resolved);
		}

		this._adapters.push({
			def,
			options: resolved,
			selector
		});
		
		return this;
	}
	
	/**
	 * Set the effective theme from a theme state.
	 * 
	 * @see {@link State}
	 * @param state Theme State
	 */
	set(state: State) {
		const from = this.state;
		const theme = resolveStateOf(state, this.system, this.config);

		if (!theme) return this;

		this.write(state);
		this.syncSystemListener();
		this.apply(theme);
		this.syncAdapters();

		this.emit("change", {
			from,
			to: state,
			theme
		});

		return this;
	}

	/**
	 * Read the stored theme state from local storage.
	 */
	get state(): State | null {
		return this.config.storage.get();
	}

	/**
	 * Destroy the controller.
	 * 
	 * @description
	 * This method disconnects the observer, stops the system listener.
	 */
	destroy(): void {
		this._observer?.disconnect();
		this.system.stop();
	}

	/**
	 * Sync all adapters.
	 */
	private syncAdapters(): void {
		for (const { def, options, selector } of this._adapters) {
			for (const el of this.root.querySelectorAll(selector)) {
				def.sync?.(this, el, options);
			}
		}
	}

	/**
	 * Sync the system listener.
	 */
	private syncSystemListener() {
		const state = this.active();

		if (state === this.config.system) {
			this.system.start(() => {
				const theme = resolveStateOf(
					"system",
					this.system,
					this.config
				);
				if (!theme) return;

				this.apply(theme);

				this.syncAdapters();
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
		this.emit("apply", { theme });
	}

	/**
	 * Write theme state to local storage.
	 * 
	 * @param theme Theme state
	 */
	private write(theme: State) {
		this.config.storage.set(theme);
	}

	/**
	 * Start the DOM elements observer.
	 * 
	 * @description
	 * This method starts a MutationObserver that watches for changes to
	 * the DOM elements that are registered as adapters. When a change
	 * is detected, the controller will bind the element to the adapter.
	 */
	private startObserver(): void {
		this._observer = new MutationObserver((mutations) => {
			for (const mu of mutations) {
				for (const node of mu.addedNodes) {
					if (node instanceof Element) {
						this.bindNode(node);
					}
				}
			}
		});

		this._observer.observe(this.root, { childList: true, subtree: true });
	}

	/**
	 * Bind a single DOM element to an adapter.
	 * 
	 * @description
	 * This method checks if the element matches the adapter's selector.
	 * If it does, the adapter's `bind` method is called with the element
	 * and the adapter's options. If the adapter has a `sync` method, it
	 * is also called with the element and the adapter's options.
	 */
	private bindNode(node: Element): void {
		for (const { def, options, selector } of this._adapters) {
			if (node.matches(selector)) {
				def.bind?.(this, node, options);
				def.sync?.(this, node, options);
			}

			for (const el of node.querySelectorAll(selector)) {
				def.bind?.(this, el, options);
				def.sync?.(this, el, options);
			}
		}
	}
}