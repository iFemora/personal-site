// Re-encodes gallery JPEGs to the house standard (2000px long edge,
// mozjpeg q80). Dimensions never grow, so content JSON stays valid;
// run it after dropping new frames into public/gallery/.
//
//   node scripts/optimize-gallery.mjs            # only files over 450 KB
//   node scripts/optimize-gallery.mjs --all      # every JPEG
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "gallery");
const LONG_EDGE = 2000;
const QUALITY = 80;
const THRESHOLD = 450 * 1024;
const all = process.argv.includes("--all");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.jpe?g$/i.test(entry.name)) out.push(p);
  }
  return out;
}

let before = 0;
let after = 0;
let touched = 0;
for (const file of walk(ROOT)) {
  const size = fs.statSync(file).size;
  if (!all && size <= THRESHOLD) continue;
  const meta = await sharp(file).metadata();
  const long = Math.max(meta.width ?? 0, meta.height ?? 0);
  const buf = await sharp(file)
    .rotate()
    .resize(long > LONG_EDGE ? { width: LONG_EDGE, height: LONG_EDGE, fit: "inside" } : undefined)
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  if (buf.length >= size) continue;
  fs.writeFileSync(file, buf);
  before += size;
  after += buf.length;
  touched++;
  console.log(
    `${path.relative(ROOT, file)}  ${(size / 1024) | 0} KB → ${(buf.length / 1024) | 0} KB`
  );
}
console.log(
  `${touched} file(s), ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`
);
