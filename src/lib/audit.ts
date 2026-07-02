/**
 * Audit logging helper (server-only).
 *
 * Records an actor-attributed event for an org via the membership-checked
 * `log_audit_event` RPC. Best-effort: a logging failure never blocks the
 * underlying action. The audit log is append-only (see migration 0003).
 */

import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

export async function logAudit(
  orgId: string,
  action: string,
  opts: { targetType?: string; targetId?: string; metadata?: Json } = {},
): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return;
    await supabase.rpc("log_audit_event", {
      p_org: orgId,
      p_action: action,
      p_target_type: opts.targetType ?? null,
      p_target_id: opts.targetId ?? null,
      p_metadata: opts.metadata ?? {},
    });
  } catch {
    // Never let audit logging break the primary operation.
  }
}
