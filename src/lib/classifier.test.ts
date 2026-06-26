import { describe, expect, it } from "vitest";
import { classify, EMPTY_ANSWERS, type ClassificationAnswers } from "./classifier";

const answers = (patch: Partial<ClassificationAnswers> = {}): ClassificationAnswers => ({
  ...EMPTY_ANSWERS,
  isAISystem: true,
  ...patch,
});

describe("classify — tier precedence", () => {
  it("flags prohibited practices above everything else", () => {
    const r = classify(
      answers({ prohibited: ["social-scoring"], annexIII: ["employment"] }),
    );
    expect(r.tier).toBe("prohibited");
    expect(r.citations).toContain("Art. 5(1)(c)");
    // Prohibited deadline is the Art. 5 application date, not the Annex III one.
    expect(r.deadline.id).toBe("prohibitions");
  });

  it("treats Annex I safety components as high-risk with the 2027 deadline", () => {
    const r = classify(answers({ annexI: true }));
    expect(r.tier).toBe("high");
    expect(r.deadline.id).toBe("high-risk-annex-i");
  });

  it("treats Annex III use cases as high-risk with the 2026 deadline", () => {
    const r = classify(answers({ annexIII: ["employment"] }));
    expect(r.tier).toBe("high");
    expect(r.deadline.id).toBe("high-risk-annex-iii");
    expect(r.obligations.length).toBeGreaterThan(0);
  });

  it("downgrades to limited under the Art. 6(3) derogation but keeps registration", () => {
    const r = classify(
      answers({ annexIII: ["employment"], annexIIIDerogation: true }),
    );
    expect(r.tier).toBe("limited");
    expect(r.citations).toContain("Art. 6(3)–(4)");
  });

  it("classifies transparency-only triggers as limited", () => {
    const r = classify(answers({ transparency: ["interacts"] }));
    expect(r.tier).toBe("limited");
    expect(r.citations).toContain("Art. 50");
  });

  it("defaults to minimal when nothing applies", () => {
    const r = classify(answers());
    expect(r.tier).toBe("minimal");
    expect(r.obligations).toHaveLength(0);
  });

  it("treats a non-AI system as out of scope (minimal)", () => {
    const r = classify(answers({ isAISystem: false, annexIII: ["employment"] }));
    expect(r.tier).toBe("minimal");
    expect(r.citations).toContain("Art. 3(1)");
  });
});

describe("classify — GPAI overlay", () => {
  it("adds the Art. 53 rationale without changing the tier", () => {
    const base = classify(answers({ annexIII: ["employment"] }));
    const gpai = classify(answers({ annexIII: ["employment"], isGPAI: true }));
    expect(gpai.tier).toBe(base.tier);
    expect(gpai.isGPAI).toBe(true);
    expect(gpai.citations).toContain("Art. 53");
  });
});

describe("classify — role scoping", () => {
  it("returns provider-only obligations for a provider", () => {
    const r = classify(answers({ annexIII: ["employment"], role: "provider" }));
    expect(r.obligations.every((o) => o.role !== "deployer")).toBe(true);
  });

  it("returns deployer-relevant obligations for a deployer", () => {
    const r = classify(answers({ annexIII: ["employment"], role: "deployer" }));
    expect(r.obligations.length).toBeGreaterThan(0);
    expect(r.obligations.every((o) => o.role !== "provider")).toBe(true);
  });
});

describe("classify — output integrity", () => {
  it("produces a deterministic result for identical input", () => {
    const input = answers({ annexIII: ["employment"], isGPAI: true });
    expect(classify(input)).toEqual(classify(input));
  });

  it("deduplicates citations and bounds confidence to [0,1]", () => {
    const r = classify(answers({ prohibited: ["social-scoring", "predictive-policing"] }));
    expect(new Set(r.citations).size).toBe(r.citations.length);
    expect(r.confidence).toBeGreaterThan(0);
    expect(r.confidence).toBeLessThanOrEqual(1);
  });
});
