import Link from "next/link";
import type { Metadata } from "next";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";
import { getStudio } from "@/lib/studio";
import VideoEmbed from "@/components/VideoEmbed";

export const metadata: Metadata = {
  title: "Reel",
  description:
    "Film and creative direction by Femi Siji-Kenneth: a student documentary and motion work with Addict Creative.",
  alternates: { canonical: "/studio/reel" },
};

const words = ["one", "two", "three", "four", "five", "six", "seven"];

export default function ReelPage() {
  const studio = getStudio();
  const count = studio.pieces.length;

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Reel", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={[studio.tagline]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Index</span> — {words[count - 1] ?? count}{" "}
            pieces
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <div className="space-y-5">
            {studio.intro.map((p) => (
              <p key={p} className="text-lg leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      <div className="space-y-20 sm:space-y-28">
        {studio.pieces.map((piece, i) => (
          <article
            key={piece.id}
            id={piece.id}
            className="grid scroll-mt-24 gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12"
          >
            <Reveal>
              <div>
                <p
                  aria-hidden
                  className="wonk font-serif text-6xl italic leading-none text-rule sm:text-7xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  {piece.kind}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-muted">
                  {piece.meta.map((m) => (
                    <span key={m} className="block">
                      {m}
                    </span>
                  ))}
                </p>
                <p className="mt-4 font-serif text-sm italic text-foreground">
                  {piece.role}
                </p>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.05}>
                <h2 className="wonk font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                  {piece.title}
                  {piece.subtitle && (
                    <span className="block font-normal italic text-muted">
                      {piece.subtitle}
                    </span>
                  )}
                </h2>
                <p className="mt-4 max-w-[640px] text-lg leading-relaxed">
                  {piece.body}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                {piece.video ? (
                  <VideoEmbed
                    id={piece.id}
                    video={piece.video}
                    title={piece.title}
                    poster={piece.poster}
                  />
                ) : null}
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <div className="max-w-[560px]">
                    {piece.caption && (
                      <p className="font-serif text-sm italic leading-snug text-muted">
                        {piece.caption}
                      </p>
                    )}
                    {piece.credits && (
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                        {piece.credits}
                      </p>
                    )}
                  </div>
                  {piece.link && (
                    <a
                      href={piece.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent underline underline-offset-4 hover:no-underline"
                    >
                      {piece.link.label} ↗
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
          </article>
        ))}
      </div>

      <DrawnRule className="my-14 sm:my-20" />

      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <Link
            href="/studio"
            className="text-accent underline underline-offset-4 hover:no-underline"
          >
            ← The whole studio
          </Link>
        </p>
      </Reveal>
    </main>
  );
}
