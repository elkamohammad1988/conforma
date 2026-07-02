"use client";

import { createContext, useContext } from "react";
import type { AiMode } from "@/lib/claude";

/**
 * Makes the AI generation mode (live vs demo) available to client components
 * without a network round-trip. The value is resolved once on the server (in the
 * root layout) and seeded here, so surfaces like the Demo Mode badge render it
 * synchronously instead of each fetching `/api/ai-status` on mount.
 */
const AiModeContext = createContext<AiMode>("demo");

export function AiModeProvider({
  initialMode,
  children,
}: {
  initialMode: AiMode;
  children: React.ReactNode;
}) {
  return (
    <AiModeContext.Provider value={initialMode}>
      {children}
    </AiModeContext.Provider>
  );
}

export function useAiMode(): AiMode {
  return useContext(AiModeContext);
}
