import { describe, expect, it } from "vitest";
import {
  resolveLocale,
  matchAcceptLanguage,
  isLocale,
  DEFAULT_LOCALE,
} from "./config";

describe("resolveLocale", () => {
  it("matches exact tags case-insensitively", () => {
    expect(resolveLocale("fr")).toBe("fr");
    expect(resolveLocale("EN")).toBe("en");
    expect(resolveLocale("zh-CN")).toBe("zh-CN");
  });

  it("collapses regional variants to the base locale", () => {
    expect(resolveLocale("fr-CA")).toBe("fr");
    expect(resolveLocale("es-419")).toBe("es");
  });

  it("maps every Chinese script/region to Simplified", () => {
    expect(resolveLocale("zh")).toBe("zh-CN");
    expect(resolveLocale("zh-Hant")).toBe("zh-CN");
    expect(resolveLocale("zh-TW")).toBe("zh-CN");
  });

  it("returns null for unsupported or empty input", () => {
    expect(resolveLocale("de")).toBeNull();
    expect(resolveLocale("")).toBeNull();
    expect(resolveLocale(null)).toBeNull();
    expect(resolveLocale(undefined)).toBeNull();
  });
});

describe("matchAcceptLanguage", () => {
  it("honours q-weighting, skipping unsupported higher-q tags", () => {
    expect(matchAcceptLanguage("de;q=0.9, fr;q=0.8, en;q=0.7")).toBe("fr");
  });

  it("picks the highest-q supported tag regardless of order", () => {
    expect(matchAcceptLanguage("en;q=0.5, ar;q=0.9")).toBe("ar");
  });

  it("defaults q to 1 for unweighted tags", () => {
    expect(matchAcceptLanguage("fr, en;q=0.9")).toBe("fr");
  });

  it("falls back to the default locale when nothing matches", () => {
    expect(matchAcceptLanguage("de, it, ja")).toBe(DEFAULT_LOCALE);
    expect(matchAcceptLanguage(null)).toBe(DEFAULT_LOCALE);
    expect(matchAcceptLanguage("")).toBe(DEFAULT_LOCALE);
  });
});

describe("isLocale", () => {
  it("is a correct type guard", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh-CN")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(42)).toBe(false);
  });
});
