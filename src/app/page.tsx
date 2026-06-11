import Link from "next/link";
import { getHomepageWriting } from "@/lib/writing";
import Reveal from "@/components/motion/Reveal";
import DrawnRule from "@/components/motion/DrawnRule";
import MaskedLines from "@/components/motion/MaskedLines";
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

export default function Home() {
  const writingItems = getHomepageWriting(3);

  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20">
      <MaskedLines
        as="h1"
        lines={["Femi Siji-Kenneth"]}
        className="font-serif text-5xl tracking-tight sm:text-6xl"
      />
      <div className="mt-3 flex items-center gap-3">
        <MaskedLines
          as="p"
          lines={["Thinker. Tinkerer."]}
          delay={0.18}
          className="font-serif text-xl italic text-muted"
        />
        <Spiral size={22} delay={0.9} className="text-accent" />
      </div>

      <DrawnRule className="my-12" immediate delay={0.35} />

      <Reveal immediate delay={0.45}>
        <p className="text-base leading-relaxed sm:text-lg">
          Femi Siji-Kenneth is a product leader in Toronto. He&apos;s built
          corporate banking platforms across two continents, payment platforms
          taken into new verticals like airline ticketing, and cardholder
          support tools shipped from concept to production in months instead
          of years. Off the clock he plays a lot of tennis, lives with his
          wife, and writes for the kind of mind that thinks in spirals.
        </p>
      </Reveal>

      <DrawnRule className="my-12" />

      <section>
        <Reveal>
          <h2 className="font-serif text-2xl">Selected work</h2>
        </Reveal>
        <ul className="mt-6 space-y-5">
          {workItems.map((item, i) => (
            <li key={item.href}>
              <Reveal delay={i * 0.08}>
                <Link
                  href={item.href}
                  className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-serif text-lg leading-snug transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                    {item.title}
                  </span>
                  <span className="whitespace-nowrap font-mono text-sm text-muted transition-transform duration-300 group-hover:-translate-x-1">
                    {item.period}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal delay={0.2}>
          <p className="mt-8 text-sm">
            <Link
              href="/work"
              className="text-accent underline underline-offset-4 hover:no-underline"
            >
              See all work →
            </Link>
          </p>
        </Reveal>
      </section>

      <DrawnRule className="my-12" />

      <section>
        <Reveal>
          <h2 className="font-serif text-2xl">Recent writing</h2>
        </Reveal>
        <ul className="mt-6 space-y-5">
          {writingItems.map((item, i) => {
            const isExternal = item.type === "external";
            const href = isExternal ? item.href : `/writing/${item.slug}`;
            const titleNode = (
              <span className="inline-block font-serif text-lg leading-snug transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                {item.title}
                {isExternal && (
                  <span aria-hidden className="ml-1 text-sm text-muted">
                    ↗
                  </span>
                )}
              </span>
            );
            return (
              <li key={isExternal ? item.href : item.slug}>
                <Reveal delay={i * 0.08}>
                  {isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      {titleNode}
                    </a>
                  ) : (
                    <Link href={href} className="group">
                      {titleNode}
                    </Link>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
        <Reveal delay={0.2}>
          <p className="mt-8 text-sm">
            <Link
              href="/writing"
              className="text-accent underline underline-offset-4 hover:no-underline"
            >
              See all writing →
            </Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
