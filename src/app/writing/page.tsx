import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllWriting, formatPostDate, type WritingItem } from "@/lib/writing";
import Reveal from "@/components/motion/Reveal";
import DrawnRule from "@/components/motion/DrawnRule";
import MaskedLines from "@/components/motion/MaskedLines";
import ProximityType from "@/components/motion/ProximityType";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays from the long way around. Pieces published on this site and on Medium.",
};

function WritingRow({ item }: { item: WritingItem }) {
  const isExternal = item.type === "external";
  const href = isExternal ? item.href : `/writing/${item.slug}`;

  const content = (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      {item.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded sm:w-44 sm:shrink-0">
          <Image
            src={item.image.src}
            alt={item.image.alt ?? item.title}
            fill
            sizes="(min-width: 640px) 176px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className="block font-serif text-xl leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
          {item.title}
          {isExternal && (
            <span aria-hidden className="ml-1 text-base text-muted">
              ↗
            </span>
          )}
        </span>
        <p className="mt-2 font-mono text-sm text-muted">
          {formatPostDate(item.date)}
          {isExternal && <> · {item.source}</>}
        </p>
        <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="group block">
      {content}
    </Link>
  );
}

export default function WritingPage() {
  const items = getAllWriting();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Writing", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["On software, cities, tennis, and the spaces where they meet."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <section className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Index</span> — {items.length} pieces
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            A running collection &mdash; some published here, some on Medium.
            The Medium ones open in a new tab; the local ones live on this
            site.
          </p>
        </Reveal>
      </section>

      <DrawnRule className="my-14 sm:my-20" />

      <ul className="space-y-14 sm:space-y-16">
        {items.map((item, i) => (
          <li
            key={item.type === "external" ? item.href : item.slug}
            className="grid gap-6 border-b border-rule pb-14 last:border-b-0 last:pb-0 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12 sm:pb-16"
          >
            <Reveal delay={Math.min(i, 2) * 0.08}>
              <p
                aria-hidden
                className="wonk hidden font-serif text-6xl italic leading-none text-rule sm:block sm:text-7xl"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
            </Reveal>
            <Reveal delay={Math.min(i, 2) * 0.08 + 0.05}>
              <WritingRow item={item} />
            </Reveal>
          </li>
        ))}
      </ul>
    </main>
  );
}
