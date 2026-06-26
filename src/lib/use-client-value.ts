"use client";

import { useSyncExternalStore } from "react";

/** The read value never changes underneath us, so there is nothing to subscribe to. */
const noopSubscribe = () => () => {};

/**
 * Read a value that only exists on the client — the current `Date`, a
 * `localStorage`/`sessionStorage` entry — without a hydration mismatch and
 * without calling `setState` inside an effect.
 *
 * `getClient` is evaluated on the client; `server` is rendered during SSR and
 * the first hydration paint, after which React swaps in the client value.
 */
export function useClientValue<T>(getClient: () => T, server: T): T {
  return useSyncExternalStore(noopSubscribe, getClient, () => server);
}
