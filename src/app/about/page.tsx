import type { Metadata } from "next";
import Image from "next/image";
import { getAboutTimeline } from "@/lib/about";
import Constellation from "@/components/motion/Constellation";
import StoryThread from "@/components/about/StoryThread";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";

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

      {/* The constellation — every beat of the chronology as a point on the spiral. */}
      <Reveal immediate delay={0.3}>
        <div className="mt-12 sm:mt-16">
          <Constellation
            beats={beats.map(({ id, year, title }) => ({ id, year, title }))}
          />
        </div>
      </Reveal>

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      {/* Intro — counter-signals the credentials: what I value first. */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <figure className="relative mb-5 aspect-[4/5] overflow-hidden rounded-sm border border-rule sm:mb-6">
            <Image
              src="/about/femi-profile-2026.jpg"
              alt="Femi Siji-Kenneth"
              fill
              sizes="(max-width: 640px) 100vw, 200px"
              priority
              className="object-cover object-[50%_32%] brightness-[1.02] contrast-[1.02] saturate-[0.9] sepia-[0.22]"
            />
          </figure>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Who</span> — the short version
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            I build products people love &mdash; in payments, in banking, in
            agriculture. The throughline was never the industry; it&apos;s the
            tinkering. I worry an idea until I love it, then keep at it until
            other people do too. Twice that turned into a company of my own
            &mdash; I&apos;m between ventures now, not done with them.
          </p>
          <p className="mt-5 text-lg leading-relaxed">
            Work has never been the whole story, though. I play a lot of
            tennis &mdash; badly, often, happily. I write for minds that think
            in spirals. I read more religion and philosophy than is strictly
            useful, make a little art, and I&apos;ll still debate almost
            anything to the ground; I came up as a debater and never
            quite stopped. The tidy version is on the{" "}
            <a href="/cv" className="link-swipe text-accent">
              CV
            </a>
            . This page is the rest.
          </p>
        </Reveal>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      {/* Timeline */}
      <StoryThread beats={beats} />
    </main>
  );
}
