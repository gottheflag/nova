/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { StateStorage } from "./storage.js";
import { Name } from "./types.js";
import { type LocalStorage } from "../storage/local.js";

/**
 * Raw configuration, passed by the user.
 */
export interface RawConfig {
    /**
     * Theme attribute name.
     * 
     * @default "data-theme"
     * @example
     * <html data-theme="light">
     */
    attribute?: string;
    /**
     * Theme storage type.
     * 
     * @description
     * The controller will use the storage to persist the theme state.
     * 
     * @default @see {@link LocalStorage}
     */
    storage?: StateStorage;
    /**
     * System theme name.
     * 
     * @default "system"
     * @example "auto" | "sync" | ...
     */
    system?: string;
    /**
     * Light theme name.
     * 
     * @default "light"
     * @example "bright" | ...
     */
    light?: Name;
    /**
     * Dark theme name.
     * 
     * @default "dark"
     * @example "dim" | ...
     */
    dark?: Name;
    /**
     * Initial theme name.
     * 
     * @default "dark"
     * @example "light" | "mint" | ...
     */
    initial?: Name;
    /**
     * Observe the DOM elements for changes.
     * Automatically bind new matching elements.
     * 
     * @default false
     */
    observe?: boolean;
};

/**
 * Resolved configuration by the controller.
 */
export interface ResolvedConfig {
    attribute: string;
    storage: StateStorage;
    system: string;
    light: Name;
    dark: Name;
    initial?: Name;
    observe: boolean;
};