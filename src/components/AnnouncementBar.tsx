"use client";

import { useState } from "react";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { PRIMARY_DEADLINE } from "@/lib/eu-ai-act";
import { useClientValue } from "@/lib/use-client-value";

export function AnnouncementBar() {
  // Hidden during SSR / hydration, then revealed unless dismissed this session.
  const previouslyDismissed = useClientValue(
    () => sessionStorage.getItem("conforma.banner") === "1",
    true,
  );
  const [dismissed, setDismissed] = useState(false);

  if (previouslyDismissed || dismissed) return null;

  return (
    <div className="relative bg-ink text-white print:hidden">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-x-3 gap-y-1 px-5 py-2 text-center text-sm">
        <span className="hidden h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 sm:inline-block" />
        <span className="text-slate-200">
          High-risk obligations apply{" "}
          <span className="font-semibold text-white">{PRIMARY_DEADLINE.date}</span>{" "}
          —{" "}
          <Countdown
            deadline={PRIMARY_DEADLINE.date}
            className="font-semibold text-amber-300"
          />
        </span>
        <Link
          href="/classify"
          className="font-semibold text-white underline-offset-2 hover:underline"
        >
          Check your exposure →
        </Link>
      </div>
      <button
        aria-label="Dismiss"
        onClick={() => {
          sessionStorage.setItem("conforma.banner", "1");
          setDismissed(true);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  );
}
