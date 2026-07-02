import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));

import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveContext } from "./context";
import { ACTIVE_ORG_COOKIE } from "./types";

type Membership = { org_id: string; role: string };
type Org = { id: string; name: string; slug: string };

function mockClient(opts: {
  user: { id: string; email?: string } | null;
  memberships?: Membership[];
  orgs?: Org[];
  plan?: string | null;
  sub?: Record<string, unknown> | null;
}) {
  return {
    auth: { getUser: () => Promise.resolve({ data: { user: opts.user } }) },
    from: (table: string) => {
      if (table === "org_members") {
        return { select: () => ({ eq: () => Promise.resolve({ data: opts.memberships ?? [] }) }) };
      }
      if (table === "organizations") {
        return { select: () => ({ in: () => Promise.resolve({ data: opts.orgs ?? [] }) }) };
      }
      if (table === "subscriptions") {
        const data = opts.sub ?? (opts.plan ? { plan: opts.plan } : null);
        return {
          select: () => ({
            eq: () => ({ maybeSingle: () => Promise.resolve({ data }) }),
          }),
        };
      }
      return {};
    },
  };
}

function setCookie(value: string | undefined) {
  vi.mocked(cookies).mockResolvedValue({
    get: (name: string) => (name === ACTIVE_ORG_COOKIE && value ? { value } : undefined),
  } as unknown as Awaited<ReturnType<typeof cookies>>);
}

function setClient(client: unknown) {
  vi.mocked(createSupabaseServerClient).mockResolvedValue(
    client as Awaited<ReturnType<typeof createSupabaseServerClient>>,
  );
}

describe("getActiveContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCookie(undefined);
  });

  it("returns null when there is no Supabase client (Demo Mode)", async () => {
    setClient(null);
    expect(await getActiveContext()).toBeNull();
  });

  it("returns null when unauthenticated", async () => {
    setClient(mockClient({ user: null }));
    expect(await getActiveContext()).toBeNull();
  });

  it("returns empty orgs and the free plan for a user with no memberships", async () => {
    setClient(mockClient({ user: { id: "u1" }, memberships: [] }));
    const ctx = await getActiveContext();
    expect(ctx).toMatchObject({ userId: "u1", orgs: [], activeOrg: null, plan: "free" });
  });

  it("honours the active-org cookie when it names a real membership", async () => {
    setCookie("b");
    setClient(
      mockClient({
        user: { id: "u1", email: "u@x.co" },
        memberships: [
          { org_id: "a", role: "owner" },
          { org_id: "b", role: "member" },
        ],
        orgs: [
          { id: "a", name: "Alpha", slug: "alpha" },
          { id: "b", name: "Beta", slug: "beta" },
        ],
      }),
    );
    const ctx = await getActiveContext();
    expect(ctx?.activeOrg?.id).toBe("b");
    expect(ctx?.activeOrg?.role).toBe("member");
  });

  it("IDOR defense: a forged cookie for a non-member org falls back to a real org", async () => {
    setCookie("org-i-do-not-belong-to");
    setClient(
      mockClient({
        user: { id: "u1" },
        memberships: [
          { org_id: "a", role: "owner" },
          { org_id: "b", role: "member" },
        ],
        orgs: [
          { id: "b", name: "Beta", slug: "beta" },
          { id: "a", name: "Alpha", slug: "alpha" },
        ],
      }),
    );
    const ctx = await getActiveContext();
    // Never the forged id; falls back to the first real org (sorted by name → Alpha).
    expect(ctx?.activeOrg?.id).toBe("a");
    expect(ctx?.orgs.map((o) => o.id)).toEqual(["a", "b"]);
  });

  it("resolves the active org's plan from its subscription", async () => {
    setClient(
      mockClient({
        user: { id: "u1" },
        memberships: [{ org_id: "a", role: "owner" }],
        orgs: [{ id: "a", name: "Alpha", slug: "alpha" }],
        plan: "pro",
      }),
    );
    const ctx = await getActiveContext();
    expect(ctx?.plan).toBe("pro");
  });

  it("exposes subscription status, period end and cancel flag", async () => {
    setClient(
      mockClient({
        user: { id: "u1" },
        memberships: [{ org_id: "a", role: "owner" }],
        orgs: [{ id: "a", name: "Alpha", slug: "alpha" }],
        sub: {
          plan: "team",
          status: "active",
          current_period_end: "2026-08-01T00:00:00Z",
          cancel_at_period_end: true,
        },
      }),
    );
    const ctx = await getActiveContext();
    expect(ctx?.plan).toBe("team");
    expect(ctx?.subscription).toEqual({
      status: "active",
      currentPeriodEnd: "2026-08-01T00:00:00Z",
      cancelAtPeriodEnd: true,
    });
  });

  it("has a null subscription when there is no subscription row", async () => {
    setClient(
      mockClient({
        user: { id: "u1" },
        memberships: [{ org_id: "a", role: "owner" }],
        orgs: [{ id: "a", name: "Alpha", slug: "alpha" }],
      }),
    );
    const ctx = await getActiveContext();
    expect(ctx?.subscription).toBeNull();
  });
});
