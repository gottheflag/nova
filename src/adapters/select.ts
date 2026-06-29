/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineAdapter } from "../core/adapter.js";
import { State } from "../core/types.js";
import { DEFAULT_PREFIX, parseValue } from "../core/utils.js";

interface SelectOptions {
    prefix?: string;
}

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
export const Select = defineAdapter<HTMLSelectElement, SelectOptions>({
    name: "select",

    defaults: {
        prefix: DEFAULT_PREFIX,
    },
    
    selector: (o) => `select:has(option[value^="${o.prefix}"])`,

    bind(ctl, el, { prefix = DEFAULT_PREFIX }) {
        el.addEventListener("change", () => {
            const option = el.options[ el.selectedIndex ];
            const theme = parseValue(option.value, prefix) as State;

            if (theme === ctl.state) return;

            ctl.set(theme);
        });
    },

    sync(ctl, el, { prefix = DEFAULT_PREFIX }) {
        const active = ctl.active();

        for (const option of el.options) {
            option.selected = parseValue(option.value, prefix) === active;
        }
    }
});