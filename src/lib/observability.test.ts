import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger, captureError } from "./observability";

describe("logger", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("emits one JSON line carrying level, msg, time and context", () => {
    logger.info("hello", { scope: "test", n: 1 });
    expect(logSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({ level: "info", msg: "hello", scope: "test", n: 1 });
    expect(typeof parsed.time).toBe("string");
  });

  it("routes warn and error to the matching console methods", () => {
    logger.warn("w");
    logger.error("e");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errSpy).toHaveBeenCalledTimes(1);
  });
});

describe("captureError", () => {
  let errSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("serializes an Error with name/message and includes context", () => {
    captureError(new Error("boom"), { scope: "webhook" });
    const parsed = JSON.parse(errSpy.mock.calls[0][0] as string);
    expect(parsed.error.name).toBe("Error");
    expect(parsed.error.message).toBe("boom");
    expect(parsed.scope).toBe("webhook");
    expect(parsed.level).toBe("error");
  });

  it("handles non-Error values without throwing", () => {
    expect(() => captureError("a plain string")).not.toThrow();
    expect(() => captureError({ code: 500 })).not.toThrow();
    expect(() => captureError(null)).not.toThrow();
    expect(() => captureError(undefined)).not.toThrow();
  });

  it("never throws, even on a circular/unserializable value", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(() => captureError(circular, { scope: "x" })).not.toThrow();
  });
});
