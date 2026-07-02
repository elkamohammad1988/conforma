/**
 * Supabase data-access for the AI-system registry (Production Mode backend).
 *
 * This is the persistent counterpart to the localStorage store. It accepts any
 * Supabase client — the browser client (RLS-scoped to the signed-in user) for
 * the reactive store, or a server client in Route Handlers / Server Actions —
 * so the same query logic serves every caller. RLS enforces tenant isolation;
 * the `orgId` arguments target *which* tenant to write into, they are not a
 * substitute for the database-level policies.
 *
 * The pure `rowToSystem` / `systemToInsert` mappers translate between database
 * rows and the `RegisteredSystem` domain shape and are unit-tested in isolation.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { ObligationState, RegisteredSystem } from "@/lib/registry";

type Client = SupabaseClient<Database>;
type SystemRow = Database["public"]["Tables"]["systems"]["Row"];
type SystemInsert = Database["public"]["Tables"]["systems"]["Insert"];
type ObligationRow = Database["public"]["Tables"]["obligation_status"]["Row"];

/* ------------------------------- Mappers -------------------------------- */

/** Assemble a `RegisteredSystem` from a system row and its obligation rows. */
export function rowToSystem(
  row: SystemRow,
  obligations: Pick<ObligationRow, "obligation_id" | "state">[],
): RegisteredSystem {
  const obligationStatus: Record<string, ObligationState> = {};
  for (const o of obligations) obligationStatus[o.obligation_id] = o.state;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    owner: row.owner,
    answers: row.answers,
    result: row.result,
    obligationStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Project a `RegisteredSystem` into a `systems` insert/upsert row. */
export function systemToInsert(
  orgId: string,
  userId: string | null,
  system: RegisteredSystem,
): SystemInsert {
  return {
    id: system.id,
    org_id: orgId,
    name: system.name,
    description: system.description,
    owner: system.owner,
    role: system.answers.role,
    answers: system.answers,
    result: system.result,
    tier: system.result.tier,
    is_gpai: system.result.isGPAI,
    created_by: userId,
    updated_at: new Date().toISOString(),
  };
}

/* ------------------------------- Queries -------------------------------- */

/** All systems in an org, newest-updated first, each with its obligations. */
export async function listSystems(
  client: Client,
  orgId: string,
): Promise<RegisteredSystem[]> {
  const { data: rows, error } = await client
    .from("systems")
    .select("*")
    .eq("org_id", orgId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const { data: obligations, error: oErr } = await client
    .from("obligation_status")
    .select("system_id, obligation_id, state")
    .in("system_id", ids);
  if (oErr) throw oErr;

  const bySystem = new Map<string, Pick<ObligationRow, "obligation_id" | "state">[]>();
  for (const o of obligations ?? []) {
    const list = bySystem.get(o.system_id) ?? [];
    list.push({ obligation_id: o.obligation_id, state: o.state });
    bySystem.set(o.system_id, list);
  }

  return rows.map((r) => rowToSystem(r, bySystem.get(r.id) ?? []));
}

/** A single system with its obligations, or `null` if not found/authorized. */
export async function getSystem(
  client: Client,
  id: string,
): Promise<RegisteredSystem | null> {
  const { data: row, error } = await client
    .from("systems")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!row) return null;

  const { data: obligations, error: oErr } = await client
    .from("obligation_status")
    .select("obligation_id, state")
    .eq("system_id", id);
  if (oErr) throw oErr;

  return rowToSystem(row, obligations ?? []);
}

/* ------------------------------ Mutations ------------------------------- */

/**
 * Create or update a system, then persist any obligation states it carries.
 * Used on creation (empty obligations) and on full updates.
 */
export async function saveSystem(
  client: Client,
  orgId: string,
  userId: string | null,
  system: RegisteredSystem,
): Promise<void> {
  const { error } = await client
    .from("systems")
    .upsert(systemToInsert(orgId, userId, system), { onConflict: "id" });
  if (error) throw error;

  const entries = Object.entries(system.obligationStatus);
  if (entries.length > 0) {
    const rows = entries.map(([obligation_id, state]) => ({
      system_id: system.id,
      obligation_id,
      state,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }));
    const { error: oErr } = await client
      .from("obligation_status")
      .upsert(rows, { onConflict: "system_id,obligation_id" });
    if (oErr) throw oErr;
  }
}

/** Delete a system (obligations cascade in the database). */
export async function deleteSystem(client: Client, id: string): Promise<void> {
  const { error } = await client.from("systems").delete().eq("id", id);
  if (error) throw error;
}

/** Set the state of a single obligation and touch the system's updated_at. */
export async function setObligationState(
  client: Client,
  systemId: string,
  obligationId: string,
  state: ObligationState,
  userId: string | null,
): Promise<void> {
  const { error } = await client.from("obligation_status").upsert(
    {
      system_id: systemId,
      obligation_id: obligationId,
      state,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "system_id,obligation_id" },
  );
  if (error) throw error;

  const { error: sErr } = await client
    .from("systems")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", systemId);
  if (sErr) throw sErr;
}
