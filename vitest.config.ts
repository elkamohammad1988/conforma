import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` throws outside the react-server condition; stub it so node
      // tests can import server modules (claude.ts, api-guard.ts) directly.
      "server-only": fileURLToPath(
        new URL("./src/test/server-only-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    // The test runner must not pick up an Anthropic key, so Demo Mode is exercised.
    env: { ANTHROPIC_API_KEY: "" },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // Focus coverage on the logic layers (domain, security, i18n).
      include: ["src/lib/**", "src/i18n/**"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**", "src/**/*.d.ts"],
    },
  },
});
