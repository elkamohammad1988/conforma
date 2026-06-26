import Link from "next/link";

/**
 * A polished empty / zero-data state. Use a clear illustration glyph, a concise
 * headline, supporting copy, and a single primary action so the screen never
 * feels broken when there's nothing to show yet.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-16 text-center ${className}`}
    >
      {icon && (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
          {icon}
        </div>
      )}
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
