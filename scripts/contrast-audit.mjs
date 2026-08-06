#!/usr/bin/env node
/* Contrast audit — WCAG 2.2 AA, every palette, both schemes.
   Usage: npm run audit:contrast

   Parses the light/dark pairs from packages/femora-ds/tokens.css (house)
   and src/app/palettes.css (guest palettes), then checks the pairs the
   site actually renders as text or interactive color:

     FAIL if below —
       foreground on background   ≥ 4.5  (body text)
       muted on background        ≥ 4.5  (secondary text, mono labels)
       accent-* on background     ≥ 4.5  (links, eyebrows, active states)
       background on accent-*     ≥ 3.0  (icons on accent-filled buttons)

     WARN only —
       text colors on the washed background (the .accent-wash layer mixes
       the accent into the paper at --wash%; strongest at the top of the
       page, gone by 55% down). Warned not failed because the wash is a
       gradient: text rarely sits at its strongest point.

   Conformance note: WCAG applies to every state the site ships, so all
   8 palettes x 2 schemes x 7 accents must pass — a user on any theme is
   entitled to a readable page there (docs/accessibility.md).

   The fix for a failure is Radix discipline: swap the hue, never the
   step (palettes use Radix step 11 for text accents, step 12 foreground,
   step 2 background). See src/app/palettes.css header. */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokensCss = readFileSync(
  resolve(root, "packages/femora-ds/tokens.css"),
  "utf8"
);
const palettesCss = readFileSync(resolve(root, "src/app/palettes.css"), "utf8");

/* ── color math (WCAG 2.x relative luminance) ─────────────────────── */

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v =
    h.length === 3
      ? h.split("").map((c) => parseInt(c + c, 16))
      : [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return v;
}

function luminance([r, g, b]) {
  const lin = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(hexA, hexB) {
  const la = luminance(hexToRgb(hexA));
  const lb = luminance(hexToRgb(hexB));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/* color-mix(in srgb, accent W%, transparent) over background:
   channel-wise gamma-space mix, like the browser does. */
function mixOver(accentHex, bgHex, weight) {
  const a = hexToRgb(accentHex);
  const b = hexToRgb(bgHex);
  const m = a.map((c, i) => Math.round(c * weight + b[i] * (1 - weight)));
  return "#" + m.map((c) => c.toString(16).padStart(2, "0")).join("");
}

/* ── parse the pair declarations ──────────────────────────────────── */

function parsePairs(cssBlock) {
  const pairs = {};
  for (const m of cssBlock.matchAll(/--([ld])-([a-z-]+):\s*([^;]+);/g)) {
    const [, scheme, name, raw] = m;
    const value = raw.trim().split("/*")[0].trim();
    (pairs[name] ??= {})[scheme] = value;
  }
  return pairs;
}

const rootBlock = tokensCss.match(/:root\s*\{([\s\S]*?)\n\}/)[1];
const house = parsePairs(rootBlock);

const palettes = { house };
for (const m of palettesCss.matchAll(
  /html\[data-palette="([a-z]+)"\]\s*\{([\s\S]*?)\n\}/g
)) {
  const [, name, block] = m;
  // Guest palettes override pairs; anything unset falls back to house.
  palettes[name] = { ...house, ...parsePairs(block) };
}

/* ── the audit ────────────────────────────────────────────────────── */

const ACCENTS = [
  "accent-home",
  "accent-work",
  "accent-writing",
  "accent-notes",
  "accent-tennis",
  "accent-gallery",
  "accent-love",
];

const failures = [];
const warnings = [];
let checks = 0;

function check(kind, palette, scheme, label, fg, bg, min) {
  checks++;
  const ratio = contrast(fg, bg);
  const line = `${palette}/${scheme}  ${label}  ${ratio.toFixed(2)}:1 (needs ${min}:1)`;
  if (ratio < min) (kind === "fail" ? failures : warnings).push(line);
}

for (const [name, p] of Object.entries(palettes)) {
  for (const scheme of ["l", "d"]) {
    const bg = p.background[scheme];
    const washPct = parseFloat((p.wash ?? house.wash)[scheme]) / 100;

    check("fail", name, scheme, "foreground on background", p.foreground[scheme], bg, 4.5);
    check("fail", name, scheme, "muted on background", p.muted[scheme], bg, 4.5);

    for (const a of ACCENTS) {
      const accent = p[a][scheme];
      check("fail", name, scheme, `${a} on background`, accent, bg, 4.5);
      check("fail", name, scheme, `background on ${a} (icon)`, bg, accent, 3.0);

      if (washPct > 0) {
        const washedBg = mixOver(accent, bg, washPct);
        check("warn", name, scheme, `foreground on ${a}-washed bg`, p.foreground[scheme], washedBg, 4.5);
        check("warn", name, scheme, `muted on ${a}-washed bg`, p.muted[scheme], washedBg, 4.5);
        check("warn", name, scheme, `${a} on ${a}-washed bg`, accent, washedBg, 4.5);
      }
    }
  }
}

/* ── report ───────────────────────────────────────────────────────── */

console.log(`contrast audit — ${Object.keys(palettes).length} palettes x 2 schemes, ${checks} checks\n`);

if (warnings.length) {
  console.log(`WARN (${warnings.length}) — text over the accent wash at full strength:`);
  for (const w of warnings) console.log("  " + w);
  console.log("");
}

if (failures.length) {
  console.log(`FAIL (${failures.length}):`);
  for (const f of failures) console.log("  " + f);
  process.exit(1);
} else {
  console.log("PASS — every text pair clears WCAG 2.2 AA in every palette and scheme.");
}
