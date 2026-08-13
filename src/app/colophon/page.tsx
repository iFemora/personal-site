import type { Metadata } from "next";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";

export const metadata: Metadata = {
  title: "Colophon",
  description: "How ifemora.dev is made, and why it looks the way it does.",
  alternates: { canonical: "/colophon" },
};

const sections = [
  {
    label: "The mark",
    body: (
      <>
        The logo is an Archimedean spiral generated in code. The same path is
        used for the favicon, social cards, navigation mark, and page
        background. I chose it because I rarely think about a subject once and
        move on.
      </>
    ),
  },
  {
    label: "Type",
    body: (
      <>
        Headlines use Fraunces, with its variable softness and wonk axes. Body
        copy uses Newsreader, while dates and labels use IBM Plex Mono.
      </>
    ),
  },
  {
    label: "Colour",
    body: (
      <>
        The light palette uses warm paper tones, teal, muted gold, rust, and
        ink. Dark mode uses a separate palette rather than reversing the light
        one. Each section claims one accent as its own, and its title sets in
        that colour.
      </>
    ),
  },
  {
    label: "Palettes",
    body: (
      <>
        The nav lets you repaint the whole site: eight palettes, from
        letterpress monochrome to loud print inks. This is a personality
        site, and people read me in different ways, so the site can be read
        in different colours too. Every guest palette keeps the same contrast
        discipline as the house one, in light and in dark. The earthy default
        is still how I pour it.
      </>
    ),
  },
  {
    label: "Motion",
    body: (
      <>
        Motion is deliberately small: short distances, one easing curve, and
        no scroll hijacking. Rules and headings animate on entry, while gallery
        images reveal colour on hover. Nothing loops forever in the
        background. The site disables these effects when reduced motion is
        enabled.
      </>
    ),
  },
  {
    label: "Liveness",
    body: (
      <>
        The photo wall deals itself a fresh order on every visit. A contact
        sheet that always hangs the same way stops being looked at, so the
        frames move; a second visit is never quite the first. The shelf and
        the drawings keep their order, because what I am reading now should
        stay where you can find it.
      </>
    ),
  },
  {
    label: "The wall",
    body: (
      <>
        The wall of love is the one page that is not about output. People see
        more of me than the work, and I wanted that on record in other
        people&apos;s words rather than mine.
      </>
    ),
  },
  {
    label: "Build",
    body: (
      <>
        Built with Next.js and MDX, and deployed on Vercel. Shared styling and
        animation live in a separate design-system package. iPhone Shortcuts
        publish field notes and gallery photos through an API that commits them
        to the repository.
      </>
    ),
  },
];

export default function ColophonPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Colophon", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={["How this site is made, and why it looks the way it does."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <div className="flex flex-col gap-12 sm:gap-16">
        {sections.map((section, i) => (
          <section
            key={section.label}
            className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12"
          >
            <Reveal immediate={i === 0} delay={i === 0 ? 0.45 : 0.05}>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span className="text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                — {section.label}
              </p>
            </Reveal>
            <Reveal immediate={i === 0} delay={i === 0 ? 0.5 : 0.1}>
              <p className="text-lg leading-relaxed text-pretty">
                {section.body}
              </p>
            </Reveal>
          </section>
        ))}
      </div>

      <DrawnRule className="my-14 sm:my-20" />

      <p className="max-w-[640px] font-serif text-lg italic text-muted sm:ml-[248px]">
        This is the current version. It will change again.
      </p>
    </main>
  );
}
