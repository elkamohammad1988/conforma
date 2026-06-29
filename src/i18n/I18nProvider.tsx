"use client";

/**
 * Client-side i18n runtime.
 *
 * The provider is seeded on the server with the locale resolved from the cookie
 * / Accept-Language header, so the first paint (and SEO) already render in the
 * right language with the right `dir`. After hydration, `setLocale` flips the
 * language **instantly** — it is pure client state, no navigation, no reload —
 * and persists the choice to a cookie (for the server) and localStorage (the
 * durable record of an explicit choice). The `<html>` `lang`/`dir` attributes
 * are updated imperatively so RTL and locale-scoped fonts switch with it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type Locale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_META,
  isLocale,
} from "./config";
import { getMessages, type Messages } from "./messages";
import { createTranslator, type Translator } from "./translator";

const STORAGE_KEY = "conforma.locale";

interface I18nContextValue extends Translator {
  messages: Messages;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function persist(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* private mode / storage disabled — the cookie still carries the choice */
  }
}

function applyDocument(locale: Locale) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = locale;
  root.dir = LOCALE_META[locale].dir;
}

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return;
    persist(next);
    applyDocument(next);
    setLocaleState(next);
  }, []);

  // On mount, mirror the server-resolved locale into the cookie + localStorage
  // so the preference persists even if the proxy didn't run for this request.
  // (Switching later goes through `setLocale`, which persists on its own.)
  useEffect(() => {
    persist(initialLocale);
  }, [initialLocale]);

  const value = useMemo<I18nContextValue>(() => {
    const messages = getMessages(locale);
    const translator = createTranslator(locale, messages);
    return { ...translator, messages, setLocale };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Full i18n context — translator, formatters, current locale and `setLocale`. */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within <I18nProvider>");
  }
  return ctx;
}

/** Convenience hook for components that only need the `t` function. */
export function useT() {
  return useI18n().t;
}
