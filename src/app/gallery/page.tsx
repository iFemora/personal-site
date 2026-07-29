import type { Metadata } from "next";
import { getPhotos, getArt, getBooks } from "@/lib/gallery";
import GalleryBrowser from "@/components/GalleryBrowser";
import {
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs, artwork, and the bookshelf of Femi Siji-Kenneth.",
};

// Rendered per request so every visit reshuffles the frames — the
// contact sheet should never hang the same way twice.
export const dynamic = "force-dynamic";

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GalleryPage() {
  const photos = shuffle(getPhotos());
  const art = shuffle(getArt());
  const books = shuffle(getBooks());

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Gallery", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["Proof I go outside — and, occasionally, stay in and draw."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <GalleryBrowser photos={photos} art={art} books={books} />
    </main>
  );
}
