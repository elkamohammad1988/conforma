/**
 * Local-development database seed.
 *
 * Creates a confirmed demo user, a demo organization (Team plan, so the free
 * system cap doesn't apply), and a small AI-system registry across risk tiers.
 * Re-runnable: it deletes any existing demo org first. Uses the service role,
 * so it bypasses RLS — for LOCAL DEV / a throwaway project only.
 *
 * Requires:  NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Run:       npm run seed        (loads .env.local)
 * Optional:  SEED_EMAIL, SEED_PASSWORD to override the demo credentials.
 */

import { createClient } from "@supabase/supabase-js";

try {
  process.loadEnvFile(".env.local");
} catch {
  /* rely on ambient env */
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error(
    "Seed requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(2);
}

const admin = createClient(url, service, { auth: { persistSession: false } });

const EMAIL = process.env.SEED_EMAIL || "demo@conforma.local";
const PASSWORD = process.env.SEED_PASSWORD || "Demo-Password-123!";
const SLUG = "acme-ai-demo";

function result(tier, obligations) {
  return {
    tier,
    rationale: [{ kind: "minimalDefault", citation: "—" }],
    citations: obligations.map((o) => o.citation),
    obligations,
    deadline: {
      id: "high-risk-annex-iii",
      date: "2026-08-02",
      label: "High-risk obligations",
      description: "High-risk obligations apply from 2 August 2026.",
      citation: "Art. 113",
      appliesTo: "all",
    },
    isGPAI: false,
    confidence: 0.85,
  };
}

const ob = (id, title, citation) => ({
  id,
  title,
  description: `${title} (seed).`,
  citation,
  role: "provider",
});

const SYSTEMS = [
  {
    name: "TalentRank — CV screening",
    description: "Ranks inbound job applicants to shortlist candidates.",
    owner: "People Operations",
    role: "provider",
    tier: "high",
    obligations: [
      ob("risk-mgmt", "Risk management system", "Art. 9"),
      ob("data-gov", "Data governance", "Art. 10"),
      ob("human-oversight", "Human oversight", "Art. 14"),
    ],
    done: ["risk-mgmt"],
  },
  {
    name: "CreditScore Pro",
    description: "Scores retail loan applications for credit officers.",
    owner: "Risk & Credit",
    role: "provider",
    tier: "high",
    obligations: [ob("transparency", "Transparency to deployers", "Art. 13")],
    done: [],
  },
  {
    name: "HelpDesk Copilot",
    description: "Customer-facing chatbot that drafts support replies.",
    owner: "Customer Support",
    role: "deployer",
    tier: "limited",
    obligations: [ob("art50", "Inform users they interact with AI", "Art. 50")],
    done: ["art50"],
  },
  {
    name: "ForecastIQ — demand planning",
    description: "Predicts weekly product demand. No impact on individuals.",
    owner: "Supply Chain",
    role: "provider",
    tier: "minimal",
    obligations: [],
    done: [],
  },
];

async function ensureUser() {
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });
  if (!error && data.user) return data.user;
  if (error && /already|registered|exists/i.test(error.message)) {
    const { data: list } = await admin.auth.admin.listUsers();
    const found = list.users.find((u) => u.email === EMAIL);
    if (found) return found;
  }
  throw new Error(`could not create/find demo user: ${error?.message}`);
}

async function main() {
  const user = await ensureUser();
  console.log(`Demo user: ${EMAIL}`);

  // Fresh org each run (cascades systems/members/subscription).
  await admin.from("organizations").delete().eq("slug", SLUG);
  const { data: org, error: orgErr } = await admin
    .from("organizations")
    .insert({ name: "Acme AI (demo)", slug: SLUG, created_by: user.id })
    .select("id")
    .single();
  if (orgErr) throw orgErr;

  await admin.from("org_members").insert({ org_id: org.id, user_id: user.id, role: "owner" });
  // Team plan so the free system cap doesn't block seeding.
  await admin.from("subscriptions").update({ plan: "team" }).eq("org_id", org.id);

  for (const s of SYSTEMS) {
    const { data: sys, error: sysErr } = await admin
      .from("systems")
      .insert({
        org_id: org.id,
        name: s.name,
        description: s.description,
        owner: s.owner,
        role: s.role,
        tier: s.tier,
        is_gpai: false,
        answers: { name: s.name, role: s.role, description: s.description },
        result: result(s.tier, s.obligations),
        created_by: user.id,
      })
      .select("id")
      .single();
    if (sysErr) throw sysErr;

    for (const obligationId of s.done) {
      await admin.from("obligation_status").insert({
        system_id: sys.id,
        obligation_id: obligationId,
        state: "done",
        updated_by: user.id,
      });
    }
  }

  console.log(`Seeded org "${org.id}" with ${SYSTEMS.length} systems.`);
  console.log(`Sign in at /login as ${EMAIL} / ${PASSWORD}`);
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
