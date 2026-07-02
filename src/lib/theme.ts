/**
 * Theme (light / dark) — a tiny external store, mirroring the pattern in
 * `store.ts`. The source of truth is the `data-theme` attribute on <html>,
 * which an inline script in the root layout sets **before first paint** (no
 * flash). This store keeps React in sync via `useSyncExternalStore` and, on
 * toggle, updates the attribute + persists the explicit choice to localStorage.
 *
 * Dark is the zero-config default: the base design tokens in `globals.css` are
 * dark, and a `:root[data-theme="light"]` block re-tints the whole product.
 */

"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_KEY = "conforma.theme";

const listeners = new Set<() => void>();
let current: Theme | null = null;

/** Dark is the brand's signature look — the default until the user opts out. */
const DEFAULT_THEME: Theme = "dark";

/** Resolve the active theme: attribute (set pre-paint) → stored choice → dark. */
function read(): Theme {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.dataset.theme;
    if (attr === "light" || attr === "dark") return attr;
  }
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage disabled — the in-session attribute still drives the theme */
  }
  return DEFAULT_THEME;
}

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

/** Set the theme explicitly, paint it, persist it, and notify subscribers. */
export function setTheme(theme: Theme): void {
  current = theme;
  apply(theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — the attribute still drives this session */
  }
  for (const listener of listeners) listener();
}

export function toggleTheme(): void {
  setTheme((current ?? read()) === "dark" ? "light" : "dark");
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  if (current === null) current = read();
  return current;
}

/** Server (and the hydration render): render as dark, then reconcile on mount. */
function getServerSnapshot(): Theme {
  return "dark";
}

/** Reactive current theme plus setters. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { theme, isDark: theme === "dark", setTheme, toggle: toggleTheme };
}
