"use client";

import { daysUntil } from "@/lib/eu-ai-act";
import { useClientValue } from "@/lib/use-client-value";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Days remaining until an ISO deadline. Computed on the client so the count is
 * always live relative to "today" rather than to build time. The number and the
 * plural form follow the active locale.
 */
export function Countdown({
  deadline,
  className = "",
}: {
  deadline: string;
  className?: string;
}) {
  const { t } = useI18n();
  const days = useClientValue<number | null>(
    () => daysUntil(deadline, new Date().toISOString().slice(0, 10)),
    null,
  );

  if (days === null) return <span className={`${className} nums`}>—</span>;
  if (days < 0) return <span className={`${className} nums`}>{t("common.deadlinePassed")}</span>;
  return <span className={`${className} nums`}>{t("common.daysLeft", { count: days })}</span>;
}
