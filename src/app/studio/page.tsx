import Link from "next/link";
import type { Metadata } from "next";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";
import { getStudio } from "@/lib/studio";
import { getPhotos } from "@/lib/gallery";
import { getHomepageWriting, formatPostDate } from "@/lib/writing";
import Filmstrip from "@/components/Filmstrip";
import ExternalArrow from "@/components/ExternalArrow";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "The other kind of work by Femi Siji-Kenneth: film and creative direction, essays, and photographs.",
  alternates: { canonical: "/studio" },
};

function RoomHeader({
  index,
  title,
  line,
}: {
  index: string;
  title: string;
  line: string;
}) {
  return (
    <Reveal>
      <div>
        <p
          aria-hidden
          className="wonk font-serif text-6xl italic leading-none text-rule sm:text-7xl"
        >
          {index}
        </p>
        <h2 className="wonk mt-4 font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 font-serif text-base italic leading-snug text-muted">
          {line}
        </p>
      </div>
    </Reveal>
  );
}

export default function StudioPage() {
  const studio = getStudio();
  const posters = studio.pieces.map((p) => ({ id: p.id, ...p.poster }));
  const years = studio.pieces
    .map((p) => parseInt(p.meta[0] ?? "", 10))
    .filter((y) => !Number.isNaN(y));
  const span =
    years.length > 0
      ? `${Math.min(...years)}–${String(Math.max(...years)).slice(-2)}`
      : "";
  const photos = getPhotos().slice(0, 5);
  const photoCount = getPhotos().length;
  const writing = getHomepageWriting(3);

  const rowClass =
    "grid scroll-mt-24 gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12";

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Studio", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={["Still. In motion."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Rooms</span> — three
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            Film, essays, and photographs. The product work lives on{" "}
            <Link href="/work" className="link-swipe text-accent">
              Work
            </Link>
            . This is the other kind.
          </p>
        </Reveal>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      <div className="space-y-20 sm:space-y-28">
        {/* Reel */}
        <section id="reel" className={rowClass}>
          <RoomHeader
            index="01"
            title="Reel"
            line="Film and documentary production, creative direction, design."
          />
          <Filmstrip
            href="/studio/reel"
            frames={posters}
            aspect="video"
            title="Reel"
            tagline={studio.tagline}
            meta={`${studio.pieces.length} pieces · ${span}`}
            event={{ name: "studio_room_open", label: "reel" }}
            delay={0.05}
          />
        </section>

        {/* Writing */}
        <section id="writing" className={rowClass}>
          <RoomHeader
            index="02"
            title="Writing"
            line="Essays from the long way around."
          />
          <Reveal delay={0.05}>
            <ol className="border-t border-rule">
              {writing.map((item) => {
                const isExternal = item.type === "external";
                const href = isExternal ? item.href : `/writing/${item.slug}`;
                const inner = (
                  <span className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <span className="font-serif text-xl leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent">
                      {item.title}
                      {isExternal && (
                        <ExternalArrow className="ml-1 text-muted" />
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                      {formatPostDate(item.date)}
                    </span>
                  </span>
                );
                return (
                  <li key={href} className="border-b border-rule">
                    {isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={href} className="group block">
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em]">
              <Link
                href="/writing"
                className="text-accent underline underline-offset-4 hover:no-underline"
              >
                All the writing →
              </Link>
            </p>
          </Reveal>
        </section>

        {/* Gallery */}
        <section id="gallery" className={rowClass}>
          <RoomHeader
            index="03"
            title="Gallery"
            line="Proof I go outside, and occasionally stay in to draw, read, or do nothing at all."
          />
          <Filmstrip
            href="/gallery"
            frames={photos}
            title="Gallery"
            tagline="the contact sheet, the drawings, and the shelf"
            meta={`${photoCount} frames · fresh order on every visit`}
            event={{ name: "studio_room_open", label: "gallery" }}
            delay={0.05}
          />
        </section>
      </div>
    </main>
  );
}
