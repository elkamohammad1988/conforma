"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, LogoMark } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AUTHOR, CASE_STUDY_URL, REPO_URL } from "@/lib/site";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Marketing chrome (top nav · footer). It wraps every page,
 * but hides itself on the in-product app routes, where <AppShell> takes over
 * with its own sidebar + topbar. This keeps the marketing site and the
 * application visually distinct without restructuring the route tree.
 */
const APP_ROUTES = ["/dashboard", "/systems", "/classify", "/report", "/team", "/settings"];

// Auth + onboarding screens: no marketing nav and no app sidebar — a focused,
// centered surface. They bring their own layout (see AuthScreen).
const BARE_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
  "/accept-invite",
];

// Standard/brand names — intentionally not translated.
const FRAMEWORKS = ["EU AI Act", "GDPR", "ISO/IEC 42001", "NIST AI RMF"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isApp = APP_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
  const isBare = BARE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  // App routes: AppShell renders its own <main id="main"> AFTER the sidebar +
  // topbar, so the "skip to content" link actually bypasses the app navigation
  // (a plain wrapper here keeps the exact flex layout, and avoids a second
  // <main>). Bare routes have no AppShell, so they still need the landmark.
  if (isApp) {
    return <div className="flex-1">{children}</div>;
  }
  if (isBare) {
    return (
      <main id="main" className="flex-1">
        {children}
      </main>
    );
  }

  return (
    <>
      <TopNav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

function TopNav() {
  const { t } = useI18n();
  const nav = [
    { href: "/#how", label: t("nav.howItWorks") },
    { href: "/security", label: t("nav.security") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/dashboard", label: t("nav.dashboard") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/70 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo withBadge={false} />
        <nav className="hidden items-center gap-1 text-sm font-medium text-ink-2 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 transition hover:bg-ink/[0.04] hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher className="hidden sm:block" />
          <Link
            href="/demo"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-ink-2 transition hover:bg-ink/[0.04] hover:text-ink sm:inline-block"
          >
            {t("common.talkToSales")}
          </Link>
          <Link href="/classify" className="btn btn-primary btn-sm">
            {t("nav.startFree")}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const cols: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: t("footer.columns.product.title"),
      links: [
        { href: "/classify", label: t("footer.columns.product.riskClassifier") },
        { href: "/dashboard", label: t("footer.columns.product.aiRegistry") },
        { href: "/pricing", label: t("footer.columns.product.pricing") },
        { href: "/demo", label: t("footer.columns.product.bookDemo") },
      ],
    },
    {
      title: t("footer.columns.trust.title"),
      links: [
        { href: "/security", label: t("footer.columns.trust.security") },
        { href: "/security#privacy", label: t("footer.columns.trust.dataResidency") },
        {
          href: "/security#subprocessors",
          label: t("footer.columns.trust.subprocessors"),
        },
      ],
    },
    {
      title: t("footer.columns.company.title"),
      links: [
        { href: "/#how", label: t("footer.columns.company.howItWorks") },
        { href: "/#faq", label: t("footer.columns.company.faq") },
        { href: "/demo", label: t("footer.columns.company.contactSales") },
      ],
    },
    {
      title: t("footer.columns.legal.title"),
      links: [
        { href: "/terms", label: t("footer.columns.legal.terms") },
        { href: "/privacy", label: t("footer.columns.legal.privacy") },
        { href: "/security#privacy", label: t("footer.columns.legal.dataProcessing") },
      ],
    },
  ];
  return (
    <footer className="border-t border-line bg-paper-2 print:hidden">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7" />
              <span className="text-lg font-semibold tracking-tight">Conforma</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {FRAMEWORKS.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-line bg-ink/[0.04] px-2 py-1 text-[11px] font-medium text-ink-2"
                >
                  {f}
                </span>
              ))}
            </div>
            <a
              href="mailto:hello@conforma.eu"
              className="mt-4 inline-block text-sm font-medium text-brand-400 hover:underline"
            >
              hello@conforma.eu
            </a>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-3">
                {c.title}
              </div>
              <ul className="mt-3 space-y-2 text-sm text-ink-2">
                {c.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="hover:text-brand-400">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Portfolio authorship — the bridge from this polished demo to the
            developer a client is actually evaluating. Product persona stays
            intact above; the real human who built it is named here. */}
        <div className="mt-10 border-t border-line pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-ink-2">
              {t("footer.builtBy")}{" "}
              <span className="font-semibold text-ink">{AUTHOR.name}</span>
              {" — "}
              {t("footer.portfolioNote")}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink-2 transition hover:text-brand-400"
              >
                GitHub
              </a>
              <a
                href={CASE_STUDY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink-2 transition hover:text-brand-400"
              >
                {t("footer.caseStudy")}
              </a>
              <a
                href={`mailto:${AUTHOR.email}?subject=${encodeURIComponent(
                  "Full-stack engagement — via Conforma",
                )}`}
                className="inline-flex items-center gap-2 font-semibold text-brand-400 transition hover:text-brand-300"
              >
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                </span>
                {t("footer.hireCta")}
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
            <p>{t("footer.rights", { year })}</p>
            <p className="max-w-md leading-relaxed">{t("footer.disclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
