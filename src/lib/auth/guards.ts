/**
 * Authorization guards for server actions. Centralizes the "is this caller
 * allowed to manage the org?" check so team, billing and API-key actions share
 * one definition (RLS + DB triggers remain the ultimate enforcement).
 */

import "server-only";
import { getActiveContext } from "./context";
import type { ActiveContext } from "./types";

/** The active context iff the caller is an owner or admin; otherwise `null`. */
export async function requireManager(): Promise<ActiveContext | null> {
  const ctx = await getActiveContext();
  if (!ctx?.activeOrg || ctx.activeOrg.role === "member") return null;
  return ctx;
}
