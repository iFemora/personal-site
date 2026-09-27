"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { DrawnRule, Reveal } from "@femora/design-system";
import { EASE } from "@femora/design-system/ease";
import Lightbox from "@/components/Lightbox";
import type { GallerySeries, SeriesFrame } from "@/lib/gallerySeries";
import { getSeriesFrames } from "@/lib/gallerySeries";

type Props = { series: GallerySeries };

/** Consecutive frames that share a group sit on one row; the rest stand alone. */
function rowsOf(frames: SeriesFrame[]): SeriesFrame[][] {
  const rows: SeriesFrame[][] = [];
  for (const f of frames) {
    const last = rows[rows.length - 1];
    if (f.group && last && last[0].group === f.group) last.push(f);
    else rows.push([f]);
  }
  return rows;
}

const isPortrait = (f: SeriesFrame) => f.height >= f.width;

// Every frame sits desaturated until hover floods the colour back.
const imgClass =
  "block w-full transition-[filter,transform] duration-500 ease-out grayscale-[0.85] sepia-[0.12] group-hover:scale-[1.015] group-hover:grayscale-0 group-hover:sepia-0";

function Frame({
  frame,
  meta,
  sizes,
  onOpen,
  priority = false,
  className = "",
}: {
  frame: SeriesFrame;
  meta: string;
  sizes: string;
  onOpen: () => void;
  priority?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.figure
      className={className}
      initial={reduced || priority ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full cursor-zoom-in text-left"
        aria-label={`Open ${frame.alt}`}
      >
        <span className="block overflow-hidden rounded-sm">
          <Image
            src={frame.src}
            alt={frame.alt}
            width={frame.width}
            height={frame.height}
            sizes={sizes}
            priority={priority}
            className={imgClass}
          />
        </span>
        <figcaption className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-muted sm:text-[11px]">
          {meta}
        </figcaption>
      </button>
      {frame.caption && (
        <p className="mt-1.5 px-0.5 font-serif text-sm italic leading-snug text-foreground">
          {frame.caption}
        </p>
      )}
    </motion.figure>
  );
}

export default function SeriesSequence({ series }: Props) {
  const frames = getSeriesFrames(series);
  const indexOf = new Map(frames.map((f, i) => [f.id, i]));
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) =>
        i === null ? null : (i + dir + frames.length) % frames.length
      ),
    [frames.length]
  );

  const metaOf = (f: SeriesFrame) =>
    [f.location ?? series.location, f.date ?? series.date]
      .filter(Boolean)
      .join(" · ");
  const openerFor = (f: SeriesFrame) => () =>
    setOpenIndex(indexOf.get(f.id) ?? null);

  return (
    <>
      {/* Opening spread: the intro beside the first frame, as in a printed folio. */}
      <section className="grid gap-10 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-12">
        <div className="space-y-6">
          <Reveal immediate delay={0.45}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              <span className="text-accent">Series</span> — {frames.length}{" "}
              frames · {series.location} · {series.date}
            </p>
          </Reveal>
          <Reveal immediate delay={0.5}>
            <p className="text-lg leading-relaxed">{series.intro}</p>
          </Reveal>
          <Reveal immediate delay={0.55}>
            <p className="font-serif text-sm italic text-muted">
              Frames open in monochrome. Hover to restore the colour; click to
              open one.
            </p>
          </Reveal>
        </div>
        <Reveal immediate delay={0.5}>
          <Frame
            frame={series.hero}
            meta={metaOf(series.hero)}
            onOpen={openerFor(series.hero)}
            priority
            sizes="(max-width: 640px) 100vw, 640px"
          />
        </Reveal>
      </section>

      {series.chapters.map((chapter, ci) => (
        <section key={chapter.title}>
          <DrawnRule className="my-14 sm:my-20" />

          <div className="mb-8 grid gap-4 sm:mb-12 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span className="text-accent">
                  {String(ci + 1).padStart(2, "0")}
                </span>{" "}
                / {chapter.title}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="wonk font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                {chapter.title}
              </h2>
              {chapter.note && (
                <p className="mt-2 font-serif text-lg italic text-muted">
                  {chapter.note}
                </p>
              )}
            </Reveal>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {rowsOf(chapter.frames).map((row) =>
              row.length === 1 ? (
                <Frame
                  key={row[0].id}
                  frame={row[0]}
                  meta={metaOf(row[0])}
                  onOpen={openerFor(row[0])}
                  sizes={
                    isPortrait(row[0])
                      ? "(max-width: 640px) 100vw, 640px"
                      : "(max-width: 1100px) 100vw, 1100px"
                  }
                  className={isPortrait(row[0]) ? "max-w-[640px]" : ""}
                />
              ) : (
                <div
                  key={row.map((f) => f.id).join("+")}
                  className={`grid items-start gap-5 sm:gap-6 ${
                    row.length >= 3 ? "sm:grid-cols-3" : "grid-cols-2"
                  }`}
                >
                  {row.map((f) => (
                    <Frame
                      key={f.id}
                      frame={f}
                      meta={metaOf(f)}
                      onOpen={openerFor(f)}
                      sizes={
                        row.length >= 3
                          ? "(max-width: 640px) 100vw, 360px"
                          : "(max-width: 640px) 50vw, 540px"
                      }
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </section>
      ))}

      <DrawnRule className="my-14 sm:my-20" />

      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <Link
            href="/gallery"
            className="text-accent underline underline-offset-4 hover:no-underline"
          >
            ← Back to the gallery
          </Link>
        </p>
      </Reveal>

      <Lightbox
        frames={frames.map((f) => ({
          ...f,
          location: f.location ?? series.location,
          date: f.date ?? series.date,
        }))}
        index={openIndex}
        onClose={close}
        onStep={step}
      />
    </>
  );
}
