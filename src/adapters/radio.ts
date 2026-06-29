// /**
//  * Copyright (c) 2026 GTF
//  * SPDX-License-Identifier: Apache-2.0
//  */

import { defineAdapter } from "../core/adapter.js";
import { State } from "../core/types.js";
import { DEFAULT_PREFIX, parseValue } from "../core/utils.js";

// import type { Adapter } from '../core/adapter.js';
// import { Controller } from '../core/controller.js';
// import { Name, State } from '../core/types.js';

// const PREFIX = "theme:";

// function parseThemeName(btn: HTMLInputElement, prefix: string): State {
//     const value = btn.value;
//     const name = value.slice(prefix.length) as State;

//     return name ? name : value as State;
// }

// interface Options {
//     prefix?: string;
// };

// export const Radio: Adapter<
//     HTMLInputElement,
//     Options
// > = {
//     name: 'radio',

//     selector: `input[type="radio"][value^="${PREFIX}"]`,

//     options: {
//         prefix: PREFIX
//     },
    
//     setup(_ctl: Controller, options) {
//         this.options = options;
        
//         this.selector = `input[type="radio"][value^="${this.options?.prefix}"]`;
//     },

//     bind(ctl: Controller) {
//         const root = ctl.root;

//         root.querySelectorAll<HTMLInputElement>(this.selector).forEach(radio => {            
//             radio.addEventListener('change', e => {
//                 const target = e.currentTarget as HTMLInputElement;
//                 const theme = parseThemeName(target, this.options?.prefix!);
                
//                 if (theme) ctl.set(theme);
//             });
//         });
//     },

//     sync(ctl: Controller) {
//         const root = ctl.root;
//         const active = ctl.active();

//         root.querySelectorAll<HTMLInputElement>(this.selector).forEach(radio => {
//             const theme = parseThemeName(radio, this.options?.prefix!);
//             radio.checked = theme === active;
//         });
//     }
// };

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