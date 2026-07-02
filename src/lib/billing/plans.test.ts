import { describe, it, expect } from "vitest";
import { withinLimit, remaining, isPlanTier, PLAN_LIMITS } from "./plans";

describe("plan limits", () => {
  it("blocks the free plan at its system cap", () => {
    expect(withinLimit("free", "systems", 2)).toBe(true); // 2 < 3
    expect(withinLimit("free", "systems", 3)).toBe(false); // at cap
  });

  it("treats the team plan as unlimited", () => {
    expect(withinLimit("team", "systems", 10_000)).toBe(true);
    expect(remaining("team", "systems", 10_000)).toBeNull();
  });

  it("computes remaining allowance and never goes negative", () => {
    expect(remaining("free", "systems", 1)).toBe(2);
    expect(remaining("pro", "members", 99)).toBe(0);
  });

  it("recognizes valid plan tiers", () => {
    expect(isPlanTier("pro")).toBe(true);
    expect(isPlanTier("enterprise")).toBe(false);
  });

  it("has a limit shape for every plan", () => {
    for (const plan of Object.keys(PLAN_LIMITS)) {
      const l = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
      expect(l).toHaveProperty("systems");
      expect(l).toHaveProperty("members");
      expect(l).toHaveProperty("aiDocumentsPerMonth");
    }
  });
});
