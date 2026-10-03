// Browser smoke test, kept under a minute: every listed route renders,
// nothing errors in the console, nothing overflows a phone viewport,
// and the About timeline is visible with reduced motion on (it once was
// not; see CLAUDE.md, Motion system). Runs against a production build:
//
//   npm run build && npm run smoke
//
// SMOKE_URL points it at a running server instead of starting one.
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 3978;
const base = process.env.SMOKE_URL ?? `http://localhost:${PORT}`;

const routes = [
  "/",
  "/about",
  "/work",
  "/work/resolve",
  "/work/corporate-banking",
  "/work/farmcrowdy",
  "/work/airline-payments",
  "/work/product-team",
  "/cv",
  "/studio",
  "/studio/reel",
  "/writing",
  "/writing/rss.xml",
  "/follow-the-money",
  "/follow-the-money/simulator",
  "/field-notes",
  "/gallery",
  "/gallery/looking-closer",
  "/love",
  "/colophon",
  "/sitemap.xml",
  "/opengraph-image",
  "/work/resolve/opengraph-image",
];

// Noise that is not a site bug.
const ignore = [/_vercel\/insights/, /Failed to load resource/];

let server;
if (!process.env.SMOKE_URL) {
  server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: "ignore",
    // Own process group, so the kill below also reaches the next-server
    // child and a stale build never lingers on the port.
    detached: true,
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: "https://ifemora.dev" },
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
}

const failures = [];
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !ignore.some((re) => re.test(m.text())))
      errors.push(`${page.url()}: ${m.text().slice(0, 160)}`);
  });
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${String(e).slice(0, 160)}`));

  for (const route of routes) {
    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    if (!res || res.status() !== 200) failures.push(`${route}: HTTP ${res?.status()}`);
    if (route.endsWith(".xml") || route.includes("opengraph")) continue;
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    if (overflow) failures.push(`${route}: horizontal overflow at 390px`);
  }

  // 404 is ours, not the framework's.
  const nf = await page.goto(`${base}/this-page-does-not-exist`);
  if (nf?.status() !== 404) failures.push(`404 route returned ${nf?.status()}`);
  if (!(await page.locator("text=Not here.").count())) failures.push("custom 404 page missing");

  // Reduced motion must not hide the About timeline.
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(400);
  const visible = await page.$$eval(
    "ol li[id^=beat-]",
    (els) => els.filter((e) => getComputedStyle(e).opacity === "1").length
  );
  if (visible === 0) failures.push("about: no timeline beats visible under reduced motion");

  failures.push(...errors);
} finally {
  await browser.close();
  if (server) {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {}
  }
}

if (failures.length) {
  console.error(`smoke: ${failures.length} failure(s)\n- ` + failures.join("\n- "));
  process.exit(1);
}
console.log(`smoke: ${routes.length} routes ok`);
