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

import { type RawConfig } from "../core/config.js";

(function (root: Element=document.documentElement, cfg?: RawConfig) {
    try {
        const storageKey = cfg?.storage?.key ?? 'theme';
        const attribute = cfg?.attribute ?? 'data-theme';
        const system = cfg?.system ?? "system";
        const light = cfg?.light ?? "light";
        const dark = cfg?.dark ?? "dark";
        const initial = cfg?.initial ?? dark;

        // Respect SSR/preset attribute to avoid flicker
        if (root && root.hasAttribute(attribute)) return;

        let state = localStorage.getItem(storageKey);

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
})();