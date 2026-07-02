/**
 * Environment preflight — validate configuration before a deploy.
 *
 * Prints the mode (demo/production) and each config group's state, and exits
 * non-zero if any group is partially configured (a misconfiguration that would
 * half-break Production Mode). Mirrors the groups in `src/lib/env.ts`.
 *
 * Run:  node --env-file=.env.local scripts/check-env.mjs   (or with ambient env)
 */

try {
  process.loadEnvFile(".env.local");
} catch {
  // no .env.local — validate the ambient environment
}

const GROUPS = [
  {
    name: "supabase",
    vars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    note: "Database, auth, multi-tenancy (Production Mode)",
  },
  {
    name: "supabase-admin",
    vars: ["SUPABASE_SERVICE_ROLE_KEY"],
    note: "Webhook/admin writes, seed & verify scripts",
  },
  {
    name: "stripe",
    vars: [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "STRIPE_PRICE_PRO_MONTHLY",
      "STRIPE_PRICE_PRO_ANNUAL",
      "STRIPE_PRICE_TEAM_MONTHLY",
      "STRIPE_PRICE_TEAM_ANNUAL",
    ],
    note: "Billing: subscriptions + portal",
  },
];

const present = (v) => (process.env[v] ?? "").trim().length > 0;

let partial = false;
const supabaseConfigured = GROUPS[0].vars.every(present);
console.log(`Mode: ${supabaseConfigured ? "production" : "demo"}\n`);

for (const g of GROUPS) {
  const missing = g.vars.filter((v) => !present(v));
  const set = g.vars.length - missing.length;
  const state = set === 0 ? "unset" : missing.length === 0 ? "configured" : "partial";
  const mark = state === "configured" ? "✓" : state === "partial" ? "✗" : "·";
  console.log(`  ${mark} ${g.name.padEnd(16)} ${state.padEnd(11)} — ${g.note}`);
  if (state === "partial") {
    partial = true;
    console.log(`      missing: ${missing.join(", ")}`);
  }
}

if (partial) {
  console.error("\nPartial configuration detected — fix the missing vars above.");
  process.exit(1);
}
console.log("\nEnvironment OK.");
