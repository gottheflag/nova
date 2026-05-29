import { Controller } from "../core/controller.js";
import type { Adapter } from "../core/adapter.js";
import { State, type Name } from "../core/types.js";

const PREFIX = "theme:";

function parseThemeName(btn: HTMLButtonElement): State {
    const value = btn.value;
    const name = value.slice(PREFIX.length) as State;

    return name ? name : value as State;
}

/**
 * @example
 * <button value="<prefix>light">Light</button>
 * <button value="<prefix>dark">Dark</button>
 */
export const Button: Adapter & {
    registry: Map<Element, Name[]>;
} = {
    name: "button",

    registry: new Map<Element, Name[]>(),

    discover(ctl: Controller) {
        const root = ctl.root;

        root.querySelectorAll<HTMLButtonElement>(`button[value^="${PREFIX}"]`).forEach(btn => {
            const detected: Name[] = [];

            const theme = parseThemeName(btn);
            if (theme) detected.push(theme);

            this.registry.set(btn, detected);
        });
    },

    bind(ctl: Controller) {
        const root = ctl.root;

        root.querySelectorAll<HTMLButtonElement>(`button[value^="${PREFIX}"]`).forEach(btn => {
            const theme = parseThemeName(btn);

            btn.addEventListener("click", () => {
                if (this.registry.get(btn)?.includes(theme)) {
                    ctl.set(theme);
                }
            });
        });
    },
};
