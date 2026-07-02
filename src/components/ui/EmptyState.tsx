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
      className={`relative flex flex-col items-center overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 text-center shadow-[var(--shadow-card)] ${className}`}
    >
      {/* environmental light from above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-56"
        style={{
          background:
            "radial-gradient(55% 100% at 50% 0%, rgba(var(--accent),0.12), transparent 72%)",
        }}
      />
      <div className="relative flex flex-col items-center">
        {icon && (
          <div
            className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/10 text-brand-400"
            style={{ boxShadow: "var(--glow-brand)" }}
          >
            {icon}
          </div>
        )}
        <p className="text-xl font-semibold tracking-tight text-ink">{title}</p>
        {description && (
          <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-ink-2">
            {description}
          </p>
        )}
        {action && (
          <Link href={action.href} className="btn btn-primary mt-6">
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
