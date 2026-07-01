import Link from "next/link";

/**
 * The Conforma mark — an abstract crimson "aperture": a hexagonal scanning ring
 * opened to the right, guarding a faceted core node. It reads as AI vision +
 * precision + a sealed, verified centre — without resorting to a shield or a
 * checkmark. Built from pure geometry so it stays crisp from 16px to billboard.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id="cf-mark"
          x1="5"
          y1="4"
          x2="27"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff6b74" />
          <stop offset="1" stopColor="#cf1622" />
        </linearGradient>
      </defs>
      {/* Hexagonal aperture, opened to the right */}
      <path
        d="M22 5.6 L10 5.6 L4 16 L10 26.4 L22 26.4"
        stroke="url(#cf-mark)"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Faceted core node */}
      <path d="M16 11.7 L20.3 16 L16 20.3 L11.7 16 Z" fill="url(#cf-mark)" />
      {/* Light catch */}
      <circle cx="14.5" cy="14.5" r="0.9" fill="#fff" fillOpacity="0.85" />
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
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 transition-transform duration-300 group-hover:scale-105" />
      <span className="text-lg font-semibold tracking-tight text-ink">Conforma</span>
      {withBadge && (
        <span className="ms-0.5 hidden rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-300 sm:inline">
          EU AI Act
        </span>
      )}
    </Link>
  );
}
