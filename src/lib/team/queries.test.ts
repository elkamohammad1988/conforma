import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getTeamMembers,
  getPendingInvites,
  getActivity,
  getSystemsCount,
} from "./queries";

type Result = { data?: unknown; count?: number };

/**
 * Chainable server-client stub: every query method returns the builder (which is
 * awaitable), resolving each awaited terminal to the next queued result.
 */
function mockClient(results: Result[]) {
  let i = 0;
  const pull = (): Result => results[i++] ?? { data: [] };
  const b: Record<string, unknown> = {};
  for (const m of ["select", "eq", "in", "order", "limit"]) {
    b[m] = () => b;
  }
  b.then = (resolve: (v: Result) => unknown, reject?: (e: unknown) => unknown) =>
    Promise.resolve(pull()).then(resolve, reject);
  return { from: () => b } as unknown as Awaited<
    ReturnType<typeof createSupabaseServerClient>
  >;
}

const use = (results: Result[]) =>
  vi.mocked(createSupabaseServerClient).mockResolvedValue(mockClient(results));

describe("team queries", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getTeamMembers joins memberships with profiles and sorts by joined date", async () => {
    use([
      {
        data: [
          { user_id: "u2", role: "member", created_at: "2026-06-05T00:00:00Z" },
          { user_id: "u1", role: "owner", created_at: "2026-06-01T00:00:00Z" },
        ],
      },
      {
        data: [
          { id: "u1", email: "a@x.co", full_name: "Alice" },
          { id: "u2", email: "b@x.co", full_name: null },
        ],
      },
    ]);
    const members = await getTeamMembers("org-1");
    expect(members.map((m) => m.userId)).toEqual(["u1", "u2"]); // sorted by joinedAt
    expect(members[0]).toMatchObject({ role: "owner", fullName: "Alice", email: "a@x.co" });
    expect(members[1]).toMatchObject({ fullName: null, email: "b@x.co" });
  });

  it("getTeamMembers returns [] and skips the profile query when empty", async () => {
    use([{ data: [] }]);
    expect(await getTeamMembers("org-1")).toEqual([]);
  });

  it("getPendingInvites maps invitation rows", async () => {
    use([
      {
        data: [
          {
            id: "inv-1",
            email: "new@x.co",
            role: "admin",
            status: "pending",
            created_at: "2026-06-10T00:00:00Z",
            expires_at: "2026-06-24T00:00:00Z",
          },
        ],
      },
    ]);
    const invites = await getPendingInvites("org-1");
    expect(invites).toHaveLength(1);
    expect(invites[0]).toMatchObject({ id: "inv-1", email: "new@x.co", role: "admin" });
  });

  it("getActivity resolves actor names from profiles", async () => {
    use([
      {
        data: [
          { id: 2, action: "member.invited", actor_id: "u1", target_type: null, target_id: null, metadata: {}, created_at: "2026-06-11T00:00:00Z" },
          { id: 1, action: "org.renamed", actor_id: null, target_type: null, target_id: null, metadata: {}, created_at: "2026-06-10T00:00:00Z" },
        ],
      },
      { data: [{ id: "u1", full_name: "Alice", email: "a@x.co" }] },
    ]);
    const activity = await getActivity("org-1");
    expect(activity[0]).toMatchObject({ action: "member.invited", actorName: "Alice" });
    expect(activity[1]).toMatchObject({ action: "org.renamed", actorName: null });
  });

  it("getSystemsCount returns the head count", async () => {
    use([{ count: 7 }]);
    expect(await getSystemsCount("org-1")).toBe(7);
  });

  it("all queries return safe empties in Demo Mode (no client)", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(null);
    expect(await getTeamMembers("o")).toEqual([]);
    expect(await getPendingInvites("o")).toEqual([]);
    expect(await getActivity("o")).toEqual([]);
    expect(await getSystemsCount("o")).toBe(0);
  });
});
