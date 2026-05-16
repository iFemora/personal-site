import Link from "next/link";
import type { Metadata } from "next";
import { getAllWriting, formatPostDate, type WritingItem } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays from the long way around. Pieces published on this site and on Medium.",
};

function WritingRow({ item }: { item: WritingItem }) {
  const isExternal = item.type === "external";
  const href = isExternal ? item.href : `/writing/${item.slug}`;

  const titleNode = (
    <span className="font-serif text-xl leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
      {item.title}
      {isExternal && (
        <span aria-hidden className="ml-1 text-base text-muted">
          ↗
        </span>
      )}
    </span>
  );

  const meta = (
    <p className="mt-2 font-mono text-sm text-muted">
      {formatPostDate(item.date)}
      {isExternal && <> · {item.source}</>}
    </p>
  );

  const description = (
    <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {titleNode}
        {meta}
        {description}
      </a>
    );
  }

  return (
    <Link href={href} className="group block">
      {titleNode}
      {meta}
      {description}
    </Link>
  );
}

export default function WritingPage() {
  const items = getAllWriting();

  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20">
      <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">
        Writing
      </h1>
      <p className="mt-3 font-serif text-xl italic text-muted">
        Essays from the long way around.
      </p>

      <hr className="my-12 border-t border-rule" />

      <p className="text-base leading-relaxed sm:text-lg">
        A running collection &mdash; some published here, some on Medium. The
        Medium ones open in a new tab; the local ones live on this site.
      </p>

      <ul className="mt-12 space-y-12 sm:space-y-14">
        {items.map((item) => (
          <li
            key={item.type === "external" ? item.href : item.slug}
            className="border-b border-rule pb-12 last:border-b-0 last:pb-0"
          >
            <WritingRow item={item} />
          </li>
        ))}
      </ul>
    </main>
  );
}
