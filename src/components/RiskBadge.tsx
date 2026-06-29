"use client";

import { type RiskTier } from "@/lib/eu-ai-act";
import { useT } from "@/i18n/I18nProvider";

// Full literal class strings so Tailwind's JIT keeps them. Earthy, editorial
// risk scale — oxblood · burnt amber · petrol · sage (no primary red/blue).
const STYLES: Record<RiskTier, string> = {
  prohibited: "bg-risk-prohibited/10 text-risk-prohibited ring-risk-prohibited/25",
  high: "bg-risk-high/12 text-risk-high ring-risk-high/30",
  limited: "bg-risk-limited/10 text-risk-limited ring-risk-limited/25",
  minimal: "bg-risk-minimal/12 text-risk-minimal ring-risk-minimal/25",
};

const DOT: Record<RiskTier, string> = {
  prohibited: "bg-risk-prohibited",
  high: "bg-risk-high",
  limited: "bg-risk-limited",
  minimal: "bg-risk-minimal",
};

export function RiskBadge({
  tier,
  size = "md",
}: {
  tier: RiskTier;
  size?: "sm" | "md";
}) {
  const t = useT();
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${STYLES[tier]} ${pad}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[tier]}`} />
      {t(`domain.riskTiers.${tier}.short`)}
    </span>
  );
}
