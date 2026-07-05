import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/claude", () => ({ isClaudeConfigured: vi.fn() }));
vi.mock("@/lib/auth/context", () => ({ getActiveContext: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));
vi.mock("@/lib/data/documents-repository", () => ({
  countAiDocumentsSince: vi.fn(),
}));

import { decideAi } from "./entitlement";
import { isClaudeConfigured } from "@/lib/claude";
import { getActiveContext } from "@/lib/auth/context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { countAiDocumentsSince } from "@/lib/data/documents-repository";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

beforeEach(() => vi.clearAllMocks());

describe("decideAi — the AI wallet + meter guard", () => {
  it("serves demo when no key is configured, without even resolving auth", async () => {
    asMock(isClaudeConfigured).mockReturnValue(false);
    asMock(getActiveContext).mockResolvedValue({ activeOrg: { id: "o1" }, plan: "pro" });
    expect(await decideAi({ metered: true })).toEqual({ effect: "demo" });
    expect(getActiveContext).not.toHaveBeenCalled();
  });

  it("serves demo for ANONYMOUS callers even when a real key IS configured", async () => {
    // This is the core financial-DoS fix: the public internet can never spend the key.
    asMock(isClaudeConfigured).mockReturnValue(true);
    asMock(getActiveContext).mockResolvedValue(null);
    expect(await decideAi({ metered: true })).toEqual({ effect: "demo" });
    expect(countAiDocumentsSince).not.toHaveBeenCalled();
  });

  it("allows live generation for an authenticated org within its monthly quota", async () => {
    asMock(isClaudeConfigured).mockReturnValue(true);
    asMock(getActiveContext).mockResolvedValue({ activeOrg: { id: "o1" }, plan: "free" });
    asMock(createSupabaseServerClient).mockResolvedValue({});
    asMock(countAiDocumentsSince).mockResolvedValue(4); // free limit is 5
    expect(await decideAi({ metered: true })).toEqual({ effect: "live", orgId: "o1" });
  });

  it("blocks with a quota decision once the monthly meter is reached", async () => {
    asMock(isClaudeConfigured).mockReturnValue(true);
    asMock(getActiveContext).mockResolvedValue({ activeOrg: { id: "o1" }, plan: "free" });
    asMock(createSupabaseServerClient).mockResolvedValue({});
    asMock(countAiDocumentsSince).mockResolvedValue(5); // == limit
    expect(await decideAi({ metered: true })).toEqual({ effect: "quota", limit: 5, used: 5 });
  });

  it("does not meter unlimited (team) plans — no count query is issued", async () => {
    asMock(isClaudeConfigured).mockReturnValue(true);
    asMock(getActiveContext).mockResolvedValue({ activeOrg: { id: "o1" }, plan: "team" });
    expect(await decideAi({ metered: true })).toEqual({ effect: "live", orgId: "o1" });
    expect(countAiDocumentsSince).not.toHaveBeenCalled();
  });

  it("never meters the (cheaper) explain path", async () => {
    asMock(isClaudeConfigured).mockReturnValue(true);
    asMock(getActiveContext).mockResolvedValue({ activeOrg: { id: "o1" }, plan: "free" });
    expect(await decideAi({ metered: false })).toEqual({ effect: "live", orgId: "o1" });
    expect(countAiDocumentsSince).not.toHaveBeenCalled();
  });
});
