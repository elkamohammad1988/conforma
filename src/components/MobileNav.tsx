"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

export function MobileNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  // While open: trap focus inside the panel, close on Escape, lock body scroll.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "Tab" && panel) {
        const nodes = panel.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    panel?.querySelector<HTMLElement>("a, button")?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const links = [
    { href: "/#how", label: t("nav.howItWorks") },
    { href: "/security", label: t("nav.security") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/demo", label: t("common.talkToSales") },
  ];

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-lg text-ink-2 transition hover:bg-ink/[0.04]"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-5 w-5">
          {open ? (
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          ) : (
            <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" />
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            className="animate-fade-in fixed inset-0 top-16 z-30 bg-[#05050a]/80 backdrop-blur-sm"
            onClick={close}
          />
          <div
            ref={panelRef}
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            className="mobile-nav-panel animate-pop absolute inset-x-0 top-full z-40 border-b border-line p-3 shadow-[var(--shadow-raised)]"
          >
            <nav className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-ink/[0.04]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/classify"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-2 w-full"
              >
                {t("nav.startFree")}
              </Link>
              <div className="mt-3 border-t border-line pt-3">
                <LanguageSwitcher align="start" />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
