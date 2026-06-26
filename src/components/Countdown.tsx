"use client";

import { daysUntil } from "@/lib/eu-ai-act";
import { useClientValue } from "@/lib/use-client-value";

/**
 * Days remaining until an ISO deadline. Computed on the client so the count is
 * always live relative to "today" rather than to build time.
 */
export function Countdown({
  deadline,
  className = "",
}: {
  deadline: string;
  className?: string;
}) {
  const days = useClientValue<number | null>(
    () => daysUntil(deadline, new Date().toISOString().slice(0, 10)),
    null,
  );

  if (days === null) return <span className={className}>—</span>;
  if (days < 0) return <span className={className}>deadline passed</span>;
  return (
    <span className={className}>
      {days.toLocaleString("en-GB")} day{days === 1 ? "" : "s"} left
    </span>
  );
}
