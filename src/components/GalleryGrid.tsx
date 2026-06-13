"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { GalleryFrame } from "@/lib/gallery";
import { EASE } from "@/components/motion/Reveal";

type Props = {
  frames: GalleryFrame[];
};

function frameNumber(i: number): string {
  return `FR-${String(i + 1).padStart(3, "0")}`;
}

export default function GalleryGrid({ frames }: Props) {
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

  return (
    <>
      {/* Contact sheet */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {frames.map((frame, i) => (
          <motion.figure
            key={frame.id}
            className="mb-5 break-inside-avoid"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{
              duration: 0.7,
              ease: EASE,
              delay: (i % 3) * 0.08,
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full cursor-zoom-in text-left"
              aria-label={`Open ${frame.alt}`}
            >
              <span className="block overflow-hidden rounded-sm">
                <img
                  src={frame.src}
                  alt={frame.alt}
                  width={frame.width}
                  height={frame.height}
                  loading="lazy"
                  className="block w-full transition-[filter,transform] duration-500 ease-out grayscale-[0.85] sepia-[0.12] group-hover:scale-[1.015] group-hover:grayscale-0 group-hover:sepia-0"
                />
              </span>
              <figcaption className="mt-2 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                <span className="text-accent">{frameNumber(i)}</span>
                {(frame.location || frame.date) && (
                  <span>
                    {[frame.location, frame.date]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                )}
              </figcaption>
            </button>
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
            <motion.img
              key={open.id}
              src={open.src}
              alt={open.alt}
              className="max-h-[80vh] max-w-full rounded-sm object-contain"
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            />
            <div
              className="mt-5 flex w-full max-w-[720px] items-baseline justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-accent">{frameNumber(openIndex)}</span>
              <span className="truncate">{open.caption ?? open.alt}</span>
              <span className="whitespace-nowrap">
                {[open.location, open.date].filter(Boolean).join(" · ")}
              </span>
            </div>
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
