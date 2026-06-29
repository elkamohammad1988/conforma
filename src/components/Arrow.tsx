/**
 * Direction-aware inline arrows. "Forward" points toward the end of the line,
 * so it flips automatically under RTL via the `rtl:` variant (keyed off the
 * `dir="rtl"` ancestor). Use these instead of bare "→"/"←" glyphs in copy.
 */

export function ArrowForward({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`inline-block rtl:-scale-x-100 ${className}`}>
      →
    </span>
  );
}

export function ArrowBackward({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`inline-block rtl:-scale-x-100 ${className}`}>
      ←
    </span>
  );
}
