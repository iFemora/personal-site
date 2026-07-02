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
};

const sections = [
  {
    label: "The mark",
    body: (
      <>
        The spiral is an Archimedean spiral, drawn in code &mdash; the same
        few lines produce the favicon, the share cards, the nav mark, and the
        ghost turning slowly behind every page. It stands in for a mind that
        thinks in spirals: circling a thing, again and again, until it makes
        sense.
      </>
    ),
  },
  {
    label: "Type",
    body: (
      <>
        Headlines are set in Fraunces, a variable serif whose softness and
        wonk axes let the hero type breathe under your cursor. Body text is
        Newsreader; dates and marginalia are IBM Plex Mono. Three voices, one
        page &mdash; like a good conversation.
      </>
    ),
  },
  {
    label: "Colour",
    body: (
      <>
        Warm paper, dark ink, and one earthy family of accents. Each section
        claims its own: rust at home, slate teal for work, moss for writing,
        ochre for notes, chartreuse for tennis, umber in the gallery. Dark
        mode is its own mood, not an inversion.
      </>
    ),
  },
  {
    label: "Motion",
    body: (
      <>
        The house rule is &ldquo;quietly alive&rdquo;: small travel, one
        easing curve, nothing performs. Rules draw themselves, titles set
        line by line, photographs sit faded until attention brings the colour
        back. If your system asks for reduced motion, everything holds still.
        The page scrolls the way your browser scrolls &mdash; no library
        between your thumb and the text.
      </>
    ),
  },
  {
    label: "Build",
    body: (
      <>
        Next.js and MDX, deployed on Vercel; the styling and motion
        primitives live in their own small design-system package. The whole
        site is a public git repository &mdash; field notes and gallery
        photos publish from my phone through a tiny API that writes straight
        to it, one commit per thought.
      </>
    ),
  },
];

export default function ColophonPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Colophon", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
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
        Everything here is deliberate; nothing here is finished.
      </p>
    </main>
  );
}
