"use client";

import { useEffect, useRef, useState } from "react";

// Ease-out quint — a fast start that decelerates into a soft settle, matching
// the app's `--ease-out-quint` motion language. Never linear.
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/**
 * A number that assembles to life: animates 0 → `to` on mount with an ease-out
 * settle, so a KPI reads as *arriving* rather than snapping in. Details:
 *
 * - **Accessible.** The animating digits are `aria-hidden`; a visually-hidden
 *   copy carries the final value, so assistive tech announces the real number
 *   once, not every frame.
 * - **Respects motion preference.** With `prefers-reduced-motion` it renders the
 *   final value immediately — no animation.
 * - **Hydration-safe.** Initial state is the final value, so server and first
 *   client render agree wherever this is used.
 * - **Re-render stable.** `format` is read through a ref, so the count-up only
 *   (re)starts when `to` changes — typing in a filter above it won't reset it.
 */
export function CountUp({
  to,
  format = (n) => String(Math.round(n)),
  durationMs = 900,
  className,
}: {
  to: number;
  format?: (n: number) => string;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(() => format(to));
  const formatRef = useRef(format);
  const rafRef = useRef<number | null>(null);

  // Keep the latest formatter available to the running animation without listing
  // it as an effect dependency — a new inline `format` each parent render must
  // not restart the count-up. Synced in an effect (never written during render).
  useEffect(() => {
    formatRef.current = format;
  });

  useEffect(() => {
    const fmt = formatRef.current;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || to === 0) {
      setDisplay(fmt(to));
      return;
    }
    // Start from zero *before* the browser paints the next frame; the card's own
    // fade/rise entrance masks the transition so there's no visible snap-back.
    setDisplay(fmt(0));
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / durationMs, 1);
      setDisplay(formatRef.current(to * easeOutQuint(p)));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [to, durationMs]);

  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{format(to)}</span>
    </span>
  );
}
