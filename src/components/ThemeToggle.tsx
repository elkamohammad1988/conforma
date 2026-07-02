"use client";

/**
 * Theme toggle — a professional sun ⇄ moon control that lives in the chrome on
 * every page (marketing top-nav and in-product topbar). The two glyphs are
 * stacked and cross-fade with a rotate + scale, so the switch reads as one
 * object turning, not two icons swapping. The visible glyph is the *destination*
 * (a sun while dark → "go light"; a moon while light → "go dark"), reinforced by
 * the tooltip and the localised `aria-label`.
 */

import { useTheme } from "@/lib/theme";
import { useI18n } from "@/i18n/I18nProvider";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-full w-full"
    >
      <circle cx="12" cy="12" r="4.1" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4l1.4-1.4M18 6l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-full w-full"
    >
      <path d="M20.5 14.2A8.2 8.2 0 1 1 10.3 3.6a6.4 6.4 0 0 0 10.2 10.6Z" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, toggle } = useTheme();
  const { t } = useI18n();
  const label = isDark ? t("themeToggle.toLight") : t("themeToggle.toDark");

  return (
    <button
      type="button"
      onClick={toggle}
      data-tip={label}
      aria-label={label}
      title={label}
      className={`tip relative grid h-9 w-9 place-items-center rounded-lg text-ink-3 transition hover:bg-ink/[0.04] hover:text-ink ${className}`}
    >
      <span className="relative block h-[18px] w-[18px]">
        <span
          className={`absolute inset-0 transition-all duration-500 [transition-timing-function:var(--ease-out-quint)] ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-50 opacity-0"
          }`}
        >
          <SunIcon />
        </span>
        <span
          className={`absolute inset-0 transition-all duration-500 [transition-timing-function:var(--ease-out-quint)] ${
            isDark
              ? "rotate-90 scale-50 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        >
          <MoonIcon />
        </span>
      </span>
    </button>
  );
}
