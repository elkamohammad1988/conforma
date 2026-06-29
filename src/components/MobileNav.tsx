"use client";

import { useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

export function MobileNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#how", label: t("nav.howItWorks") },
    { href: "/security", label: t("nav.security") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/demo", label: t("nav.bookDemo") },
  ];

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-lg text-ink-2 hover:bg-white/5"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
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
            className="fixed inset-0 top-16 z-30 bg-black/20"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-40 border-b border-line bg-surface/95 p-3 shadow-[var(--shadow-raised)] backdrop-blur-xl">
            <nav className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-white/5"
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
