/**
 * Environment validation + a typed configuration report.
 *
 * Conforma is dual-mode: with no secrets it runs a fully-functional Demo Mode,
 * so env vars are *optional* — but they come in all-or-nothing groups, and a
 * partially-configured group (e.g. the Supabase URL without the anon key) is a
 * misconfiguration that would half-break Production Mode. This module reports
 * the state of each group and flags partials, without ever throwing at import.
 *
 * Consumed by `/api/health` and the `check-env` preflight script.
 */

export type GroupState = "configured" | "partial" | "unset";

export interface EnvGroup {
  name: string;
  state: GroupState;
  /** Vars that are required for this group but missing. */
  missing: string[];
  /** One line explaining what the group unlocks / what a partial state breaks. */
  note: string;
}

export interface EnvReport {
  /** True when no group is partially configured (Demo Mode or clean Production). */
  ok: boolean;
  mode: "demo" | "production";
  groups: EnvGroup[];
  warnings: string[];
}

const SUPABASE_PUBLIC = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;
const SUPABASE_ADMIN = ["SUPABASE_SERVICE_ROLE_KEY"] as const;
const STRIPE = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_PRO_ANNUAL",
  "STRIPE_PRICE_TEAM_MONTHLY",
  "STRIPE_PRICE_TEAM_ANNUAL",
] as const;

function present(name: string, env: Record<string, string | undefined>): boolean {
  return (env[name] ?? "").trim().length > 0;
}

function evaluate(
  name: string,
  vars: readonly string[],
  note: string,
  env: Record<string, string | undefined>,
): EnvGroup {
  const set = vars.filter((v) => present(v, env));
  const missing = vars.filter((v) => !present(v, env));
  const state: GroupState =
    set.length === 0 ? "unset" : missing.length === 0 ? "configured" : "partial";
  return { name, state, missing, note };
}

/** Validate the environment and return a structured, non-throwing report. */
export function validateEnv(env: Record<string, string | undefined> = process.env): EnvReport {
  const supabasePublic = evaluate(
    "supabase",
    SUPABASE_PUBLIC,
    "Database, auth, multi-tenancy (Production Mode).",
    env,
  );
  const supabaseAdmin = evaluate(
    "supabase-admin",
    SUPABASE_ADMIN,
    "Server-side admin ops: Stripe webhook writes, seed/verify scripts.",
    env,
  );
  const stripe = evaluate("stripe", STRIPE, "Billing: subscriptions + portal.", env);

  const groups = [supabasePublic, supabaseAdmin, stripe];
  const warnings: string[] = [];

  for (const g of groups) {
    if (g.state === "partial") {
      warnings.push(
        `${g.name} is partially configured — missing: ${g.missing.join(", ")}`,
      );
    }
  }
  // Admin key without the public keys is useless; note it.
  if (supabaseAdmin.state === "configured" && supabasePublic.state !== "configured") {
    warnings.push(
      "SUPABASE_SERVICE_ROLE_KEY is set but the public Supabase vars are not — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  // Stripe needs the admin key to persist webhook state.
  if (stripe.state === "configured" && supabaseAdmin.state !== "configured") {
    warnings.push(
      "Stripe is configured but SUPABASE_SERVICE_ROLE_KEY is not — the webhook cannot persist subscription state.",
    );
  }

  return {
    ok: warnings.length === 0,
    mode: supabasePublic.state === "configured" ? "production" : "demo",
    groups,
    warnings,
  };
}

/** Throw if the environment is partially/mis-configured (for a preflight gate). */
export function assertEnv(env: Record<string, string | undefined> = process.env): void {
  const report = validateEnv(env);
  if (!report.ok) {
    throw new Error(
      `Environment misconfiguration:\n  - ${report.warnings.join("\n  - ")}`,
    );
  }
}
