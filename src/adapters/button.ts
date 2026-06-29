/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { Controller } from "../core/controller.js";
import { defineAdapter } from "../core/adapter.js";
import { State } from "../core/types.js";
import { DEFAULT_PREFIX, parseValue } from "../core/utils.js";

type Easing = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

interface ButtonOptions {
    prefix?: string;
    animate?: {
        enabled?: boolean;
        duration?: number;
        easing?: Easing;
    }
}

/**
 * @example
 * <button value="theme:light">Light</button>
 * <button value="theme:dark">Dark</button>
 */
export const Button = defineAdapter<HTMLButtonElement, ButtonOptions>({
    name: "button",

    defaults: {
        prefix: DEFAULT_PREFIX,
        animate: {
            enabled: false,
            duration: 600,
            easing: "ease-in-out"
        }
    },

    selector: (o) => `button[value^="${o.prefix ?? DEFAULT_PREFIX}"]`,

    bind(ctl, el, { prefix = DEFAULT_PREFIX, animate }) {
        el.addEventListener("click", async (event) => {
            const theme = parseValue(el.value, prefix) as State;

            if (theme === ctl.state) return;

            if (!animate?.enabled || !document.startViewTransition) {
                ctl.set(theme);
                return;
            }

            const { clientX: x, clientY: y } = event;

            const radius = Math.hypot(
                Math.max(x, innerWidth - x),
                Math.max(y, innerHeight - y)
            );

            const transition = document.startViewTransition(() => ctl.set(theme));

            await transition.ready;

            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${radius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: animate.duration ?? 500,
                    easing: animate.easing ?? "ease-in-out",
                    pseudoElement: "::view-transition-new(root)"
                }
            );
        });
    },
});
