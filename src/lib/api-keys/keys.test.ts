import { describe, it, expect } from "vitest";
import { generateApiKey, hashApiKey, keyPrefix, parseBearerKey } from "./keys";

describe("api key generation", () => {
  it("produces a prefixed, url-safe key of stable shape", () => {
    const key = generateApiKey();
    expect(key).toMatch(/^cfm_[A-Za-z0-9_-]{32}$/);
    expect(keyPrefix(key)).toBe(key.slice(0, 12));
  });

  it("generates distinct keys", () => {
    expect(generateApiKey()).not.toBe(generateApiKey());
  });
});

describe("hashApiKey", () => {
  it("is a deterministic 64-char sha-256 hex digest", async () => {
    const h1 = await hashApiKey("cfm_example_key_value");
    const h2 = await hashApiKey("cfm_example_key_value");
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
  });

  it("differs for different keys", async () => {
    expect(await hashApiKey("cfm_a")).not.toBe(await hashApiKey("cfm_b"));
  });
});

describe("parseBearerKey", () => {
  it("extracts a valid bearer key", () => {
    expect(parseBearerKey("Bearer cfm_abcdefghijklmnop1234")).toBe(
      "cfm_abcdefghijklmnop1234",
    );
  });

  it("rejects malformed or missing headers", () => {
    expect(parseBearerKey(null)).toBeNull();
    expect(parseBearerKey("Bearer notakey")).toBeNull();
    expect(parseBearerKey("cfm_abcdefghijklmnop1234")).toBeNull(); // no scheme
  });
});
