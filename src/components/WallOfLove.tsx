"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Highlight } from "@femora/design-system";
import { EASE } from "@femora/design-system/ease";
import type { WallEntry } from "@/lib/wallOfLove";

/** Shorter notes read bigger, like a real wall of pinned-up praise. */
function quoteSize(quote: string): string {
  if (quote.length < 220) return "text-2xl leading-snug sm:text-[1.75rem]";
  if (quote.length < 480) return "text-xl leading-snug";
  return "text-lg leading-relaxed";
}

function serial(i: number): string {
  return `LV-${String(i + 1).padStart(3, "0")}`;
}

/** Wraps the highlight phrase (if present) in the marker swipe. */
function withHighlight(text: string, highlight?: string) {
  if (!highlight) return text;
  const at = text.indexOf(highlight);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <Highlight>{highlight}</Highlight>
      {text.slice(at + highlight.length)}
    </>
  );
}

export default function WallOfLove({ entries }: { entries: WallEntry[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="columns-1 gap-12 sm:columns-2">
      {entries.map((entry, i) => {
        const paragraphs = entry.quote.split("\n\n");
        return (
          <motion.figure
            key={entry.id}
            className="group mb-14 break-inside-avoid sm:mb-16"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 2) * 0.08 }}
          >
            <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              <span className="text-accent">{serial(i)}</span>
              {entry.how && <span className="truncate">{entry.how}</span>}
            </div>

            <blockquote
              className={`mt-4 font-serif tracking-tight ${quoteSize(entry.quote)}`}
            >
              {paragraphs.map((para, p) => (
                <p key={p} className={p === 0 ? "" : "mt-4"}>
                  {p === 0 && "“"}
                  {withHighlight(para, entry.highlight)}
                  {p === paragraphs.length - 1 && "”"}
                </p>
              ))}
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-4">
              {entry.image && (
                <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={entry.image.src}
                    alt={entry.image.alt}
                    width={112}
                    height={112}
                    sizes="56px"
                    className="h-full w-full object-cover grayscale-[0.85] sepia-[0.12] transition-[filter] duration-500 ease-out group-hover:grayscale-0 group-hover:sepia-0"
                  />
                </span>
              )}
              <span className="min-w-0">
                <span className="block font-mono text-xs uppercase tracking-[0.15em]">
                  {entry.name}
                </span>
                {entry.role && (
                  <span className="mt-0.5 block text-sm text-muted">
                    {entry.role}
                  </span>
                )}
              </span>
            </figcaption>
          </motion.figure>
        );
      })}
    </div>
  );
}
