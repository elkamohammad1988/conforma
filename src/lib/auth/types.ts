/**
 * Session/tenant context shapes, shared between the server resolver
 * (`context.ts`, server-only) and the client provider (`SessionProvider`). Kept
 * free of `server-only` so both sides can import it.
 */

import type { OrgRole } from "@/lib/supabase/types";
import type { PlanTier } from "@/lib/billing/plans";

export type { OrgRole };

export interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  role: OrgRole;
}

export interface ActiveContext {
  userId: string;
  email: string | null;
  fullName: string | null;
  /** Every org the user belongs to. */
  orgs: OrgSummary[];
  /** The currently selected org — `null` only before onboarding. */
  activeOrg: OrgSummary | null;
  /** The active org's billing plan (defaults to `free`). */
  plan: PlanTier;
  /** Whether Stripe is configured (upgrade/portal available). */
  billingEnabled: boolean;
}

/** Cookie holding the user's currently-selected organization id. */
export const ACTIVE_ORG_COOKIE = "conforma.active_org";
export const ACTIVE_ORG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
