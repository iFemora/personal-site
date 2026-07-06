import Link from "next/link";
import type { Metadata } from "next";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Six things made, instead of jobs held. Selected work by Femi Siji-Kenneth.",
};

type WorkEntry = {
  id: string;
  title: string;
  body: string;
  meta: string;
  caseStudy?: { href: string; label?: string };
};

const entries: WorkEntry[] = [
  {
    id: "corporate-banking",
    title:
      "A corporate banking platform, stood up from scratch across two continents.",
    body: "Served 50,000+ SME and enterprise clients across Nigeria and the UK. Onboarding time-to-value cut by 40%. A multi-product portfolio across corporate internet banking, payroll, remittances, and FX/trade management.",
    meta: "FCMB · 2024–25",
    caseStudy: { href: "/work/corporate-banking" },
  },
  {
    id: "airline-payments",
    title: "A payment platform, taken into airline ticketing.",
    body: "A strategic enterprise expansion into a new vertical. Built product enhancements for high-volume airline transactions and owned industry stakeholder relationships end-to-end. The expansion drove a $7M revenue campaign.",
    meta: "Paystack · 2021–2024",
  },
  {
    id: "cardholder-support",
    title:
      "A cardholder support platform, concept to production in under five months.",
    body: "Designed by sitting with BPO agents and watching them work. Now in production for a global card issuer processing billions in payment volume, and growing release by release into a platform spanning debit, credit, and prepaid programs: payments, collections, disputes, fraud, and sub-status management in one tool. Built the automated testing workflow alongside it, entirely in Claude Code and Playwright.",
    meta: "Marqeta · 2025",
    caseStudy: { href: "/work/resolve" },
  },
  {
    id: "greenfield-vertical",
    title: "A greenfield vertical, grown 8× in half the projected time.",
    body: "First product hire at the company. From 3,200 to 25,000 users in six months against a 12-month mandate. Owned the full portfolio across iOS, Android, and web: field-service software for farmers, technicians, and buyers. Travelled across 29 Nigerian states to sit with them in person.",
    meta: "Farmcrowdy · 2019–21",
    caseStudy: { href: "/work/farmcrowdy" },
  },
  {
    id: "product-team",
    title: "A product team, hired and grown across three time zones.",
    body: "Five PMs at varying levels. Mentored APMs into PMs, recruited Senior PMs who became Leads. One mentee eventually became Head of Products for the Retail Banking division.",
    meta: "FCMB · 2024–25",
  },
  {
    id: "this-site",
    title: "This website, designed and built end to end in Claude Code.",
    body: "The site you are reading: a bespoke design system with its own motion language, an MDX essay pipeline, and iOS Shortcut endpoints that publish notes and photos straight from a phone. Designed, prototyped, and shipped the same way I work: in small iterations.",
    meta: "ifemora.dev · 2026",
    caseStudy: { href: "/colophon", label: "Read the colophon →" },
  },
];

export default function WorkPage() {
  const total = String(entries.length).padStart(2, "0");
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Work", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["Built, not held."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Index</span> — six artifacts
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            These are the artifacts I&apos;ve cared about most over the last
            ten years. For the conventional view — roles, dates, every line
            item — see the{" "}
            <Link href="/cv" className="link-swipe text-accent">
              long form
            </Link>
            .
          </p>
        </Reveal>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      <div className="space-y-16 sm:space-y-24">
        {entries.map((entry, i) => (
          <article
            key={entry.id}
            id={entry.id}
            className="grid scroll-mt-24 gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12"
          >
            <Reveal>
              <div>
                <p
                  aria-hidden
                  className="wonk font-serif text-6xl italic leading-none text-rule sm:text-7xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  No. {String(i + 1).padStart(2, "0")} / {total}
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                  {entry.meta}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
                {entry.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed">{entry.body}</p>
              {entry.caseStudy && (
                <p className="mt-5">
                  <Link
                    href={entry.caseStudy.href}
                    className="link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent"
                  >
                    {entry.caseStudy.label ?? "Read the case study →"}
                  </Link>
                </p>
              )}
            </Reveal>
          </article>
        ))}
      </div>

      <DrawnRule className="my-14 sm:my-20" />

      <Reveal>
        <p>
          <Link
            href="/cv"
            className="link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent"
          >
            Read the long form →
          </Link>
        </p>
      </Reveal>
    </main>
  );
}
