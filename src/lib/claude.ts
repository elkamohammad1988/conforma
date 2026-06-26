/**
 * Server-only AI integration with a first-class Demo Mode.
 *
 * Conforma's deterministic engine works fully offline. Claude is layered on
 * top for the things a decision tree can't do well: a plain-language compliance
 * narrative and first-draft regulatory documents.
 *
 * The whole module degrades gracefully. When ANTHROPIC_API_KEY is absent the
 * product automatically runs in **Demo Mode**: instead of erroring or nagging,
 * it returns realistic, system-specific pre-generated documents that read like
 * a genuine AI first draft. This keeps the public GitHub repo and the Vercel
 * deployment fully functional — and premium — with zero paid credentials.
 */

// NOTE: server-only module — imported exclusively from Route Handlers.
import Anthropic from "@anthropic-ai/sdk";
import type { ClassificationResult } from "./classifier";
import { RISK_TIERS, PENALTIES } from "./eu-ai-act";

/** The model is fixed per project policy; adaptive thinking, no sampling params. */
const MODEL = "claude-opus-4-8";

/** Where a piece of AI output came from. `demo` = pre-generated Demo Mode draft. */
export type AiSource = "claude" | "demo";

/** Live = a real key is configured; Demo = pre-generated drafts, no API needed. */
export type AiMode = "live" | "demo";

