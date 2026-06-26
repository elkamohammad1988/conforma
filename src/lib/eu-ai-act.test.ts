import { describe, expect, it } from "vitest";
import {
  COMPLIANCE_DEADLINES,
  DEPLOYER_OBLIGATIONS,
  HIGH_RISK_OBLIGATIONS,
  PENALTIES,
  PRIMARY_DEADLINE,
  TRANSPARENCY_OBLIGATIONS,
  daysUntil,
  obligationsForTier,
} from "./eu-ai-act";

describe("obligationsForTier", () => {
  it("returns nothing for minimal and an empty-but-valid set for unknowns", () => {
    expect(obligationsForTier("minimal")).toHaveLength(0);
  });

  it("merges provider and deployer obligations for high risk (role=both)", () => {
    const both = obligationsForTier("high", "both");
    expect(both.length).toBe(
      HIGH_RISK_OBLIGATIONS.length + DEPLOYER_OBLIGATIONS.length,
    );
  });

  it("filters by role, keeping shared (both) obligations", () => {
    const provider = obligationsForTier("high", "provider");
    expect(provider.every((o) => o.role === "provider" || o.role === "both")).toBe(true);
    expect(provider.some((o) => o.role === "both")).toBe(true);
  });

  it("returns the Art. 50 set for limited risk", () => {
    expect(obligationsForTier("limited")).toEqual(TRANSPARENCY_OBLIGATIONS);
  });
});

describe("daysUntil", () => {
  it("is positive before the date and negative after", () => {
    expect(daysUntil("2030-01-01", "2029-12-31")).toBe(1);
    expect(daysUntil("2020-01-01", "2020-01-02")).toBeLessThan(0);
  });

  it("is zero on the day itself", () => {
    expect(daysUntil("2026-08-02", "2026-08-02")).toBe(0);
  });
});

describe("regulatory constants", () => {
  it("points PRIMARY_DEADLINE at the Annex III milestone", () => {
    expect(PRIMARY_DEADLINE.id).toBe("high-risk-annex-iii");
    expect(PRIMARY_DEADLINE.date).toBe("2026-08-02");
  });

  it("keeps the staged timeline in chronological order", () => {
    const dates = COMPLIANCE_DEADLINES.map((d) => d.date);
    expect([...dates].sort()).toEqual(dates);
  });

  it("ranks penalties prohibited > high-risk > misleading", () => {
    expect(PENALTIES.prohibited.amountEur).toBeGreaterThan(PENALTIES.highRisk.amountEur);
    expect(PENALTIES.highRisk.amountEur).toBeGreaterThan(PENALTIES.misleadingInfo.amountEur);
  });
});
