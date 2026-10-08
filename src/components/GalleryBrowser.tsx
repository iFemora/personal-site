"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import GalleryGrid from "@/components/GalleryGrid";
import SeriesStrip from "@/components/SeriesStrip";
import type { GalleryFrame } from "@/lib/gallery";
import type { SeriesSummary } from "@/lib/gallerySeries";
import { EASE } from "@femora/design-system/ease";
import { trackEvent } from "@/lib/track";

type SectionKey = "photos" | "art" | "books";
type ShelfKey = "all" | "faith" | "product" | "others";

const SHELVES: { key: ShelfKey; label: string }[] = [
  { key: "all", label: "all" },
  { key: "faith", label: "faith" },
  { key: "product", label: "product" },
  { key: "others", label: "others" },
];

type Props = {
  photos: GalleryFrame[];
  art: GalleryFrame[];
  books: GalleryFrame[];
  /** Sequenced photo series, shown above the shuffled contact sheet. */
  series?: SeriesSummary[];
  /** Which pill segment is selected on first render (from `?section=`). */
  initialSection?: SectionKey;
};

/** The pill toggle from the wall of love: click a segment or slide across. */
function Toggle<K extends string>({
  options,
  value,
  onChange,
  layoutId,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
  layoutId: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const sliding = useRef(false);

  const selectFromPoint = (clientX: number) => {
    const buttons =
      ref.current?.querySelectorAll<HTMLButtonElement>("button[data-key]");
    if (!buttons) return;
    for (const b of buttons) {
      const r = b.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right) {
        onChange(b.dataset.key as K);
        return;
      }
    }
  };

  return (
    <div
      ref={ref}
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
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            data-key={o.key}
            aria-pressed={active}
            onClick={() => onChange(o.key)}
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
                  layoutId={layoutId}
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-accent/10"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              ))}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function GalleryBrowser({
  photos,
  art,
  books,
  series = [],
  initialSection = "photos",
}: Props) {
  const reduced = useReducedMotion();
  const [section, setSection] = useState<SectionKey>(initialSection);
  const [shelf, setShelf] = useState<ShelfKey>("all");

  // Trailing debounce so sliding across the pill reports only where the
  // pointer settles, and re-selecting the current segment reports nothing.
  const lastSent = useRef<string>(`${initialSection}:`);
  const sendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackSelect = (params: { section: SectionKey; shelf?: ShelfKey }) => {
    const key = `${params.section}:${params.shelf ?? ""}`;
    if (sendTimer.current) clearTimeout(sendTimer.current);
    sendTimer.current = setTimeout(() => {
      if (lastSent.current === key) return;
      lastSent.current = key;
      trackEvent("gallery_section_select", params);
    }, 400);
  };

  const sections: { key: SectionKey; label: string }[] = [
    { key: "photos", label: "photos" },
    ...(art.length > 0 ? [{ key: "art" as const, label: "art" }] : []),
    ...(books.length > 0 ? [{ key: "books" as const, label: "books" }] : []),
  ];

  const shelvesOf = (b: GalleryFrame): string[] => {
    const c = b.category ?? "others";
    return Array.isArray(c) ? c : [c];
  };
  const shelves = SHELVES.filter(
    (s) => s.key === "all" || books.some((b) => shelvesOf(b).includes(s.key))
  );
  const shownBooks =
    shelf === "all"
      ? books
      : books.filter((b) => shelvesOf(b).includes(shelf));

  const intro: Record<SectionKey, { eyebrow: string; body: string }> = {
    photos: {
      eyebrow:
        photos.length === 0
          ? "Contact sheet — in the darkroom"
          : `Contact sheet — ${photos.length} frames`,
      body:
        photos.length === 0
          ? "The prints are still drying. Photographs land here soon — the good ones, eventually, once I stop second-guessing which are the good ones."
          : "Photos start in monochrome. Hover to restore colour; click to open one.",
    },
    art: {
      eyebrow: `Made — ${art.length} pieces`,
      body: "Artwork starts in monochrome too. Hover to restore the colour.",
    },
    books: {
      eyebrow: `Shelf — ${shownBooks.length} spines`,
      body: "Books I have on my shelf. I have read some, not all. Covers for now; arguments about them later.",
    },
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Toggle
          options={sections}
          value={section}
          onChange={(k) => {
            setSection(k);
            trackSelect({ section: k });
          }}
          layoutId="gallery-section-thumb"
        />
        {section === "books" && shelves.length > 2 && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <Toggle
              options={shelves}
              value={shelf}
              onChange={(k) => {
                setShelf(k);
                trackSelect({ section: "books", shelf: k });
              }}
              layoutId="gallery-shelf-thumb"
            />
          </motion.div>
        )}
      </div>

      <section className="mb-10 mt-8 grid gap-6 sm:mb-12 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span className="text-accent">{intro[section].eyebrow.split(" — ")[0]}</span>
          {" — "}
          {intro[section].eyebrow.split(" — ")[1]}
        </p>
        <p className="text-lg leading-relaxed">{intro[section].body}</p>
      </section>

      {section === "photos" && series.length > 0 && (
        <div className="mb-14 sm:mb-20">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Series</span> — sequenced, not
            shuffled
          </p>
          <SeriesStrip series={series} />
          <div className="mt-14 border-t border-rule sm:mt-20" />
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Contact sheet</span> — fresh order
            on every visit
          </p>
        </div>
      )}
      {section === "photos" && photos.length > 0 && (
        <GalleryGrid key="photos" frames={photos} />
      )}
      {section === "art" && <GalleryGrid key="art" frames={art} />}
      {section === "books" &&
        (shownBooks.length === 0 ? (
          <p className="font-serif text-lg italic leading-relaxed text-muted">
            Nothing on this shelf yet.
          </p>
        ) : (
          <GalleryGrid key={`books-${shelf}`} frames={shownBooks} dense />
        ))}
    </>
  );
}
