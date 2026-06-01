/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Adapter } from '../core/adapter.js';
import { Controller } from '../core/controller.js';
import { Name, State } from '../core/types.js';

const PREFIX = "theme:";

function parseThemeName(btn: HTMLInputElement, prefix: string): State {
    const value = btn.value;
    const name = value.slice(prefix.length) as State;

    return name ? name : value as State;
}

interface Options {
    prefix?: string;
};

export const Radio: Adapter<Options> & {
    registry: Map<Element, Name[]>;
    prefix?: string;
} = {
    name: 'radio',

    registry: new Map<Element, Name[]>(),

    setup(_ctl: Controller, options) {
        this.prefix = options?.prefix ?? PREFIX;
    },

    discover(ctl: Controller) {
        const root = ctl.root;

        root.querySelectorAll<HTMLInputElement>(`input[type="radio"][value^="${PREFIX}"]`).forEach(radio => {
            const detected: Name[] = [];

            const theme = parseThemeName(radio, this.prefix!);
            if (theme) detected.push(theme);

            this.registry.set(radio, detected);
        });
    },

    bind(ctl: Controller) {
        const root = ctl.root;

        root.querySelectorAll<HTMLInputElement>(`input[type="radio"][value^="${PREFIX}"]`).forEach(radio => {            
            radio.addEventListener('change', e => {
                const target = e.currentTarget as HTMLInputElement;
                const theme = parseThemeName(target, this.prefix!);
                
                if (theme) ctl.set(theme);
            });
        });
    },

    sync(ctl: Controller) {
        const root = ctl.root;
        const active = ctl.active();

        root.querySelectorAll<HTMLInputElement>(`input[type="radio"][value^="${PREFIX}"]`).forEach(radio => {
            const theme = parseThemeName(radio, this.prefix!);
            radio.checked = theme === active;
        });
    }
};
