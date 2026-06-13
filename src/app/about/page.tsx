/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { getAboutTimeline } from "@/lib/about";
import Reveal from "@/components/motion/Reveal";
import DrawnRule from "@/components/motion/DrawnRule";
import MaskedLines from "@/components/motion/MaskedLines";
import ProximityType from "@/components/motion/ProximityType";

export const metadata: Metadata = {
  title: "About",
  description: "How Femi Siji-Kenneth got here — the long way, with detours.",
};

export default function AboutPage() {
  const beats = getAboutTimeline();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "About", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["The long way here, detours included."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      {/* Intro — counter-signals the credentials: what I value first. */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Who</span> — the short version
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            I&apos;m most interested in the seam between what software
            promises and what actually happens to a person on the other side
            of it. That&apos;s why I&apos;ve spent a decade in payments and
            banking, why I still read the codebase, and why I write. The
            résumé&apos;s on the{" "}
            <a href="/cv" className="link-swipe text-accent">
              CV
            </a>
            ; this page is the longer, less tidy story.
          </p>
        </Reveal>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      {/* Timeline */}
      <ol className="space-y-14 sm:space-y-20">
        {beats.map((beat, i) => (
          <li key={beat.id}>
            <Reveal delay={Math.min(i, 2) * 0.06}>
              <article className="grid gap-4 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
                <p
                  aria-hidden
                  className="wonk font-serif text-4xl italic leading-none text-rule sm:text-right sm:text-5xl"
                >
                  {beat.year}
                </p>
                <div>
                  <h2 className="font-serif text-2xl leading-snug tracking-tight">
                    {beat.title}
                  </h2>
                  {beat.caption && (
                    <p className="mt-3 text-lg leading-relaxed text-muted">
                      {beat.caption}
                    </p>
                  )}
                  {beat.image && (
                    <figure className="group mt-5 overflow-hidden rounded-sm">
                      <img
                        src={beat.image.src}
                        alt={beat.image.alt}
                        loading="lazy"
                        className="w-full transition-[filter,transform] duration-500 ease-out grayscale-[0.85] sepia-[0.12] group-hover:scale-[1.015] group-hover:grayscale-0 group-hover:sepia-0"
                      />
                    </figure>
                  )}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </main>
  );
}
