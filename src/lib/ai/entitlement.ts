/**
 * AI generation entitlement — the wallet guard for the paid Claude endpoints.
 *
 * The paid model is invoked ONLY for an authenticated user whose org is within
 * its monthly quota. Everyone else — anonymous visitors, and every request in
 * Demo Mode — is served the deterministic demo draft, so `ANTHROPIC_API_KEY`
 * can never be spent by the public internet (the historical financial-DoS on
 * these unauthenticated routes) and the paid meter can't be exceeded.
 *
 * This is enforced server-side and does not rely on any client signal.
 */

import "server-only";
import { getActiveContext } from "@/lib/auth/context";
import { isClaudeConfigured } from "@/lib/claude";
import { PLAN_LIMITS } from "@/lib/billing/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { countAiDocumentsSince } from "@/lib/data/documents-repository";

export type AiDecision =
  /** Serve the free deterministic demo draft — no model call, no spend. */
  | { effect: "demo" }
  /** Authorised paid generation for this org. */
  | { effect: "live"; orgId: string }
  /** Authenticated, but the org has hit its monthly document quota. */
  | { effect: "quota"; limit: number; used: number };

/** First instant of the current UTC calendar month, as an ISO string. */
function startOfUtcMonth(now = new Date()): string {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();
}

/**
 * Decide how to serve an AI request.
 *
 * @param metered  When true, this generation counts against the org's
 *   `aiDocumentsPerMonth` quota (document generation). The lighter "explain"
 *   narrative passes `false` — it is still auth-gated against anonymous spend,
 *   but is not metered.
 */
export async function decideAi(opts: { metered: boolean }): Promise<AiDecision> {
  // No real key configured → Demo Mode for everyone: free, open, no spend.
  if (!isClaudeConfigured()) return { effect: "demo" };

  // A real key IS set → spending is possible, so require an authenticated org.
  // Anonymous callers (including the public marketing demo) fall back to demo.
  const ctx = await getActiveContext();
  if (!ctx?.activeOrg) return { effect: "demo" };

  if (opts.metered) {
    const limit = PLAN_LIMITS[ctx.plan].aiDocumentsPerMonth;
    if (limit !== null) {
      const supabase = await createSupabaseServerClient();
      const used = supabase
        ? await countAiDocumentsSince(supabase, ctx.activeOrg.id, startOfUtcMonth())
        : 0;
      if (used >= limit) return { effect: "quota", limit, used };
    }
  }

  return { effect: "live", orgId: ctx.activeOrg.id };
}
