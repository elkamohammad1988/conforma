"use client";

import { useState } from "react";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { ArrowForward } from "@/components/Arrow";
import { PRIMARY_DEADLINE } from "@/lib/eu-ai-act";
import { useClientValue } from "@/lib/use-client-value";
import { useI18n } from "@/i18n/I18nProvider";

export function AnnouncementBar() {
  const { t, formatDate } = useI18n();
  // Hidden during SSR / hydration, then revealed unless dismissed this session.
  const previouslyDismissed = useClientValue(
    () => sessionStorage.getItem("conforma.banner") === "1",
    true,
  );
  const [dismissed, setDismissed] = useState(false);

  if (previouslyDismissed || dismissed) return null;

  return (
    <div className="relative border-b border-line bg-paper-2 print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-2.5 px-10 py-2 text-center text-xs sm:text-sm">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass-400" />
        <span className="truncate text-ink-2">
          {t("announcement.prefix")}
          <span className="hidden font-medium text-ink sm:inline">
            {" "}
            {formatDate(PRIMARY_DEADLINE.date, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>{" "}
          —{" "}
          <Countdown
            deadline={PRIMARY_DEADLINE.date}
            className="font-medium text-brass-300"
          />
        </span>
        <Link
          href="/classify"
          className="hidden shrink-0 font-medium text-ink underline-offset-2 hover:underline sm:inline"
        >
          {t("announcement.cta")} <ArrowForward />
        </Link>
      </div>
      <button
        aria-label={t("announcement.dismiss")}
        onClick={() => {
          sessionStorage.setItem("conforma.banner", "1");
          setDismissed(true);
        }}
        className="absolute end-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-3 hover:text-ink"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  );
}
