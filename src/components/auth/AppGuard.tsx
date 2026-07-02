/**
 * App-route guard + session seeding (server component).
 *
 * Wraps every in-product route. In Demo Mode it renders the shell exactly as
 * before, with a null session (localStorage backend). In Production Mode it
 * requires a signed-in user (→ /login) with an organization (→ /onboarding),
 * then hands the resolved context to the client via SessionProvider so the
 * AppShell shows the real user/org and the store reads the right tenant.
 *
 * The proxy already redirects unauthenticated users; the checks here are a
 * server-side backstop and, crucially, where the org requirement is enforced.
 */

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getActiveContext } from "@/lib/auth/context";
import { AppShell } from "@/components/AppShell";
import { SessionProvider } from "@/components/auth/SessionProvider";

export async function AppGuard({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <SessionProvider value={null}>
        <AppShell>{children}</AppShell>
      </SessionProvider>
    );
  }

  const ctx = await getActiveContext();
  if (!ctx) redirect("/login");
  if (!ctx.activeOrg) redirect("/onboarding");

  return (
    <SessionProvider value={ctx}>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  );
}
