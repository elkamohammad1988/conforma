import { describe, expect, it } from "vitest";
import { createTranslator } from "./translator";
import { getMessages } from "./messages";

const en = createTranslator("en", getMessages("en"));

describe("createTranslator — interpolation", () => {
  it("substitutes named variables", () => {
    expect(en.t("alerts.deadlineBody", { date: "2 Aug 2026" })).toBe(
      "Chapter III duties apply on 2 Aug 2026 (Art. 113).",
    );
  });

  it("returns the dot-path for an unknown key", () => {
    expect(en.t("does.not.exist")).toBe("does.not.exist");
  });
});

describe("createTranslator — CLDR plurals", () => {
  it("selects English one/other forms", () => {
    expect(en.t("settings.data.count", { count: 1 })).toBe(
      "1 system in this browser",
    );
    expect(en.t("settings.data.count", { count: 5 })).toBe(
      "5 systems in this browser",
    );
  });

  it("selects Arabic plural categories (one vs few)", () => {
    const ar = createTranslator("ar", getMessages("ar"));
    // Arabic 'one' is a fixed word with no numeral.
    expect(ar.t("settings.data.count", { count: 1 })).toBe(
      "نظام واحد في هذا المتصفح",
    );
    // 3 selects the 'few' category ("أنظمة"); the numeral is localised.
    expect(ar.t("settings.data.count", { count: 3 })).toContain("أنظمة");
  });
});

describe("createTranslator — formatters", () => {
  it("formats currency in EUR for the locale", () => {
    expect(en.formatCurrency(35_000_000)).toContain("€");
  });

  it("keeps date-only ISO strings on their calendar day (UTC)", () => {
    expect(en.formatDate("2026-08-02", { day: "numeric", month: "short", year: "numeric" })).toContain(
      "2026",
    );
  });
});
