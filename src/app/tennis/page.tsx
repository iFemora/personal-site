import type { Metadata } from "next";
import Image from "next/image";
import { getTennisEntries, formatTennisDate } from "@/lib/tennis";
import TennisVideo from "@/components/TennisVideo";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";

export const metadata: Metadata = {
  title: "Tennis",
  description:
    "A tennis log — match notes, clips, and photographs from the court.",
  alternates: { canonical: "/tennis" },
  // Unlisted until the log has more than a handful of entries.
  robots: { index: false },
};

export default function TennisPage() {
  const entries = getTennisEntries();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Tennis", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight text-accent"
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
            <span className="text-accent">Log</span>
            {entries.length >= 3 && <> — {entries.length} entries</>}
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            Match notes, clips, and photos from the court. I introduce myself
            as a part-time product manager and a full-time tennis enthusiast
            &mdash; even in interviews. The audacity.
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
                        <Image
                          src={entry.image.src}
                          alt={entry.image.alt ?? entry.title ?? "Tennis"}
                          width={entry.image.width}
                          height={entry.image.height}
                          sizes="(max-width: 640px) 100vw, 640px"
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
                        <TennisVideo
                          src={entry.video.src}
                          poster={entry.video.poster}
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
