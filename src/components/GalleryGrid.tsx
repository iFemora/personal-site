"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { GalleryFrame } from "@/lib/gallery";
import { EASE } from "@femora/design-system/ease";

type Props = {
  frames: GalleryFrame[];
  /** Serial prefix so each section numbers independently. */
  prefix?: string;
  /** Denser columns for small sources (book covers) so they render at or below native size. */
  dense?: boolean;
};

function frameNumber(prefix: string, i: number): string {
  return `${prefix}-${String(i + 1).padStart(3, "0")}`;
}

export default function GalleryGrid({
  frames,
  prefix = "FR",
  dense = false,
}: Props) {
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) =>
        i === null ? null : (i + dir + frames.length) % frames.length
      ),
    [frames.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  const open = openIndex === null ? null : frames[openIndex];

  // Every frame sits desaturated until hover floods the colour back.
  const imgClass =
    "block w-full transition-[filter,transform] duration-500 ease-out grayscale-[0.85] sepia-[0.12] group-hover:scale-[1.015] group-hover:grayscale-0 group-hover:sepia-0";

  return (
    <>
      {/* Contact sheet */}
      <div
        className={
          dense
            ? "columns-2 gap-4 sm:columns-3 lg:columns-5"
            : "columns-1 gap-5 sm:columns-2 lg:columns-3"
        }
      >
        {frames.map((frame, i) => (
          <motion.figure
            key={frame.id}
            className="mb-5 break-inside-avoid"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full cursor-zoom-in text-left"
              aria-label={`Open ${frame.alt}`}
            >
              <span className="block overflow-hidden rounded-sm">
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  width={frame.width}
                  height={frame.height}
                  sizes={
                    dense
                      ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                  }
                  unoptimized={frame.src.endsWith(".gif")}
                  priority={i < 3}
                  className={imgClass}
                />
              </span>
              <figcaption className="mt-2 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                <span className="text-accent">{frameNumber(prefix, i)}</span>
                {frame.status ? (
                  <span
                    className={
                      frame.status === "reading" ? "text-accent" : undefined
                    }
                  >
                    {frame.status}
                  </span>
                ) : (
                  (frame.location || frame.date) && (
                    <span>
                      {[frame.location, frame.date]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )
                )}
              </figcaption>
            </button>
            {(frame.caption || frame.note || frame.href) && (
              <div className="mt-1.5 px-0.5">
                {frame.caption && (
                  <p className="font-serif text-sm italic leading-snug text-foreground">
                    {frame.href ? (
                      <a
                        href={frame.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline underline-offset-4 hover:no-underline"
                      >
                        {frame.caption} ↗
                      </a>
                    ) : (
                      frame.caption
                    )}
                  </p>
                )}
                {frame.note && (
                  <p className="mt-1 font-serif text-xs italic text-muted">
                    {frame.note}
                  </p>
                )}
                {frame.verdict && (
                  <p className="mt-1.5 font-serif text-[13px] italic leading-snug text-foreground/80">
                    &ldquo;{frame.verdict}&rdquo;
                  </p>
                )}
              </div>
            )}
          </motion.figure>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-background/95 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={open.alt}
          >
            {/* The print "develops": opens duotone like its thumbnail, floods to colour. */}
            <motion.div
              key={open.id}
              className="flex min-h-0 justify-center"
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
                filter: { duration: 0.9, ease: EASE, delay: 0.15 },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={open.src}
                alt={open.alt}
                width={open.width}
                height={open.height}
                sizes="100vw"
                quality={85}
                unoptimized={open.src.endsWith(".gif")}
                className="max-h-[78vh] w-auto max-w-full rounded-sm object-contain"
              />
            </motion.div>
            <div
              className="mt-5 flex w-full max-w-[720px] items-baseline justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-accent">
                {frameNumber(prefix, openIndex)}
              </span>
              <span className="truncate">
                {open.href ? (
                  <a
                    href={open.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {open.caption ?? open.alt} ↗
                  </a>
                ) : (
                  open.caption ?? open.alt
                )}
              </span>
              <span className="whitespace-nowrap">
                {[open.location, open.date].filter(Boolean).join(" · ")}
              </span>
            </div>
            {open.note && (
              <p
                className="mt-2 font-serif text-sm italic text-muted"
                onClick={(e) => e.stopPropagation()}
              >
                {open.note}
              </p>
            )}
            <div
              className="mt-6 flex gap-8 font-mono text-xs uppercase tracking-[0.18em]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => step(-1)}
                className="text-muted transition-colors hover:text-accent"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={close}
                className="text-muted transition-colors hover:text-accent"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="text-muted transition-colors hover:text-accent"
              >
                Next →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
