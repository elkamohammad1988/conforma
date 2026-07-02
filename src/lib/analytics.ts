/**
 * Product analytics — provider-agnostic, no-op until a provider is attached.
 *
 * Call `track()` / `identify()` from client code at meaningful moments. With no
 * provider present these are silent, so instrumentation can be added freely and
 * a tool (PostHog, Segment, …) wired in one place — `resolveProvider()` — later.
 * This mirrors the app's dual-mode philosophy: fully functional with zero
 * third-party dependencies.
 */

export type AnalyticsProps = Record<string, unknown>;

interface AnalyticsProvider {
  capture(event: string, props?: AnalyticsProps): void;
  identify(id: string, traits?: AnalyticsProps): void;
}

function resolveProvider(): AnalyticsProvider | null {
  if (typeof window === "undefined") return null;
  // Drop-in: attach PostHog/Segment on `window` and it starts receiving events.
  const w = window as unknown as { posthog?: AnalyticsProvider };
  return w.posthog ?? null;
}

export function track(event: string, props?: AnalyticsProps): void {
  try {
    resolveProvider()?.capture(event, props);
  } catch {
    // analytics must never break the app
  }
}

export function identify(id: string, traits?: AnalyticsProps): void {
  try {
    resolveProvider()?.identify(id, traits);
  } catch {
    // ignore
  }
}
