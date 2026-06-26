import { RISK_TIERS, type RiskTier } from "@/lib/eu-ai-act";

// Full literal class strings so Tailwind's JIT keeps them.
const STYLES: Record<RiskTier, string> = {
  prohibited: "bg-red-50 text-red-700 ring-red-600/20",
  high: "bg-amber-50 text-amber-700 ring-amber-600/20",
  limited: "bg-blue-50 text-blue-700 ring-blue-600/20",
  minimal: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const DOT: Record<RiskTier, string> = {
  prohibited: "bg-red-500",
  high: "bg-amber-500",
  limited: "bg-blue-500",
  minimal: "bg-emerald-500",
};

export function RiskBadge({
  tier,
  size = "md",
}: {
  tier: RiskTier;
  size?: "sm" | "md";
}) {
  const meta = RISK_TIERS[tier];
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${STYLES[tier]} ${pad}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[tier]}`} />
      {meta.short}
    </span>
  );
}
