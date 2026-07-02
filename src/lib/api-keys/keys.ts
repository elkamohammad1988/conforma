/**
 * API key generation + hashing. Uses Web Crypto so it runs in any runtime
 * (Node, edge). The plaintext key is returned to the caller once and never
 * stored; only its SHA-256 hash is persisted.
 *
 * Format: `cfm_` + 32 base64url chars (24 random bytes). The stored `key_prefix`
 * is the first 12 chars, enough to identify a key in the UI without revealing it.
 */

const PREFIX = "cfm_";

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** A fresh plaintext API key. Show once; store only its hash. */
export function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return PREFIX + base64url(bytes);
}

/** SHA-256 hex of a key — the value persisted and matched on. */
export async function hashApiKey(key: string): Promise<string> {
  const data = new TextEncoder().encode(key);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The identifying, non-secret prefix stored alongside the hash. */
export function keyPrefix(key: string): string {
  return key.slice(0, 12);
}

/** Extract a `cfm_...` bearer token from an Authorization header, if present. */
export function parseBearerKey(header: string | null): string | null {
  const m = (header ?? "").match(/^Bearer\s+(cfm_[A-Za-z0-9_-]{16,})$/);
  return m ? m[1] : null;
}
