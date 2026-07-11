import Link from "next/link";
import Image from "next/image";
import { Reveal, DrawnRule, MaskedLines } from "@femora/design-system";

export type CaseStudyFigure = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type CaseStudySection = {
  label: string;
  paras: string[];
  artifact?: React.ReactNode;
  figures?: CaseStudyFigure[];
};

type CaseStudyProps = {
  eyebrow: string;
  title: string[];
  standfirst: string;
  sections: CaseStudySection[];
};

export default function CaseStudy({
  eyebrow,
  title,
  standfirst,
  sections,
}: CaseStudyProps) {
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
