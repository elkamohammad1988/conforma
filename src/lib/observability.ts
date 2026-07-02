/**
 * Structured logging + error capture.
 *
 * Emits one JSON object per line to stdout/stderr — the format hosting platforms
 * (Vercel, CloudWatch, Loki, …) parse into queryable fields. Dependency-free and
 * runtime-agnostic, so it works in edge middleware, route handlers and server
 * components alike.
 *
 * `captureError` is the single choke point for reporting failures. It structured
 * -logs today and is the drop-in seam for an error-monitoring provider: wire
 * Sentry (or similar) here and every existing call site starts reporting, with
 * no other changes.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Record<string, unknown>;

function emit(level: LogLevel, message: string, context?: LogContext): void {
  const entry = { level, msg: message, time: new Date().toISOString(), ...context };
  let line: string;
  try {
    line = JSON.stringify(entry);
  } catch {
    line = JSON.stringify({ level, msg: message, time: entry.time });
  }
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") emit("debug", message, context);
  },
  info(message: string, context?: LogContext) {
    emit("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    emit("warn", message, context);
  },
  error(message: string, context?: LogContext) {
    emit("error", message, context);
  },
};

/** Normalize any thrown value into a serializable shape. */
function toErrorShape(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { message: typeof error === "string" ? error : JSON.stringify(error) };
}

/**
 * Report a failure. Structured-logs at error level and is the hook point for a
 * monitoring provider (Sentry, etc.). Never throws.
 */
export function captureError(error: unknown, context?: LogContext): void {
  try {
    const err = toErrorShape(error);
    emit("error", err.message || "error", { ...context, error: err });
    // Drop-in: forward to Sentry/monitoring here when a DSN is configured.
  } catch {
    // Reporting must never mask the original error.
  }
}
