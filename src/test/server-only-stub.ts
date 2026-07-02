/**
 * Test-only stub for the `server-only` package.
 *
 * `server-only` throws unless resolved under the `react-server` condition (which
 * Next sets for server code). The vitest node runner has no such condition, so
 * it would resolve the throwing entry and break tests that import server modules
 * (e.g. `claude.ts`). vitest.config aliases `server-only` to this no-op instead.
 */
export {};
