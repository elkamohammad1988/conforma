"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useTheme, type Theme } from "@/lib/theme";
import {
  useSystems,
  clearAllSystems,
  resetToDemoData,
} from "@/lib/store";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useAiMode } from "@/components/AiModeProvider";
import { REPO_URL, DOCS_URL } from "@/lib/site";

/* Compact 1.6-stroke icons, consistent with the app chrome's hand-drawn set. */
function Icon({ d, className = "h-[18px] w-[18px]" }: { d: string; className?: string }) {
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
      {d.split("|").map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

const ICONS = {
  appearance: "M12 3v18|M12 3a9 9 0 0 1 0 18|M3 12h18",
  language:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M3 12h18|M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18",
  data: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z|M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6|M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
  about: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M12 11v5|M12 8h.01",
  external: "M14 5h5v5|M19 5l-8 8|M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4",
} as const;

/** A titled settings card with an icon, description and its control. */
function Section({
  icon,
  title,
  desc,
  children,
}: {
  icon: keyof typeof ICONS;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-ink-2">
          <Icon d={ICONS[icon]} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[0.95rem] font-semibold text-ink">{title}</h2>
          <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{desc}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function SettingsPanels({ version }: { version: string }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const mode = useAiMode();
  const { theme, setTheme } = useTheme();
  const systems = useSystems();
  const [confirm, setConfirm] = useState<null | "reset" | "clear">(null);

  const themes: { id: Theme; label: string }[] = [
    { id: "light", label: t("settings.appearance.light") },
    { id: "dark", label: t("settings.appearance.dark") },
  ];

  const doReset = () => {
    resetToDemoData();
    setConfirm(null);
    toast(t("settings.data.resetDone"));
  };
  const doClear = () => {
    clearAllSystems();
    setConfirm(null);
    toast(t("settings.data.clearDone"));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-ink-2">{t("settings.subtitle")}</p>
      </header>

      <div className="flex flex-col gap-4">
        {/* Appearance */}
        <Section
          icon="appearance"
          title={t("settings.appearance.title")}
          desc={t("settings.appearance.desc")}
        >
          <div
            className="seg"
            role="radiogroup"
            aria-label={t("settings.appearance.theme")}
          >
            {themes.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={theme === opt.id}
                data-active={theme === opt.id}
                onClick={() => setTheme(opt.id)}
                className="seg-item"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Language */}
        <Section
          icon="language"
          title={t("settings.language.title")}
          desc={t("settings.language.desc")}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-2">
              {t("settings.language.label")}
            </span>
            <LanguageSwitcher align="start" />
          </div>
        </Section>

        {/* Registry data */}
        <Section
          icon="data"
          title={t("settings.data.title")}
          desc={t("settings.data.desc")}
        >
          <p className="text-sm text-ink-2">
            {systems === null ? (
              <span className="skeleton inline-block h-4 w-40 align-middle" />
            ) : (
              <span className="font-medium text-ink">
                {t("settings.data.count", { count: systems.length })}
              </span>
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setConfirm("reset")}
            >
              {t("settings.data.reset")}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setConfirm("clear")}
              disabled={systems !== null && systems.length === 0}
            >
              {t("settings.data.clear")}
            </button>
          </div>
        </Section>

        {/* About */}
        <Section
          icon="about"
          title={t("settings.about.title")}
          desc={t("settings.about.desc")}
        >
          <dl className="divide-y divide-line text-sm">
            <Row label={t("settings.about.version")}>
              <span className="nums font-medium text-ink">v{version}</span>
            </Row>
            <Row label={t("settings.about.mode")}>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    mode === "live" ? "bg-ok-500" : "bg-brand-500"
                  }`}
                />
                <span className="font-medium text-ink">
                  {mode === "live"
                    ? t("ai.draftedByClaude")
                    : t("ai.demoBadge")}
                </span>
              </span>
            </Row>
            <Row label={t("settings.about.docs")}>
              <ExternalLink href={DOCS_URL} label={t("settings.about.docs")} />
            </Row>
            <Row label={t("settings.about.source")}>
              <ExternalLink href={REPO_URL} label={t("settings.about.source")} />
            </Row>
          </dl>
        </Section>
      </div>

      <ConfirmDialog
        open={confirm === "reset"}
        title={t("settings.data.confirmResetTitle")}
        description={t("settings.data.confirmResetBody")}
        confirmLabel={t("settings.data.reset")}
        cancelLabel={t("common.cancel")}
        onConfirm={doReset}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "clear"}
        tone="danger"
        title={t("settings.data.confirmClearTitle")}
        description={t("settings.data.confirmClearBody")}
        confirmLabel={t("settings.data.clear")}
        cancelLabel={t("common.cancel")}
        onConfirm={doClear}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-ink-2">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-medium text-brand-400 transition hover:text-brand-300"
    >
      {label}
      <Icon d={ICONS.external} className="h-3.5 w-3.5" />
    </a>
  );
}
