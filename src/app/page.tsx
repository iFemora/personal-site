import Link from "next/link";

const workItems = [
  {
    title:
      "A corporate banking platform, stood up from scratch across two continents.",
    period: "2024–25",
    href: "/work#corporate-banking",
  },
  {
    title:
      "A payment platform, taken into airline ticketing.",
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

const writingItems = [
  {
    title: "The Wrong Scoreboard",
    href: "https://medium.com/@iFemora/the-wrong-scoreboard-5267ed9cb2b8",
  },
  {
    title: "Go Fetch",
    href: "https://medium.com/@iFemora/go-fetch-6c829f37aa70",
  },
  {
    title:
      "Making Sense at the Edges: A Field Guide for People Who Think in Spirals",
    href: "https://medium.com/@iFemora/making-sense-at-the-edges-a-field-guide-for-people-who-think-in-spirals-c26e22298ae4",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20">
      <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">
        Femi Siji-Kenneth
      </h1>
      <p className="mt-3 font-serif text-xl italic text-muted">
        Thinker. Tinkerer.
      </p>

      <hr className="my-12 border-t border-rule" />

      <p className="text-base leading-relaxed sm:text-lg">
        Femi Siji-Kenneth is a product leader in Toronto. He&apos;s built
        corporate banking platforms across two continents, payment platforms
        taken into new verticals like airline ticketing, and cardholder
        support tools shipped from concept to production in months instead
        of years. Off the clock he plays a lot of tennis, lives with his
        wife, and writes for the kind of mind that thinks in spirals.
      </p>

      <hr className="my-12 border-t border-rule" />

      <section>
        <h2 className="font-serif text-2xl">Selected work</h2>
        <ul className="mt-6 space-y-5">
          {workItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                  {item.title}
                </span>
                <span className="whitespace-nowrap font-mono text-sm text-muted">
                  {item.period}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm">
          <Link
            href="/work"
            className="text-accent underline underline-offset-4 hover:no-underline"
          >
            See all work →
          </Link>
        </p>
      </section>

      <hr className="my-12 border-t border-rule" />

      <section>
        <h2 className="font-serif text-2xl">Recent writing</h2>
        <ul className="mt-6 space-y-5">
          {writingItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-lg leading-snug transition-colors hover:text-accent"
              >
                {item.title}{" "}
                <span aria-hidden className="text-sm text-muted">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm">
          <Link
            href="/writing"
            className="text-accent underline underline-offset-4 hover:no-underline"
          >
            See all writing →
          </Link>
        </p>
      </section>
    </main>
  );
}
