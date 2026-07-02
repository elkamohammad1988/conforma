import { describe, it, expect, vi, beforeEach } from "vitest";

// Control the service-role client the authenticator uses.
vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { authenticateApiKey } from "./authenticate";
import { generateApiKey } from "./keys";

/** Minimal admin-client stub: the api_keys lookup returns `row`; update is a no-op. */
function mockAdmin(row: unknown) {
  return {
    from: vi.fn(() => ({
      select: () => ({
        eq: () => ({ maybeSingle: () => Promise.resolve({ data: row }) }),
      }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    })),
  };
}

function reqWith(auth?: string): Request {
  return new Request("https://x/api/v1/systems", {
    headers: auth ? { authorization: auth } : {},
  });
}

const setAdmin = (client: unknown) =>
  vi.mocked(createSupabaseAdminClient).mockReturnValue(
    client as ReturnType<typeof createSupabaseAdminClient>,
  );

describe("authenticateApiKey", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a request with no bearer key (never touches the DB)", async () => {
    setAdmin(mockAdmin({ id: "k", org_id: "o", revoked_at: null }));
    expect(await authenticateApiKey(reqWith())).toBeNull();
    expect(await authenticateApiKey(reqWith("Bearer not-a-key"))).toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("resolves a valid, non-revoked key to its org", async () => {
    setAdmin(mockAdmin({ id: "key-1", org_id: "org-1", revoked_at: null }));
    const out = await authenticateApiKey(reqWith(`Bearer ${generateApiKey()}`));
    expect(out).toEqual({ orgId: "org-1" });
  });

  it("rejects a revoked key", async () => {
    setAdmin(
      mockAdmin({ id: "key-1", org_id: "org-1", revoked_at: "2026-01-01T00:00:00Z" }),
    );
    expect(await authenticateApiKey(reqWith(`Bearer ${generateApiKey()}`))).toBeNull();
  });

  it("rejects a well-formed key with no matching row", async () => {
    setAdmin(mockAdmin(null));
    expect(await authenticateApiKey(reqWith(`Bearer ${generateApiKey()}`))).toBeNull();
  });

  it("returns null when billing/admin is not configured", async () => {
    setAdmin(null);
    expect(await authenticateApiKey(reqWith(`Bearer ${generateApiKey()}`))).toBeNull();
  });
});
