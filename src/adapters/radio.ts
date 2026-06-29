// /**
//  * Copyright (c) 2026 GTF
//  * SPDX-License-Identifier: Apache-2.0
//  */

import { defineAdapter } from "../core/adapter.js";
import { State } from "../core/types.js";
import { DEFAULT_PREFIX, parseValue } from "../core/utils.js";

interface RadioOptions {
    prefix?: string;
}

/**
 * @example
 * <input type="radio" name="theme" value="theme:light">
 * <input type="radio" name="theme" value="theme:dark">
 * <input type="radio" name="theme" value="theme:system">
 */
export const Radio = defineAdapter<HTMLInputElement, RadioOptions>({
    name: "radio",

    defaults: {
        prefix: DEFAULT_PREFIX,
    },

    selector: (o) => `input[type="radio"][value^="${o.prefix}"]`,

    bind(ctl, el, { prefix = DEFAULT_PREFIX }) {
        el.addEventListener("change", () => {
            if (!el.checked) return;

            const theme = parseValue(el.value, prefix) as State;

            if (theme === ctl.state) return;

            ctl.set(theme);
        });
    },

    sync(ctl, el, { prefix = DEFAULT_PREFIX }) {
        el.checked = parseValue(el.value, prefix) === ctl.active();
    }
});