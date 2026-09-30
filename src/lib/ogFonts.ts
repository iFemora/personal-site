import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* The share cards are rendered by Satori, which ships no serif or mono
   face, so "serif" silently became sans. These are static instances of
   the site's own faces (OFL), read at build time. Sizes are small
   because they are Latin subsets from Google Fonts. */
const dir = join(process.cwd(), "assets", "fonts", "og");

export async function ogFonts() {
  const [semiBold, italic, mono] = await Promise.all([
    readFile(join(dir, "Fraunces-SemiBold.ttf")),
    readFile(join(dir, "Fraunces-Italic.ttf")),
    readFile(join(dir, "IBMPlexMono-Regular.ttf")),
  ]);
  return [
    { name: "Fraunces", data: semiBold, style: "normal" as const, weight: 600 as const },
    { name: "Fraunces", data: italic, style: "italic" as const, weight: 400 as const },
    { name: "IBM Plex Mono", data: mono, style: "normal" as const, weight: 400 as const },
  ];
}
