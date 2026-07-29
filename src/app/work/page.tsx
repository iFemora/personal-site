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
  description: "Selected products and teams built by Femi Siji-Kenneth.",
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
    title: "Built a corporate banking platform from scratch across Nigeria and the UK.",
    body: "The platform now serves 50,000+ SME and enterprise clients across Nigeria and the UK. We cut onboarding time by 40% and shipped corporate banking, payroll, remittances, and FX and trade management.",
    meta: "FCMB · 2024–25",
    caseStudy: { href: "/work/corporate-banking" },
  },
  {
    id: "airline-payments",
    title: "Turned a reconciliation gap into a payment channel.",
    body: "Paystack already owned airline payments online. What nobody could do was book online and pay later, because nothing turned a booking reference into an amount owed at a terminal. We built that, sold it to an industry I convened rather than cold-called, signed Qatar Airways, and then ran the same rail through insurance premiums. The work supported a $7M revenue campaign.",
    meta: "Paystack · 2021–2024",
    caseStudy: { href: "/work/airline-payments" },
  },
  {
    id: "cardholder-support",
    title: "Took a cardholder support platform from concept to production in under five months.",
    body: "I designed Resolve by sitting with BPO agents and watching them work. It now supports debit, credit, and prepaid programs across payments, collections, disputes, fraud, and sub-status management. I also built its automated testing workflow in Claude Code and Playwright. Resolve is one of four areas I carry: the program-management dashboard, identity and access management, and the telephony suite behind our IVR are the others.",
    meta: "Marqeta · 2025",
    caseStudy: { href: "/work/resolve" },
  },
  {
    id: "greenfield-vertical",
    title: "Grew a new agricultural community from 3,200 to 25,000 users in six months.",
    body: "First product hire at the company. From 3,200 to 25,000 users in six months against a 12-month mandate. Owned the full portfolio across iOS, Android, and web: field-service software for farmers, technicians, and buyers. Travelled across 29 Nigerian states to sit with them in person.",
    meta: "Farmcrowdy · 2019–21",
    caseStudy: { href: "/work/farmcrowdy" },
  },
  {
    id: "product-team",
    title: "Made a sales-driven bank product-led.",
    body: "First product hire at a company with no product function: five PMs from APM to Senior across Nigeria, the UK, and Canada, over four product lines. I installed the discovery framework, the templates, the rituals, and a design system, and the group CEO backed the pipeline until it became how the company works. One Senior PM I grew is now Head of Products for retail.",
    meta: "FCMB · 2024–25",
    caseStudy: { href: "/work/product-team" },
  },
  {
    id: "this-site",
    title: "This website, designed and built end to end in Claude Code.",
    body: "A visitor can repaint the whole thing and it remembers: eight palettes, letterpress monochrome through to loud print inks, each one contrast-checked in light and dark so no choice I offer is unreadable. Every colour is declared once and resolved in a single place, which is what keeps eight of them cheap to maintain. The gallery deals itself a fresh order on every visit, and voice notes publish straight from my phone. I built it the way I build products: one small release at a time.",
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
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={["Products, platforms, and teams I’ve built."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Index</span> — six projects
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            These are the products and teams I&apos;ve cared about most over the
            last ten years. For roles, dates, and the full list, see the{" "}
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
