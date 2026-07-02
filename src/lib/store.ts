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
import { type ClassificationAnswers, type ProviderRole } from "./classifier";
import {
  compliancePct,
  makeSystem,
  newId,
  type ObligationState,
  type RegisteredSystem,
} from "./registry";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import * as remote from "@/lib/data/systems-repository";

// Re-export the domain model so existing importers of `@/lib/store` keep
// working; the definitions now live in the backend-agnostic `registry` module.
export { compliancePct, makeSystem, newId };
export type { ObligationState, RegisteredSystem };

const KEY = "conforma.systems.v2";
const SEED_FLAG = "conforma.seeded.v2";

/* ----------------------------- External store ---------------------------- */

let snapshot: RegisteredSystem[] | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function sortByUpdated(list: RegisteredSystem[]): RegisteredSystem[] {
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/* --------------------------- Backend selection --------------------------- */
/**
 * Demo Mode → localStorage; Production Mode → Supabase (RLS-scoped to the active
 * org via the browser client). The mode defaults from env so a configured
 * deployment never flashes localStorage data before the session effect runs;
 * the active org/user is supplied by `configureRegistryBackend`.
 */
type RemoteCtx = { orgId: string; userId: string };

let mode: "local" | "remote" = isSupabaseConfigured() ? "remote" : "local";
let remoteCtx: RemoteCtx | null = null;
let remoteSnapshot: RegisteredSystem[] | null = null;

/** Point the registry at a tenant (Production) or localStorage (Demo). */
export function configureRegistryBackend(ctx: RemoteCtx | null): void {
  const orgChanged = ctx?.orgId !== remoteCtx?.orgId;
  remoteCtx = ctx;
  mode = ctx ? "remote" : "local";
  if (mode === "remote") {
    if (orgChanged) remoteSnapshot = null;
    void refreshRemote();
  }
  notify();
}

async function refreshRemote(): Promise<void> {
  const client = getSupabaseBrowserClient();
  if (!client || !remoteCtx) return;
  try {
    remoteSnapshot = await remote.listSystems(client, remoteCtx.orgId);
  } catch {
    remoteSnapshot = remoteSnapshot ?? [];
  }
  notify();
}

/** Optimistically upsert into the remote cache, keeping newest-first order. */
function cacheUpsert(system: RegisteredSystem): RegisteredSystem[] {
  const rest = (remoteSnapshot ?? []).filter((s) => s.id !== system.id);
  return sortByUpdated([system, ...rest]);
}

async function saveRemote(system: RegisteredSystem): Promise<void> {
  const client = getSupabaseBrowserClient();
  if (!client || !remoteCtx) return;
  remoteSnapshot = cacheUpsert(system);
  notify();
  try {
    await remote.saveSystem(client, remoteCtx.orgId, remoteCtx.userId, system);
  } finally {
    void refreshRemote();
  }
}

async function deleteRemote(id: string): Promise<void> {
  const client = getSupabaseBrowserClient();
  if (!client || !remoteCtx) return;
  remoteSnapshot = (remoteSnapshot ?? []).filter((s) => s.id !== id);
  notify();
  try {
    await remote.deleteSystem(client, id);
  } finally {
    void refreshRemote();
  }
}

async function setObligationRemote(
  id: string,
  obligationId: string,
  state: ObligationState,
): Promise<void> {
  const client = getSupabaseBrowserClient();
  if (!client || !remoteCtx) return;
  const now = new Date().toISOString();
  remoteSnapshot = sortByUpdated(
    (remoteSnapshot ?? []).map((s) =>
      s.id === id
        ? {
            ...s,
            obligationStatus: { ...s.obligationStatus, [obligationId]: state },
            updatedAt: now,
          }
        : s,
    ),
  );
  notify();
  try {
    await remote.setObligationState(client, id, obligationId, state, remoteCtx.userId);
  } finally {
    void refreshRemote();
  }
}

async function clearAllRemote(): Promise<void> {
  const client = getSupabaseBrowserClient();
  if (!client || !remoteCtx) return;
  const ids = (remoteSnapshot ?? []).map((s) => s.id);
  remoteSnapshot = [];
  notify();
  try {
    await Promise.all(ids.map((id) => remote.deleteSystem(client, id)));
  } finally {
    void refreshRemote();
  }
}

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
  if (mode === "remote") return remoteSnapshot; // null while loading
  if (snapshot === null) {
    snapshot = sortByUpdated(read());
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

export function saveSystem(system: RegisteredSystem): void {
  if (mode === "remote") {
    void saveRemote(system);
    return;
  }
  const all = read();
  const idx = all.findIndex((s) => s.id === system.id);
  if (idx >= 0) all[idx] = system;
  else all.push(system);
  write(all);
}

export function deleteSystem(id: string): void {
  if (mode === "remote") {
    void deleteRemote(id);
    return;
  }
  write(read().filter((s) => s.id !== id));
}

/** Empty the registry. Demo Mode blocks re-seeding; Production deletes rows. */
export function clearAllSystems(): void {
  if (mode === "remote") {
    void clearAllRemote();
    return;
  }
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SEED_FLAG, "1");
  write([]);
}

/**
 * Discard the current registry and restore the seeded demo systems. This is a
 * Demo-Mode-only affordance — there is nothing to seed against a real tenant.
 */
export function resetToDemoData(): void {
  if (mode === "remote") return;
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(SEED_FLAG);
  maybeSeed();
  snapshot = null;
  notify();
}

export function setObligationState(
  id: string,
  obligationId: string,
  state: ObligationState,
): void {
  if (mode === "remote") {
    void setObligationRemote(id, obligationId, state);
    return;
  }
  const all = read();
  const sys = all.find((s) => s.id === id);
  if (!sys) return;
  sys.obligationStatus[obligationId] = state;
  sys.updatedAt = new Date().toISOString();
  write(all);
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
// empty-then-populated flash. No-op on the server, after the first seed, and in
// Production Mode (a real tenant's data must never be shadowed by demo seeds).
if (typeof window !== "undefined" && !isSupabaseConfigured()) maybeSeed();
