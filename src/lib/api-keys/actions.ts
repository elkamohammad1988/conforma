"use server";

/**
 * API key server actions: create (returns the plaintext once) and revoke. Both
 * are owner/admin-gated and audited. The plaintext key is generated server-side,
 * only its hash is stored, and it is never persisted or logged.
 */

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireManager } from "@/lib/auth/guards";
import { logAudit } from "@/lib/audit";
import { generateApiKey, hashApiKey, keyPrefix } from "./keys";

export interface ApiKeyActionState {
  error?: string;
  ok?: boolean;
  /** The plaintext key — returned exactly once, on successful creation. */
  plaintextKey?: string;
}

export async function createApiKeyAction(
  _prev: ApiKeyActionState,
  formData: FormData,
): Promise<ApiKeyActionState> {
  const ctx = await requireManager();
  if (!ctx?.activeOrg) return { error: "forbidden" };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "generic" };

  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  if (name.length < 1) return { error: "invalidName" };

  const key = generateApiKey();
  const key_hash = await hashApiKey(key);

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      org_id: ctx.activeOrg.id,
      name,
      key_prefix: keyPrefix(key),
      key_hash,
      created_by: ctx.userId,
    })
    .select("id")
    .single();
  if (error || !data) return { error: "generic" };

  await logAudit(ctx.activeOrg.id, "apikey.created", {
    targetType: "api_key",
    targetId: data.id,
    metadata: { name },
  });
  revalidatePath("/team");

  return { ok: true, plaintextKey: key };
}

export async function revokeApiKeyAction(id: string): Promise<ApiKeyActionState> {
  const ctx = await requireManager();
  if (!ctx?.activeOrg) return { error: "forbidden" };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "generic" };

  const { error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("org_id", ctx.activeOrg.id);
  if (error) return { error: "generic" };

  await logAudit(ctx.activeOrg.id, "apikey.revoked", {
    targetType: "api_key",
    targetId: id,
  });
  revalidatePath("/team");
  return { ok: true };
}
