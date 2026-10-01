// Prints /cv to public/cv/femi-siji-kenneth.pdf with headless Chromium,
// so the "Download as PDF" link hands recruiters a file instead of a
// print dialog. Run it after editing src/app/cv/page.tsx and commit the
// result:
//
//   npm run build && npm run cv:pdf
//
// It starts `next start` on a spare port unless CV_URL points at a
// running server. Needs the playwright devDependency and a Chromium
// (`npx playwright install chromium` once).
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const OUT = path.join(process.cwd(), "public", "cv", "femi-siji-kenneth.pdf");
const PORT = 3977;
const url = process.env.CV_URL ?? `http://localhost:${PORT}/cv`;

let server;
if (!process.env.CV_URL) {
  server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: "ignore",
    // Own process group, so the kill below also reaches the next-server
    // child and a stale build never lingers on the port.
    detached: true,
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: "https://ifemora.dev" },
  });
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
}

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await page.pdf({
    path: OUT,
    format: "Letter",
    printBackground: false,
    preferCSSPageSize: true,
  });
  await browser.close();
  const pages = (fs.readFileSync(OUT).toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`wrote ${path.relative(process.cwd(), OUT)} (${pages} page${pages === 1 ? "" : "s"})`);
} finally {
  if (server) {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {}
  }
}
