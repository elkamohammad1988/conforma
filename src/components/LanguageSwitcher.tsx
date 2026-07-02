"use client";

/**
 * Language switcher. Flipping the language is instant — `setLocale` updates
 * client state, persists the choice, and re-renders the whole tree in the new
 * language with the correct text direction. No navigation, no reload.
 */

import { useEffect, useRef, useState } from "react";
import { LOCALE_LIST, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

function GlobeIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LanguageSwitcher({
  className = "",
  align = "end",
}: {
  className?: string;
  align?: "start" | "end";
}) {
  const { locale, setLocale, t } = useI18n();
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

  // Move focus into the menu on open (the active language first) and restore it
  // to the trigger on close — matches AlertsMenu's popover focus behaviour.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const active = panel?.querySelector<HTMLElement>('[aria-checked="true"]');
    (active ?? panel?.querySelector<HTMLElement>("button"))?.focus();
    return () => trigger?.focus();
  }, [open]);

  const choose = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("languageSwitcher.change")}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-2 transition hover:bg-ink/[0.04] hover:text-ink"
      >
        <GlobeIcon />
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className={`h-3.5 w-3.5 text-ink-3 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.2 7.5a.75.75 0 0 1 1.06 0L10 11.2l3.74-3.7a.75.75 0 1 1 1.05 1.07l-4.27 4.23a.75.75 0 0 1-1.05 0L5.2 8.57a.75.75 0 0 1 0-1.07Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label={t("languageSwitcher.label")}
          className={`animate-pop absolute top-full z-50 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-line bg-raised p-1 shadow-[var(--shadow-pop)] ${
            align === "end" ? "end-0" : "start-0"
          }`}
        >
          {LOCALE_LIST.map((meta) => {
            const active = meta.code === locale;
            return (
              <button
                key={meta.code}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(meta.code)}
                dir={meta.dir}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-sm transition ${
                  active
                    ? "bg-ink/[0.05] text-ink"
                    : "text-ink-2 hover:bg-ink/[0.04] hover:text-ink"
                }`}
              >
                <span className="text-base leading-none" aria-hidden>
                  {meta.flag}
                </span>
                <span className="flex-1">
                  <span className="block font-medium">{meta.nativeName}</span>
                  <span className="block text-[11px] text-ink-3">
                    {meta.englishName}
                  </span>
                </span>
                {active && (
                  <span className="text-brand-400">
                    <CheckIcon />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
