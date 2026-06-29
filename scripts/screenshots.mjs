/**
 * Reproducible screenshot capture for the Conforma catalog/portfolio package.
 *
 * Drives a system-installed Chrome/Edge (no browser download) via playwright-core
 * against a running Conforma server, and writes retina (2x) PNGs to
 * docs/screenshots. The registry seeds itself in localStorage on first paint, so
 * the dashboard, report and system-detail shots are fully reproducible with zero
 * backend, credentials or manual setup.
 *
 * Usage:
 *   1. npm run build && npm start      # serve a production build on :3000
 *   2. npm run screenshots             # capture all eight shots
 *
 * Env:
 *   SCREENSHOT_BASE_URL  default http://localhost:3000
 *   PLAYWRIGHT_CHANNEL   force a browser channel (chrome | msedge)
 */

import { chromium, devices } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const OUT = path.resolve("docs/screenshots");
const DESKTOP = { width: 1440, height: 900 };

/** Desktop pages — captured in one shared context so the seed + banner persist. */
const DESKTOP_SHOTS = [
  { name: "landing", path: "/", wait: "EU AI Act compliance" },
  {
    name: "classify",
    path: "/classify",
    wait: "Tell us about the system",
    async prep(page) {
      // Fill the name so the live "Provisional tier" + Continue read as active.
      await page.getByPlaceholder("e.g. CV screening model").fill("CV screening model");
      await page.waitForTimeout(150);
    },
  },
  { name: "dashboard", path: "/dashboard", wait: "System Registry" },
  { name: "report", path: "/report", wait: "Compliance Readiness Report" },
  { name: "pricing", path: "/pricing", wait: "compliance retainer" },
  { name: "security", path: "/security", wait: "compliant too" },
];

async function pickChannel() {
  const forced = process.env.PLAYWRIGHT_CHANNEL;
  const candidates = forced ? [forced] : ["chrome", "msedge"];
  for (const channel of candidates) {
    try {
      const browser = await chromium.launch({ channel, headless: true });
      return { browser, channel };
    } catch {
      /* try the next channel */
    }
  }
  throw new Error(
    "No system Chrome or Edge found. Set PLAYWRIGHT_CHANNEL or install Chrome.",
  );
}

async function settle(page, text) {
  await page.waitForLoadState("networkidle").catch(() => {});
  if (text) {
    await page.getByText(text, { exact: false }).first().waitFor({ timeout: 15000 }).catch(() => {});
  }
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(500);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const { browser, channel } = await pickChannel();
  console.log(`▶ Capturing against ${BASE} via ${channel}`);

  // ---- Desktop: one context so the localStorage seed persists across pages ----
  const ctx = await browser.newContext({
    viewport: DESKTOP,
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const page = await ctx.newPage();

  // Prime the registry seed (runs client-side when localStorage is empty).
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await settle(page, "System Registry");

  for (const shot of DESKTOP_SHOTS) {
    await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle" });
    await settle(page, shot.wait);
    if (shot.prep) await shot.prep(page);
    const file = path.join(OUT, `${shot.name}.png`);
    await page.screenshot({ path: file });
    console.log(`  ✓ ${shot.name}.png`);
  }

  // ---- System detail: resolve the high-risk seed id from localStorage ----
  const detailId = await page.evaluate(() => {
    try {
      const raw = localStorage.getItem("conforma.systems.v1");
      if (!raw) return null;
      const list = JSON.parse(raw);
      const high = list.find((s) => s?.result?.tier === "high");
      return (high ?? list[0])?.id ?? null;
    } catch {
      return null;
    }
  });
  if (detailId) {
    await page.goto(`${BASE}/systems/${detailId}`, { waitUntil: "networkidle" });
    await settle(page, "Classification rationale");
    await page.screenshot({ path: path.join(OUT, "system-detail.png") });
    console.log("  ✓ system-detail.png");
  } else {
    console.warn("  ! could not resolve a seeded system id — skipped system-detail");
  }

  await ctx.close();

  // ---- Mobile: landing hero on a retina phone viewport ----
  const mobile = await browser.newContext({
    ...devices["iPhone 13 Pro"],
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const mpage = await mobile.newPage();
  await mpage.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await settle(mpage, "EU AI Act compliance");
  await mpage.screenshot({ path: path.join(OUT, "mobile.png") });
  console.log("  ✓ mobile.png");
  await mobile.close();

  await browser.close();
  console.log("✔ Done — 8 screenshots written to docs/screenshots/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
