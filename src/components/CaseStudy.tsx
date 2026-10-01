import Link from "next/link";
import Image from "next/image";
import { Reveal, DrawnRule, MaskedLines } from "@femora/design-system";
import { resolveVoices, type CaseVoice } from "@/lib/caseVoices";
import HireMe from "@/components/HireMe";

export type CaseStudyFigure = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type CaseStudySection = {
  label: string;
  paras: React.ReactNode[];
  artifact?: React.ReactNode;
  figures?: CaseStudyFigure[];
};

type CaseStudyProps = {
  eyebrow: string;
  title: string[];
  standfirst: string;
  sections: CaseStudySection[];
  /** Wall of Love excerpts placed beside the claim they support. */
  voices?: CaseVoice[];
};

export default function CaseStudy({
  eyebrow,
  title,
  standfirst,
  sections,
  voices = [],
}: CaseStudyProps) {
  const resolved = resolveVoices(voices);
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <Reveal immediate>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span className="text-accent">Case study</span> · {eyebrow}
        </p>
      </Reveal>
      <MaskedLines
        as="h1"
        lines={title}
        delay={0.12}
        className="mt-6 font-serif text-4xl leading-tight tracking-tight sm:text-6xl"
      />
      <MaskedLines
        as="p"
        lines={[standfirst]}
        delay={0.28}
        className="mt-6 max-w-[680px] font-serif text-xl italic leading-snug text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.4} />

      <div className="space-y-16 sm:space-y-24">
        {sections.map((section, i) => (
          <section
            key={section.label}
            className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12"
          >
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span className="text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                · {section.label}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="space-y-5">
                {section.paras.map((p, j) => (
                  <p key={j} className="text-lg leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              {section.artifact}
              {section.figures?.map((figure) => (
                <figure key={figure.src} className="mt-8">
                  <div className="overflow-hidden border border-rule">
                    <Image
                      src={figure.src}
                      alt={figure.alt}
                      width={figure.width}
                      height={figure.height}
                      className="w-full"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                    {figure.caption}
                  </figcaption>
                </figure>
              ))}
            </Reveal>
          </section>
        ))}
      </div>

      {resolved.length > 0 && (
        <>
          <DrawnRule className="my-14 sm:my-20" />
          <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span className="text-accent">In their words</span>
              </p>
            </Reveal>
            <div className="space-y-10">
              {resolved.map((voice, i) => (
                <Reveal key={voice.id} delay={i * 0.08}>
                  <blockquote>
                    <p className="font-serif text-xl italic leading-snug tracking-tight sm:text-2xl">
                      &ldquo;{voice.excerpt}&rdquo;
                    </p>
                    <footer className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                      <span className="text-foreground">{voice.name}</span>
                      {voice.role && <> · {voice.role}</>}
                      {voice.company && <>, {voice.company}</>}
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
              <Reveal delay={0.16}>
                <p>
                  <Link
                    href="/love"
                    className="link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent"
                  >
                    More on the wall of love →
                  </Link>
                </p>
              </Reveal>
            </div>
          </section>
        </>
      )}

      <DrawnRule className="my-14 sm:my-20" />

      <HireMe location="case_study_end" />

      <DrawnRule className="my-14 sm:my-20" />

      <Reveal>
        <p>
          <Link
            href="/work"
            className="link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent"
          >
            ← All work
          </Link>
        </p>
      </Reveal>
    </main>
  );
}
