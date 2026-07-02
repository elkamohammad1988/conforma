"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { Countdown } from "@/components/Countdown";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AlertsMenu } from "@/components/AlertsMenu";
import { CommandPalette, OPEN_COMMAND_PALETTE } from "@/components/CommandPalette";
import { DOCS_URL } from "@/lib/site";
import { useI18n } from "@/i18n/I18nProvider";

/* ----------------------------------------------------------------------------
   Hand-drawn icon set — 1.6 stroke, consistent with the rest of the product.
   -------------------------------------------------------------------------- */
type IconProps = { className?: string };
const I = ({ d, className = "h-[18px] w-[18px]" }: IconProps & { d: string }) => (
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
    {d.split("|").map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

const OverviewIcon = (p: IconProps) => (
  <I {...p} d="M4 4h7v7H4zM4 15h7v5H4zM15 4h5v5h-5zM15 13h5v7h-5z" />
);
const ClassifyIcon = (p: IconProps) => (
  <I
    {...p}
    d="M4 7V5a1 1 0 0 1 1-1h2|M20 7V5a1 1 0 0 0-1-1h-2|M4 17v2a1 1 0 0 0 1 1h2|M20 17v2a1 1 0 0 0-1 1h-2|M7 12h10|M9.5 9 7 12l2.5 3"
  />
);
const ReportIcon = (p: IconProps) => (
  <I
    {...p}
    d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z|M14 3v4h4|M9 13h6|M9 17h4"
  />
);
const SettingsIcon = (p: IconProps) => (
  <I
    {...p}
    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M19.4 13.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V20a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.7-1.1l-.1.1A2 2 0 1 1 4.4 16l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.2A1.6 1.6 0 0 0 4.4 6l-.1-.1A2 2 0 1 1 7.1 3l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 20.6 5l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1z"
  />
);
const SearchIcon = (p: IconProps) => (
  <I {...p} d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z|M20.5 20.5 16 16" />
);
const HelpIcon = (p: IconProps) => (
  <I
    {...p}
    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3|M12 17h.01"
  />
);

const NAV = [
  { href: "/dashboard", key: "overview", Icon: OverviewIcon },
  { href: "/classify", key: "classify", Icon: ClassifyIcon },
  { href: "/report", key: "reports", Icon: ReportIcon },
] as const;

/** EU AI Act — high-risk obligations apply from 2 August 2026 (Art. 113). */
const HIGH_RISK_DEADLINE = "2026-08-02";

function sectionKeyFor(pathname: string): { eyebrow: string; title: string } {
  if (pathname.startsWith("/classify"))
    return { eyebrow: "app.breadcrumb.assessment", title: "app.breadcrumb.classifyTitle" };
  if (pathname.startsWith("/report"))
    return { eyebrow: "app.breadcrumb.reporting", title: "app.breadcrumb.reportTitle" };
  if (pathname.startsWith("/systems"))
    return { eyebrow: "app.breadcrumb.registry", title: "app.breadcrumb.systemDetail" };
  if (pathname.startsWith("/settings"))
    return { eyebrow: "app.account", title: "app.settings" };
  return { eyebrow: "app.breadcrumb.workspace", title: "app.breadcrumb.overview" };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, formatDate } = useI18n();
  const pathname = usePathname() ?? "/dashboard";
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const section = sectionKeyFor(pathname);
  const highRiskDate = formatDate(HIGH_RISK_DEADLINE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="app-canvas min-h-screen lg:flex">
      {/* ------------------------------- Sidebar ------------------------------ */}
      <aside className="sticky top-0 z-30 hidden h-screen w-[16.5rem] shrink-0 flex-col border-e border-line bg-paper/60 px-4 pb-5 pt-5 backdrop-blur-xl lg:flex print:hidden">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
          <LogoMark className="h-8 w-8" />
          <span className="text-[1.05rem] font-semibold tracking-tight text-ink">
            Conforma
          </span>
        </Link>

        <nav className="mt-7 flex flex-col gap-1">
          <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            {t("app.workspace")}
          </p>
          {NAV.map(({ href, key, Icon }) => (
            <Link
              key={href}
              href={href}
              data-active={isActive(href)}
              aria-current={isActive(href) ? "page" : undefined}
              className="navlink"
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {t(`app.nav.${key}`)}
            </Link>
          ))}

          <p className="mt-5 px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            {t("app.account")}
          </p>
          <Link
            href="/settings"
            data-active={isActive("/settings")}
            aria-current={isActive("/settings") ? "page" : undefined}
            className="navlink"
          >
            <SettingsIcon className="h-[18px] w-[18px] shrink-0" />
            {t("app.settings")}
          </Link>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="navlink"
          >
            <HelpIcon className="h-[18px] w-[18px] shrink-0" />
            {t("app.helpDocs")}
          </a>
        </nav>

        {/* Deadline widget — the regulatory clock, always in view. */}
        <div className="mt-auto rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-surface-2 text-brass-600">
              <I
                d="M8 2v3|M16 2v3|M4 8h16|M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
                className="h-4 w-4"
              />
            </span>
            <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-3">
              {t("app.complianceClock")}
            </div>
          </div>
          <p className="mt-3 text-[1.4rem] font-semibold leading-none tracking-tight text-ink">
            <Countdown deadline={HIGH_RISK_DEADLINE} className="" />
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            {t("app.untilHighRisk")}{" "}
            <span className="font-medium text-ink">{highRiskDate}</span>.
          </p>
        </div>

        {/* Account */}
        <div className="mt-3 flex items-center gap-3 rounded-2xl px-1.5 py-1.5">
          <Avatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {t("app.accountName")}
            </p>
            <p className="truncate text-xs text-ink-3">{t("app.accountPlan")}</p>
          </div>
          <Link
            href="/settings"
            className="tip rounded-lg p-1.5 text-ink-3 transition hover:bg-ink/[0.04] hover:text-ink"
            data-tip={t("app.accountSettings")}
            aria-label={t("app.accountSettings")}
          >
            <SettingsIcon className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </aside>

      {/* ------------------------------ Main column --------------------------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-paper/70 px-4 backdrop-blur-xl sm:px-6 print:hidden">
          {/* Mobile brand */}
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <LogoMark className="h-7 w-7" />
            <span className="font-semibold tracking-tight text-ink">Conforma</span>
          </Link>

          {/* Breadcrumb (desktop) */}
          <div className="hidden items-center gap-2 text-sm lg:flex">
            <span className="text-ink-3">{t(section.eyebrow)}</span>
            <I d="M9 6l6 6-6 6" className="h-3.5 w-3.5 text-line-2 rtl:-scale-x-100" />
            <span className="font-semibold text-ink">{t(section.title)}</span>
          </div>

          <div className="ms-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE))}
              data-tip={t("commandPalette.trigger")}
              aria-label={t("commandPalette.trigger")}
              className="tip inline-flex items-center gap-2 rounded-lg p-2 text-ink-3 transition hover:bg-ink/[0.04] hover:text-ink sm:border sm:border-line sm:bg-surface-2 sm:px-2.5 sm:py-1.5"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
              <span className="hidden text-xs sm:inline">
                {t("commandPalette.trigger")}
              </span>
              <kbd className="hidden rounded border border-line px-1 font-mono text-[10px] text-ink-3 sm:inline">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <LanguageSwitcher />
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-tip={t("app.helpDocs")}
              aria-label={t("app.helpAria")}
              className="tip rounded-lg p-2 text-ink-3 transition hover:bg-ink/[0.04] hover:text-ink"
            >
              <HelpIcon />
            </a>
            <AlertsMenu />
            <div className="ms-1 lg:hidden">
              <Avatar />
            </div>
          </div>
        </header>

        {/* Mobile section nav */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line bg-paper/60 px-3 py-2 lg:hidden print:hidden">
          {NAV.map(({ href, key, Icon }) => (
            <Link
              key={href}
              href={href}
              data-active={isActive(href)}
              aria-current={isActive(href) ? "page" : undefined}
              className="navlink whitespace-nowrap"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {t(`app.nav.${key}`)}
            </Link>
          ))}
        </div>

        <div key={pathname} className="flex-1 animate-fade-in">
          {children}
        </div>
      </div>

      <CommandPalette />
    </div>
  );
}

function Avatar() {
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-on-accent shadow-[0_4px_12px_-4px_rgba(var(--accent),0.55)] ring-1 ring-white/15"
      style={{
        background: "linear-gradient(140deg, var(--color-brand-400), var(--color-brand-600))",
      }}
    >
      ME
    </span>
  );
}
