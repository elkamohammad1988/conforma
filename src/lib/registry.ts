/**
 * The AI-system registry domain model — pure, framework-free, backend-agnostic.
 *
 * These types and helpers are the single source of truth for what a "registered
 * system" is, independent of where it is persisted. Both persistence backends
 * consume this module:
 *   • `store.ts`  — the localStorage backend (Demo Mode), a "use client" module.
 *   • `data/systems-repository.ts` — the Supabase backend (Production Mode).
 *
 * Keeping the model here (no "use client", no localStorage) lets the repository
 * and unit tests share it without pulling in a browser-only store.
 */

import {
  classify,
  type ClassificationAnswers,
  type ClassificationResult,
} from "./classifier";

export type ObligationState = "todo" | "in-progress" | "done";

export interface RegisteredSystem {
  id: string;
  name: string;
  description: string;
  owner: string;
  answers: ClassificationAnswers;
  result: ClassificationResult;
  obligationStatus: Record<string, ObligationState>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fresh id for a system. A UUID so the same value is valid both as a
 * localStorage key (Demo Mode) and as the `uuid` primary key in Postgres
 * (Production Mode) — which lets a newly-created system be navigated to
 * optimistically before the database round-trip completes.
 */
export function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for runtimes without crypto.randomUUID.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Share of applicable obligations marked done (0–100). */
export function compliancePct(system: RegisteredSystem): number {
  const total = system.result.obligations.length;
  if (total === 0) return 100;
  const done = system.result.obligations.filter(
    (o) => system.obligationStatus[o.id] === "done",
  ).length;
  return Math.round((done / total) * 100);
}

/** Build a fresh registered system from questionnaire answers. */
export function makeSystem(
  name: string,
  description: string,
  owner: string,
  answers: ClassificationAnswers,
): RegisteredSystem {
  const now = new Date().toISOString();
  return {
    id: newId(),
    name,
    description,
    owner,
    answers,
    result: classify(answers),
    obligationStatus: {},
    createdAt: now,
    updatedAt: now,
  };
}
