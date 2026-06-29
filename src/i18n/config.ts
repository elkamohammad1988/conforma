/**
 * Locale configuration — the single source of truth for which languages
 * Conforma speaks, how they are written, and how dates / numbers / currency
 * are formatted in each.
 *
 * This module is intentionally free of React and Next imports so it can be used
 * from the middleware (Edge), Server Components, Client Components and tests
 * alike.
 */

export const LOCALES = ["en", "ar", "fr", "es", "zh-CN"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie that persists the visitor's choice across sessions and to the server. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
/** Header the middleware forwards so the very first SSR render is already correct. */
export const LOCALE_HEADER = "x-conforma-locale";
/** One year, in seconds — the locale preference is sticky. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Direction = "ltr" | "rtl";

export interface LocaleMeta {
  /** BCP-47 tag used for the `lang` attribute and `Intl` formatters. */
  code: Locale;
  /** English name, for documentation / fallbacks. */
  englishName: string;
  /** Endonym — how speakers name their own language (shown in the switcher). */
  nativeName: string;
  /** Writing direction. */
  dir: Direction;
  /** `Intl` locale used for dates, numbers and currency. */
  intlLocale: string;
  /** OpenGraph `og:locale` value. */
  ogLocale: string;
  /** A short flag/sced emoji label for the switcher (decorative only). */
  flag: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    englishName: "English",
    nativeName: "English",
    dir: "ltr",
    intlLocale: "en-GB",
    ogLocale: "en_GB",
    flag: "🇬🇧",
  },
  ar: {
    code: "ar",
    englishName: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    intlLocale: "ar",
    ogLocale: "ar_AR",
    flag: "🇸🇦",
  },
  fr: {
    code: "fr",
    englishName: "French",
    nativeName: "Français",
    dir: "ltr",
    intlLocale: "fr-FR",
    ogLocale: "fr_FR",
    flag: "🇫🇷",
  },
  es: {
    code: "es",
    englishName: "Spanish",
    nativeName: "Español",
    dir: "ltr",
    intlLocale: "es-ES",
    ogLocale: "es_ES",
    flag: "🇪🇸",
  },
  "zh-CN": {
    code: "zh-CN",
    englishName: "Chinese (Simplified)",
    nativeName: "简体中文",
    dir: "ltr",
    intlLocale: "zh-CN",
    ogLocale: "zh_CN",
    flag: "🇨🇳",
  },
};

/** Ordered list of locale metadata — drives the language switcher menu. */
export const LOCALE_LIST: LocaleMeta[] = LOCALES.map((l) => LOCALE_META[l]);

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): Direction {
  return LOCALE_META[locale].dir;
}

export function isRtl(locale: Locale): boolean {
  return dirOf(locale) === "rtl";
}

/**
 * Normalise an arbitrary language tag to one of our supported locales.
 * Handles regional variants (`fr-CA` → `fr`), scripts (`zh-Hant`/`zh-Hans` →
 * `zh-CN`) and casing. Returns `null` when there is no reasonable match.
 */
export function resolveLocale(input: string | null | undefined): Locale | null {
  if (!input) return null;
  const raw = input.trim().toLowerCase();
  if (!raw) return null;

  // Exact (case-insensitive) match first.
  for (const l of LOCALES) {
    if (l.toLowerCase() === raw) return l;
  }

  const primary = raw.split("-")[0];
  switch (primary) {
    case "en":
      return "en";
    case "ar":
      return "ar";
    case "fr":
      return "fr";
    case "es":
      return "es";
    case "zh":
      // We only ship Simplified Chinese; map every Chinese variant to it.
      return "zh-CN";
    default:
      return null;
  }
}

/**
 * Pick the best supported locale from an `Accept-Language` header, honouring the
 * quality (`q`) weighting. Falls back to the default locale when nothing matches.
 */
export function matchAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
      return { tag: tag.trim(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const match = resolveLocale(tag);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}
