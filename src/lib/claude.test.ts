import { describe, expect, it } from "vitest";
import {
  aiMode,
  isClaudeConfigured,
  explainClassification,
  generateDocument,
  type DocType,
} from "./claude";
import { classify, EMPTY_ANSWERS } from "./classifier";

// vitest.config sets ANTHROPIC_API_KEY="" so these exercise Demo Mode end-to-end.

const ctx = () => {
  const result = classify({
    ...EMPTY_ANSWERS,
    name: "CV Screening Model",
    isAISystem: true,
    annexIII: ["employment"],
  });
  return {
    systemName: "CV Screening Model",
    description: "Ranks job applicants for recruiters.",
    organisation: "Acme Talent",
    result,
  };
};

describe("Demo Mode detection", () => {
  it("reports demo mode when no key is configured", () => {
    expect(isClaudeConfigured()).toBe(false);
    expect(aiMode()).toBe("demo");
  });
});

describe("generateDocument (Demo Mode)", () => {
  const types: DocType[] = [
    "technical-documentation",
    "transparency-notice",
    "conformity-declaration",
  ];

  it.each(types)("returns a tagged, system-specific draft for %s", async (type) => {
    const { markdown, source } = await generateDocument(type, ctx());
    expect(source).toBe("demo");
    expect(markdown).toContain("CV Screening Model");
    expect(markdown).toContain("Demo Mode");
    expect(markdown.length).toBeGreaterThan(500);
  });

  it("cites the controlling regulation in the technical file", async () => {
    const { markdown } = await generateDocument("technical-documentation", ctx());
    expect(markdown).toContain("Annex IV");
    expect(markdown).toContain("2024/1689");
  });

  it("localizes the demo-mode note for non-English locales", async () => {
    const { markdown } = await generateDocument("transparency-notice", ctx(), "fr");
    expect(markdown).toContain("Mode Démo");
  });
});

describe("explainClassification (Demo Mode)", () => {
  it("returns a plain-language narrative tagged as demo", async () => {
    const { narrative, source } = await explainClassification(ctx());
    expect(source).toBe("demo");
    expect(narrative).toContain("CV Screening Model");
    expect(narrative.length).toBeGreaterThan(200);
  });
});
