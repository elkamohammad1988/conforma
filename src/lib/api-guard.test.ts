import { describe, expect, it } from "vitest";
import { withinRateLimit, clientIp, parseAiBody } from "./api-guard";
import { explainBodySchema } from "./schemas";
import { classify, EMPTY_ANSWERS } from "./classifier";

const result = classify({ ...EMPTY_ANSWERS, name: "Sys", isAISystem: true });
const validBody = () => ({ systemName: "Sys", result });

describe("withinRateLimit", () => {
  it("allows up to the cap, then throttles the same IP", () => {
    const ip = "rl-cap";
    for (let i = 0; i < 30; i++) expect(withinRateLimit(ip, 30)).toBe(true);
    expect(withinRateLimit(ip, 30)).toBe(false);
  });

  it("keeps buckets isolated per IP", () => {
    expect(withinRateLimit("rl-a", 1)).toBe(true);
    expect(withinRateLimit("rl-a", 1)).toBe(false);
    expect(withinRateLimit("rl-b", 1)).toBe(true);
  });
});

describe("clientIp", () => {
  it("reads the first x-forwarded-for hop", () => {
    const req = new Request("http://x", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip then to 'unknown'", () => {
    expect(
      clientIp(new Request("http://x", { headers: { "x-real-ip": "9.9.9.9" } })),
    ).toBe("9.9.9.9");
    expect(clientIp(new Request("http://x"))).toBe("unknown");
  });

  it("prefers the trusted x-real-ip over a spoofable x-forwarded-for", () => {
    // A caller who rotates x-forwarded-for to dodge the rate limiter must not
    // control the bucket key: the platform-set x-real-ip wins.
    const req = new Request("http://x", {
      headers: { "x-forwarded-for": "6.6.6.6", "x-real-ip": "9.9.9.9" },
    });
    expect(clientIp(req)).toBe("9.9.9.9");
  });
});

describe("parseAiBody", () => {
  const post = (body: string, ip: string) =>
    new Request("http://x", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body,
    });

  it("returns typed data for a valid request", async () => {
    const guard = await parseAiBody(post(JSON.stringify(validBody()), "p1"), explainBodySchema);
    expect("data" in guard).toBe(true);
    if ("data" in guard) expect(guard.data.systemName).toBe("Sys");
  });

  it("returns a 400 response on invalid JSON", async () => {
    const guard = await parseAiBody(post("{not json", "p2"), explainBodySchema);
    expect("response" in guard && guard.response.status).toBe(400);
  });

  it("returns a 400 response on a schema violation", async () => {
    const guard = await parseAiBody(
      post(JSON.stringify({ systemName: "" }), "p3"),
      explainBodySchema,
    );
    expect("response" in guard && guard.response.status).toBe(400);
  });

  it("returns a 429 response once the IP is throttled", async () => {
    const ip = "p4";
    // Exhaust the default window for this IP via the public limiter.
    for (let i = 0; i < 30; i++) withinRateLimit(ip);
    const guard = await parseAiBody(post(JSON.stringify(validBody()), ip), explainBodySchema);
    expect("response" in guard && guard.response.status).toBe(429);
  });

  it("returns a 413 before parsing when Content-Length exceeds the cap", async () => {
    // A real inbound request carries Content-Length; set it explicitly here (the
    // test runtime doesn't derive it from the body). The body is valid JSON, so
    // reaching parse would 200/400 — getting 413 proves the size guard runs first.
    const req = new Request("http://x", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "p5",
        "content-length": "70000",
      },
      body: JSON.stringify(validBody()),
    });
    const guard = await parseAiBody(req, explainBodySchema);
    expect("response" in guard && guard.response.status).toBe(413);
  });
});
