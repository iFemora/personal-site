import Link from "next/link";
import { getHomepageWriting } from "@/lib/writing";
import Reveal from "@/components/motion/Reveal";
import DrawnRule from "@/components/motion/DrawnRule";
import ProximityType from "@/components/motion/ProximityType";
import IdentityFlip from "@/components/motion/IdentityFlip";
import Highlight from "@/components/motion/Highlight";
import Spiral from "@/components/motion/Spiral";

const workItems = [
  {
    title:
      "A corporate banking platform, stood up from scratch across two continents.",
    period: "2024–25",
    href: "/work#corporate-banking",
  },
  {
    title: "A payment platform, taken into airline ticketing.",
    period: "2021–24",
    href: "/work#airline-payments",
  },
  {
    title:
      "A cardholder support platform, concept to production in under five months.",
    period: "2025",
    href: "/work#cardholder-support",
  },
];

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
      <span className="text-accent">{index}</span> — {label}
    </p>
  );
}

export default function Home() {
  const writingItems = getHomepageWriting(3);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      {/* Hero */}
      <div className="relative">
        <ProximityType
          lines={[
            { text: "Femi", className: "wonk" },
            { text: "Siji-Kenneth", className: "wonk italic text-accent" },
          ]}
          className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
        />
        <div className="mt-6 flex items-center gap-3">
          <Reveal immediate delay={0.28}>
            <IdentityFlip
              first={["Thinker.", "Debater.", "Writer.", "Designer."]}
              second={["Tinkerer.", "Builder.", "Athlete.", "Photographer."]}
              className="font-serif text-xl italic text-muted sm:text-2xl"
            />
          </Reveal>
          <Spiral size={24} delay={1.0} className="text-accent" />
        </div>

        <Reveal immediate delay={0.5}>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:absolute sm:right-0 sm:top-2 sm:mt-0 sm:text-right">
            Product, payments
            <br />
            Toronto, Canada
          </p>
        </Reveal>
      </div>

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.45} />

      {/* Bio */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.55}>
          <SectionLabel index="01" label="About" />
        </Reveal>
        <Reveal immediate delay={0.6}>
          <p className="text-lg leading-relaxed sm:text-xl">
            I build payment software &mdash; the kind where the gap between
            what you promised and what actually happens to someone&apos;s
            money is <Highlight order={0}>unforgiving</Highlight>. Ten years
            of it: card issuing, banking across{" "}
            <Highlight order={1}>two continents</Highlight>, a micro-payment
            idea that grew into{" "}
            <Highlight order={2}>tens of millions</Highlight> before I&apos;d
            finished pitching it. I still{" "}
            <Highlight order={3}>read the codebase</Highlight>. Off the clock
            I play a lot of tennis &mdash; badly, often &mdash; and write for
            minds that <Highlight order={4}>think in spirals</Highlight>.
          </p>
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
                    <span className="col-start-2 whitespace-nowrap font-mono text-xs uppercase tracking-[0.15em] text-muted transition-transform duration-300 group-hover:-translate-x-1 sm:col-start-3">
                      {item.period}
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

      {/* Recent writing */}
      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12">
        <Reveal>
          <SectionLabel index="03" label="Recent writing" />
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
                      <span aria-hidden className="ml-2 text-base text-muted">
                        ↗
                      </span>
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
    </main>
  );
}
