import { describe, expect, it } from "vitest";
import { LOCALES } from "./config";
import { getMessages } from "./messages";

/**
 * Runtime catalog parity. TypeScript already forces identical *keys* (every
 * locale must satisfy `typeof en`), but it cannot check that a translated string
 * preserves its `{placeholder}` set or that plurals keep an `other` form. A
 * dropped `{count}` in one locale compiles clean and only shows up at runtime —
 * this test is the guard for exactly that class of bug.
 */

function isPlural(v: unknown): v is { other: string } {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as Record<string, unknown>).other === "string"
  );
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

/** Flatten a catalog to `dotpath -> canonical string value` (plural → `other`). */
function flatten(
  obj: unknown,
  prefix = "",
  out = new Map<string, string>(),
): Map<string, string> {
  if (isPlural(obj)) {
    out.set(prefix, obj.other);
    return out;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string") out.set(path, v);
      else flatten(v, path, out);
    }
  }
  return out;
}

const en = flatten(getMessages("en"));
const others = LOCALES.filter((l) => l !== "en");

describe("i18n catalog parity", () => {
  it.each(others)("%s exposes exactly the same leaf keys as en", (locale) => {
    const cat = flatten(getMessages(locale));
    expect([...cat.keys()].sort()).toEqual([...en.keys()].sort());
  });

  it.each(others)("%s preserves every interpolation placeholder", (locale) => {
    const cat = flatten(getMessages(locale));
    const mismatches: string[] = [];
    for (const [path, value] of en) {
      const expected = placeholders(value).join(",");
      const actual = placeholders(cat.get(path) ?? "").join(",");
      if (expected !== actual) {
        mismatches.push(`${path}: en{${expected}} vs ${locale}{${actual}}`);
      }
    }
    expect(mismatches).toEqual([]);
  });

  it.each(LOCALES)("%s has no blank message values", (locale) => {
    const blank = [...flatten(getMessages(locale)).entries()]
      .filter(([, v]) => v.trim() === "")
      .map(([k]) => k);
    expect(blank).toEqual([]);
  });
});
