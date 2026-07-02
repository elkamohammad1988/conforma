"use client";

/**
 * Carries the resolved session/tenant context (from the server guard) to client
 * components — the AppShell (real user + org) and the registry store (which org
 * to read/write). `null` in Demo Mode, so consumers fall back to demo behaviour.
 */

import { createContext, useContext, useEffect } from "react";
import type { ActiveContext } from "@/lib/auth/types";
import { configureRegistryBackend } from "@/lib/store";
import { identify } from "@/lib/analytics";

const SessionContext = createContext<ActiveContext | null>(null);

export function SessionProvider({
  value,
  children,
}: {
  value: ActiveContext | null;
  children: React.ReactNode;
}) {
  // Bridge the resolved session into the registry store: point it at the active
  // tenant (Supabase) or fall back to localStorage (Demo Mode).
  const orgId = value?.activeOrg?.id;
  const userId = value?.userId;
  const plan = value?.plan;
  useEffect(() => {
    configureRegistryBackend(orgId && userId ? { orgId, userId } : null);
    if (userId) identify(userId, { orgId, plan });
  }, [orgId, userId, plan]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

/** The active session, or `null` in Demo Mode / when signed out. */
export function useSession(): ActiveContext | null {
  return useContext(SessionContext);
}
