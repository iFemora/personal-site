import type { Metadata } from "next";
import { getPhotos, getArt, getBooks } from "@/lib/gallery";
import GalleryGrid from "@/components/GalleryGrid";
import {
  Reveal,
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

      {/* Contact sheet — photographs */}
      <section className="mb-14 grid gap-6 sm:mb-16 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Contact sheet</span> —{" "}
            {photos.length === 0
              ? "in the darkroom"
              : `${photos.length} frames`}
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            {photos.length === 0 ? (
              <>
                The prints are still drying. Photographs land here soon
                &mdash; the good ones, eventually, once I stop second-guessing
                which are the good ones.
              </>
            ) : (
              <>
                Every frame sits faded until you give it some attention
                &mdash; hover to bring the colour back, click to see it full.
              </>
            )}
          </p>
        </Reveal>
      </section>

      {photos.length > 0 && <GalleryGrid frames={photos} prefix="FR" />}

      {/* Made — artwork */}
      {art.length > 0 && (
        <>
          <DrawnRule className="my-14 sm:my-20" />
          <section className="mb-14 grid gap-6 sm:mb-16 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
            <Reveal delay={0.05}>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span className="text-accent">Made</span> — {art.length} pieces
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed">
                Things I&apos;ve drawn and animated. They wait faded like
                everything else here &mdash; hover to wake the colour up.
              </p>
            </Reveal>
          </section>
          <GalleryGrid frames={art} prefix="MADE" />
        </>
      )}

      {/* Shelf — books, current and queued */}
      {books.length > 0 && (
        <>
          <DrawnRule className="my-14 sm:my-20" />
          <section className="mb-14 grid gap-6 sm:mb-16 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
            <Reveal delay={0.05}>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span className="text-accent">Shelf</span> — {books.length}{" "}
                spines
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed">
                Books I&apos;m reading, or circling before I commit. Covers
                for now; arguments about them later.
              </p>
            </Reveal>
          </section>
          <GalleryGrid frames={books} prefix="BK" dense />
        </>
      )}
    </main>
  );
}
