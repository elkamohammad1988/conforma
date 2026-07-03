/**
 * Premium portfolio demo video for Conforma.
 *
 * Drives a system-installed Chrome/Edge (no browser download) through a scripted,
 * SaaS-landing-style walkthrough — landing → theme switch → guided classifier →
 * dashboard → ⌘K command palette → system detail (live obligation toggle) →
 * readiness report → a responsive mobile beat — with a soft, on-brand cursor
 * overlay so every interaction reads clearly. Playwright records WebM; ffmpeg
 * (via ffmpeg-static, no system install) transcodes to a portfolio-ready MP4 and
 * grabs a poster frame.
 *
 * Usage:
 *   npm run build && npm start                 # serve a production build on :3000
 *   npm run demo:video                         # → docs/portfolio/conforma-demo.mp4
 *   DEMO_BASE_URL=https://conforma-ten.vercel.app npm run demo:video   # from prod
 */

import { chromium, devices } from "playwright-core";
import { mkdir, rm, readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import os from "node:os";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");

const BASE = process.env.DEMO_BASE_URL || process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const OUT_DIR = path.resolve("docs/portfolio");
const MP4 = path.join(OUT_DIR, "conforma-demo.mp4");
const POSTER = path.join(OUT_DIR, "conforma-demo-poster.png");
const W = 1280;
const H = 720;

/* --------------------------------- helpers -------------------------------- */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** A soft crimson pointer that follows real mouse events dispatched by Playwright. */
const CURSOR_INIT = `
(() => {
  if (window.__pwCursorInstalled) return;
  window.__pwCursorInstalled = true;
  const install = () => {
    if (document.getElementById('pw-cursor')) return;
    const style = document.createElement('style');
    style.textContent = \`
      #pw-cursor{position:fixed;top:0;left:0;z-index:2147483647;width:26px;height:26px;
        margin:0;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);
        background:radial-gradient(circle at 35% 30%, rgba(255,255,255,.95), rgba(245,51,63,.55) 55%, rgba(245,51,63,0) 72%);
        box-shadow:0 2px 10px rgba(0,0,0,.45), 0 0 22px rgba(245,51,63,.5);
        transition:width .12s ease, height .12s ease, opacity .2s ease;opacity:0}
      #pw-cursor.down{width:16px;height:16px}
      #pw-cursor.on{opacity:1}
      #pw-ripple{position:fixed;z-index:2147483646;width:14px;height:14px;border-radius:50%;
        pointer-events:none;transform:translate(-50%,-50%) scale(1);border:2px solid rgba(245,51,63,.9);
        opacity:0}
      @keyframes pw-rip{from{opacity:.7;transform:translate(-50%,-50%) scale(.4)}
        to{opacity:0;transform:translate(-50%,-50%) scale(2.6)}}
      #pw-ripple.go{animation:pw-rip .5s ease-out}
    \`;
    document.documentElement.appendChild(style);
    const c = document.createElement('div'); c.id = 'pw-cursor';
    const rp = document.createElement('div'); rp.id = 'pw-ripple';
    document.documentElement.appendChild(c);
    document.documentElement.appendChild(rp);
    const move = (e) => {
      c.classList.add('on');
      c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', move, true);
    window.addEventListener('pointermove', move, true);
    window.addEventListener('mousedown', (e) => {
      c.classList.add('down');
      rp.style.left = e.clientX + 'px'; rp.style.top = e.clientY + 'px';
      rp.classList.remove('go'); void rp.offsetWidth; rp.classList.add('go');
    }, true);
    window.addEventListener('mouseup', () => c.classList.remove('down'), true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
  // Next.js client transitions keep the same document; re-assert on nav just in case.
  const reassert = () => setTimeout(install, 30);
  window.addEventListener('popstate', reassert);
})();
`;

let mouse = { x: W / 2, y: H / 2 };

/** Ease the pointer to (x,y) so motion looks human, not teleported. */
async function glide(page, x, y, steps = 30) {
  await page.mouse.move(x, y, { steps });
  mouse = { x, y };
  await wait(120);
}

async function moveToLocator(page, locator, { steps = 30 } = {}) {
  const box = await locator.boundingBox();
  if (!box) return null;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await glide(page, x, y, steps);
  return { x, y };
}

async function clickLocator(page, locator, opts = {}) {
  // Glide the visible cursor to the target for the video, then use Playwright's
  // actionable click (auto-waits + hit-tests) so a shifted layout never misfires.
  await moveToLocator(page, locator, opts);
  await wait(160);
  await locator.click({ timeout: 6000 }).catch(() => {});
  await wait(280);
}

/** Smooth, paced scroll to an absolute Y using the page's own smooth behaviour. */
async function scrollTo(page, y, hold = 900) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "smooth" }), y);
  await wait(hold);
}

async function settle(page, text, timeout = 12000) {
  await page.waitForLoadState("networkidle").catch(() => {});
  if (text) {
    await page
      .getByText(text, { exact: false })
      .first()
      .waitFor({ timeout })
      .catch(() => {});
  }
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
}

