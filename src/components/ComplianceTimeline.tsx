"use client";

import { COMPLIANCE_DEADLINES, daysUntil } from "@/lib/eu-ai-act";
import { Countdown } from "@/components/Countdown";
import { useClientValue } from "@/lib/use-client-value";

/**
 * The Art. 113 staged-application timeline. Each milestone shows whether it is
 * already in force or still upcoming, with a live countdown. "Today" is resolved
 * on the client so the status is always current rather than frozen at build time.
 */
export function ComplianceTimeline() {
  const today = useClientValue(
    () => new Date().toISOString().slice(0, 10),
    null,
  );

  return (
    <ol className="relative space-y-6 sm:space-y-0">
      {/* Connecting line */}
      <div
        aria-hidden
        className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200 sm:hidden"
      />
      <div className="hidden sm:grid sm:grid-cols-5 sm:gap-4">
        {COMPLIANCE_DEADLINES.map((d) => {
          const inForce = today ? daysUntil(d.date, today) < 0 : false;
          return (
            <li key={d.id} className="relative">
              <div
                aria-hidden
                className="absolute left-0 right-0 top-[11px] h-px bg-slate-200"
              />
              <div className="relative flex justify-center">
                <span
                  className={`h-3.5 w-3.5 rounded-full ring-4 ring-white ${
                    inForce ? "bg-emerald-500" : "bg-brand-600"
                  }`}
                />
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="font-mono text-xs font-semibold text-slate-900">
                  {d.date}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-800">
                  {d.label}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {d.description}
                </p>
                <div className="mt-2.5">
                  {inForce ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      ● In force
                    </span>
                  ) : (
                    <Countdown
                      deadline={d.date}
                      className="text-[11px] font-semibold text-amber-600"
                    />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </div>

      {/* Mobile: vertical list */}
      <div className="space-y-5 sm:hidden">
        {COMPLIANCE_DEADLINES.map((d) => {
          const inForce = today ? daysUntil(d.date, today) < 0 : false;
          return (
            <li key={d.id} className="relative pl-10">
              <span
                className={`absolute left-2 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white ${
                  inForce ? "bg-emerald-500" : "bg-brand-600"
                }`}
              />
              <div className="font-mono text-xs font-semibold text-slate-900">
                {d.date}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-slate-800">
                {d.label}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {d.description}
              </p>
              <div className="mt-1.5">
                {inForce ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    ● In force
                  </span>
                ) : (
                  <Countdown
                    deadline={d.date}
                    className="text-[11px] font-semibold text-amber-600"
                  />
                )}
              </div>
            </li>
          );
        })}
      </div>
    </ol>
  );
}
