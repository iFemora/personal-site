"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Highlight } from "@femora/design-system";
import { EASE } from "@femora/design-system/ease";
import type { WallEntry } from "@/lib/wallOfLove";

const FILTERS = [
  { key: "all", label: "everything" },
  { key: "work", label: "for the work" },
  { key: "character", label: "for the character" },
  { key: "love", label: "just love" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/** Shorter notes read bigger, like a real wall of pinned-up praise. */
function quoteSize(quote: string): string {
  if (quote.length < 220) return "text-2xl leading-snug sm:text-[1.75rem]";
  if (quote.length < 480) return "text-xl leading-snug";
  return "text-lg leading-relaxed";
}

/** Wraps every highlight phrase found in the paragraph, staggering the swipes. */
function markParagraph(
  text: string,
  highlights: string[],
  nextOrder: () => number
): React.ReactNode[] {
  let first: { at: number; phrase: string } | null = null;
  for (const phrase of highlights) {
    const at = text.indexOf(phrase);
    if (at !== -1 && (first === null || at < first.at)) first = { at, phrase };
  }
  if (first === null) return [text];
  return [
    text.slice(0, first.at),
    <Highlight key={`${first.at}-${first.phrase}`} order={nextOrder()}>
      {first.phrase}
    </Highlight>,
    ...markParagraph(
      text.slice(first.at + first.phrase.length),
      highlights,
      nextOrder
    ),
  ];
}

export default function WallOfLove({ entries }: { entries: WallEntry[] }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    if (focusedId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedId]);

  const shown =
    filter === "all" ? entries : entries.filter((e) => e.kind === filter);

  return (
    <>
      <div className="mb-12 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] sm:mb-16 sm:gap-x-4">
        {FILTERS.map((f, i) => {
          const active = filter === f.key;
          return (
            <Fragment key={f.key}>
              {i > 0 && (
                <span aria-hidden className="text-rule">
                  ·
                </span>
              )}
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(f.key);
                  setFocusedId(null);
                }}
                className={`relative ${
                  active
                    ? "text-accent"
                    : "text-muted transition-colors hover:text-foreground"
                }`}
              >
                {f.label}
                {active &&
                  (reduced ? (
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full bg-current"
                    />
                  ) : (
                    <motion.span
                      layoutId="wall-filter-active"
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full bg-current"
                      transition={{ duration: 0.45, ease: EASE }}
                    />
                  ))}
              </button>
            </Fragment>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="font-serif text-lg italic leading-relaxed text-muted">
          Nothing filed under this yet.
        </p>
      ) : (
        <div key={filter} className="columns-1 gap-12 sm:columns-2">
          {shown.map((entry, i) => {
            const paragraphs = entry.quote.split("\n\n");
            let order = 0;
            const nextOrder = () => order++;
            const focused = focusedId === entry.id;
            const dimmed = focusedId !== null && !focused;
            const toggle = () =>
              setFocusedId(focused ? null : entry.id);
            return (
              <motion.figure
                key={entry.id}
                className="mb-14 break-inside-avoid sm:mb-16"
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 2) * 0.08 }}
              >
                {/* Spotlight lives on this wrapper so it never fights the
                    entrance animation's inline styles. */}
                <div
                  className={`group cursor-pointer transition-[filter,opacity] duration-500 ease-out ${
                    dimmed ? "opacity-40 blur-[2px]" : ""
                  }`}
                  onClick={() => {
                    if (window.getSelection()?.toString()) return;
                    toggle();
                  }}
                >
                  {entry.how && (
                    <p
                      className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-500 ${
                        focused ? "text-accent" : "text-muted"
                      }`}
                    >
                      {entry.how}
                    </p>
                  )}

                  <blockquote
                    className={`mt-4 font-serif tracking-tight ${quoteSize(entry.quote)}`}
                  >
                    {paragraphs.map((para, p) => (
                      <p key={p} className={p === 0 ? "" : "mt-4"}>
                        {p === 0 && "“"}
                        {markParagraph(para, entry.highlights ?? [], nextOrder)}
                        {p === paragraphs.length - 1 && "”"}
                      </p>
                    ))}
                  </blockquote>

                  <figcaption className="mt-6">
                    <button
                      type="button"
                      aria-pressed={focused}
                      aria-label={`Spotlight ${entry.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle();
                      }}
                      className="flex items-center gap-4 text-left"
                    >
                      {entry.image && (
                        <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-sm">
                          <Image
                            src={entry.image.src}
                            alt={entry.image.alt}
                            width={112}
                            height={112}
                            sizes="56px"
                            className={`h-full w-full object-cover transition-[filter,transform] duration-500 ease-out ${
                              focused
                                ? "scale-[1.04] grayscale-0 sepia-0"
                                : "grayscale-[0.85] sepia-[0.12] group-hover:grayscale-0 group-hover:sepia-0"
                            }`}
                            style={
                              entry.image.position
                                ? { objectPosition: entry.image.position }
                                : undefined
                            }
                          />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span
                          className={`block font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-500 ${
                            focused ? "text-accent" : ""
                          }`}
                        >
                          {entry.name}
                        </span>
                        {(entry.role || entry.company) && (
                          <span className="mt-0.5 block text-sm text-muted">
                            {[entry.role, entry.company]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        )}
                      </span>
                    </button>
                  </figcaption>
                </div>
              </motion.figure>
            );
          })}
        </div>
      )}
    </>
  );
}
