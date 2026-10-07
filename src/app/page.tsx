import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getHomepageWriting } from "@/lib/writing";
import { getDesk } from "@/lib/desk";
import { siteUrl, serializeJsonLd } from "@/lib/seo";
import ExternalArrow from "@/components/ExternalArrow";
import BookIntroLink from "@/components/BookIntroLink";
import HireMe, { LEAD_LINE, THESIS_LINE, SEEKING_LINE } from "@/components/HireMe";
import ProofStrip from "@/components/ProofStrip";
import EmployerStrip from "@/components/EmployerStrip";
import {
  Reveal,
  DrawnRule,
  ProximityType,
  IdentityFlip,
  Highlight,
  Spiral,
} from "@femora/design-system";

const workItems = [
  {
    title: "Built a corporate banking platform from scratch across Nigeria and the UK.",
    meta: "FCMB · 2024–25",
    href: "/work#corporate-banking",
  },
  {
    title: "Expanded a payment platform into airline ticketing.",
    meta: "Paystack · 2021–24",
    href: "/work#airline-payments",
  },
  {
    title: "Took a cardholder support platform from concept to production in under five months.",
    meta: "Marqeta · 2025–26",
    href: "/work#cardholder-support",
  },
];

/* Drafted on Femi's behalf; logged in docs/review-queue.md. */
const seeking = [
  {
    title: "The role: a founding product seat, or a senior one.",
    body: "Head of Product or founding PM at an early-stage company, where the first product still has to be designed and shipped. Or Principal, Lead or Director at a scale-up or a bank, where the product exists and the work is making complex workflows feel simple.",
  },
  {
    title: "The place: where the detail is the product.",
    body: "Payments, banking, B2B platforms, marketplaces. Regulated and operationally messy suits me: card issuing, corporate banking, disputes, collections, identity. I have shipped in all of them, and twice built the team as well as the product.",
  },
  {
    title: "The where: Vancouver, or remote across Canada.",
    body: "Pacific time, happy to keep eastern hours. Ten years of working with teams in Lagos, the UK, Toronto and now Vancouver, so time zones are a habit, not a hurdle.",
  },
];

const decisionPrinciples = [
  {
    title: "Start close to reality.",
    body: "The roadmap changes when I sit beside the agent, walk the farm, or listen to the customer explain the problem in their own language.",
    evidence: "29 states, one corrected roadmap",
    href: "/work/farmcrowdy",
  },
  {
    title: "Decide what the first release must prove.",
    body: "I choose the smallest release that can answer the important question. The rest can wait, even when it matters.",
    evidence: "Core workflows in five months",
    href: "/work/resolve",
  },
  {
    title: "Ship in steps.",
    body: "Each release should teach me something useful. I prefer several chances to learn over one large launch built on old assumptions.",
    evidence: "Resolve, release by release",
    href: "/work/resolve",
  },
  {
    title: "Keep the complexity behind the product.",
    body: "Moving money and filing disputes are complicated. The screen is where that complexity is either absorbed or passed on to the person using it, and I would rather absorb it: fewer steps, plain words, the state of things always visible.",
    evidence: "Two markets, one banking surface",
    href: "/work/corporate-banking",
  },
  {
    title: "Bring an opinion, then work with the experts.",
    body: "I map the workflow and build a prototype so the team has something concrete to react to. Design and engineering make it better.",
    evidence: "Why Resolve is called Resolve",
    href: "/work/resolve",
  },
];

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
      <span className="text-accent">{index}</span> — {label}
    </p>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Femi Siji-Kenneth",
  jobTitle: "Product Leader",
  url: siteUrl,
  sameAs: [
    "https://linkedin.com/in/ifemora",
    "https://x.com/iFemora",
    "https://ifemora.substack.com",
    "https://substack.com/@ifemora",
  ],
};

