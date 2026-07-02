"use client";

import { useT } from "@/i18n/I18nProvider";
import { useAiMode } from "@/components/AiModeProvider";

/**
 * Proactive Demo Mode indicator. Reads the generation mode from context (seeded
 * once on the server) — so when no Anthropic key is configured it shows a
 * tasteful pill, synchronously, with no per-mount fetch or loading flash. It
 * stays silent in live mode (the per-output "Drafted by Claude" tag covers that).
 */
export function DemoModeBadge({ className = "" }: { className?: string }) {
  const t = useT();
  const mode = useAiMode();

  if (mode !== "demo") return null;

  return (
    <span
      title={t("ai.demoBadgeTitle")}
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/[0.03] px-2.5 py-1 text-[11px] font-medium text-ink-2 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {t("ai.demoBadge")}
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
  const t = useT();
  if (source === "claude") {
    return (
      <span className="rounded border border-brand-500/30 bg-brand-500/10 px-1.5 py-0.5 font-medium text-brand-400">
        {t("ai.draftedByClaude")}
      </span>
    );
  }
  if (source === "demo") {
    return (
      <span
        title={t("ai.aiDraftDemoTitle")}
        className="inline-flex items-center gap-1 rounded border border-line bg-ink/[0.03] px-1.5 py-0.5 font-medium text-ink-2"
      >
        {t("ai.aiDraftDemo")}
      </span>
    );
  }
  return <span className="text-danger-400">{t("ai.couldNotGenerate")}</span>;
}