async function pickBrowser() {
  const forced = process.env.PLAYWRIGHT_CHANNEL;
  for (const channel of forced ? [forced] : ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      /* next */
    }
  }
  throw new Error("No system Chrome or Edge found. Set PLAYWRIGHT_CHANNEL or install Chrome.");
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "ignore", "inherit"] });
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

/**
 * Duration (seconds) of the black segment at the very start of a raw clip.
 * Playwright begins recording the instant the context exists — before the first
 * page has painted — so a cold navigation shows as a black lead-in whose length
 * depends on load time. We detect it with ffmpeg's blackdetect and trim it at
 * transcode so the video always opens on content, never on a black hold.
 */
function detectLeadBlack(clip) {
  return new Promise((resolve) => {
    let err = "";
    const p = spawn(ffmpegPath, [
      "-i", clip, "-vf", "blackdetect=d=0.2:pix_th=0.10", "-an", "-f", "null", "-",
    ]);
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("error", () => resolve(0));
    p.on("close", () => {
      // Only trim black that begins at t=0; leave a 0.15s breath; cap at 10s.
      const m = err.match(/black_start:0(?:\.0+)?\s+black_end:([\d.]+)/);
      const end = m ? parseFloat(m[1]) : 0;
      resolve(Math.min(Math.max(end - 0.15, 0), 10));
    });
  });
}

/* ---------------------------------- story --------------------------------- */

async function recordDesktop(browser, tmpDir) {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    locale: "en-US",
    colorScheme: "dark",
    recordVideo: { dir: tmpDir, size: { width: W, height: H } },
  });
  await ctx.addInitScript(() => {
    try { localStorage.setItem("conforma.theme", "dark"); } catch {}
  });
  await ctx.addInitScript(CURSOR_INIT);
  const page = await ctx.newPage();

  // Seed the demo registry so every in-app screen is populated on first paint.
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await settle(page, "System Registry");
  await wait(500);

  // ---- 1. Landing hero ----------------------------------------------------
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await settle(page, "EU AI Act");
  await glide(page, W / 2, H / 2, 20);
  await wait(1500);
  await scrollTo(page, 520, 1100);   // product showcase
  await scrollTo(page, 1180, 1100);  // stat strip / interactive demo
  await scrollTo(page, 0, 900);      // back to hero

  // ---- 2. Dark → light → dark (theme) -------------------------------------
  const themeBtn = page.getByRole("button", { name: /light|dark/i }).first();
  if (await themeBtn.count()) {
    await clickLocator(page, themeBtn);
    await wait(1300);
    await clickLocator(page, themeBtn);
    await wait(900);
  }

  // ---- 3. Start free → guided classifier ----------------------------------
  const startBtn = page.getByRole("link", { name: /start free/i }).first();
  await clickLocator(page, startBtn);
  await settle(page, "Tell us about the system");
  await wait(700);
  const nameField = page.getByPlaceholder("e.g. CV screening model");
  if (await nameField.count()) {
    await moveToLocator(page, nameField);
    await nameField.click();
    await nameField.type("TalentRank — CV screening", { delay: 55 });
    await wait(1200); // provisional tier reacts
  }
  const continueBtn = page.getByRole("button", { name: /continue/i }).first();
  if (await continueBtn.count()) {
    await clickLocator(page, continueBtn);
    await wait(1100);
  }

  // ---- 4. Dashboard -------------------------------------------------------
  const overviewLink = page.getByRole("link", { name: /^overview$/i }).first();
  if (await overviewLink.count()) await clickLocator(page, overviewLink);
  else await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await settle(page, "System Registry");
  await wait(1000);
  await scrollTo(page, 380, 1300); // risk distribution + needs attention
  await scrollTo(page, 0, 900);

  // ---- 5. ⌘K command palette ---------------------------------------------
  await page.keyboard.press("Control+k");
  await wait(750);
  const palette = page.locator('[role="dialog"] input[role="combobox"]');
  if (await palette.count()) {
    await palette.type("Talent", { delay: 85 });
    await wait(1500); // hold on the open palette so the search UX reads clearly
  }
  await page.keyboard.press("Enter");

  // ---- 6. System detail — live obligation toggle --------------------------
  await settle(page, "Classification rationale");
  await wait(900);
  await scrollTo(page, 620, 1100); // obligations checklist into view
  const statusBtn = page
    .getByRole("button", { name: /to do|in progress/i })
    .first();
  if (await statusBtn.count()) {
    await clickLocator(page, statusBtn);
    await wait(900);
  }
  await scrollTo(page, 0, 800);

  // ---- 7. Readiness report ------------------------------------------------
  const reportsLink = page.getByRole("link", { name: /^reports?$/i }).first();
  if (await reportsLink.count()) {
    await clickLocator(page, reportsLink);
    await page.waitForURL(/\/report/, { timeout: 8000 }).catch(() => {});
  }
  if (!/\/report/.test(page.url())) {
    await page.goto(`${BASE}/report`, { waitUntil: "networkidle" });
  }
  await settle(page, "Readiness Report");
  await wait(1600);
  await scrollTo(page, 380, 1500); // executive summary → system register
  await scrollTo(page, 860, 1400); // deeper into the register table
  await scrollTo(page, 0, 1100);

  // ---- 8. Land back on the marketing hero for a clean close ---------------
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" }).catch(() => {});
  await settle(page, "EU AI Act");
  await glide(page, W / 2, H / 2 - 40, 18);
  await wait(1800);

  const video = page.video();
  await ctx.close();
  return video ? await video.path() : null;
}

