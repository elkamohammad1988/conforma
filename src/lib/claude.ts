/**
 * Server-only Claude integration.
 *
 * Conforma's deterministic engine works fully offline. Claude is layered on
 * top for the things a decision tree can't do well: a plain-language compliance
 * narrative and first-draft regulatory documents. The whole module degrades
 * gracefully — when ANTHROPIC_API_KEY is absent it returns high-quality
 * template fallbacks, so the product is demo-able with zero credentials.
 */

// NOTE: server-only module — imported exclusively from Route Handlers.
import Anthropic from "@anthropic-ai/sdk";
import type { ClassificationResult } from "./classifier";
import { RISK_TIERS, PENALTIES } from "./eu-ai-act";

/** The model is fixed per project policy; adaptive thinking, no sampling params. */
const MODEL = "claude-opus-4-8";

export function isClaudeConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export type DocType =
  | "technical-documentation"
  | "transparency-notice"
  | "conformity-declaration";

export const DOC_LABELS: Record<DocType, string> = {
  "technical-documentation": "Technical Documentation (Annex IV)",
  "transparency-notice": "Transparency Notice (Art. 50)",
  "conformity-declaration": "EU Declaration of Conformity (Art. 47)",
};

interface DocContext {
  systemName: string;
  description: string;
  result: ClassificationResult;
  organisation?: string;
}

const firstSentence = (text: string) =>
  (text.split(/(?<=[.!?])\s/)[0] ?? text).trim();

function docPrompt(docType: DocType, ctx: DocContext): string {
  const { systemName, description, result, organisation } = ctx;
  const tier = RISK_TIERS[result.tier].label;
  const obligations = result.obligations
    .map((o) => `- ${o.title} (${o.citation}): ${o.description}`)
    .join("\n");
  const org = organisation || "the provider";

  const shared = `You are an EU AI Act compliance specialist drafting a real, usable document for ${org}.
Be precise, cite specific Articles/Annexes of Regulation (EU) 2024/1689, and write in formal regulatory English.
Output GitHub-flavoured Markdown only — no preamble, no "here is" framing. Use [BRACKETED PLACEHOLDERS] for details the organisation must fill in.

AI system: "${systemName}"
Description: ${description || "(not provided)"}
Risk classification: ${tier}
Applicable obligations:
${obligations}`;

  const instructions: Record<DocType, string> = {
    "technical-documentation": `Draft the Annex IV technical documentation pack as required by Art. 11. Include these numbered sections, each with concrete, system-specific guidance (not generic boilerplate):
1. General description of the AI system
2. Detailed description of elements and development process
3. Monitoring, functioning and control
4. Risk management system (Art. 9)
5. Data and data governance (Art. 10)
6. Human oversight measures (Art. 14)
7. Accuracy, robustness and cybersecurity (Art. 15)
8. Changes and version control
9. List of standards applied and the EU declaration of conformity reference`,
    "transparency-notice": `Draft a concise, user-facing transparency notice satisfying Art. 50. State clearly that the user is interacting with / viewing output from an AI system, what it does, its limitations, and how AI-generated or manipulated content is marked. Keep it readable for a general audience while remaining legally sufficient.`,
    "conformity-declaration": `Draft the EU Declaration of Conformity per Art. 47 and Annex V. Include: a unique reference, provider name & address [PLACEHOLDER], a statement that the declaration is issued under the sole responsibility of the provider, system identification, a statement of conformity with Regulation (EU) 2024/1689, references to relevant harmonised standards, the conformity-assessment procedure followed (Art. 43), notified body details if applicable [PLACEHOLDER], and signature block.`,
  };

  return `${shared}\n\nTASK: ${instructions[docType]}`;
}

/** Generate a compliance document. Falls back to a structured template offline. */
export async function generateDocument(
  docType: DocType,
  ctx: DocContext,
): Promise<{ markdown: string; source: "claude" | "template" }> {
  if (!isClaudeConfigured()) {
    return { markdown: templateDocument(docType, ctx), source: "template" };
  }

  try {
    const message = await getClient().messages.create({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: docPrompt(docType, ctx) }],
    });
    const markdown = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return { markdown: markdown || templateDocument(docType, ctx), source: "claude" };
  } catch {
    // Never let a transient API error break the workflow — fall back.
    return { markdown: templateDocument(docType, ctx), source: "template" };
  }
}

