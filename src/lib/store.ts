/**
 * Client-side registry persistence for the demo.
 *
 * A real deployment would back this with Postgres/Supabase + RLS (the same
 * pattern this team already ships). For a zero-credential demo we persist the
 * AI-system registry in localStorage and expose it through a small external
 * store, so React components stay in sync via `useSyncExternalStore` — no
 * effects, no manual refetching after a mutation.
 */

"use client";

import { useSyncExternalStore } from "react";
import {
  classify,
  type ClassificationAnswers,
  type ClassificationResult,
  type ProviderRole,
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

const KEY = "conforma.systems.v2";
const SEED_FLAG = "conforma.seeded.v2";

/* ----------------------------- External store ---------------------------- */

let snapshot: RegisteredSystem[] | null = null;
const listeners = new Set<() => void>();

/**
 * Defensive shape check. localStorage can hold legacy, partial or hand-edited
 * records; a single malformed one must not white-screen the dashboard/report,
 * so we drop anything that doesn't carry the fields the UI dereferences.
 */
function isValidSystem(s: unknown): s is RegisteredSystem {
  if (typeof s !== "object" || s === null) return false;
  const r = s as Record<string, unknown>;
  const result = r.result as Record<string, unknown> | null;
  return (
    typeof r.id === "string" &&
    typeof r.name === "string" &&
    typeof r.updatedAt === "string" &&
    typeof r.obligationStatus === "object" &&
    r.obligationStatus !== null &&
    typeof result === "object" &&
    result !== null &&
    Array.isArray(result.obligations) &&
    Array.isArray(result.rationale) &&
    typeof result.deadline === "object" &&
    result.deadline !== null &&
    typeof result.tier === "string"
  );
}

function read(): RegisteredSystem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidSystem) : [];
  } catch {
    return [];
  }
}

/** Persist, invalidate the cached snapshot, and notify subscribers. */
function write(systems: RegisteredSystem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(systems));
  snapshot = null;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): RegisteredSystem[] | null {
  // Pure reader: `useSyncExternalStore` may call this repeatedly per render, so
  // it must not mutate anything. Seeding happens once at module init (below).
  if (snapshot === null) {
    snapshot = read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return snapshot;
}

/** Server (and first hydration paint): the registry is client-only. */
function getServerSnapshot(): RegisteredSystem[] | null {
  return null;
}

/** Reactive list of registered systems; `null` while the client hydrates. */
export function useSystems(): RegisteredSystem[] | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Reactive single system: `undefined` while loading, `null` if not found. */
export function useSystem(id: string): RegisteredSystem | null | undefined {
  const systems = useSystems();
  if (systems === null) return undefined;
  return systems.find((s) => s.id === id) ?? null;
}

/* ------------------------------- Mutations ------------------------------- */

export function newId(): string {
  return `sys_${Math.random().toString(36).slice(2, 10)}`;
}

export function saveSystem(system: RegisteredSystem): void {
  const all = read();
  const idx = all.findIndex((s) => s.id === system.id);
  if (idx >= 0) all[idx] = system;
  else all.push(system);
  write(all);
}

export function deleteSystem(id: string): void {
  write(read().filter((s) => s.id !== id));
}

/** Empty the registry and keep it empty (won't re-seed on next read). */
export function clearAllSystems(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SEED_FLAG, "1");
  write([]);
}

/** Discard the current registry and restore the seeded demo systems. */
export function resetToDemoData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(SEED_FLAG);
  maybeSeed();
  snapshot = null;
  for (const listener of listeners) listener();
}

