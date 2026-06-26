"use client";

import { useEffect, useState } from "react";

type Mode = "live" | "demo" | "loading";

/**
 * Proactive Demo Mode indicator. Asks the server which mode AI generation runs
 * in and, when no Anthropic key is configured, shows a tasteful pill so users
 * know up-front that AI output is realistic pre-generated sample content. It
 * stays silent in live mode (the per-output "Drafted by Claude" tag covers that)
 * and never surfaces an error — if the status check fails it assumes Demo Mode.
 */
export function DemoModeBadge({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("loading");

  useEffect(() => {
    let alive = true;
    fetch("/api/ai-status")
      .then((r) => r.json())
      .then((d) => alive && setMode(d?.demo ? "demo" : "live"))
      .catch(() => alive && setMode("demo"));
    return () => {
      alive = false;
    };
  }, []);

  if (mode !== "demo") return null;

  return (
    <span
      title="No Anthropic API key is configured, so AI generation runs in Demo Mode — realistic, pre-generated sample documents. No paid API required."
      className={`inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
      </span>
      Demo Mode · sample AI output
    </span>
  );
}

/**
 * Per-output provenance tag. Renders next to a generated document or narrative
 * to show where it came from — a live Claude draft, a Demo Mode sample, or
 * (rarely) an error. Centralised here so every AI surface labels output the
 * same premium way.
 */
export function AiSourceTag({ source }: { source: string }) {
  if (source === "claude") {
    return (
      <span className="rounded bg-brand-100 px-1.5 py-0.5 font-medium text-brand-700">
        ✨ Drafted by Claude
      </span>
    );
  }
  if (source === "demo") {
    return (
      <span
        title="Realistic, pre-generated sample. Add an ANTHROPIC_API_KEY to switch to live, system-specific drafting."
        className="inline-flex items-center gap-1 rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700 ring-1 ring-brand-200"
      >
        ✨ AI draft · Demo Mode
      </span>
    );
  }
  return <span className="text-red-500">Could not generate — please try again.</span>;
}
