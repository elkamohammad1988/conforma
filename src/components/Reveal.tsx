"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Reveals its children with a subtle slide-up the first time they scroll into
 * view. Progressive enhancement: content is fully visible if JS never runs, and
 * the animation is skipped entirely for users who prefer reduced motion.
 *
 * The IntersectionObserver is wired through a callback ref rather than an effect,
 * so state only ever updates from a callback (never synchronously in an effect
 * body) and the observer is torn down deterministically when the node unmounts.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in milliseconds. */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const [shown, setShown] = useState(false);
  const cleanup = useRef<(() => void) | undefined>(undefined);

  const attach = useCallback((el: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = undefined;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    cleanup.current = () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={attach as React.Ref<never>}
      className={`${className} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
