import Link from "next/link";

/** The Conforma mark: a compliance shield with a check — trust + verification. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="conforma-mark" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" stopColor="#6a72e6" />
          <stop offset="1" stopColor="#4f57d4" />
        </linearGradient>
      </defs>
      <path
        d="M16 1.6 27 5.2v9.1c0 7.3-4.6 12.9-11 16.1-6.4-3.2-11-8.8-11-16.1V5.2L16 1.6Z"
        fill="url(#conforma-mark)"
      />
      <path
        d="M10.5 16.2 14.4 20l7.3-7.6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  withBadge = true,
}: {
  className?: string;
  withBadge?: boolean;
}) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8" />
      <span className="text-lg font-semibold tracking-tight text-ink">
        Conforma
      </span>
      {withBadge && (
        <span className="ml-0.5 hidden rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-200 sm:inline">
          EU AI Act
        </span>
      )}
    </Link>
  );
}
