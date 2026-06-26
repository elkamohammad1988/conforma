"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import {
  compliancePct,
  deleteSystem,
  setObligationState,
  useSystem,
  type ObligationState,
  type RegisteredSystem,
} from "@/lib/store";
import { RISK_TIERS } from "@/lib/eu-ai-act";

const DOC_TYPES = [
  { id: "technical-documentation", label: "Technical Documentation", cite: "Annex IV / Art. 11" },
  { id: "transparency-notice", label: "Transparency Notice", cite: "Art. 50" },
  { id: "conformity-declaration", label: "Declaration of Conformity", cite: "Art. 47" },
] as const;

const STATE_LABEL: Record<ObligationState, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export default function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const system = useSystem(id);

  if (system === undefined) {
    return <div className="mx-auto max-w-4xl px-5 py-16 text-slate-400">Loading…</div>;
  }

  if (system === null) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold">System not found</h1>
        <p className="mt-2 text-slate-500">
          It may have been deleted or saved in another browser.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const meta = RISK_TIERS[system.result.tier];
  const pct = compliancePct(system);

  const cycle = (obId: string) => {
    const order: ObligationState[] = ["todo", "in-progress", "done"];
    const current = system.obligationStatus[obId] ?? "todo";
    const next = order[(order.indexOf(current) + 1) % order.length];
    // The store notifies subscribers, so `useSystem` re-renders with the update.
    setObligationState(system.id, obId, next);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        ← Registry
      </Link>

      {/* Header */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-ink text-white shadow-sm">
        <div className="px-7 py-7">
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge tier={system.result.tier} />
            <h1 className="text-2xl font-bold">{system.name}</h1>
            {system.result.isGPAI && (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-brand-200">
                + GPAI
              </span>
            )}
          </div>
          {system.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              {system.description}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Meta label="Tier" value={meta.label} />
            <Meta label="Role" value={system.answers.role} />
            <Meta label="Owner" value={system.owner || "Unassigned"} />
            <Meta
              label="Deadline"
              value={
                <span className="flex items-center gap-2">
                  {system.result.deadline.date}
                  <Countdown
                    deadline={system.result.deadline.date}
                    className="text-amber-300"
                  />
                </span>
              }
            />
          </div>
        </div>
        {/* Compliance bar */}
        <div className="border-t border-white/10 bg-white/5 px-7 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Compliance</span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${
                pct === 100 ? "bg-emerald-400" : "bg-brand-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rationale */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Classification rationale
        </h2>
        <ul className="mt-3 space-y-2">
          {system.result.rationale.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 rounded bg-brand-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-brand-700">
                {r.citation}
              </span>
              <span className="text-slate-700">{r.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Obligations checklist */}
      {system.result.obligations.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Obligations checklist
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Tap a status to cycle: To do → In progress → Done.
          </p>
          <div className="mt-3 space-y-2">
            {system.result.obligations.map((o) => {
              const state = system.obligationStatus[o.id] ?? "todo";
              return (
                <div
                  key={o.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">
                        {o.title}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {o.citation}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-500">
                        {o.role}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {o.description}
                    </p>
                  </div>
                  <button
                    onClick={() => cycle(o.id)}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      state === "done"
                        ? "bg-emerald-100 text-emerald-700"
                        : state === "in-progress"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {STATE_LABEL[state]}
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
      <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
        <Link
          href="/classify"
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          + Classify another system
        </Link>
        <button
          onClick={() => {
            if (confirm(`Delete "${system.name}" from the registry?`)) {
              deleteSystem(system.id);
              router.push("/dashboard");
            }
          }}
          className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete system
        </button>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 font-medium capitalize text-slate-100">{value}</div>
    </div>
  );
}

/* --------------------------------------------------------- Document section */

function DocSection({ system }: { system: RegisteredSystem }) {
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [docs, setDocs] = useState<
    Record<string, { markdown: string; source: string }>
  >({});
  const [copied, setCopied] = useState(false);

  const generate = async (docType: string) => {
    setActive(docType);
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
        }),
      });
      const data = await res.json();
      setDocs((d) => ({
        ...d,
        [docType]: { markdown: data.markdown, source: data.source },
      }));
    } catch {
      setDocs((d) => ({
        ...d,
        [docType]: {
          markdown: "Could not generate this document. Please try again.",
          source: "error",
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  const activeDoc = active ? docs[active] : null;

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Compliance documents
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Generate first-draft regulatory documents tailored to this system.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {DOC_TYPES.map((d) => (
          <button
            key={d.id}
            onClick={() => generate(d.id)}
            className={`rounded-lg border px-3.5 py-2 text-left text-sm transition ${
              active === d.id
                ? "border-brand-400 bg-brand-50 ring-1 ring-brand-300"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span className="block font-medium text-slate-800">{d.label}</span>
            <span className="font-mono text-[11px] text-slate-400">{d.cite}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-4 animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-400">
          Drafting {DOC_TYPES.find((d) => d.id === loading)?.label}…
        </div>
      )}

      {activeDoc && !loading && (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs">
              {activeDoc.source === "claude" ? (
                <span className="rounded bg-brand-100 px-1.5 py-0.5 font-medium text-brand-700">
                  ✨ Drafted by Claude
                </span>
              ) : activeDoc.source === "template" ? (
                <span className="rounded bg-slate-200 px-1.5 py-0.5 font-medium text-slate-500">
                  offline template — add ANTHROPIC_API_KEY for live drafting
                </span>
              ) : (
                <span className="text-red-500">error</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeDoc.markdown);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="rounded px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([activeDoc.markdown], {
                    type: "text/markdown",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${system.name}-${active}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                Download
              </button>
            </div>
          </div>
          <div className="prose-doc max-h-[28rem] overflow-y-auto px-5 py-4 font-mono text-[13px] text-slate-700">
            {activeDoc.markdown}
          </div>
        </div>
      )}
    </section>
  );
}
