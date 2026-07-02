"use server";

/**
 * Authentication server actions (email + password via Supabase Auth).
 *
 * Each mutating action returns an `AuthActionState` consumed by `useActionState`
 * on the client, or performs a `redirect()` on success. Errors are returned as
 * i18n *subpaths* under the `auth.` namespace (e.g. `errors.invalidCredentials`,
 * `reset.invalidLink`) so the client localizes them with `t(\`auth.${error}\`)`
 * — the server never needs the active locale.
 *
 * No-ops safely in Demo Mode (no Supabase), though these are only reachable when
 * the auth pages render, which themselves only exist in Production Mode.
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requestOrigin } from "@/lib/request-origin";
import { isEmail, sanitizeNextPath } from "@/lib/validation";

export interface AuthActionState {
  /** i18n subpath under `auth.` (e.g. `errors.generic`), rendered by the client. */
  error?: string;
  /** Success flag for non-redirecting actions (e.g. reset-link requested). */
  ok?: boolean;
  /** Echoed back so the UI can show "we emailed {email}". */
  email?: string;
}

const MIN_PASSWORD = 8;

function parseEmail(value: FormDataEntryValue | null): string | null {
  const s = typeof value === "string" ? value.trim().toLowerCase() : "";
  return isEmail(s) ? s : null;
}

/** Map a Supabase auth error to an i18n subpath under `auth.`. */
function mapAuthError(error: { code?: string } | null): string {
  switch (error?.code) {
    case "invalid_credentials":
      return "errors.invalidCredentials";
    case "user_already_exists":
    case "email_exists":
      return "errors.emailInUse";
    case "weak_password":
      return "errors.weakPassword";
    case "email_not_confirmed":
      return "errors.emailNotConfirmed";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "errors.rateLimited";
    default:
      return "errors.generic";
  }
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "errors.generic" };

  const email = parseEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim().slice(0, 120);
  if (!email) return { error: "errors.generic" };
  if (password.length < MIN_PASSWORD) return { error: "errors.weakPassword" };

  const origin = await requestOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || null },
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent("/onboarding")}`,
    },
  });
  if (error) return { error: mapAuthError(error), email };

  // A session is returned only when email confirmation is disabled.
  if (data.session) redirect("/onboarding");
  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "errors.generic" };

  const email = parseEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const next = sanitizeNextPath(String(formData.get("next") ?? ""));
  if (!email || !password) return { error: "errors.invalidCredentials" };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: mapAuthError(error), email };

  redirect(next);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordResetAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const supabase = await createSupabaseServerClient();
  const email = parseEmail(formData.get("email"));
  // Always report success — never reveal whether an account exists.
  if (!supabase || !email) return { ok: true, email: email ?? "" };

  const origin = await requestOrigin();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent("/reset-password")}`,
  });
  return { ok: true, email };
}

export async function resendVerificationAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const supabase = await createSupabaseServerClient();
  const email = parseEmail(formData.get("email"));
  if (!supabase || !email) return { ok: true, email: email ?? "" };

  const origin = await requestOrigin();
  await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent("/onboarding")}`,
    },
  });
  return { ok: true, email };
}

export async function updatePasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "errors.generic" };

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  if (password.length < MIN_PASSWORD) return { error: "errors.weakPassword" };
  if (password !== confirm) return { error: "reset.mismatch" };

  // The recovery link must have established a session (via /auth/confirm).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "reset.invalidLink" };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: mapAuthError(error) };

  redirect("/dashboard");
}
