"use client";

import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { useT } from "@/i18n/I18nProvider";

export default function NotFound() {
  const t = useT();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
        <LogoMark className="h-7 w-7" />
      </span>
      <div className="mt-6 text-5xl font-semibold tracking-tight text-ink-3 nums">
        {t("notFound.code")}
      </div>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        {t("notFound.title")}
      </h1>
      <p className="mt-2 text-ink-2">{t("notFound.body")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          {t("notFound.backHome")}
        </Link>
        <Link href="/classify" className="btn btn-secondary">
          {t("notFound.classify")}
        </Link>
      </div>
    </div>
  );
}
