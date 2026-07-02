import { describe, it, expect } from "vitest";
import { isAuthRequired, isAuthPage } from "./routes";

describe("isAuthRequired", () => {
  it("matches protected app routes and their subpaths", () => {
    expect(isAuthRequired("/dashboard")).toBe(true);
    expect(isAuthRequired("/systems/abc")).toBe(true);
    expect(isAuthRequired("/team")).toBe(true);
    expect(isAuthRequired("/settings")).toBe(true);
    expect(isAuthRequired("/onboarding")).toBe(true);
  });

  it("does not match public/marketing routes", () => {
    expect(isAuthRequired("/")).toBe(false);
    expect(isAuthRequired("/pricing")).toBe(false);
    expect(isAuthRequired("/security")).toBe(false);
    expect(isAuthRequired("/login")).toBe(false);
    // guards against prefix false-positives
    expect(isAuthRequired("/teamwork")).toBe(false);
    expect(isAuthRequired("/reporting")).toBe(false);
  });
});

describe("isAuthPage", () => {
  it("matches only the auth entry pages exactly", () => {
    expect(isAuthPage("/login")).toBe(true);
    expect(isAuthPage("/signup")).toBe(true);
    expect(isAuthPage("/forgot-password")).toBe(true);
    expect(isAuthPage("/reset-password")).toBe(false); // needs a recovery session
    expect(isAuthPage("/dashboard")).toBe(false);
  });
});
