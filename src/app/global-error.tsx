"use client";

import { useEffect } from "react";

/**
 * Global error boundary — the last line of defence. It only fires if the root
 * layout itself throws, so it renders *outside* the providers (no i18n, no
 * theme) and must supply its own <html>/<body>. Kept self-contained with inline
 * styles and an English fallback so it works even if the app CSS never loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[conforma] global error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#07070b",
          color: "#f3f2f6",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <main style={{ maxWidth: "28rem", textAlign: "center" }}>
          <div
            style={{
              width: "3.25rem",
              height: "3.25rem",
              margin: "0 auto 1.25rem",
              display: "grid",
              placeItems: "center",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ff7078",
              fontSize: "1.5rem",
              fontWeight: 600,
            }}
            aria-hidden
          >
            !
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ margin: "0.5rem 0 0", color: "#a6a5b2", lineHeight: 1.6 }}>
            An unexpected error interrupted the application. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.75rem",
              cursor: "pointer",
              border: "1px solid transparent",
              borderRadius: "0.6rem",
              padding: "0.6rem 1.15rem",
              fontSize: "0.9rem",
              fontWeight: 560,
              color: "#fff",
              background: "linear-gradient(180deg, #f5414b, #e11d2a)",
              boxShadow: "0 8px 26px -8px rgba(225,29,42,0.6)",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "1.75rem", fontSize: "0.75rem", color: "#77767f" }}>
              Error reference:{" "}
              <span style={{ fontFamily: "ui-monospace, monospace" }}>
                {error.digest}
              </span>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
