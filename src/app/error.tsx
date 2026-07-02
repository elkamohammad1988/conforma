"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Route-level error boundary. Any render/runtime error under the root layout
 * lands here instead of a white screen — with the app chrome and i18n intact,
 * a retry (`reset`) and a safe way home. The error is logged for diagnostics.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("[conforma] route error boundary:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-surface text-danger-400 shadow-[var(--shadow-card)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="h-7 w-7"
        >
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </span>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">
        {t("error.title")}
      </h1>
      <p className="mt-2 text-ink-2">{t("error.body")}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-primary">
          {t("error.retry")}
        </button>
        <Link href="/" className="btn btn-secondary">
          {t("error.home")}
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-ink-3">
          {t("error.reference")}:{" "}
          <span className="nums font-mono">{error.digest}</span>
        </p>
      )}

      <div className="mt-6 flex items-center gap-2 text-ink-3">
        <LogoMark className="h-5 w-5 opacity-70" />
        <span className="text-sm">Conforma</span>
      </div>
    </div>
  );
}
