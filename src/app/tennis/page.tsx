/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { getTennisEntries, formatTennisDate } from "@/lib/tennis";
import Reveal from "@/components/motion/Reveal";
import DrawnRule from "@/components/motion/DrawnRule";
import MaskedLines from "@/components/motion/MaskedLines";
import ProximityType from "@/components/motion/ProximityType";

export const metadata: Metadata = {
  title: "Tennis",
  description:
    "A tennis log — match notes, clips, and photographs from the court.",
};

export default function TennisPage() {
  const entries = getTennisEntries();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Tennis", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["The only remaining gladiator sport."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Log</span> — {entries.length}{" "}
            {entries.length === 1 ? "entry" : "entries"}
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            Match notes, clips, and photographs from the court. Played often,
            mastered never.
          </p>
        </Reveal>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      {entries.length === 0 ? (
        <p className="leading-relaxed text-muted">
          Nothing yet. First entry after the next session.
        </p>
      ) : (
        <ol className="space-y-14 sm:space-y-20">
          {entries.map((entry, i) => (
            <li key={entry.id}>
              <Reveal delay={Math.min(i, 2) * 0.08}>
                <article
                  id={entry.id}
                  className="grid scroll-mt-24 gap-4 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted sm:pt-1 sm:text-right">
                    {formatTennisDate(entry.date)}
                  </p>

                  <div>
                    {entry.title && (
                      <h2 className="font-serif text-2xl leading-snug tracking-tight">
                        {entry.title}
                      </h2>
                    )}

                    {entry.body &&
                      entry.body.split("\n\n").map((para, j) => (
                        <p
                          key={j}
                          className="mt-4 text-lg leading-relaxed first:mt-0 [h2+&]:mt-4"
                        >
                          {para}
                        </p>
                      ))}

                    {entry.image && (
                      <figure className="mt-6 first:mt-0">
                        <img
                          src={entry.image.src}
                          alt={entry.image.alt ?? entry.title ?? "Tennis"}
                          width={entry.image.width}
                          height={entry.image.height}
                          loading="lazy"
                          className="w-full rounded-sm"
                        />
                        {entry.image.caption && (
                          <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                            {entry.image.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {entry.video && (
                      <figure className="mt-6 first:mt-0">
                        <video
                          src={entry.video.src}
                          poster={entry.video.poster}
                          controls
                          preload="metadata"
                          playsInline
                          className="w-full rounded-sm"
                        />
                        {entry.video.caption && (
                          <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                            {entry.video.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
