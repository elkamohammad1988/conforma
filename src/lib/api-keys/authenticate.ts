/**
 * Authenticate an inbound API request by its `Authorization: Bearer cfm_...`
 * key. Runs server-side with the service role (API calls carry no user session),
 * matches the SHA-256 hash, rejects revoked keys, and records `last_used_at`.
 * Returns the owning org id, or `null` if the key is missing/invalid/revoked.
 */

import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashApiKey, parseBearerKey } from "./keys";

export async function authenticateApiKey(
  request: Request,
): Promise<{ orgId: string } | null> {
  const key = parseBearerKey(request.headers.get("authorization"));
  if (!key) return null;

  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const hash = await hashApiKey(key);
  const { data } = await admin
    .from("api_keys")
    .select("id, org_id, revoked_at")
    .eq("key_hash", hash)
    .maybeSingle();
  if (!data || data.revoked_at) return null;

  // Best-effort usage stamp — never blocks the request.
  void admin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return { orgId: data.org_id };
}
