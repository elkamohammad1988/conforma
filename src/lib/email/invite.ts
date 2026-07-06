/**
 * Team-invitation email template.
 *
 * Pure, dependency-free builder: given the org, inviter and accept link it
 * returns the `{subject, html, text}` triple that `sendEmail` transports. Kept
 * separate from the provider so it is trivially unit-testable and carries no
 * network or env concerns. All interpolated, user-controlled values (org name,
 * inviter) are HTML-escaped — an invitation email must never let an org name
 * inject markup into the recipient's inbox.
 */

import type { EmailMessage } from "./provider";

/** Minimal HTML entity escaping for text interpolated into the email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface InviteEmailInput {
  /** Recipient address. */
  to: string;
  /** The organization the recipient is being invited into. */
  orgName: string;
  /** Display name (or email) of the person who sent the invite. */
  inviterName: string;
  /** Role the recipient will hold once they accept. */
  role: "admin" | "member";
  /** Absolute `/accept-invite?token=…` URL. */
  acceptUrl: string;
}

export function buildInviteEmail(input: InviteEmailInput): EmailMessage {
  const org = escapeHtml(input.orgName);
  const inviter = escapeHtml(input.inviterName);
  const roleLabel = input.role === "admin" ? "an admin" : "a member";
  const url = input.acceptUrl;

  const subject = `${input.inviterName} invited you to ${input.orgName} on Conforma`;

  const text = [
    `${input.inviterName} has invited you to join ${input.orgName} on Conforma as ${roleLabel}.`,
    "",
    "Conforma turns the EU AI Act into a guided compliance workflow.",
    "",
    "Accept the invitation:",
    url,
    "",
    "If you weren't expecting this, you can safely ignore this email.",
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#0b0b0f;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#15151b;border:1px solid #26262e;border-radius:16px;">
      <tr><td style="padding:32px 32px 24px;">
        <div style="font-size:14px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#e0483d;">Conforma</div>
        <h1 style="margin:16px 0 8px;font-size:22px;line-height:1.3;color:#f5f5f7;font-weight:600;">You're invited to ${org}</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#a9a9b2;">
          ${inviter} has invited you to join <strong style="color:#f5f5f7;">${org}</strong> on Conforma as ${roleLabel} — a guided workflow for EU AI Act compliance.
        </p>
        <a href="${url}" style="display:inline-block;background:#e0483d;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 24px;border-radius:10px;">Accept invitation</a>
        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6f6f79;">
          If the button doesn't work, copy this link into your browser:<br />
          <a href="${url}" style="color:#e0483d;word-break:break-all;">${url}</a>
        </p>
        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6f6f79;">
          If you weren't expecting this, you can safely ignore this email.
        </p>
      </td></tr>
    </table>
  </body>
</html>`;

  return { to: input.to, subject, html, text };
}
