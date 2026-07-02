"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { useSystems, compliancePct } from "@/lib/store";

/** EU AI Act — high-risk obligations apply from 2 August 2026 (Art. 113). */
const HIGH_RISK_DEADLINE = "2026-08-02";
/** A high-risk system below this completion is surfaced as needing attention. */
const ATTENTION_THRESHOLD = 50;

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[18px] w-[18px]"
    >
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

type Tone = "danger" | "warn" | "info";
type Alert = { id: string; tone: Tone; title: string; body: string };

const TONE_DOT: Record<Tone, string> = {
  danger: "bg-danger-500",
  warn: "bg-warn-500",
  info: "bg-brand-500",
};

/**
 * Alerts — a real, registry-driven notifications popover (the app chrome's bell).
 * It derives live compliance signals from the stored systems: prohibited
 * practices, high-risk systems below target, and the regulatory deadline. The
 * badge counts only actionable warnings; the deadline is always shown as info.
 */
export function AlertsMenu() {
  const { t, formatDate } = useI18n();
  const systems = useSystems();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Move focus into the popover on open and restore it to the bell on close, so
  // keyboard / screen-reader users don't lose their place (Escape and
  // outside-click already close it above).
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    panelRef.current?.focus();
    return () => trigger?.focus();
  }, [open]);

  const warnings = useMemo<Alert[]>(() => {
    if (!systems) return [];
    const out: Alert[] = [];
    const prohibited = systems.filter((s) => s.result.tier === "prohibited");
    const attention = systems.filter(
      (s) => s.result.tier === "high" && compliancePct(s) < ATTENTION_THRESHOLD,
    );
    if (prohibited.length > 0) {
      out.push({
        id: "prohibited",
        tone: "danger",
        title: t("alerts.prohibitedTitle", { count: prohibited.length }),
        body: t("alerts.prohibitedBody"),
      });
    }
    if (attention.length > 0) {
      out.push({
        id: "attention",
        tone: "warn",
        title: t("alerts.attentionTitle", { count: attention.length }),
        body: t("alerts.attentionBody"),
      });
    }
    return out;
  }, [systems, t]);

  const deadline: Alert = {
    id: "deadline",
    tone: "info",
    title: t("alerts.deadlineTitle"),
    body: t("alerts.deadlineBody", {
      date: formatDate(HIGH_RISK_DEADLINE, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }),
  };

  const badge = warnings.length;

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-tip={t("app.notifications")}
        aria-label={t("app.notifications")}
        className="tip relative rounded-lg p-2 text-ink-3 transition hover:bg-ink/[0.04] hover:text-ink"
      >
        <BellIcon />
        {badge > 0 && (
          <span
            aria-hidden
            className="absolute end-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger-600 px-1 text-[10px] font-semibold leading-none text-white"
          >
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={t("alerts.title")}
          tabIndex={-1}
          className="animate-pop absolute end-0 top-full z-50 mt-2 w-[20rem] overflow-hidden rounded-xl border border-line bg-raised shadow-[var(--shadow-pop)] focus:outline-none"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">{t("alerts.title")}</p>
            <p className="text-xs text-ink-3">{t("alerts.subtitle")}</p>
          </div>

          <div className="max-h-[22rem] overflow-y-auto py-1 scrollbar-thin">
            {warnings.length === 0 && (
              <p className="px-4 py-3 text-sm text-ink-2">{t("alerts.empty")}</p>
            )}
            {warnings.map((a) => (
              <AlertRow key={a.id} alert={a} />
            ))}
            <div className="divider-x my-1" />
            <AlertRow alert={deadline} />
          </div>

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block border-t border-line px-4 py-2.5 text-center text-sm font-medium text-brand-400 transition hover:bg-ink/[0.03] hover:text-brand-300"
          >
            {t("alerts.viewAll")}
          </Link>
        </div>
      )}
    </div>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2.5">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_DOT[alert.tone]}`} />
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug text-ink">{alert.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-2">{alert.body}</p>
      </div>
    </div>
  );
}
