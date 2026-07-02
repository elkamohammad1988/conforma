import { describe, it, expect, vi, afterEach } from "vitest";
import { track, identify } from "./analytics";

type W = { posthog?: { capture: (e: string, p?: unknown) => void; identify: (id: string, t?: unknown) => void } };
const setWindow = (w: W | undefined) => {
  (globalThis as unknown as { window: W | undefined }).window = w;
};

describe("analytics", () => {
  afterEach(() => setWindow(undefined));

  it("no-ops safely when no provider is attached", () => {
    setWindow({}); // window exists, but no posthog
    expect(() => track("event", { a: 1 })).not.toThrow();
    expect(() => identify("u1", { plan: "free" })).not.toThrow();
  });

  it("forwards events to a provider on window", () => {
    const capture = vi.fn();
    const ident = vi.fn();
    setWindow({ posthog: { capture, identify: ident } });

    track("signed_up", { plan: "pro" });
    identify("user-1", { orgId: "o1" });

    expect(capture).toHaveBeenCalledWith("signed_up", { plan: "pro" });
    expect(ident).toHaveBeenCalledWith("user-1", { orgId: "o1" });
  });

  it("swallows provider errors — analytics must never break the app", () => {
    setWindow({
      posthog: {
        capture: () => {
          throw new Error("provider down");
        },
        identify: () => {
          throw new Error("provider down");
        },
      },
    });
    expect(() => track("e")).not.toThrow();
    expect(() => identify("u")).not.toThrow();
  });
});