async function recordMobile(browser, tmpDir) {
  const iphone = devices["iPhone 13 Pro"];
  const ctx = await browser.newContext({
    ...iphone,
    locale: "en-US",
    colorScheme: "dark",
    recordVideo: { dir: tmpDir, size: { width: iphone.viewport.width, height: iphone.viewport.height } },
  });
  await ctx.addInitScript(() => {
    try { localStorage.setItem("conforma.theme", "dark"); } catch {}
  });
  await ctx.addInitScript(CURSOR_INIT);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await wait(700);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await settle(page, "EU AI Act");
  await wait(1400);
  // Open the mobile nav for a clear responsive beat, hold, then close.
  const burger = page.getByRole("button", { name: /menu/i }).first();
  if (await burger.count()) {
    await burger.click().catch(() => {});
    await wait(1800);
    await burger.click().catch(() => {});
    await wait(500);
  }
  // A gentle scroll to show the responsive product mockup stacks cleanly.
  await page.evaluate(() => window.scrollTo({ top: 520, behavior: "smooth" }));
  await wait(1600);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await wait(900);
  const video = page.video();
  await ctx.close();
  return video ? await video.path() : null;
}

/* ---------------------------------- main ---------------------------------- */

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const tmpDir = path.join(os.tmpdir(), "conforma-demo-clips");
  await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  await mkdir(tmpDir, { recursive: true });

  const browser = await pickBrowser();
  console.log(`▶ Recording demo against ${BASE}`);

  const desktopRaw = await recordDesktop(browser, tmpDir);
  console.log(`  ✓ desktop clip: ${desktopRaw}`);
  let mobileRaw = null;
  try {
    mobileRaw = await recordMobile(browser, tmpDir);
    console.log(`  ✓ mobile clip:  ${mobileRaw}`);
  } catch (e) {
    console.warn(`  ! mobile clip skipped — ${e.message.split("\n")[0]}`);
  }
  await browser.close();

  if (!desktopRaw) throw new Error("no desktop video was produced");

  // Trim any cold-load black lead-in so the video opens on content, not a hold.
  const leadDesktop = await detectLeadBlack(desktopRaw);
  const leadMobile = mobileRaw ? await detectLeadBlack(mobileRaw) : 0;
  if (leadDesktop > 0.2) console.log(`  ✂ trimming ${leadDesktop.toFixed(2)}s black lead-in (desktop)`);
  if (leadMobile > 0.2) console.log(`  ✂ trimming ${leadMobile.toFixed(2)}s black lead-in (mobile)`);

  // Transcode: desktop is the master; pad the mobile clip to 16:9 and append it.
  console.log("▶ Transcoding with ffmpeg…");
  if (mobileRaw) {
    await run(ffmpegPath, [
      "-y",
      "-i", desktopRaw,
      "-i", mobileRaw,
      "-filter_complex",
      // trim each clip's cold-load black, normalise both to 1280x720@30, pad the
      // portrait mobile clip on a dark bed, then concatenate.
      `[0:v]trim=start=${leadDesktop},setpts=PTS-STARTPTS,scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x07070b,setsar=1,fps=30[v0];` +
      `[1:v]trim=start=${leadMobile},setpts=PTS-STARTPTS,scale=-2:${H},pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x07070b,setsar=1,fps=30[v1];` +
      `[v0][v1]concat=n=2:v=1:a=0,format=yuv420p,fade=t=in:st=0:d=0.5[v]`,
      "-map", "[v]",
      "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-movflags", "+faststart",
      MP4,
    ]);
  } else {
    await run(ffmpegPath, [
      "-y",
      "-i", desktopRaw,
      "-vf", `trim=start=${leadDesktop},setpts=PTS-STARTPTS,scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x07070b,setsar=1,fps=30,format=yuv420p,fade=t=in:st=0:d=0.5`,
      "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-movflags", "+faststart",
      MP4,
    ]);
  }
  console.log(`  ✓ ${MP4}`);

  // Poster frame ~2.5s in (settled on the hero).
  await run(ffmpegPath, ["-y", "-ss", "2.5", "-i", MP4, "-frames:v", "1", "-update", "1", POSTER]).catch(() => {});
  console.log(`  ✓ ${POSTER}`);

  await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  console.log("✔ Demo video ready");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
