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

const KEY = "conforma.systems.v1";
const SEED_FLAG = "conforma.seeded.v1";

/* ----------------------------- External store ---------------------------- */

let snapshot: RegisteredSystem[] | null = null;
const listeners = new Set<() => void>();

function read(): RegisteredSystem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RegisteredSystem[]) : [];
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
  if (snapshot === null) {
    maybeSeed();
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
  const seeds: Array<{
    name: string;
    description: string;
    owner: string;
    answers: ClassificationAnswers;
    progress?: number;
  }> = [
    {
      name: "TalentRank — CV screening",
      description:
        "Ranks and filters job applicants from uploaded CVs to shortlist candidates for recruiters.",
      owner: "People Ops",
      answers: {
        name: "TalentRank — CV screening",
        role: "provider",
        description: "Recruitment screening model.",
        isAISystem: true,
        isGPAI: false,
        prohibited: [],
        annexI: false,
        annexIII: ["employment"],
        annexIIIDerogation: false,
        transparency: [],
      },
      progress: 0.45,
    },
    {
      name: "HelpDesk Copilot",
      description:
        "Customer-facing chatbot that answers product questions and drafts replies.",
      owner: "Support",
      answers: {
        name: "HelpDesk Copilot",
        role: "deployer",
        description: "Customer support chatbot built on a GPAI model.",
        isAISystem: true,
        isGPAI: true,
        prohibited: [],
        annexI: false,
        annexIII: [],
        annexIIIDerogation: false,
        transparency: ["interacts", "synthetic"],
      },
      progress: 0.75,
    },
    {
      name: "ForecastIQ — demand planning",
      description:
        "Predicts weekly product demand to optimise inventory ordering. No impact on individuals.",
      owner: "Supply Chain",
      answers: {
        name: "ForecastIQ — demand planning",
        role: "provider",
        description: "Internal demand-forecasting model.",
        isAISystem: true,
        isGPAI: false,
        prohibited: [],
        annexI: false,
        annexIII: [],
        annexIIIDerogation: false,
        transparency: [],
      },
    },
  ];

  const records = seeds.map((s) => {
    const sys = makeSystem(s.name, s.description, s.owner, s.answers);
    if (s.progress) {
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
