/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Effective theme name (e.g. `day`, `night`, `mint`).
 */
export type Name = string;

/**
 * Theme state (`<dark>`, `<light>`, `<system>`).
 * Different between state themes and effective themes:
 * - State themes are the raw values used as identifiers (`<dark>`, `<light>`, `<system>`).
 * - Effective themes are the resolved values (e.g. `<dark>`, `<light>`, `mint`).
 */
export type State = "system" | "light" | "dark";
