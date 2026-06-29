/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Theme Loader (FOUC prevention).
 * 
 * Put this inline as a <script> in <head>, before CSS.
 * - Reads localStorage for <storage.key>.
 * - If "<system>":
 *   - If prefers-color-scheme is dark, use <dark>.
 *   - If prefers-color-scheme is light, use <light>.
 *   - Otherwise fallback to <initial> (no persistent storage).
 * - If "<light>" or "<dark>": use that.
 */

import { type ResolvedConfig } from "../core/config.js";
import { LocalStorage } from "../storage/local.js";

(function (root: Element = document.documentElement, cfg: ResolvedConfig) {
    try {
        const storage = cfg.storage;
        const attribute = cfg.attribute;
        const system = cfg.system;
        const light = cfg.light;
        const dark = cfg.dark;
        const initial = cfg.initial;

        // Respect SSR/preset attribute to avoid flicker
        if (root && root.hasAttribute(attribute)) return;

        let state = storage.get();

        let effective: string | null = null;

        if (state === system) {
            effective = matchMedia?.("(prefers-color-scheme: dark)").matches
                ? dark
                : light;
        } else if (state === light || state === dark) {
            effective = state;
        } else if (!state && initial) {
            effective = initial;
        }

        effective && root.setAttribute(attribute, effective);
    } catch { /* no-throw loader */ }
})(document.documentElement, {
    /** Just change the storage loader, everything is the same */
    storage: new LocalStorage(),
    attribute: 'data-theme',
    system: "system",
    light: "light",
    dark: "dark",
    initial: "dark",
    observe: false
});