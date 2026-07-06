/**
 * Transactional email — a thin, dependency-free Resend integration.
 *
 * Uses Resend's REST API directly (no SDK) so there is zero bundle cost and no
 * install step. Gated on `RESEND_API_KEY` + `EMAIL_FROM`: when either is unset
 * (Demo Mode, or a self-host without email) `sendEmail` returns `{skipped:true}`
 * and callers degrade gracefully — an action never fails because email did.
 *
 * NOTE: this covers app-owned transactional mail (team invites, and any future
 * receipts/notifications). Auth emails (signup verification, password reset) are
 * sent by Supabase Auth — configure a custom SMTP provider there for production
 * deliverability (see docs). "Requires operator configuration."
 */

import "server-only";
import { logger } from "@/lib/observability";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export type SendResult =
  | { ok: true; id: string | null }
  | { ok: false; skipped: true }
  | { ok: false; error: string };

/**
 * Send one transactional email. Never throws — returns a discriminated result so
 * best-effort callers can log without breaking the user flow. `fetchImpl` is
 * injectable for tests.
 */
export async function sendEmail(
  msg: EmailMessage,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) return { ok: false, skipped: true };

  try {
    const res = await fetchImpl(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      logger.warn("email.send failed", { status: res.status, detail: detail.slice(0, 300) });
      return { ok: false, error: `resend_${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id ?? null };
  } catch (error) {
    logger.warn("email.send threw", { error: String(error) });
    return { ok: false, error: "network" };
  }
}
