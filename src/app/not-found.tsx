import Link from "next/link";
import type { Metadata } from "next";
import { DrawnRule, MaskedLines, Reveal } from "@femora/design-system";
import BookIntroLink from "@/components/BookIntroLink";

export const metadata: Metadata = {
  title: "Not here",
  robots: { index: false },
};

const places = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/cv", label: "CV" },
  { href: "/writing", label: "Writing" },
];

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <Reveal immediate>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span className="text-accent">404</span> · nothing at this address
        </p>
      </Reveal>
      <MaskedLines
        as="h1"
        lines={[{ text: "Not here.", className: "wonk text-accent" }]}
        delay={0.12}
        className="mt-6 font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["The page moved, or never was. The rest of the site is."]}
        delay={0.28}
        className="mt-6 max-w-[680px] font-serif text-xl italic leading-snug text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.4} />

      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Try</span> — these instead
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {places.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent"
                >
                  {p.label} →
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[560px] leading-relaxed text-muted">
            Looking for someone who builds products in payments and banking?
            That part is not lost.
          </p>
          <div className="mt-5">
            <BookIntroLink location="not_found" />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
