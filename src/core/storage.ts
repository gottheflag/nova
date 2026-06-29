/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

import { State } from "./types.js";

/**
 * A storage interface for persisting the theme state.
 * 
 * @description
 * The theme state is persisted in a storage mechanism that is
 * specific to the application. For example, a web application might
 * use cookies, local storage, or a database.
 */
export interface StateStorage {
	get(): State | null;

	set(state: State): void;

	remove(): void;
}