/**
 * Small, pure, framework-free validation/normalization helpers shared across
 * auth, team and billing server actions. Kept in one place (and unit-tested) so
 * the same rules aren't re-implemented — and can't drift — per call site.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** True for a syntactically plausible email. Case/whitespace-normalize first. */
export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

/**
 * Constrain a post-auth / callback redirect target to an internal, single-slash
 * path — the guard against open redirects (`//evil.com`, `https://…`). Anything
 * else falls back to `fallback`.
 */
export function sanitizeNextPath(
  next: string | null | undefined,
  fallback = "/dashboard",
): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

/**
 * Derive a URL-safe organization slug from a display name, matching the DB
 * `slug` CHECK (`^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$` territory): lowercase,
 * accents stripped, non-alphanumerics collapsed to single hyphens, trimmed.
 */
export function slugifyOrgName(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritical marks
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return base.length >= 1 ? base : "org";
}
