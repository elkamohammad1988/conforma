"use client";

import { useEffect, useRef } from "react";

/**
 * Accessible confirmation dialog — the premium replacement for the browser's
 * native `confirm()`. Dimmed, blurred backdrop over a raised glass panel; focus
 * is trapped inside while open, Escape and backdrop-click cancel, and focus is
 * restored to the trigger on close. Body scroll is locked so the page behind
 * doesn't drift. Copy is passed in already-translated, so it stays i18n/RTL
 * correct and the component carries no strings of its own.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "default",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Keep the latest onCancel without making it an effect dependency, so the
  // focus-trap / scroll-lock setup runs only on the open→close transition.
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  });

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    // Focus the non-destructive action first so an eager Enter can't confirm.
    const raf = requestAnimationFrame(() => cancelRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancelRef.current();
        return;
      }
      if (e.key === "Tab") {
        const nodes = panelRef.current?.querySelectorAll<HTMLElement>("button");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] grid place-items-center p-4"
      style={{ background: "rgba(4,4,7,0.62)", backdropFilter: "blur(3px)" }}
      onMouseDown={onCancel}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={description ? "confirm-desc" : undefined}
        onMouseDown={(e) => e.stopPropagation()}
        className="panel-raised animate-pop w-full max-w-md rounded-2xl p-6 text-start"
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
              tone === "danger"
                ? "border-danger-500/30 bg-danger-500/12 text-danger-400"
                : "border-brand-500/30 bg-brand-500/12 text-brand-400"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="confirm-title"
              className="text-lg font-semibold tracking-tight text-ink"
            >
              {title}
            </h2>
            {description && (
              <p
                id="confirm-desc"
                className="mt-1.5 text-sm leading-relaxed text-ink-2"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button ref={cancelRef} onClick={onCancel} className="btn btn-secondary">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${tone === "danger" ? "btn-danger" : "btn-primary"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
