/**
 * Live RLS / tenant-isolation verification.
 *
 * Proves — against a real Supabase project — that Row Level Security isolates
 * tenants: a user in org B can never read, modify, insert into, or join org A.
 * Creates two throwaway users + orgs, runs the checks, and cleans up after
 * itself (service-role deletes cascade).
 *
 * Run:  node --env-file=.env.local scripts/verify-rls.mjs
 * (or ensure NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
 *  are exported in the environment.)
 */

import { createClient } from "@supabase/supabase-js";

try {
  process.loadEnvFile(".env.local");
} catch {
  // no .env.local — rely on the ambient environment
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon || !service) {
  console.error(
    "Missing env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(2);
}

const admin = createClient(url, service, { auth: { persistSession: false } });

const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass });
  const tag = pass ? "PASS" : "FAIL";
  console.log(`  ${tag}  ${name}${detail ? `  — ${detail}` : ""}`);
}

async function makeUser(email, password) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error(`createUser ${email}: ${error.message}`);
  return data.user;
}

async function signedInClient(email, password) {
  const c = createClient(url, anon, { auth: { persistSession: false } });
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`signIn ${email}: ${error.message}`);
  return c;
}

const answers = {
  name: "S",
  role: "provider",
  description: "",
  isAISystem: true,
  isGPAI: false,
  prohibited: [],
  annexI: false,
  annexIII: ["employment"],
  annexIIIDerogation: false,
  transparency: [],
};
const result = {
  tier: "high",
  rationale: [],
  citations: [],
  obligations: [],
  deadline: {
    id: "high-risk",
    date: "2026-08-02",
    label: "",
    description: "",
    citation: "",
    appliesTo: "all",
  },
  isGPAI: false,
  confidence: 0.85,
};

async function main() {
  const s = Date.now();
  const pw = "Rls-Test-Password-123!";
  const emailA = `rlstest-a-${s}@example.com`;
  const emailB = `rlstest-b-${s}@example.com`;

  let userA, userB, userC, orgAId, orgBId;
  try {
    userA = await makeUser(emailA, pw);
    userB = await makeUser(emailB, pw);
    const A = await signedInClient(emailA, pw);
    const B = await signedInClient(emailB, pw);

    const { data: orgA, error: orgAErr } = await A.rpc("create_organization", {
      p_name: "Org A",
      p_slug: `org-a-${s}`,
    });
    if (orgAErr) throw new Error(`create org A: ${orgAErr.message}`);
    orgAId = orgA.id;

    const { data: orgB, error: orgBErr } = await B.rpc("create_organization", {
      p_name: "Org B",
      p_slug: `org-b-${s}`,
    });
    if (orgBErr) throw new Error(`create org B: ${orgBErr.message}`);
    orgBId = orgB.id;

    const sysId = crypto.randomUUID();
    const { error: insErr } = await A.from("systems").insert({
      id: sysId,
      org_id: orgAId,
      name: "Secret A",
      answers,
      result,
      tier: "high",
      created_by: userA.id,
    });
    check("A inserts a system into its own org", !insErr, insErr?.message);

    const { data: bRead } = await B.from("systems").select("*").eq("id", sysId);
    check("B cannot READ A's system", (bRead ?? []).length === 0, `${bRead?.length ?? 0} rows`);

    const { data: bUpd } = await B.from("systems")
      .update({ name: "hacked" })
      .eq("id", sysId)
      .select();
    check("B cannot UPDATE A's system", (bUpd ?? []).length === 0);

    const { data: bDel } = await B.from("systems")
      .delete()
      .eq("id", sysId)
      .select();
    check("B cannot DELETE A's system", (bDel ?? []).length === 0);

    const { error: bInsErr } = await B.from("systems").insert({
      id: crypto.randomUUID(),
      org_id: orgAId,
      name: "intruder",
      answers,
      result,
      tier: "high",
      created_by: userB.id,
    });
    check("B cannot INSERT into A's org", Boolean(bInsErr), bInsErr?.code);

    const { error: bMemErr } = await B.from("org_members").insert({
      org_id: orgAId,
      user_id: userB.id,
      role: "member",
    });
    check("B cannot join A's org via org_members", Boolean(bMemErr), bMemErr?.code);

    const { data: aRead } = await A.from("systems")
      .select("name")
      .eq("id", sysId)
      .maybeSingle();
    check("A's system is intact after B's attempts", aRead?.name === "Secret A", `name=${aRead?.name}`);

    const { data: aList } = await A.from("systems").select("id");
    check("A sees exactly its own systems", (aList ?? []).length === 1, `${aList?.length ?? 0} rows`);

    // --- Intra-tenant authority: the owner role is owner-controlled (0004) ---
    userC = await makeUser(`rlstest-c-${s}@example.com`, pw);
    const C = await signedInClient(`rlstest-c-${s}@example.com`, pw);

    // Owner A adds C to org A as a plain member (allowed).
    const { error: addErr } = await A.from("org_members").insert({
      org_id: orgAId,
      user_id: userC.id,
      role: "member",
    });
    check("Owner can add a member to their org", !addErr, addErr?.message);

    // C (member) must NOT be able to promote themselves to owner.
    const { data: promo } = await C.from("org_members")
      .update({ role: "owner" })
      .eq("org_id", orgAId)
      .eq("user_id", userC.id)
      .select();
    check("A member cannot self-promote to owner", (promo ?? []).length === 0);

    const { data: cRole } = await A.from("org_members")
      .select("role")
      .eq("org_id", orgAId)
      .eq("user_id", userC.id)
      .maybeSingle();
    check("Member's role is unchanged after the attempt", cRole?.role === "member", `role=${cRole?.role}`);
  } finally {
    // Cleanup — service role bypasses RLS.
    if (orgAId) await admin.from("organizations").delete().eq("id", orgAId);
    if (orgBId) await admin.from("organizations").delete().eq("id", orgBId);
    if (userA) await admin.auth.admin.deleteUser(userA.id);
    if (userB) await admin.auth.admin.deleteUser(userB.id);
    if (userC) await admin.auth.admin.deleteUser(userC.id);
  }

  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} isolation checks passed`);
  process.exit(passed === results.length && results.length > 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("\nVerification error:", e.message);
  process.exit(1);
});
