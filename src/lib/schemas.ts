/**
 * Request validation schemas for the AI route handlers.
 *
 * The `result` object arrives from the client and is untrusted, so it is fully
 * validated here — including array *element* shapes — before any prompt builder
 * dereferences it. Kept framework-free (pure Zod) so it is unit-testable and
 * shared identically by both routes. `z.infer` gives the route its typed body.
 */
import { z } from "zod";
import { INPUT_LIMITS } from "./input-limits";

// Re-exported so existing importers (`@/lib/schemas`) keep working while the
// values themselves live in a dependency-free module the client can import too.
export { INPUT_LIMITS };

/**
 * The `result` object is client-supplied and echoes the deterministic
 * classifier's output, which is small and bounded by the encoded regulation.
 * These caps sit far above any legitimate value but block a caller from padding
 * the payload with megabyte arrays/strings that would otherwise flow straight
 * into the (paid) model prompt. Blocking arrays before parsing is the primary
 * cost/DoS backstop for the unauthenticated AI routes.
 */
const RESULT_LIMITS = {
  array: 100, // obligations/rationale/citations count
  short: 300, // ids, citations, labels, ISO dates
  long: 4_000, // human-readable descriptions
  narrative: 20_000, // an already-generated narrative echoed back
} as const;

const shortStr = z.string().max(RESULT_LIMITS.short);
const longStr = z.string().max(RESULT_LIMITS.long);

const riskTierSchema = z.enum(["prohibited", "high", "limited", "minimal"]);
const roleSchema = z.enum(["provider", "deployer", "both"]);

/** A cited reason for the tier — a locale-free discriminated union. */
const rationalePointSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("notAISystem"), citation: shortStr }),
  z.object({
    kind: z.literal("prohibitedMatch"),
    practiceId: shortStr,
    citation: shortStr,
  }),
  z.object({ kind: z.literal("annexIMatch"), citation: shortStr }),
  z.object({
    kind: z.literal("annexIIIMatch"),
    areaId: shortStr,
    citation: shortStr,
  }),
  z.object({ kind: z.literal("derogation"), citation: shortStr }),
  z.object({
    kind: z.literal("transparencyMatch"),
    triggerId: shortStr,
    citation: shortStr,
  }),
  z.object({ kind: z.literal("minimalDefault"), citation: shortStr }),
  z.object({ kind: z.literal("gpaiOverlay"), citation: shortStr }),
]);

const obligationSchema = z.object({
  id: shortStr,
  title: shortStr,
  description: longStr,
  citation: shortStr,
  role: roleSchema,
});

const deadlineSchema = z.object({
  id: shortStr,
  date: shortStr,
  label: shortStr,
  description: longStr,
  citation: shortStr,
  appliesTo: z.union([z.array(riskTierSchema).max(8), z.literal("all")]),
});

/** Mirrors `ClassificationResult` from the classifier — validated element-deep. */
export const classificationResultSchema = z.object({
  tier: riskTierSchema,
  rationale: z.array(rationalePointSchema).max(RESULT_LIMITS.array),
  citations: z.array(shortStr).max(RESULT_LIMITS.array),
  obligations: z.array(obligationSchema).max(RESULT_LIMITS.array),
  deadline: deadlineSchema,
  isGPAI: z.boolean(),
  confidence: z.number(),
  narrative: z.string().max(RESULT_LIMITS.narrative).optional(),
});

/** DocType — kept in literal sync with `claude.ts` (only three, stable). */
export const docTypeSchema = z.enum([
  "technical-documentation",
  "transparency-notice",
  "conformity-declaration",
]);

const systemNameField = z.string().trim().min(1).max(INPUT_LIMITS.systemName);
const descriptionField = z.string().max(INPUT_LIMITS.description).optional();
const localeField = z.string().optional();

export const explainBodySchema = z.object({
  systemName: systemNameField,
  description: descriptionField,
  result: classificationResultSchema,
  locale: localeField,
});

export const generateDocBodySchema = z.object({
  docType: docTypeSchema,
  systemName: systemNameField,
  description: descriptionField,
  organisation: z.string().max(INPUT_LIMITS.organisation).optional(),
  result: classificationResultSchema,
  locale: localeField,
  /** Optional: links a persisted document to its system (Production Mode). */
  systemId: shortStr.optional(),
});

export type ExplainBody = z.infer<typeof explainBodySchema>;
export type GenerateDocBody = z.infer<typeof generateDocBodySchema>;
