/**
 * Copyright (c) 2026 GTF
 * SPDX-License-Identifier: Apache-2.0
 */

export type Listener<T> = (event: T) => void;

/**
 * A simple event emitter implementation.
 * 
 * @description
 * This class is suitable for use in a web application that wants to
 * listen for changes in the theme state.
 */
export class EventEmitter<M extends Record<string, unknown>> {
	private _map = new Map<keyof M, Set<Listener<any>>>();

	on<K extends keyof M>(event: K, listener: Listener<M[ K ]>): () => void {
		let set = this._map.get(event);
		if (!set) this._map.set(event, set = new Set());

		set.add(listener);

		return () => this.off(event, listener);
	}

	off<K extends keyof M>(event: K, listener: Listener<M[ K ]>): void {
		this._map.get(event)?.delete(listener);
	}

	emit<K extends keyof M>(event: K, payload: M[ K ]): void {
		this._map.get(event)?.forEach(listener => listener(payload));
	}
}