/** A short plain-language narrative explaining the classification. */
export async function explainClassification(
  ctx: DocContext,
): Promise<{ narrative: string; source: "claude" | "template" }> {
  if (!isClaudeConfigured()) {
    return { narrative: templateNarrative(ctx), source: "template" };
  }
  try {
    const prompt = `You are an EU AI Act compliance specialist. In 2-3 short paragraphs of plain English, explain to a non-lawyer why the AI system "${ctx.systemName}" was classified as "${RISK_TIERS[ctx.result.tier].label}", what that means in practice, and the single most urgent next step. Cite the key Article(s). Do not use Markdown headers; write flowing prose.

System description: ${ctx.description || "(not provided)"}
Engine reasoning: ${ctx.result.rationale.map((r) => `${r.text} [${r.citation}]`).join(" ")}`;

    const message = await getClient().messages.create({
      model: MODEL,
      max_tokens: 1200,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: prompt }],
    });
    const narrative = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return { narrative: narrative || templateNarrative(ctx), source: "claude" };
  } catch {
    return { narrative: templateNarrative(ctx), source: "template" };
  }
}

/* ----------------------------- Offline fallbacks ------------------------- */

function templateNarrative(ctx: DocContext): string {
  const meta = RISK_TIERS[ctx.result.tier];
  const reasons = ctx.result.rationale.map((r) => firstSentence(r.text)).join(" ");
  return `"${ctx.systemName}" has been classified as ${meta.label} under Regulation (EU) 2024/1689. ${reasons} ${meta.summary} The most urgent next step is to close the obligation gaps listed below before the applicable deadline (${ctx.result.deadline.label}, ${ctx.result.deadline.date}). Non-compliance can attract penalties of up to €${(ctx.result.tier === "prohibited" ? PENALTIES.prohibited.amountEur : PENALTIES.highRisk.amountEur).toLocaleString("en-GB")} or a percentage of worldwide annual turnover.`;
}

function templateDocument(docType: DocType, ctx: DocContext): string {
  const { systemName, description, result } = ctx;
  const obligations = result.obligations
    .map((o) => `### ${o.title}\n*Reference: ${o.citation}*\n\n${o.description}\n\n- [ ] Evidence: [DESCRIBE HOW YOU MEET THIS]\n- [ ] Owner: [NAME]\n- [ ] Status: [Not started / In progress / Complete]`)
    .join("\n\n");

  const header = `> **Draft — generated by Conforma.** Offline template. Connect an Anthropic API key for a fully drafted, system-specific version. This is decision-support, not legal advice.\n\n`;

  switch (docType) {
    case "technical-documentation":
      return `${header}# Technical Documentation — ${systemName}\n*Annex IV, drawn up per Art. 11 of Regulation (EU) 2024/1689*\n\n## 1. General description\n${description || "[DESCRIBE THE SYSTEM, ITS INTENDED PURPOSE AND THE PROVIDER]"}\n\n## 2. Risk classification\n**${RISK_TIERS[result.tier].label}** — ${result.citations.join(", ")}\n\n## 3. Obligations to evidence\n\n${obligations}\n\n## 4. Standards applied\n[LIST HARMONISED STANDARDS / COMMON SPECIFICATIONS]\n\n## 5. Declaration of conformity\n[REFERENCE THE EU DECLARATION OF CONFORMITY]`;
    case "transparency-notice":
      return `${header}# Transparency Notice — ${systemName}\n*Issued under Art. 50 of Regulation (EU) 2024/1689*\n\nYou are interacting with an artificial-intelligence system. ${description || "[DESCRIBE WHAT THE SYSTEM DOES]"}\n\n**What this means for you**\n- Outputs are generated or assisted by AI and may contain errors.\n- AI-generated or manipulated audio, image, video or text is marked as such.\n- [DESCRIBE HUMAN OVERSIGHT / HOW TO REACH A HUMAN]\n\n**Your rights**\n[DESCRIBE HOW USERS CAN CONTEST OR SEEK REVIEW OF DECISIONS, WHERE APPLICABLE]`;
    case "conformity-declaration":
      return `${header}# EU Declaration of Conformity\n*Per Art. 47 and Annex V of Regulation (EU) 2024/1689*\n\n1. **Reference:** [UNIQUE-ID]\n2. **Provider:** [NAME], [ADDRESS]\n3. **System:** ${systemName}\n4. This declaration is issued under the sole responsibility of the provider.\n5. The above AI system is in conformity with Regulation (EU) 2024/1689 and the following Union legislation: [LIST].\n6. **Harmonised standards applied:** [LIST]\n7. **Conformity-assessment procedure:** [Art. 43 — internal control / notified body]\n8. **Notified body:** [NAME, NUMBER — if applicable]\n\nSigned for and on behalf of: [NAME]\nPlace and date: [PLACE], [DATE]\nName, function, signature: [____________________]`;
  }
}
