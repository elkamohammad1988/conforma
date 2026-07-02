"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Toast system — one lightweight, dependency-free primitive for transient
 * feedback (save, delete, copy, errors). Toasts are enqueued with an
 * already-translated message so the primitive stays i18n/RTL-agnostic, auto
 * -dismiss, stack bottom-anchored, and announce politely (errors assertively)
 * to assistive tech. The provider lives above the router outlet, so a toast
 * raised just before `router.push` survives the client navigation.
 */

type Tone = "success" | "error" | "info";

interface ToastRecord {
  id: number;
  message: string;
  tone: Tone;
}

interface ToastApi {
  /** Show a toast with an already-translated message. Defaults to success. */
  toast: (message: string, tone?: Tone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const DURATION_MS = 3800;
const MAX_VISIBLE = 4;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message: string, tone: Tone = "success") => {
      const id = (nextId.current += 1);
      setToasts((list) => [...list, { id, message, tone }].slice(-MAX_VISIBLE));
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), DURATION_MS),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      for (const timer of map.values()) clearTimeout(timer);
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

const TONE_STYLES: Record<Tone, { ring: string; icon: string; d: string }> = {
  success: {
    ring: "text-ok-400",
    icon: "ok",
    d: "M20 6 9 17l-5-5",
  },
  error: {
    ring: "text-danger-400",
    icon: "error",
    d: "M12 8v5|M12 16h.01|M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  },
  info: {
    ring: "text-brand-400",
    icon: "info",
    d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M12 11v5|M12 8h.01",
  },
};

function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: ToastRecord[];
  onDismiss: (id: number) => void;
}) {
  const { t } = useI18n();
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={t("toast.region")}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-4 print:hidden sm:items-end sm:p-6"
    >
      {toasts.map((toast) => {
        const tone = TONE_STYLES[toast.tone];
        return (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className="panel-raised animate-pop pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl p-3.5 ps-4"
          >
            <span className={`mt-0.5 shrink-0 ${tone.ring}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-5 w-5"
              >
                {tone.d.split("|").map((p, i) => (
                  <path key={i} d={p} />
                ))}
              </svg>
            </span>
            <p className="min-w-0 flex-1 text-sm leading-snug text-ink">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label={t("toast.dismiss")}
              className="-me-1 -mt-1 shrink-0 rounded-md p-1 text-ink-3 transition hover:bg-ink/[0.06] hover:text-ink"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-4 w-4"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
