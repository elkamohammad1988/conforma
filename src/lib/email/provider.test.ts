import { describe, it, expect, vi, afterEach } from "vitest";
import { sendEmail, isEmailConfigured } from "./provider";

/** A fake `fetch` that records the call and returns a canned Response. */
function fakeFetch(response: Partial<Response> & { ok: boolean; status?: number }) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const impl = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return {
      ok: response.ok,
      status: response.status ?? (response.ok ? 200 : 500),
      text: async () => "detail",
      json: async () => ({ id: "email_123" }),
    } as unknown as Response;
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const MSG = { to: "a@b.com", subject: "Hi", html: "<p>hi</p>", text: "hi" };

afterEach(() => vi.unstubAllEnvs());

describe("isEmailConfigured", () => {
  it("is false unless both RESEND_API_KEY and EMAIL_FROM are set", () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("EMAIL_FROM", "");
    expect(isEmailConfigured()).toBe(false);

    vi.stubEnv("RESEND_API_KEY", "re_x");
    expect(isEmailConfigured()).toBe(false);

    vi.stubEnv("EMAIL_FROM", "Conforma <no-reply@conforma.app>");
    expect(isEmailConfigured()).toBe(true);
  });
});

describe("sendEmail", () => {
  it("skips (never throws) when email is unconfigured — Demo Mode", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("EMAIL_FROM", "");
    const { impl, calls } = fakeFetch({ ok: true });
    const res = await sendEmail(MSG, impl);
    expect(res).toEqual({ ok: false, skipped: true });
    expect(calls).toHaveLength(0); // no network call attempted
  });

  it("posts to Resend with auth + payload and returns the id on success", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_secret");
    vi.stubEnv("EMAIL_FROM", "Conforma <no-reply@conforma.app>");
    const { impl, calls } = fakeFetch({ ok: true, status: 200 });
    const res = await sendEmail(MSG, impl);

    expect(res).toEqual({ ok: true, id: "email_123" });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://api.resend.com/emails");
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer re_secret");
    const body = JSON.parse(calls[0].init.body as string);
    expect(body).toMatchObject({
      from: "Conforma <no-reply@conforma.app>",
      to: ["a@b.com"],
      subject: "Hi",
    });
    expect(body.reply_to).toBeUndefined(); // omitted when no replyTo
  });

  it("includes reply_to only when provided", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_secret");
    vi.stubEnv("EMAIL_FROM", "no-reply@conforma.app");
    const { impl, calls } = fakeFetch({ ok: true });
    await sendEmail({ ...MSG, replyTo: "team@conforma.app" }, impl);
    const body = JSON.parse(calls[0].init.body as string);
    expect(body.reply_to).toBe("team@conforma.app");
  });

  it("returns a resend_<status> error on a non-2xx response without throwing", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_secret");
    vi.stubEnv("EMAIL_FROM", "no-reply@conforma.app");
    const { impl } = fakeFetch({ ok: false, status: 422 });
    const res = await sendEmail(MSG, impl);
    expect(res).toEqual({ ok: false, error: "resend_422" });
  });

  it("returns a network error (never throws) when fetch rejects", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_secret");
    vi.stubEnv("EMAIL_FROM", "no-reply@conforma.app");
    const throwing = (async () => {
      throw new Error("down");
    }) as unknown as typeof fetch;
    const res = await sendEmail(MSG, throwing);
    expect(res).toEqual({ ok: false, error: "network" });
  });
});
