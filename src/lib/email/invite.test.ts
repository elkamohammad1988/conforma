import { describe, it, expect } from "vitest";
import { buildInviteEmail } from "./invite";

const BASE = {
  to: "invitee@example.com",
  orgName: "Acme AI",
  inviterName: "Dana Lee",
  role: "member" as const,
  acceptUrl: "https://conforma-ten.vercel.app/accept-invite?token=abc123",
};

describe("buildInviteEmail", () => {
  it("addresses the recipient and carries a descriptive subject", () => {
    const msg = buildInviteEmail(BASE);
    expect(msg.to).toBe("invitee@example.com");
    expect(msg.subject).toContain("Acme AI");
    expect(msg.subject).toContain("Dana Lee");
  });

  it("puts the accept URL in both the HTML and the plain-text body", () => {
    const msg = buildInviteEmail(BASE);
    expect(msg.text).toContain(BASE.acceptUrl);
    expect(msg.html).toContain(`href="${BASE.acceptUrl}"`);
  });

  it("reflects the invited role in the copy", () => {
    expect(buildInviteEmail({ ...BASE, role: "admin" }).text).toContain("an admin");
    expect(buildInviteEmail({ ...BASE, role: "member" }).text).toContain("a member");
  });

  it("HTML-escapes org and inviter names to prevent markup injection", () => {
    const msg = buildInviteEmail({
      ...BASE,
      orgName: '<script>alert(1)</script>',
      inviterName: 'A & B "Corp"',
    });
    expect(msg.html).not.toContain("<script>");
    expect(msg.html).toContain("&lt;script&gt;");
    expect(msg.html).toContain("&amp;");
    expect(msg.html).toContain("&quot;");
  });

  it("produces a self-contained HTML document", () => {
    const msg = buildInviteEmail(BASE);
    expect(msg.html).toMatch(/^<!doctype html>/i);
    expect(msg.html).toContain("Accept invitation");
  });
});
