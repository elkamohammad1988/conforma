/**
 * Framework-agnostic translation + formatting engine.
 *
 * Used identically from Server Components, Client Components, the middleware and
 * the server-only AI module. Given a locale + its catalog it returns a `t()`
 * function (dot-path lookup, `{var}` interpolation, CLDR plurals) plus a set of
 * `Intl`-backed formatters so dates, numbers and currency follow each locale.
 */
import {
  type Locale,
  type Direction,
  LOCALE_META,
  dirOf,
} from "./config";
import { type Messages, FALLBACK_MESSAGES } from "./messages";

export type TVars = Record<string, string | number>;

type PluralLike = { other: string; [k: string]: string | undefined };

function isPlural(value: unknown): value is PluralLike {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).other === "string"
  );
}

function lookup(root: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      root,
    );
}

function interpolate(template: string, vars?: TVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export interface Translator {
  locale: Locale;
  dir: Direction;
  intlLocale: string;
  /** Look up a message by dot-path, interpolating `{vars}` and selecting plurals. */
  t: (path: string, vars?: TVars) => string;
  /** Whether a key resolves in the active locale or the English fallback. */
  has: (path: string) => boolean;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string;
  /** Format an ISO date string (or Date). Date-only ISO strings render in UTC. */
  formatDate: (value: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatDateLong: (value: string | Date) => string;
  formatMonthYear: (value: string | Date) => string;
}

function toDate(value: string | Date): { date: Date; dateOnly: boolean } {
  if (value instanceof Date) return { date: value, dateOnly: false };
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  // Date-only strings are parsed as UTC midnight by the spec; keep them in UTC
  // when formatting so the calendar day never shifts across time zones.
  return { date: new Date(value), dateOnly };
}

export function createTranslator(
  locale: Locale,
  messages: Messages = FALLBACK_MESSAGES,
): Translator {
  const intlLocale = LOCALE_META[locale].intlLocale;
  const pluralRules = new Intl.PluralRules(intlLocale);

  const resolve = (path: string): unknown => {
    const value = lookup(messages, path);
    if (value !== undefined) return value;
    return lookup(FALLBACK_MESSAGES, path);
  };

  const t = (path: string, vars?: TVars): string => {
    const value = resolve(path);

    if (typeof value === "string") return interpolate(value, vars);

    if (isPlural(value)) {
      const count = typeof vars?.count === "number" ? vars.count : 0;
      const category = pluralRules.select(count);
      const template = value[category] ?? value.other;
      const localisedCount = new Intl.NumberFormat(intlLocale).format(count);
      return interpolate(template, { ...vars, count: localisedCount });
    }

    // Missing or non-leaf key — surface the path so gaps are obvious in dev.
    return path;
  };

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(intlLocale, options).format(value);

  const formatCurrency = (value: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
      ...options,
    }).format(value);

  const formatDate = (
    value: string | Date,
    options?: Intl.DateTimeFormatOptions,
  ) => {
    const { date, dateOnly } = toDate(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(intlLocale, {
      ...(dateOnly ? { timeZone: "UTC" } : {}),
      ...options,
    }).format(date);
  };

  const formatDateLong = (value: string | Date) =>
    formatDate(value, { day: "numeric", month: "long", year: "numeric" });

  const formatMonthYear = (value: string | Date) =>
    formatDate(value, { month: "short", year: "numeric" });

  return {
    locale,
    dir: dirOf(locale),
    intlLocale,
    t,
    has: (path) => resolve(path) !== undefined,
    formatNumber,
    formatCurrency,
    formatDate,
    formatDateLong,
    formatMonthYear,
  };
}