export function setObligationState(
  id: string,
  obligationId: string,
  state: ObligationState,
): void {
  const all = read();
  const sys = all.find((s) => s.id === id);
  if (!sys) return;
  sys.obligationStatus[obligationId] = state;
  sys.updatedAt = new Date().toISOString();
  write(all);
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

/* ------------------------------- Seed data ------------------------------- */

function maybeSeed() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEED_FLAG)) return;
  if (read().length > 0) {
    window.localStorage.setItem(SEED_FLAG, "1");
    return;
  }
  // Compact answer builder — every system is an AI system; overrides set the
  // few flags that drive its risk tier so `classify()` produces real results.
  const mk = (
    name: string,
    role: ProviderRole,
    over: Partial<ClassificationAnswers> = {},
  ): ClassificationAnswers => ({
    name,
    role,
    description: "",
    isAISystem: true,
    isGPAI: false,
    prohibited: [],
    annexI: false,
    annexIII: [],
    annexIIIDerogation: false,
    transparency: [],
    ...over,
  });

  // A believable enterprise AI portfolio spanning all four risk tiers.
  const seeds: Array<{
    name: string;
    description: string;
    owner: string;
    answers: ClassificationAnswers;
    progress: number;
    ageDays: number;
  }> = [
    {
      name: "TalentRank — CV screening",
      description:
        "Ranks and filters inbound job applicants from uploaded CVs to shortlist candidates for recruiters.",
      owner: "People Operations",
      answers: mk("TalentRank — CV screening", "provider", { annexIII: ["employment"] }),
      progress: 0.45,
      ageDays: 2,
    },
    {
      name: "CreditScore Pro",
      description:
        "Scores retail loan and overdraft applications to support credit-officer decisions.",
      owner: "Risk & Credit",
      answers: mk("CreditScore Pro", "provider", { annexIII: ["essential-services"] }),
      progress: 0.62,
      ageDays: 5,
    },
    {
      name: "BorderVision — ID verification",
      description:
        "Matches a live selfie against identity-document photos during customer onboarding.",
      owner: "Trust & Safety",
      answers: mk("BorderVision — ID verification", "deployer", { annexIII: ["biometrics"] }),
      progress: 0.3,
      ageDays: 9,
    },
    {
      name: "SmartGrid Optimiser",
      description:
        "Balances electricity load across substations to reduce peak-demand strain on the grid.",
      owner: "Infrastructure",
      answers: mk("SmartGrid Optimiser", "provider", {
        annexIII: ["critical-infrastructure"],
      }),
      progress: 0.88,
      ageDays: 13,
    },
    {
      name: "HelpDesk Copilot",
      description:
        "Customer-facing chatbot that answers product questions and drafts support replies.",
      owner: "Customer Support",
      answers: mk("HelpDesk Copilot", "deployer", {
        isGPAI: true,
        transparency: ["interacts", "synthetic"],
      }),
      progress: 0.75,
      ageDays: 1,
    },
    {
      name: "StudioGen — campaign imagery",
      description:
        "Generates marketing images and social creative from text briefs for the brand team.",
      owner: "Marketing",
      answers: mk("StudioGen — campaign imagery", "deployer", {
        isGPAI: true,
        transparency: ["synthetic"],
      }),
      progress: 0.9,
      ageDays: 7,
    },
    {
      name: "VoiceAssist — call routing",
      description:
        "Voice assistant that greets inbound callers and routes them to the right support queue.",
      owner: "Customer Care",
      answers: mk("VoiceAssist — call routing", "deployer", { transparency: ["interacts"] }),
      progress: 0.5,
      ageDays: 18,
    },
    {
      name: "ForecastIQ — demand planning",
      description:
        "Predicts weekly product demand to optimise inventory ordering. No impact on individuals.",
      owner: "Supply Chain",
      answers: mk("ForecastIQ — demand planning", "provider"),
      progress: 1,
      ageDays: 21,
    },
    {
      name: "InventoryBot — replenishment",
      description:
        "Suggests warehouse restock quantities from historical sales and supplier lead times.",
      owner: "Operations",
      answers: mk("InventoryBot — replenishment", "provider"),
      progress: 1,
      ageDays: 27,
    },
    {
      name: "SentinelAML — transaction monitoring",
      description:
        "Screens payments for money-laundering and fraud signals to flag cases for compliance officers.",
      owner: "Financial Crime",
      answers: mk("SentinelAML — transaction monitoring", "provider", {
        annexIII: ["essential-services"],
      }),
      progress: 0.12,
      ageDays: 4,
    },
  ];

  const records = seeds.map((s) => {
    const sys = makeSystem(s.name, s.description, s.owner, s.answers);
    // Stagger timestamps so the "recently updated" ordering reads naturally.
    const ts = new Date(Date.now() - s.ageDays * 86_400_000).toISOString();
    sys.createdAt = ts;
    sys.updatedAt = ts;
    if (s.progress > 0) {
      const n = Math.round(sys.result.obligations.length * s.progress);
      sys.result.obligations.slice(0, n).forEach((o) => {
        sys.obligationStatus[o.id] = "done";
      });
    }
    return sys;
  });
  window.localStorage.setItem(KEY, JSON.stringify(records));
  window.localStorage.setItem(SEED_FLAG, "1");
}

// Seed the demo registry once, on first client load of this module — before any
// component reads the store — so `getSnapshot` stays pure and there is no
// empty-then-populated flash. No-op on the server and after the first seed.
if (typeof window !== "undefined") maybeSeed();