export default function Home() {
  const writingItems = getHomepageWriting(3);
  const desk = getDesk();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />
      {/* Hero. On the phone everything is in flow (name, tagline, line,
          pills, photo); from sm: the photo block is lifted out to the
          right so the text never has to dodge it with pixel offsets. */}
      <div className="relative isolate sm:min-h-[410px]">
        <div className="relative z-10">
          <ProximityType
            lines={[
              { text: "Femi", className: "wonk" },
              { text: "Siji-Kenneth", className: "wonk italic text-accent" },
            ]}
            className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
          />
        </div>
        <div className="relative z-10 mt-6 flex items-center gap-3">
          <Reveal immediate delay={0.28}>
            <IdentityFlip
              first={["Thinker."]}
              second={[
                "Tinkerer.",
                "Builder.",
                "Athlete.",
                "Designer.",
                "Photographer.",
                "Director.",
              ]}
              className="font-serif text-xl italic text-muted sm:text-2xl"
            />
          </Reveal>
          <Spiral size={24} delay={1.0} className="text-accent" />
        </div>

        {/* The one line a recruiter needs before anything else. */}
        <Reveal immediate delay={0.34}>
          <p className="relative z-10 mt-6 max-w-[500px] text-base leading-relaxed sm:text-lg">
            {LEAD_LINE} {THESIS_LINE}{" "}
            <span className="text-muted">{SEEKING_LINE}</span>
          </p>
        </Reveal>

        {/* Availability: the pill borrows the nav's treatment so it reads
            as part of the furniture, not a badge. */}
        <Reveal immediate delay={0.4}>
          <div className="relative z-10 mt-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-rule px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground sm:text-xs">
              <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
              Open to new roles
            </span>
            <BookIntroLink />
          </div>
        </Reveal>

        <div className="relative z-0 mt-10 w-[210px] sm:absolute sm:right-[8%] sm:top-0 sm:mt-0 sm:w-[270px]">
          <div
            aria-hidden
            className="pointer-events-none relative h-[270px] w-full overflow-hidden border border-rule bg-background sm:h-[340px]"
          >
            <Image
              src="/about/femi-profile-2026.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 640px) 210px, 270px"
              className="object-cover object-[50%_24%] contrast-[1.03] saturate-[0.9]"
            />
            <span className="absolute inset-y-0 left-0 w-1 bg-accent sm:left-auto sm:right-0" />
          </div>
          <Reveal immediate delay={0.5}>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:text-right">
              Product, payments
              <br />
              Vancouver, Canada
            </p>
          </Reveal>
        </div>
      </div>

      <ProofStrip />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.45} />

      {/* Bio */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.55}>
          <SectionLabel index="01" label="About" />
        </Reveal>
        <Reveal immediate delay={0.6}>
          <p className="text-lg leading-relaxed sm:text-xl">
            I build products in{" "}
            <Highlight order={0}>payments, banking, and agriculture</Highlight>.
            The industry changes; how I work does not. I go where the customers
            are, stay with an idea until I understand it, then improve it in
            small releases. Twice, that became{" "}
            <Highlight order={1}>a company of my own</Highlight>. Off the clock I
            play <Highlight order={2}>a lot of tennis</Highlight>, badly and
            often, read too much philosophy, and write for minds
            that <Highlight order={3}>think in spirals</Highlight>.
          </p>
          <EmployerStrip className="mt-10" />
        </Reveal>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      {/* Selected work */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12">
        <Reveal>
          <SectionLabel index="02" label="Selected work" />
        </Reveal>
        <div>
          <ul className="space-y-8">
            {workItems.map((item, i) => (
              <li key={item.href}>
                <Reveal delay={i * 0.08}>
                  <Link
                    href={item.href}
                    className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-6"
                  >
                    <span
                      aria-hidden
                      className="font-serif text-3xl italic leading-none text-rule transition-colors duration-300 group-hover:text-accent sm:text-4xl"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-xl leading-snug transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent sm:text-2xl">
                      {item.title}
                    </span>
                    <span className="col-start-2 font-mono text-xs uppercase tracking-[0.15em] text-muted transition-transform duration-300 group-hover:-translate-x-1 sm:col-start-3 sm:text-right lg:whitespace-nowrap">
                      {item.meta}
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal delay={0.2}>
            <p className="mt-10">
              <Link
                href="/work"
                className="link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent"
              >
                See all work →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      {/* How I make decisions */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12">
        <Reveal>
          <SectionLabel index="03" label="How I decide" />
        </Reveal>
        <div>
          <Reveal delay={0.05}>
            <p className="mb-10 max-w-[640px] font-serif text-xl italic leading-snug text-muted sm:text-2xl">
              These are the principles I decide by, formed in product work
              and used well beyond it: when time is short, the roadmap is
              crowded, or the evidence changes the plan.
            </p>
          </Reveal>
          <ol className="border-t border-rule">
            {decisionPrinciples.map((principle, i) => (
              <li key={principle.title} className="border-b border-rule">
                <Reveal delay={Math.min(i, 2) * 0.06}>
                  <Link
                    href={principle.href}
                    className="group grid gap-3 py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-5"
                  >
                    <span className="font-mono text-[11px] tracking-[0.18em] text-accent sm:pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-serif text-xl leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                        {principle.title}
                      </span>
                      <span className="mt-2 block max-w-[580px] leading-relaxed text-muted">
                        {principle.body}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors duration-300 group-hover:text-accent sm:max-w-32 sm:pt-1 sm:text-right">
                      {principle.evidence} →
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      {/* What I'm looking for — the recruiter's first question, answered
          in prose. Part of the open-to-work signal (see CLAUDE.md). */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12">
        <Reveal>
          <SectionLabel index="04" label="What I’m looking for" />
        </Reveal>
        <div>
          <Reveal delay={0.05}>
            <p className="mb-10 max-w-[640px] font-serif text-xl italic leading-snug text-muted sm:text-2xl">
              The next role, in three lines.
            </p>
          </Reveal>
          <ol className="border-t border-rule">
            {seeking.map((item, i) => (
              <li key={item.title} className="border-b border-rule">
                <Reveal delay={Math.min(i, 2) * 0.06}>
                  <div className="grid gap-3 py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-5">
                    <span className="font-mono text-[11px] tracking-[0.18em] text-accent sm:pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-serif text-xl leading-snug tracking-tight sm:text-2xl">
                        {item.title}
                      </span>
                      <span className="mt-2 block max-w-[580px] leading-relaxed text-muted">
                        {item.body}
                      </span>
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      {/* From the desk */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12">
        <Reveal>
          <div>
            <SectionLabel index="05" label="From the desk" />
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Updated {desk.updated}
            </p>
          </div>
        </Reveal>
        <div className="grid border-t border-rule sm:grid-cols-3">
          {desk.items.map((item, i) => {
            const deskItemClass = `group block min-h-full border-b border-rule py-6 sm:border-b-0 ${
              i === 0
                ? "sm:border-r sm:pr-6"
                : i === desk.items.length - 1
                  ? "sm:pl-6"
                  : "sm:border-r sm:px-6"
            }`;
            const content = (
              <>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  {item.label}
                </p>
                <p className="mt-4 font-serif text-xl leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
                {item.href && (
                  <span className="mt-5 block font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                    Read more →
                  </span>
                )}
              </>
            );

            return (
              <Reveal key={`${item.label}-${item.title}`} delay={i * 0.08}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={deskItemClass}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className={deskItemClass}>
                    {content}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      {/* Recent writing */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12">
        <Reveal>
          <SectionLabel index="06" label="Recent writing" />
        </Reveal>
        <div>
          <ul className="space-y-8">
            {writingItems.map((item, i) => {
              const isExternal = item.type === "external";
              const href = isExternal ? item.href : `/writing/${item.slug}`;
              const inner = (
                <>
                  <span
                    aria-hidden
                    className="font-serif text-3xl italic leading-none text-rule transition-colors duration-300 group-hover:text-accent sm:text-4xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-xl leading-snug transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent sm:text-2xl">
                    {item.title}
                    {isExternal && (
                      <ExternalArrow className="ml-1.5 text-muted" />
                    )}
                  </span>
                </>
              );
              return (
                <li key={isExternal ? item.href : item.slug}>
                  <Reveal delay={i * 0.08}>
                    {isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                      >
                        {inner}
                      </Link>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
          <Reveal delay={0.2}>
            <p className="mt-10">
              <Link
                href="/writing"
                className="link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent"
              >
                See all writing →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      <HireMe location="home_end" />
    </main>
  );
}
