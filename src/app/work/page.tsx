import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Five things made, instead of five jobs held. A curated view of the artifacts I've cared about most over the last ten years.",
};

type WorkEntry = {
  id: string;
  title: string;
  body: string;
  meta: string;
};

const entries: WorkEntry[] = [
  {
    id: "corporate-banking",
    title:
      "A corporate banking platform, stood up from scratch across two continents.",
    body: "Served 50,000+ SME and enterprise clients across Nigeria and the UK. Onboarding time-to-value cut by 40%. A multi-product portfolio across corporate internet banking, payroll, remittances, and FX/trade management.",
    meta: "FCMB · 2024–25",
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
    body: "Designed by sitting with BPO agents and watching them work. Now in production for a global card issuer processing billions in payment volume. Built the automated testing workflow alongside it, entirely in Claude Code and Playwright.",
    meta: "Marqeta · 2025",
  },
  {
    id: "greenfield-vertical",
    title: "A greenfield vertical, grown 8× in half the projected time.",
    body: "First product hire at the company. From 3,200 to 25,000 users in six months against a 12-month mandate. Owned the full portfolio across iOS, Android, and web — and travelled across 29 Nigerian states to research it in person.",
    meta: "Farmcrowdy · 2019–21",
  },
  {
    id: "product-team",
    title: "A product team, hired and grown across three time zones.",
    body: "Five PMs at varying levels. Mentored APMs into PMs, recruited Senior PMs who became Leads. One mentee eventually became Head of Products for the Retail Banking division.",
    meta: "FCMB · 2024–25",
  },
];

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20">
      <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">Work</h1>
      <p className="mt-3 font-serif text-xl italic text-muted">
        Five things made, instead of five jobs held.
      </p>

      <hr className="my-12 border-t border-rule" />

      <p className="text-base leading-relaxed sm:text-lg">
        These are the artifacts I&apos;ve cared about most over the last ten
        years. For the conventional view — roles, dates, every line item —
        see the{" "}
        <Link
          href="/cv"
          className="text-accent underline underline-offset-4 hover:no-underline"
        >
          long form
        </Link>
        .
      </p>

      <div className="mt-12 space-y-12 sm:space-y-16">
        {entries.map((entry) => (
          <article key={entry.id} id={entry.id} className="scroll-mt-24">
            <h2 className="font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
              {entry.title}
            </h2>
            <p className="mt-5 leading-relaxed">{entry.body}</p>
            <p className="mt-4 font-mono text-sm text-muted">{entry.meta}</p>
            <hr className="mt-12 border-t border-rule" />
          </article>
        ))}
      </div>

      <p className="mt-4 text-sm">
        <Link
          href="/cv"
          className="text-accent underline underline-offset-4 hover:no-underline"
        >
          Read the long form →
        </Link>
      </p>
    </main>
  );
}
