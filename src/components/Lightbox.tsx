"use client";

import { useEffect } from "react";
import Image from "next/image";
import { sendGAEvent } from "@next/third-parties/google";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";

export type LightboxFrame = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  location?: string;
  date?: string;
  href?: string;
  note?: string;
};

type Props = {
  frames: LightboxFrame[];
  /** Index of the open frame, or null when closed. */
  index: number | null;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
};

/** The darkroom lightbox shared by the contact sheet and the series pages. */
export default function Lightbox({ frames, index, onClose, onStep }: Props) {
  const reduced = useReducedMotion();
  const open = index === null ? null : frames[index];

  // Counts every photo viewed, including prev/next steps.
  useEffect(() => {
    if (!open) return;
    sendGAEvent("event", "gallery_photo_view", { label: open.id });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, onStep]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-background/95 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
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
              onClick={() => onStep(-1)}
              className="text-muted transition-colors hover:text-accent"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-muted transition-colors hover:text-accent"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onStep(1)}
              className="text-muted transition-colors hover:text-accent"
            >
              Next →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
