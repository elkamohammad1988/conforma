"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { useSystems, resetToDemoData } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { useToast } from "@/components/ui/Toast";
import { DOCS_URL } from "@/lib/site";

/** Custom event name the app-bar trigger dispatches to open the palette. */
export const OPEN_COMMAND_PALETTE = "conforma:command-palette";

interface Command {
  id: string;
  group: string;
  label: string;
  run: () => void;
}

/**
 * Command palette (⌘K / Ctrl+K). A fully client-side launcher: navigate, run
 * quick actions, or jump to any registered system. Implements the combobox +
 * listbox pattern — the input keeps focus and `aria-activedescendant` tracks the
 * highlighted option, so arrow-key navigation is announced to assistive tech.
 */
export function CommandPalette() {
  const { t } = useI18n();
  const router = useRouter();
  const systems = useSystems();
  const { toggle } = useTheme();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Global ⌘K / Ctrl+K toggle, plus the app-bar trigger's custom event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Reset in the event handler (not an effect) so each open starts clean.
        setQuery("");
        setActive(0);
        setOpen((o) => !o);
      }
    };
    const onOpen = () => {
      setQuery("");
      setActive(0);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
    };
  }, []);

  const commands = useMemo<Command[]>(() => {
    const nav = t("commandPalette.groups.navigate");
    const acts = t("commandPalette.groups.actions");
    const sys = t("commandPalette.groups.systems");
    const go = (href: string) => () => router.push(href);
    return [
      { id: "nav-dashboard", group: nav, label: t("app.nav.overview"), run: go("/dashboard") },
      { id: "nav-classify", group: nav, label: t("app.nav.classify"), run: go("/classify") },
      { id: "nav-report", group: nav, label: t("app.nav.reports"), run: go("/report") },
      { id: "nav-settings", group: nav, label: t("app.settings"), run: go("/settings") },
      { id: "act-new", group: acts, label: t("commandPalette.actions.newClassification"), run: go("/classify") },
      { id: "act-theme", group: acts, label: t("commandPalette.actions.toggleTheme"), run: () => toggle() },
      {
        id: "act-reset",
        group: acts,
        label: t("commandPalette.actions.resetDemo"),
        run: () => {
          resetToDemoData();
          toast(t("settings.data.resetDone"));
        },
      },
      {
        id: "act-docs",
        group: acts,
        label: t("commandPalette.actions.openDocs"),
        run: () => window.open(DOCS_URL, "_blank", "noopener,noreferrer"),
      },
      ...(systems ?? []).map((s) => ({
        id: `sys-${s.id}`,
        group: sys,
        label: s.name,
        run: go(`/systems/${s.id}`),
      })),
    ];
  }, [systems, t, router, toggle, toast]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // On open: remember focus, focus the input, lock scroll. No setState here —
  // open-time state resets live in the open handlers above so this effect only
  // syncs with external systems (the DOM), per react-hooks/set-state-in-effect.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  // Clamp at read time so a shrinking result list can never point past the end —
  // derived state, no effect required.
  const activeIndex = results.length ? Math.min(active, results.length - 1) : 0;

  const close = () => setOpen(false);
  const run = (cmd?: Command) => {
    if (!cmd) return;
    close();
    cmd.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[activeIndex]);
    } else if (e.key === "Tab") {
      // The input is the dialog's only tabbable node (options use
      // aria-activedescendant, not focus), so trap Tab here to satisfy
      // aria-modal — focus must not fall through to the page behind.
      e.preventDefault();
    }
  };

  const activeId = results[activeIndex] ? `cmdk-${results[activeIndex].id}` : undefined;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[85] flex justify-center p-4 pt-[12vh]"
      style={{ background: "rgba(5,5,8,0.6)", backdropFilter: "blur(3px)" }}
      onMouseDown={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("commandPalette.aria")}
        onMouseDown={(e) => e.stopPropagation()}
        className="panel-raised animate-pop h-fit w-full max-w-lg overflow-hidden rounded-2xl"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded
          aria-controls="cmdk-list"
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label={t("commandPalette.placeholder")}
          placeholder={t("commandPalette.placeholder")}
          className="w-full border-b border-line bg-transparent px-4 py-3.5 text-sm text-ink outline-none transition focus:ring-2 focus:ring-inset focus:ring-brand-500/50 placeholder:text-ink-3"
        />
        <ul
          id="cmdk-list"
          role="listbox"
          aria-label={t("commandPalette.aria")}
          className="scrollbar-thin max-h-[50vh] overflow-y-auto p-1.5"
        >
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-ink-3">
              {t("commandPalette.empty")}
            </li>
          )}
          {results.map((cmd, idx) => {
            const showGroup = idx === 0 || results[idx - 1].group !== cmd.group;
            return (
              <li key={cmd.id}>
                {showGroup && (
                  <div
                    role="presentation"
                    className="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3"
                  >
                    {cmd.group}
                  </div>
                )}
                <div
                  id={`cmdk-${cmd.id}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  data-active={idx === activeIndex}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => run(cmd)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink-2 data-[active=true]:bg-ink/[0.06] data-[active=true]:text-ink"
                >
                  {cmd.label}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
