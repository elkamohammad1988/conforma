"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Reveals its children with a subtle slide-up the first time they scroll into
 * view. Progressive enhancement done properly: the hidden starting state lives in
 * a CSS rule gated on the `.js` class (set on <html> before first paint), so
 * crawlers and no-JS visitors always get the fully-rendered content, JS visitors
 * never see a flash of it, and there is no layout shift. The animation is skipped
 * entirely for users who prefer reduced motion.
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
      data-reveal
      data-shown={shown ? "true" : "false"}
      className={`reveal ${className} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
