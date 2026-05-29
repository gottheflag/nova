import { Name } from "./types.js";

/**
 * Raw configuration, passed by the user.
 */
export interface RawConfig {
    attribute?: string;
    storage?: { key: string };
    system?: string;
    light?: Name;
    dark?: Name;
    initial?: Name;
};

/**
 * Resolved configuration by the controller.
 */
export interface ResolvedConfig {
    attribute: string;
    storage: { key: string };
    system: string;
    light: Name;
    dark: Name;
    initial?: Name;
};