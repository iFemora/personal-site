"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Highlight } from "@femora/design-system";
import { EASE } from "@femora/design-system/ease";
import type { WallEntry } from "@/lib/wallOfLove";

const FILTERS = [
  { key: "all", label: "everything", short: "all" },
  { key: "work", label: "for the work", short: "work" },
  { key: "character", label: "for the character", short: "character" },
  { key: "love", label: "just love", short: "love" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/** Shorter notes read bigger, like a real wall of pinned-up praise. */
function quoteSize(quote: string): string {
  if (quote.length < 220) return "text-2xl leading-snug sm:text-[1.75rem]";
  if (quote.length < 480) return "text-xl leading-snug";
  return "text-lg leading-relaxed";
}

/** The centred view speaks a size louder than the wall. */
function stageQuoteSize(quote: string): string {
  if (quote.length < 220) return "text-3xl leading-snug sm:text-4xl";
  if (quote.length < 480) return "text-2xl leading-snug sm:text-3xl";
  return "text-xl leading-relaxed sm:text-2xl";
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

/** Frames the avatar on the face: object-position picks the spot, zoom magnifies around it. */
function avatarStyle(
  image: NonNullable<WallEntry["image"]>
): React.CSSProperties | undefined {
  if (!image.position && !image.zoom) return undefined;
  return {
    objectPosition: image.position,
    ...(image.zoom
      ? {
          transform: `scale(${image.zoom})`,
          transformOrigin: image.position ?? "50% 50%",
        }
      : {}),
  };
}

function Paragraphs({ entry, className }: { entry: WallEntry; className: string }) {
  const paragraphs = entry.quote.split("\n\n");
  let order = 0;
  const nextOrder = () => order++;
  return (
    <blockquote className={className}>
      {paragraphs.map((para, p) => (
        <p key={p} className={p === 0 ? "" : "mt-4"}>
          {p === 0 && "“"}
          {markParagraph(para, entry.highlights ?? [], nextOrder)}
          {p === paragraphs.length - 1 && "”"}
        </p>
      ))}
    </blockquote>
  );
}

export default function WallOfLove({ entries }: { entries: WallEntry[] }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);
  const sliding = useRef(false);

  // The toggle is slidable: dragging across it moves the selection to
  // whichever segment sits under the pointer.
  const selectFromPoint = (clientX: number) => {
    const buttons = toggleRef.current?.querySelectorAll<HTMLButtonElement>(
      "button[data-filter]"
    );
    if (!buttons) return;
    for (const b of buttons) {
      const r = b.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right) {
        setFilter(b.dataset.filter as FilterKey);
        return;
      }
    }
  };

  const open = openId === null ? null : entries.find((e) => e.id === openId);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (photoZoom) setPhotoZoom(false);
      else setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openId, photoZoom]);

  const shown =
    filter === "all"
      ? entries
      : entries.filter((e) => e.kinds?.includes(filter));

  const openEntry = (id: string) => {
    setPhotoZoom(false);
    setOpenId(id);
  };

  return (
    <>
      <div className="mb-12 sm:mb-16">
        <div
          ref={toggleRef}
          className="inline-flex touch-none select-none items-center rounded-full border border-rule p-1"
          onPointerDown={(e) => {
            sliding.current = true;
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              // pointer already gone (fast tap); the segment click handles it
            }
            selectFromPoint(e.clientX);
          }}
          onPointerMove={(e) => {
            if (sliding.current) selectFromPoint(e.clientX);
          }}
          onPointerUp={() => {
            sliding.current = false;
          }}
          onPointerCancel={() => {
            sliding.current = false;
          }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                data-filter={f.key}
                aria-pressed={active}
                onClick={() => setFilter(f.key)}
                className={`relative rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 sm:px-4 ${
                  active ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {active &&
                  (reduced ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent/10"
                    />
                  ) : (
                    <motion.span
                      layoutId="wall-filter-thumb"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent/10"
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  ))}
                <span className="relative">
                  <span className="sm:hidden">{f.short}</span>
                  <span className="hidden sm:inline">{f.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="font-serif text-lg italic leading-relaxed text-muted">
          Nothing filed under this yet.
        </p>
      ) : (
        <div key={filter} className="columns-1 gap-12 sm:columns-2">
          {shown.map((entry, i) => (
            <motion.figure
              key={entry.id}
              className="mb-14 break-inside-avoid sm:mb-16"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 2) * 0.08 }}
            >
              <div
                className="group cursor-pointer"
                onClick={() => {
                  if (window.getSelection()?.toString()) return;
                  openEntry(entry.id);
                }}
              >
                {entry.how && (
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                    {entry.how}
                  </p>
                )}

                <Paragraphs
                  entry={entry}
                  className={`mt-4 font-serif tracking-tight ${quoteSize(entry.quote)}`}
                />

                <figcaption className="mt-6">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={`Open ${entry.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEntry(entry.id);
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
                          className="h-full w-full object-cover grayscale-[0.85] sepia-[0.12] transition-[filter] duration-500 ease-out group-hover:grayscale-0 group-hover:sepia-0"
                          style={avatarStyle(entry.image)}
                        />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block font-mono text-xs uppercase tracking-[0.15em]">
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
          ))}
        </div>
      )}

      {/* Centre stage: the clicked voice comes out of the wall. A second
          click on the portrait zooms the photo itself; clicks step back
          one layer at a time. */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] overflow-y-auto bg-background/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => (photoZoom ? setPhotoZoom(false) : setOpenId(null))}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.name} on the wall`}
          >
            <div className="flex min-h-full items-center justify-center px-6 py-14 sm:py-20">
              {photoZoom && open.image ? (
                <motion.figure
                  key={`photo-${open.id}`}
                  className="flex flex-col items-center"
                  initial={
                    reduced
                      ? { opacity: 1, filter: "grayscale(0) sepia(0)" }
                      : {
                          opacity: 0,
                          scale: 0.97,
                          filter: "grayscale(0.85) sepia(0.12)",
                        }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "grayscale(0) sepia(0)",
                  }}
                  transition={{
                    duration: 0.35,
                    ease: EASE,
                    filter: { duration: 0.9, ease: EASE, delay: 0.1 },
                  }}
                >
                  <Image
                    src={open.image.src}
                    alt={open.image.alt}
                    width={open.image.width}
                    height={open.image.height}
                    sizes="90vw"
                    quality={85}
                    className="max-h-[68vh] w-auto max-w-full cursor-zoom-out rounded-sm object-contain"
                  />
                  <figcaption className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                    {open.name}
                  </figcaption>
                </motion.figure>
              ) : (
                <motion.div
                  key={`entry-${open.id}`}
                  className="w-full max-w-[640px]"
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {open.image && (
                    <button
                      type="button"
                      aria-label={`See ${open.name}'s photo`}
                      onClick={() => setPhotoZoom(true)}
                      className="block h-24 w-24 cursor-zoom-in overflow-hidden rounded-sm sm:h-28 sm:w-28"
                    >
                      <motion.span
                        className="block h-full w-full"
                        initial={
                          reduced
                            ? { filter: "grayscale(0) sepia(0)" }
                            : { filter: "grayscale(0.85) sepia(0.12)" }
                        }
                        animate={{ filter: "grayscale(0) sepia(0)" }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
                      >
                        <Image
                          src={open.image.src}
                          alt={open.image.alt}
                          width={224}
                          height={224}
                          sizes="112px"
                          className="h-full w-full object-cover"
                          style={avatarStyle(open.image)}
                        />
                      </motion.span>
                    </button>
                  )}

                  {open.how && (
                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                      {open.how}
                    </p>
                  )}

                  <Paragraphs
                    entry={open}
                    className={`mt-4 font-serif tracking-tight ${stageQuoteSize(open.quote)}`}
                  />

                  <p className="mt-8 font-mono text-xs uppercase tracking-[0.15em]">
                    {open.name}
                  </p>
                  {(open.role || open.company) && (
                    <p className="mt-1 text-sm text-muted">
                      {[open.role, open.company].filter(Boolean).join(" · ")}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
