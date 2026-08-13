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
  alternates: { canonical: "/gallery" },
};

// Rendered per request so the contact sheet reshuffles on every visit.
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
  // Only the photo wall shuffles. The shelf and the drawings keep their
  // authored order — what I'm reading now should stay findable.
  const photos = shuffle(getPhotos());
  const art = getArt();
  const books = [...getBooks()].sort(
    (a, b) =>
      Number(b.status === "reading") - Number(a.status === "reading")
  );

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Gallery", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={[
          "Proof I go outside, and occasionally stay in to draw, read, or do nothing at all.",
        ]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <GalleryBrowser photos={photos} art={art} books={books} />
    </main>
  );
}
