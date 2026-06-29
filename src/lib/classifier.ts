/**
 * Risk-classification engine.
 *
 * A deterministic decision tree maps questionnaire answers to an EU AI Act
 * risk tier with cited reasoning. It runs fully offline (no API key needed),
 * which keeps the core product auditable and demo-able. When an Anthropic key
 * is configured, `enhanceClassification` layers a plain-language narrative and
 * edge-case nuance on top — but never *overrides* the deterministic tier.
 */

import {
  ANNEX_III_AREAS,
  PROHIBITED_PRACTICES,
  PRIMARY_DEADLINE,
  COMPLIANCE_DEADLINES,
  obligationsForTier,
  type Obligation,
  type RiskTier,
  type ComplianceDeadline,
} from "./eu-ai-act";

export type ProviderRole = "provider" | "deployer" | "both";

export interface ClassificationAnswers {
  name: string;
  role: ProviderRole;
  description: string;
  /** Owning team — metadata only, not a classification input. */
  owner?: string;
  /** Art. 3(1) gate — is this an "AI system" at all? */
  isAISystem: boolean;
  /** Art. 3(63) — is it a general-purpose AI model? */
  isGPAI: boolean;
  /** ids from PROHIBITED_PRACTICES; empty = none. */
  prohibited: string[];
  /** Safety component of a product covered by Annex I harmonised legislation. */
  annexI: boolean;
  /** ids from ANNEX_III_AREAS; empty = none. */
  annexIII: string[];
  /** Art. 6(3) — performs only a narrow procedural / preparatory task. */
  annexIIIDerogation: boolean;
  /** Art. 50 transparency triggers. */
  transparency: string[]; // 'interacts' | 'synthetic' | 'deepfake' | 'emotion'
}

/**
 * A reason for the assigned tier, expressed as a locale-free key (plus any
 * referenced domain id) rather than English prose. The UI / AI layer renders it
 * through the active locale's catalog via `renderRationale`, which keeps the
 * deterministic engine pure and fully translatable. `citation` is a regulatory
 * identifier and is never translated.
 */
export type RationalePoint =
  | { kind: "notAISystem"; citation: string }
  | { kind: "prohibitedMatch"; practiceId: string; citation: string }
  | { kind: "annexIMatch"; citation: string }
  | { kind: "annexIIIMatch"; areaId: string; citation: string }
  | { kind: "derogation"; citation: string }
  | { kind: "transparencyMatch"; triggerId: string; citation: string }
  | { kind: "minimalDefault"; citation: string }
  | { kind: "gpaiOverlay"; citation: string };

export interface ClassificationResult {
  tier: RiskTier;
  rationale: RationalePoint[];
  citations: string[];
  obligations: Obligation[];
  deadline: ComplianceDeadline;
  isGPAI: boolean;
  /** Confidence the deterministic engine assigns to the tier (0–1). */
  confidence: number;
  /** Optional narrative added by Claude; absent in offline mode. */
  narrative?: string;
}

const uniqueCitations = (points: RationalePoint[]): string[] =>
  Array.from(new Set(points.map((p) => p.citation)));

/**
 * The decision tree. Priority order matters:
 *   prohibited  >  high  >  limited  >  minimal
 */
export function classify(answers: ClassificationAnswers): ClassificationResult {
  const rationale: RationalePoint[] = [];

  // Gate: not an AI system → out of scope (treated as minimal).
  if (!answers.isAISystem) {
    rationale.push({ kind: "notAISystem", citation: "Art. 3(1)" });
    return finalize("minimal", rationale, answers, 0.7);
  }

  // 1) Prohibited practices (Art. 5) — highest priority.
  if (answers.prohibited.length > 0) {
    for (const id of answers.prohibited) {
      const p = PROHIBITED_PRACTICES.find((x) => x.id === id);
      if (p) {
        rationale.push({
          kind: "prohibitedMatch",
          practiceId: p.id,
          citation: p.citation,
        });
      }
    }
    return finalize("prohibited", rationale, answers, 0.95);
  }

  // 2) High risk — Annex I (safety component of a regulated product).
  if (answers.annexI) {
    rationale.push({ kind: "annexIMatch", citation: "Art. 6(1) + Annex I" });
    return finalize("high", rationale, answers, 0.9);
  }

  // 3) High risk — Annex III use-case areas.
  if (answers.annexIII.length > 0) {
    for (const id of answers.annexIII) {
      const a = ANNEX_III_AREAS.find((x) => x.id === id);
      if (a) {
        rationale.push({
          kind: "annexIIIMatch",
          areaId: a.id,
          citation: a.citation,
        });
      }
    }

    if (answers.annexIIIDerogation) {
      // Art. 6(3): may not be high-risk if it performs only a narrow task and
      // does not materially influence decisions — BUT registration still applies.
      rationale.push({ kind: "derogation", citation: "Art. 6(3)–(4)" });
      return finalize("limited", rationale, answers, 0.55);
    }

    return finalize("high", rationale, answers, 0.85);
  }

  // 4) Limited risk — transparency triggers (Art. 50).
  if (answers.transparency.length > 0) {
    for (const trigger of answers.transparency) {
      rationale.push({
        kind: "transparencyMatch",
        triggerId: trigger,
        citation: "Art. 50",
      });
    }
    return finalize("limited", rationale, answers, 0.8);
  }

  // 5) Minimal risk — default.
  rationale.push({ kind: "minimalDefault", citation: "—" });
  return finalize("minimal", rationale, answers, 0.75);
}

function finalize(
  tier: RiskTier,
  rationale: RationalePoint[],
  answers: ClassificationAnswers,
  confidence: number,
): ClassificationResult {
  if (answers.isGPAI) {
    rationale.push({ kind: "gpaiOverlay", citation: "Art. 53" });
  }

  const deadline =
    tier === "high"
      ? answers.annexI
        ? COMPLIANCE_DEADLINES.find((d) => d.id === "high-risk-annex-i")!
        : PRIMARY_DEADLINE
      : tier === "limited"
        ? PRIMARY_DEADLINE
        : tier === "prohibited"
          ? COMPLIANCE_DEADLINES.find((d) => d.id === "prohibitions")!
          : PRIMARY_DEADLINE;

  return {
    tier,
    rationale,
    citations: uniqueCitations(rationale),
    obligations: obligationsForTier(tier, answers.role),
    deadline,
    isGPAI: answers.isGPAI,
    confidence,
  };
}

/** A blank answer set for initialising the wizard. */
export const EMPTY_ANSWERS: ClassificationAnswers = {
  name: "",
  role: "provider",
  description: "",
  owner: "",
  isAISystem: true,
  isGPAI: false,
  prohibited: [],
  annexI: false,
  annexIII: [],
  annexIIIDerogation: false,
  transparency: [],
};
