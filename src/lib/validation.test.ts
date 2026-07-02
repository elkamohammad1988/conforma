import { describe, it, expect } from "vitest";
import { isEmail, sanitizeNextPath, slugifyOrgName } from "./validation";

describe("isEmail", () => {
  it("accepts plausible addresses and rejects malformed ones", () => {
    expect(isEmail("a@b.co")).toBe(true);
    expect(isEmail("jane.doe@company.io")).toBe(true);
    expect(isEmail("no-at-sign")).toBe(false);
    expect(isEmail("no@domain")).toBe(false);
    expect(isEmail("spaces in@email.com")).toBe(false);
    expect(isEmail("")).toBe(false);
  });
});

describe("sanitizeNextPath", () => {
  it("allows internal single-slash paths", () => {
    expect(sanitizeNextPath("/team")).toBe("/team");
    expect(sanitizeNextPath("/systems/abc")).toBe("/systems/abc");
  });

  it("blocks open-redirect vectors and empties, falling back", () => {
    expect(sanitizeNextPath("//evil.com")).toBe("/dashboard");
    expect(sanitizeNextPath("https://evil.com")).toBe("/dashboard");
    expect(sanitizeNextPath("evil.com")).toBe("/dashboard");
    expect(sanitizeNextPath(null)).toBe("/dashboard");
    expect(sanitizeNextPath(undefined)).toBe("/dashboard");
    expect(sanitizeNextPath("/x", "/onboarding")).toBe("/x");
    expect(sanitizeNextPath("//x", "/onboarding")).toBe("/onboarding");
  });
});

describe("slugifyOrgName", () => {
  it("lowercases, strips accents, and collapses separators", () => {
    expect(slugifyOrgName("Acme Inc.")).toBe("acme-inc");
    expect(slugifyOrgName("Café Ölü")).toBe("cafe-olu");
    expect(slugifyOrgName("  Multiple   Spaces  ")).toBe("multiple-spaces");
    expect(slugifyOrgName("A/B & C")).toBe("a-b-c");
  });

  it("never yields empty, leading/trailing hyphens, or over-length", () => {
    expect(slugifyOrgName("!!!")).toBe("org");
    expect(slugifyOrgName("")).toBe("org");
    const long = slugifyOrgName("x".repeat(100));
    expect(long.length).toBeLessThanOrEqual(40);
    expect(long.startsWith("-")).toBe(false);
    expect(long.endsWith("-")).toBe(false);
  });

  it("produces a slug matching the DB CHECK pattern", () => {
    const re = /^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$/;
    for (const name of ["Acme Inc.", "Café", "  weird -- name  ", "123"]) {
      expect(slugifyOrgName(name)).toMatch(re);
    }
  });
});
