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

export default function GalleryPage() {
  const photos = getPhotos();
  const art = getArt();
  const books = getBooks();

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
