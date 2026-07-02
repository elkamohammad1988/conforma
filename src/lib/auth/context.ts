/**
 * Server-side session + tenant resolution.
 *
 * Resolves the signed-in user, every organization they belong to (with role),
 * and the active org (from the `conforma.active_org` cookie, defaulting to the
 * first). Returns `null` in Demo Mode or when unauthenticated. Consumed by the
 * app-layout guard to gate routes and seed the client `SessionProvider`.
 *
 * Memberships and orgs are fetched as two simple queries and joined in JS,
 * avoiding PostgREST embedded-resource typing against a hand-written schema.
 */

import "server-only";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ACTIVE_ORG_COOKIE,
  type ActiveContext,
  type OrgSummary,
  type SubscriptionSummary,
} from "./types";
import type { PlanTier } from "@/lib/billing/plans";
import { isStripeConfigured } from "@/lib/billing/stripe";

export async function getActiveContext(): Promise<ActiveContext | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const base = {
    userId: user.id,
    email: user.email ?? null,
    fullName:
      (typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null) ?? null,
  };

  const { data: memberships } = await supabase
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", user.id);

  const billingEnabled = isStripeConfigured();

  const rows = memberships ?? [];
  if (rows.length === 0) {
    return {
      ...base,
      orgs: [],
      activeOrg: null,
      plan: "free",
      subscription: null,
      billingEnabled,
    };
  }

  const roleById = new Map(rows.map((r) => [r.org_id, r.role]));
  const { data: orgRows } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .in(
      "id",
      rows.map((r) => r.org_id),
    );

  const orgs: OrgSummary[] = (orgRows ?? [])
    .map((o) => {
      const role = roleById.get(o.id);
      return role ? { id: o.id, name: o.name, slug: o.slug, role } : null;
    })
    .filter((o): o is OrgSummary => o !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  const cookieStore = await cookies();
  const activeId = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;
  const activeOrg = orgs.find((o) => o.id === activeId) ?? orgs[0] ?? null;

  let plan: PlanTier = "free";
  let subscription: SubscriptionSummary | null = null;
  if (activeOrg) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end, cancel_at_period_end")
      .eq("org_id", activeOrg.id)
      .maybeSingle();
    if (sub) {
      if (sub.plan) plan = sub.plan;
      subscription = {
        status: sub.status,
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
      };
    }
  }

  return { ...base, orgs, activeOrg, plan, subscription, billingEnabled };
}
