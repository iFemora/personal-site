"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { GalleryFrame } from "@/lib/gallery";
import { EASE } from "@femora/design-system/ease";
import Lightbox from "@/components/Lightbox";

type Props = {
  frames: GalleryFrame[];
  /** Denser columns for small sources (book covers) so they render at or below native size. */
  dense?: boolean;
};

export default function GalleryGrid({ frames, dense = false }: Props) {
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
            initial={{ opacity: 0, y: 16 }}
            {...(reduced
              ? { animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
              : {
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "0px 0px -8% 0px" },
                  transition: { duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 },
                })}
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
              {(frame.status || frame.location || frame.date) && (
                <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  {frame.status ? (
                    <span
                      className={
                        frame.status === "reading" ? "text-accent" : undefined
                      }
                    >
                      {frame.status}
                    </span>
                  ) : (
                    <span>
                      {[frame.location, frame.date]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}
                </figcaption>
              )}
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

      <Lightbox
        frames={frames}
        index={openIndex}
        onClose={close}
        onStep={step}
      />
    </>
  );
}
