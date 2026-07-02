"use client";

import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import { ArrowBackward } from "@/components/Arrow";
import { DemoModeBadge, AiSourceTag } from "@/components/DemoModeBadge";
import { Markdown } from "@/components/ui/Markdown";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  compliancePct,
  deleteSystem,
  setObligationState,
  useSystem,
  type ObligationState,
  type RegisteredSystem,
} from "@/lib/store";
import { useI18n } from "@/i18n/I18nProvider";
import { renderRationale } from "@/i18n/rationale";

const DOC_TYPES = [
  { id: "technical-documentation", key: "technical" },
  { id: "transparency-notice", key: "transparency" },
  { id: "conformity-declaration", key: "conformity" },
] as const;

export default function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, formatDate } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const system = useSystem(id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (system === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-44 rounded-2xl" />
        <Skeleton className="mt-8 h-5 w-48" />
        <Skeleton className="mt-3 h-28 rounded-xl" />
        <Skeleton className="mt-8 h-5 w-48" />
        <Skeleton className="mt-3 h-40 rounded-xl" />
      </div>
    );
  }

  if (system === null) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20">
        <EmptyState
          title={t("system.notFoundTitle")}
          description={t("system.notFoundBody")}
          action={{ href: "/dashboard", label: t("system.backToDashboard") }}
        />
      </div>
    );
  }

  const pct = compliancePct(system);
  const obligationsDone = system.result.obligations.filter(
    (o) => system.obligationStatus[o.id] === "done",
  ).length;

  const cycle = (obId: string) => {
    const order: ObligationState[] = ["todo", "in-progress", "done"];
    const current = system.obligationStatus[obId] ?? "todo";
    const next = order[(order.indexOf(current) + 1) % order.length];
    setObligationState(system.id, obId, next);
  };

  const stateLabel: Record<ObligationState, string> = {
    todo: t("system.states.todo"),
    "in-progress": t("system.states.inProgress"),
    done: t("system.states.done"),
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-3 hover:text-ink-2"
      >
        <ArrowBackward /> {t("system.backRegistry")}
      </Link>

      {/* Header */}
      <div className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-surface text-ink shadow-[var(--shadow-card)]">
        {/* lit by the system's own risk-tier colour */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 h-56 w-56 rounded-full"
          style={{
            insetInlineEnd: "-2.5rem",
            background: `radial-gradient(closest-side, color-mix(in srgb, var(--color-risk-${system.result.tier}) 20%, transparent), transparent 70%)`,
          }}
        />
        <div className="relative px-7 py-7">
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge tier={system.result.tier} />
            <h1 className="text-2xl font-semibold tracking-tight">{system.name}</h1>
            {system.result.isGPAI && (
              <span className="rounded-full bg-ink/10 px-2.5 py-1 text-xs font-medium text-brand-300">
                {t("system.plusGpai")}
              </span>
            )}
          </div>
          {system.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
              {system.description}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Meta
              label={t("system.meta.tier")}
              value={t(`domain.riskTiers.${system.result.tier}.label`)}
            />
            <Meta
              label={t("system.meta.role")}
              value={t(`domain.roles.${system.answers.role}`)}
            />
            <Meta
              label={t("system.meta.owner")}
              value={system.owner || t("system.unassigned")}
            />
            <Meta
              label={t("system.meta.deadline")}
              value={
                <span className="flex items-center gap-2">
                  {formatDate(system.result.deadline.date, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  <Countdown
                    deadline={system.result.deadline.date}
                    className="text-brass-700"
                  />
                </span>
              }
            />
          </div>
        </div>
        {/* Compliance bar */}
        <div className="border-t border-line bg-ink/[0.04] px-7 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-2">{t("system.compliance")}</span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
            <div
              className={`h-full rounded-full transition-all ${
                pct === 100 ? "bg-ok-400" : "bg-brand-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rationale */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-3">
          {t("system.rationaleTitle")}
        </h2>
        <ul className="mt-3 space-y-2">
          {system.result.rationale.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 rounded bg-brand-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-brand-400">
                {r.citation}
              </span>
              <span className="text-ink-2">{renderRationale(r, t)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Obligations checklist */}
      {system.result.obligations.length > 0 && (
        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-3">
                {t("system.obligationsTitle")}
              </h2>
              <p className="mt-1 text-xs text-ink-3">{t("system.obligationsHint")}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-ink-2 nums">
                {obligationsDone}/{system.result.obligations.length}
              </span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-quint)]"
                  style={{
                    width: `${(obligationsDone / system.result.obligations.length) * 100}%`,
                    background:
                      "linear-gradient(90deg, var(--color-ok-500), var(--color-ok-400))",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {system.result.obligations.map((o) => {
              const state = system.obligationStatus[o.id] ?? "todo";
              const dot =
                state === "done"
                  ? "bg-ok-400"
                  : state === "in-progress"
                    ? "bg-warn-400"
                    : "bg-ink-3/50";
              return (
                <div
                  key={o.id}
                  className={`group flex items-start justify-between gap-4 rounded-xl border bg-surface px-4 py-3.5 transition-colors hover:bg-surface-2/40 ${
                    state === "done"
                      ? "border-ok-500/25"
                      : state === "in-progress"
                        ? "border-warn-500/25"
                        : "border-line"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                      <span className="text-sm font-medium text-ink">
                        {t(`domain.obligations.${o.id}.title`)}
                      </span>
                      <span className="font-mono text-[11px] text-ink-3">
                        {o.citation}
                      </span>
                      <span className="rounded bg-ink/[0.04] px-1.5 py-0.5 text-[10px] font-medium uppercase text-ink-3">
                        {t(`domain.roles.${o.role}`)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink-3">
                      {t(`domain.obligations.${o.id}.description`)}
                    </p>
                  </div>
                  <button
                    onClick={() => cycle(o.id)}
                    aria-label={`${t(`domain.obligations.${o.id}.title`)} — ${stateLabel[state]}`}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      state === "done"
                        ? "border-ok-500/30 bg-ok-500/15 text-ok-400"
                        : state === "in-progress"
                          ? "border-warn-500/30 bg-warn-500/15 text-warn-400"
                          : "border-line-2 bg-ink/[0.04] text-ink-2 hover:text-ink"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                    {stateLabel[state]}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Document generation */}
      <DocSection system={system} />

      {/* Danger zone */}
      <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
        <Link
          href="/classify"
          className="text-sm font-medium text-brand-400 hover:underline"
        >
          + {t("system.classifyAnother")}
        </Link>
        <button
          onClick={() => setConfirmDelete(true)}
          className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-danger-400 transition hover:border-danger-500/30 hover:bg-danger-500/10"
        >
          {t("system.deleteSystem")}
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        tone="danger"
        title={t("system.deleteSystem")}
        description={t("system.deleteConfirm", { name: system.name })}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteSystem(system.id);
          toast(t("toast.deleted"));
          router.push("/dashboard");
        }}
      />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.1em] text-ink-3">{label}</div>
      <div className="mt-0.5 font-medium text-ink">{value}</div>
    </div>
  );
}

/* --------------------------------------------------------- Document section */

/** Print/Word stylesheet — kept compact and self-contained for portability. */
const EXPORT_CSS = `
  body { font-family: Georgia, 'Times New Roman', serif; color: #1e293b; line-height: 1.6; max-width: 46rem; margin: 2.5rem auto; padding: 0 1.5rem; }
  h1 { font-size: 1.6rem; } h2 { font-size: 1.2rem; margin-top: 1.6rem; } h3 { font-size: 1.02rem; }
  table { width: 100%; border-collapse: collapse; margin: 0.8rem 0; font-size: 0.85rem; }
  th, td { border: 1px solid #cbd5e1; padding: 0.4rem 0.6rem; text-align: left; vertical-align: top; }
  th { background: #f1f5f9; }
  blockquote { border-left: 3px solid #e11d2a; background: #fdeef0; padding: 0.6rem 0.9rem; margin: 0.8rem 0; }
  code { font-family: monospace; background: #f1f5f9; padding: 0.1rem 0.3rem; border-radius: 3px; }
  hr { border: 0; border-top: 1px solid #e2e8f0; margin: 1.2rem 0; }
`;

function DocSection({ system }: { system: RegisteredSystem }) {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [docs, setDocs] = useState<
    Record<string, { markdown: string; source: string }>
  >({});
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"preview" | "raw">("preview");
  const previewRef = useRef<HTMLDivElement>(null);

  const labelFor = (id: string) => {
    const dt = DOC_TYPES.find((d) => d.id === id);
    return dt ? t(`system.docs.types.${dt.key}.label`) : "document";
  };

  const generate = async (docType: string) => {
    setActive(docType);
    setView("preview");
    if (docs[docType]) return;
    setLoading(docType);
    try {
      const res = await fetch("/api/generate-doc", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          docType,
          systemName: system.name,
          description: system.description,
          organisation: system.owner,
          result: system.result,
          locale,
        }),
      });
      // A non-2xx response (429 throttled, 413 too long, 400/500) returns an
      // `{error}` body with no `markdown`. Reject it here so the catch renders a
      // friendly message instead of caching `{markdown: undefined}` — which is
      // truthy, so the early-return above would then serve the broken doc
      // forever, and <Markdown source={undefined}> would crash the route.
      if (!res.ok) throw new Error(`generate-doc failed: ${res.status}`);
      const data = await res.json();
      if (typeof data.markdown !== "string") {
        throw new Error("generate-doc: malformed response");
      }
      setDocs((d) => ({
        ...d,
        [docType]: { markdown: data.markdown, source: data.source },
      }));
    } catch {
      setDocs((d) => ({
        ...d,
        [docType]: {
          markdown: t("system.docs.couldNotGenerate"),
          source: "error",
        },
      }));
    } finally {
      // Only clear the indicator if *this* request is still the active one — a
      // slower earlier request must not switch off a later doc's spinner.
      setLoading((cur) => (cur === docType ? null : cur));
    }
  };

  const activeDoc = active ? docs[active] : null;
  const activeLabel = active ? labelFor(active) : "document";
  const fileBase = `${system.name}-${active}`.replace(/[^A-Za-z0-9-]+/g, "-");

  const download = (content: string, type: string, ext: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportWord = () => {
    const inner = previewRef.current?.innerHTML ?? "";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${activeLabel}</title><style>${EXPORT_CSS}</style></head><body>${inner}</body></html>`;
    download(html, "application/msword", "doc");
  };

  const exportPdf = () => {
    const inner = previewRef.current?.innerHTML ?? "";
    const win = window.open("", "_blank");
    if (!win) {
      toast(t("toast.exportBlocked"), "error");
      return;
    }
    win.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${fileBase}</title><style>${EXPORT_CSS}</style></head><body>${inner}<script>window.onload=function(){window.print()}<\/script></body></html>`,
    );
    win.document.close();
  };

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-3">
          {t("system.docs.title")}
        </h2>
        <DemoModeBadge />
      </div>
      <p className="mt-1 text-xs text-ink-3">{t("system.docs.hint")}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {DOC_TYPES.map((d) => {
          const isLoading = loading === d.id;
          return (
            <button
              key={d.id}
              onClick={() => generate(d.id)}
              aria-pressed={active === d.id}
              className={`flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-start text-sm transition ${
                active === d.id
                  ? "border-brand-400 bg-brand-500/10 ring-1 ring-brand-500/30"
                  : "border-line bg-surface hover:border-line-2"
              }`}
            >
              <span>
                <span className="block font-medium text-ink">
                  {t(`system.docs.types.${d.key}.label`)}
                </span>
                <span className="font-mono text-[11px] text-ink-3">
                  {t(`system.docs.types.${d.key}.cite`)}
                </span>
              </span>
              {isLoading && (
                <Spinner
                  className="h-4 w-4 shrink-0 text-brand-500"
                  label={t("common.loading")}
                />
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="flex items-center gap-2 border-b border-line bg-ink/[0.03] px-4 py-2.5 text-xs text-ink-3">
            <Spinner
              className="h-3.5 w-3.5 text-brand-500"
              label={t("common.loading")}
            />
            {t("system.docs.drafting", { label: labelFor(loading) })}
          </div>
          <div className="space-y-3 p-5">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="mt-4 h-3.5 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      )}

      {activeDoc && !loading && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink/[0.03] px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs">
              <AiSourceTag source={activeDoc.source} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* View toggle */}
              <div className="seg">
                {(["preview", "raw"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    data-active={view === v}
                    aria-pressed={view === v}
                    className="seg-item"
                  >
                    {v === "raw" ? t("system.docs.markdown") : t("system.docs.preview")}
                  </button>
                ))}
              </div>
              <span className="h-4 w-px bg-ink/10" aria-hidden />
              <button
                onClick={() => {
                  navigator.clipboard
                    .writeText(activeDoc.markdown)
                    .then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    })
                    .catch(() => toast(t("toast.copyFailed"), "error"));
                }}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-ink-3 transition hover:bg-ink/[0.04]"
              >
                {copied ? t("system.docs.copied") : t("system.docs.copy")}
              </button>
              <button
                onClick={() => download(activeDoc.markdown, "text/markdown", "md")}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-ink-3 transition hover:bg-ink/[0.04]"
              >
                .md
              </button>
              <button
                onClick={exportWord}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-ink-3 transition hover:bg-ink/[0.04]"
              >
                Word
              </button>
              <button
                onClick={exportPdf}
                className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-semibold text-on-accent transition hover:bg-brand-500"
              >
                PDF
              </button>
            </div>
          </div>

          {/* Rendered preview (always mounted so exports can read its HTML). */}
          <div
            ref={previewRef}
            className={`scrollbar-thin max-h-[32rem] overflow-y-auto px-6 py-5 ${
              view === "preview" ? "" : "hidden"
            }`}
          >
            <Markdown source={activeDoc.markdown} />
          </div>
          {/* Raw markdown */}
          {view === "raw" && (
            <div className="prose-doc scrollbar-thin max-h-[32rem] overflow-y-auto px-5 py-4 font-mono text-[13px] text-ink-2">
              {activeDoc.markdown}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