export function isClaudeConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Resolve the current generation mode. Drives the UI's Demo Mode indicators. */
export function aiMode(): AiMode {
  return isClaudeConfigured() ? "live" : "demo";
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

/** Generate a compliance document. Falls back to a Demo Mode draft offline. */
export async function generateDocument(
  docType: DocType,
  ctx: DocContext,
): Promise<{ markdown: string; source: AiSource }> {
  if (!isClaudeConfigured()) {
    return { markdown: demoDocument(docType, ctx), source: "demo" };
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
    return { markdown: markdown || demoDocument(docType, ctx), source: "claude" };
  } catch {
    // Never let a transient API error break the workflow — fall back to a draft.
    return { markdown: demoDocument(docType, ctx), source: "demo" };
  }
}

/** A short plain-language narrative explaining the classification. */
export async function explainClassification(
  ctx: DocContext,
): Promise<{ narrative: string; source: AiSource }> {
  if (!isClaudeConfigured()) {
    return { narrative: demoNarrative(ctx), source: "demo" };
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
    return { narrative: narrative || demoNarrative(ctx), source: "claude" };
  } catch {
    return { narrative: demoNarrative(ctx), source: "demo" };
  }
}

/* ------------------------------------------------------------------------- */
/*  Demo Mode — realistic pre-generated AI drafts (no external API needed)   */
/* ------------------------------------------------------------------------- */

/**
 * Demo Mode drafts are written to look and read like genuine Claude output:
 * formal regulatory English, system-specific prose, Article-level citations,
 * and [BRACKETED PLACEHOLDERS] only where an organisation must supply its own
 * facts. They are decision-support, not legal advice.
 */

const DEMO_HEADER =
  `> **AI-drafted by Conforma · Demo Mode.** This is a realistic, system-specific ` +
  `first draft generated without any external AI service — so the public demo works ` +
  `with zero credentials. Replace every \`[BRACKETED PLACEHOLDER]\` with your own ` +
  `details before use. Decision-support, not legal advice.\n\n`;

function demoNarrative(ctx: DocContext): string {
  const meta = RISK_TIERS[ctx.result.tier];
  const reasons = ctx.result.rationale.map((r) => firstSentence(r.text)).join(" ");
  const penalty =
    ctx.result.tier === "prohibited"
      ? PENALTIES.prohibited
      : PENALTIES.highRisk;
  const gpai = ctx.result.isGPAI
    ? " Because it is built on a general-purpose AI model, the GPAI provider duties in Art. 53 apply on top of the tier above — keep model technical documentation and a training-data summary ready."
    : "";

  const nextStep =
    ctx.result.tier === "prohibited"
      ? "stop placing the system on the market or putting it into service, because the practice is banned outright under Art. 5"
      : ctx.result.tier === "high"
        ? "stand up the Art. 9 risk-management process and begin the Annex IV technical file, since these gate the conformity assessment you must pass before the deadline"
        : ctx.result.tier === "limited"
          ? "implement the Art. 50 transparency disclosures — tell people they are dealing with AI and machine-readably label any synthetic content"
          : "record this assessment in your AI inventory and keep it under review, since intended-purpose changes can move the system into a higher tier";

  return `"${ctx.systemName}" has been classified as ${meta.label} under Regulation (EU) 2024/1689. ${reasons} In practice this means ${meta.summary.charAt(0).toLowerCase()}${meta.summary.slice(1)}${gpai}

The single most urgent next step is to ${nextStep}. The clock that matters here is ${ctx.result.deadline.label.toLowerCase()} — ${ctx.result.deadline.date} — after which the obligations become enforceable. Non-compliance can attract penalties of up to €${penalty.amountEur.toLocaleString("en-GB")} or ${penalty.turnoverPct}% of worldwide annual turnover, whichever is higher (${penalty.citation}).

Treat the obligation checklist below as your gap analysis: assign an owner to each item, capture the evidence that shows you meet it, and close anything still open well ahead of the deadline. None of this is legal advice — confirm the final classification and your remediation plan with qualified counsel.`;
}

function demoDocument(docType: DocType, ctx: DocContext): string {
  switch (docType) {
    case "technical-documentation":
      return technicalDocumentation(ctx);
    case "transparency-notice":
      return transparencyNotice(ctx);
    case "conformity-declaration":
      return conformityDeclaration(ctx);
  }
}

/** Annex IV technical documentation, drawn up per Art. 11. */
function technicalDocumentation(ctx: DocContext): string {
  const { systemName, description, result, organisation } = ctx;
  const org = organisation || "[PROVIDER LEGAL NAME]";
  const tier = RISK_TIERS[result.tier].label;
  const desc =
    description ||
    "[Describe the system's intended purpose, the problem it solves, and the context in which it is deployed.]";

  // Map the engine's obligation checklist into a governance traceability table.
  const obligationRows =
    result.obligations.length > 0
      ? result.obligations
          .map(
            (o) =>
              `| ${o.title} | ${o.citation} | ${o.role} | [Evidence / artefact reference] | [Owner] | [Not started / In progress / Complete] |`,
          )
          .join("\n")
      : "| — | — | — | No system-level obligations identified for this tier. | — | — |";

  return `${DEMO_HEADER}# Technical Documentation — ${systemName}
*Drawn up under Article 11 and Annex IV of Regulation (EU) 2024/1689 (the EU AI Act)*

| | |
|---|---|
| **Provider** | ${org} |
| **System** | ${systemName} |
| **Risk classification** | ${tier} (${result.citations.join(", ")}) |
| **Document reference** | [TD-${systemName.replace(/[^A-Za-z0-9]+/g, "-").toUpperCase()}-001] |
| **Version** | [1.0] · **Date** | [YYYY-MM-DD] |
| **Status** | Draft for internal review |

---

## 1. General description of the AI system

**1.1 Intended purpose.** ${desc} ${org} places "${systemName}" on the market / puts it into service for this purpose only; any use outside it is reasonably-foreseeable misuse addressed in Section 4.

**1.2 Provider and points of contact.** Provider: ${org}, [registered address]. Authorised representative in the Union (if the provider is established outside the EU): [NAME, ADDRESS — Art. 22]. Single point of contact for authorities: [NAME, EMAIL].

**1.3 Versions and form of supply.** This documentation covers version [1.0] of the system. It is supplied as [SaaS / on-premise software / embedded component] and interacts with [list the products or services it is integrated into].

**1.4 Hardware and deployment environment.** The system runs on [describe compute environment — e.g. EU-region cloud, GPU class, container orchestration]. Expected throughput and latency targets: [STATE].

## 2. Detailed description of the elements and development process

**2.1 System architecture.** "${systemName}" comprises [data ingestion → pre-processing → model inference → post-processing → human-review interface]. A component diagram is held at [reference].

**2.2 Model and methods.** The core model is [model family / architecture, e.g. a fine-tuned transformer / gradient-boosted trees]. Design choices, key assumptions and the optimisation objective are recorded at [reference]. Where third-party or general-purpose AI models are used, their provider documentation is retained per Art. 53(1)(b).

**2.3 Development process.** Development follows [your SDLC], with stage gates for design review, data validation, evaluation and security review. Roles and responsibilities are defined in the quality-management system (Art. 17).

**2.4 Computational resources used.** Training/fine-tuning consumed approximately [STATE compute] over [period]; this is logged for reproducibility.

## 3. Monitoring, functioning and control

**3.1 Capabilities and limitations.** The system is expected to perform [intended capability] within [operating envelope]. Known limitations include [e.g. degraded accuracy on under-represented groups, sensitivity to out-of-distribution inputs]. These limitations are communicated to deployers in the instructions for use (Art. 13).

**3.2 Expected performance.** Target metrics and their accepted ranges are defined in Section 7. Performance is monitored continuously in production via [monitoring stack], with alerting thresholds at [STATE].

**3.3 Foreseeable unintended outcomes & post-market monitoring.** Risks to health, safety and fundamental rights, and the controls that mitigate them, are tracked in the risk-management system (Section 4). A post-market monitoring plan (Art. 72) defines how field performance and incidents feed back into the lifecycle.

## 4. Risk management system (Art. 9)

A continuous, iterative risk-management process operates across the system's entire lifecycle:

1. **Identify** reasonably-foreseeable risks to health, safety and fundamental rights, including from reasonably-foreseeable misuse.
2. **Estimate and evaluate** those risks under intended-use and misuse conditions.
3. **Adopt** targeted risk-management measures, giving priority to elimination or reduction through design before mitigation through information and training.
4. **Test** that residual risks are judged acceptable and that the system performs consistently for its intended purpose.

The current risk register is held at [reference] and reviewed [quarterly / on material change]. Residual risks accepted by [accountable owner] are listed at [reference].

## 5. Data and data governance (Art. 10)

**5.1 Datasets.** Training, validation and testing datasets are described at [reference], including provenance, scope and how data was collected and labelled.

**5.2 Data quality.** Datasets are examined to be relevant, sufficiently representative, and to the best extent possible free of errors and complete for the intended purpose. Pre-processing, labelling and cleaning steps are documented at [reference].

**5.3 Bias examination.** Datasets are examined for possible biases likely to affect health, safety or fundamental rights, and appropriate measures to detect, prevent and mitigate such biases are recorded at [reference].

**5.4 Special-category data.** Where special-category personal data is processed strictly for bias monitoring, the Art. 10(5) safeguards and the relevant GDPR basis apply; the assessment is held at [reference].

## 6. Human oversight measures (Art. 14)

The system is designed to be effectively overseen by natural persons during use. Oversight measures include:

- **Interpretability:** outputs are presented with [confidence scores / rationale / contributing factors] so a reviewer can interpret them correctly.
- **Automation-bias safeguards:** reviewers are trained to remain aware of the tendency to over-rely on system output and are instructed on when to disregard it.
- **Intervention controls:** an authorised human can [override / not act on / reverse] an output, and a documented procedure exists to **stop** the system.
- **Assignment:** the deployer assigns oversight to [competent persons with the necessary authority and training].

## 7. Accuracy, robustness and cybersecurity (Art. 15)

**7.1 Accuracy.** Declared performance metrics: [e.g. accuracy / precision / recall / F1] = [value], measured on [test set] as of [date]. Accepted operating ranges and the method of measurement are at [reference]. Metrics are reported in the instructions for use.

**7.2 Robustness.** The system is resilient to errors, faults and inconsistencies via [redundancy / fallback behaviour / input validation]. Behaviour on out-of-distribution and edge-case inputs has been tested ([reference]).

**7.3 Cybersecurity.** Measures address AI-specific threats including data and model poisoning, adversarial examples, model evasion and confidentiality attacks: [controls — e.g. input sanitisation, rate limiting, model-access controls, monitoring]. The security assessment is at [reference].

## 8. Changes and version control

Changes to "${systemName}" are managed under change control. Each release records the change, its rationale, the re-evaluation performed and the approver. Pre-determined changes are described in this file; substantial modifications trigger a renewed conformity assessment (Art. 43(4)). The change log is held at [reference].

## 9. Standards applied & declaration of conformity

**9.1 Harmonised standards / common specifications applied:** [e.g. EN ISO/IEC 42001 (AI management system), EN ISO/IEC 23894 (AI risk management), and any harmonised standards published under Art. 40 — list those actually applied].

**9.2 Conformity assessment:** the procedure followed is [Annex VI internal control / Annex VII involving notified body [NAME, NUMBER]], per Art. 43.

**9.3 EU declaration of conformity:** drawn up under Art. 47; reference [DoC-${systemName.replace(/[^A-Za-z0-9]+/g, "-").toUpperCase()}-001]. The CE marking is affixed in accordance with Art. 48.

---

### Governance traceability — obligation checklist

| Obligation | Citation | Applies to | Evidence | Owner | Status |
|---|---|---|---|---|---|
${obligationRows}

*Keep this dossier up to date for the lifetime of the system and for 10 years after it is placed on the market (Art. 18). Make it available to national competent authorities on request.*`;
}

/** User-facing transparency notice satisfying Art. 50. */
function transparencyNotice(ctx: DocContext): string {
  const { systemName, description, organisation } = ctx;
  const org = organisation || "[Provider name]";
  const what =
    description ||
    "[Describe in one or two plain sentences what this AI system does for the user.]";

  return `${DEMO_HEADER}# Transparency Notice — ${systemName}
*Provided under Article 50 of Regulation (EU) 2024/1689 (the EU AI Act)*

### You are interacting with an AI system

${what} "${systemName}" is an artificial-intelligence system operated by ${org}. We are telling you this so that you can make informed decisions about how you use it.

### What this means for you

- **Outputs are AI-generated.** Responses, recommendations or content you receive are produced or assisted by an AI system and may contain errors, omissions or out-of-date information. Do not rely on them as a substitute for professional advice.
- **Synthetic content is labelled.** Where the system generates or manipulates audio, image, video or text, that content is marked as artificially generated or manipulated in a machine-readable format, in line with Art. 50(2).
- **Limitations.** The system may be less reliable for [state known limitations — e.g. languages, edge cases, under-represented groups]. It should be used within its intended purpose only.

### A human is available

This system supports — it does not replace — human judgement. ${org} provides human oversight of its use. If you would like a decision reviewed by a person, or want to understand how an output was produced, contact us at [SUPPORT EMAIL / CHANNEL].

### Your rights

Where the system is used to make or assist a decision that affects you, you have the right to be informed and, where applicable, to request human review and to contest the outcome. To exercise these rights, contact [DATA PROTECTION / SUPPORT CONTACT]. For how we handle personal data, see our [Privacy Policy link].

---

*Issued by ${org}. Last updated [YYYY-MM-DD]. This notice is decision-support drafted by Conforma, not legal advice — have it reviewed by qualified counsel before publication.*`;
}

/** EU Declaration of Conformity per Art. 47 and Annex V. */
function conformityDeclaration(ctx: DocContext): string {
  const { systemName, organisation, result } = ctx;
  const org = organisation || "[PROVIDER LEGAL NAME]";
  const ref = `EU-DOC-${systemName.replace(/[^A-Za-z0-9]+/g, "-").toUpperCase()}-001`;

  return `${DEMO_HEADER}# EU Declaration of Conformity
*Drawn up in accordance with Article 47 and Annex V of Regulation (EU) 2024/1689*

**1. Declaration reference (unique identifier):** ${ref}

**2. Provider:** ${org}
Registered address: [STREET, POSTCODE, CITY, COUNTRY]
Where applicable, authorised representative: [NAME, ADDRESS]

**3. This declaration of conformity is issued under the sole responsibility of the provider.**

**4. Object of the declaration (system identification):**
- Name / trade name: ${systemName}
- Type / model / version: [MODEL, VERSION]
- Unambiguous identification allowing traceability: [SERIAL / BUILD ID]
- Risk classification under the Regulation: ${RISK_TIERS[result.tier].label} (${result.citations.join(", ")})

**5. Statement of conformity.** The object of the declaration described above is in conformity with Regulation (EU) 2024/1689 (the Artificial Intelligence Act). The system has been designed and developed, and is to be placed on the market and put into service, in accordance with the applicable requirements of Chapter III, Section 2 of that Regulation.

**6. Other Union harmonisation legislation complied with (where applicable):** [e.g. Regulation (EU) 2016/679 (GDPR); sectoral product legislation listed in Annex I — list those that apply, or "None"].

**7. References to the harmonised standards or common specifications applied:** [e.g. EN ISO/IEC 42001; EN ISO/IEC 23894; and any harmonised standards published under Art. 40 — list those actually applied, with their references and dates].

**8. Conformity-assessment procedure (Art. 43):** [Annex VI — assessment based on internal control] / [Annex VII — assessment involving a notified body].

**9. Notified body (if a notified body was involved):** [NAME], identification number [NNNN], which carried out [describe the assessment] and issued certificate [NUMBER]. *(Delete this clause if no notified body was involved.)*

**10. Additional information:** [Reference to the technical documentation (Annex IV) and the registration in the EU database (Art. 49), if applicable.]

---

Signed for and on behalf of: ${org}

Place of issue: [CITY, COUNTRY]   Date of issue: [YYYY-MM-DD]

Name and function: [FULL NAME], [TITLE]

Signature: ____________________________

*This draft was prepared by Conforma in Demo Mode and is decision-support, not legal advice. Verify the conformity-assessment route and all references with qualified counsel before signing.*`;
}
