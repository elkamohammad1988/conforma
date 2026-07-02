import { describe, expect, it } from "vitest";
import {
  classificationResultSchema,
  explainBodySchema,
  generateDocBodySchema,
  INPUT_LIMITS,
} from "./schemas";
import { classify, EMPTY_ANSWERS } from "./classifier";

const validResult = classify({
  ...EMPTY_ANSWERS,
  name: "CV Screening",
  isAISystem: true,
  annexIII: ["employment"],
});

describe("classificationResultSchema", () => {
  it("accepts a real classifier result", () => {
    expect(classificationResultSchema.safeParse(validResult).success).toBe(true);
  });

  it("rejects a malformed obligation element (the hand-rolled gap)", () => {
    const bad = { ...validResult, obligations: [{}] };
    expect(classificationResultSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an unknown tier", () => {
    const bad = { ...validResult, tier: "banana" };
    expect(classificationResultSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects a rationale point with an unknown kind", () => {
    const bad = { ...validResult, rationale: [{ kind: "nope", citation: "x" }] };
    expect(classificationResultSchema.safeParse(bad).success).toBe(false);
  });

  it("caps oversized arrays so the payload can't bloat the model prompt", () => {
    const one = validResult.obligations[0];
    const bad = {
      ...validResult,
      obligations: Array.from({ length: 101 }, () => one),
    };
    const parsed = classificationResultSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.code === "too_big")).toBe(true);
    }
  });

  it("caps over-long strings inside the result (too_big → 413)", () => {
    const bad = { ...validResult, citations: ["a".repeat(301)] };
    const parsed = classificationResultSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.code === "too_big")).toBe(true);
    }
  });
});

describe("explainBodySchema", () => {
  it("accepts a valid body", () => {
    const parsed = explainBodySchema.safeParse({
      systemName: "Sys",
      description: "d",
      result: validResult,
      locale: "fr",
    });
    expect(parsed.success).toBe(true);
  });

  it("requires a non-empty systemName", () => {
    expect(explainBodySchema.safeParse({ result: validResult }).success).toBe(false);
    expect(
      explainBodySchema.safeParse({ systemName: "", result: validResult }).success,
    ).toBe(false);
  });

  it("flags an over-cap field as too_big (→ 413)", () => {
    const parsed = explainBodySchema.safeParse({
      systemName: "a".repeat(INPUT_LIMITS.systemName + 1),
      result: validResult,
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.code === "too_big")).toBe(true);
    }
  });
});

describe("generateDocBodySchema", () => {
  it("accepts a valid document request", () => {
    const parsed = generateDocBodySchema.safeParse({
      docType: "transparency-notice",
      systemName: "Sys",
      result: validResult,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects an unknown docType", () => {
    const parsed = generateDocBodySchema.safeParse({
      docType: "not-a-doc",
      systemName: "Sys",
      result: validResult,
    });
    expect(parsed.success).toBe(false);
  });
});
