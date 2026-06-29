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
      className={`flex flex-col items-center rounded-2xl border border-dashed border-line-2 bg-surface-2/60 px-6 py-16 text-center ${className}`}
    >
      {icon && (
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface-2 text-brand-400">
          {icon}
        </div>
      )}
      <p className="text-lg font-semibold tracking-tight text-ink">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-2">
          {description}
        </p>
      )}
      {action && (
        <Link href={action.href} className="btn btn-primary mt-6">
          {action.label}
        </Link>
      )}
    </div>
  );
}
