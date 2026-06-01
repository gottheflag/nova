/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Adapter } from "../core/adapter.js";
import { Controller } from "../core/controller.js";
import { State, type Name } from "../core/types.js";

const PREFIX = "theme:";

function parseThemeName(btn: HTMLOptionElement, prefix: string): State {
    const value = btn.value;
    const name = value.slice(prefix.length) as State;

    return name ? name : value as State;
}

interface Options {
    prefix?: string;
};

/**
 * @example
 * ```html
 * <select>
 *   <option value="theme:light">Light</option>
 *   <option value="theme:system">System</option>
 *   <option value="theme:dark">Dark</option>
 * </select>
 * ```
 */
export const Select: Adapter<Options> & {
    registry: Map<Element, Name[]>;
    prefix?: string;
} = {
    name: "select",

    registry: new Map<Element, Name[]>(),

    setup(_ctl: Controller, options) {
        this.prefix = options?.prefix ?? PREFIX;
    },

    discover(ctl: Controller) {
        const root = ctl.root;

        root.querySelectorAll<HTMLSelectElement>(`select:has(option[value^="${this.prefix}"])`).forEach(sel => {
            const detected: Name[] = [];

            Array.from(sel.options).forEach(option => {
                const theme = parseThemeName(option, this.prefix!);
                if (theme) detected.push(theme);
            });

            this.registry.set(sel, detected);
        });
    },

    bind(ctl: Controller) {
        const root = ctl.root;

        root.querySelectorAll<HTMLSelectElement>(`select:has(option[value^="${this.prefix}"])`).forEach(sel => {
            sel.addEventListener("change", e => {
                const target = e.currentTarget as HTMLSelectElement;
                const option = target.options[ target.selectedIndex ];

                const theme = parseThemeName(option as HTMLOptionElement, this.prefix!);
                if (theme) ctl.set(theme);
            });
        });
    },

    sync(ctl: Controller) {
        const root = ctl.root;
        const active = ctl.active();

        root.querySelectorAll<HTMLSelectElement>(`select:has(option[value^="${this.prefix}"])`).forEach(sel => {
            Array.from(sel.options).forEach(option => {
                const theme = parseThemeName(option, this.prefix!);
                option.selected = theme === active;
            });
        });
    }
};
