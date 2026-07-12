"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
} from "motion/react";
import type { AboutBeat } from "@/lib/about";

function StoryBeat({ beat, index }: { beat: AboutBeat; index: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const reached = useInView(ref, {
    once: true,
    margin: "0px 0px -48% 0px",
  });
  const active = useInView(ref, {
    margin: "-38% 0px -38% 0px",
  });
  const reduced = useReducedMotion();

  return (
    <motion.li
      ref={ref}
      id={`beat-${beat.id}`}
      className="relative scroll-mt-24 pl-8 sm:pl-0"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay: Math.min(index, 2) * 0.04 }}
    >
      <span
        aria-hidden
        className={`absolute left-[3px] top-2 z-10 h-[9px] w-[9px] rounded-full border-2 transition-[background-color,border-color,box-shadow,transform] duration-300 sm:left-[163px] ${
          reached
            ? "border-accent bg-accent"
            : "border-rule bg-background"
        } ${active ? "scale-125 shadow-[0_0_0_7px_color-mix(in_srgb,var(--accent)_12%,transparent)]" : ""}`}
      />

      <article className="grid gap-4 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <p
          aria-hidden
          className={`wonk font-serif text-4xl italic leading-none transition-colors duration-300 sm:pr-14 sm:text-right sm:text-5xl ${
            active ? "text-accent" : "text-rule"
          }`}
        >
          {beat.year}
        </p>
        <div>
          <h2
            className={`font-serif text-2xl leading-snug tracking-tight transition-colors duration-300 ${
              active ? "text-accent" : ""
            }`}
          >
            {beat.title}
          </h2>
          {beat.caption && (
            <p className="mt-3 text-lg leading-relaxed text-muted">
              {beat.caption}
            </p>
          )}
          {beat.image && (
            <figure className="group mt-5 overflow-hidden rounded-sm">
              <img
                src={beat.image.src}
                alt={beat.image.alt}
                loading="lazy"
                className="w-full transition-[filter,transform] duration-500 ease-out grayscale-[0.85] sepia-[0.12] group-hover:scale-[1.015] group-hover:grayscale-0 group-hover:sepia-0"
              />
            </figure>
          )}
        </div>
      </article>
    </motion.li>
  );
}

export default function StoryThread({ beats }: { beats: AboutBeat[] }) {
  const trackRef = useRef<HTMLOListElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });

  return (
    <div className="relative" aria-label="Life story">
      <div
        aria-hidden
        className="absolute bottom-2 left-[7px] top-2 w-px bg-rule sm:left-[167px]"
      />
      <motion.div
        aria-hidden
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent sm:left-[167px]"
        style={{ scaleY: reduced ? 1 : scrollYProgress }}
      />
      <ol ref={trackRef} className="space-y-14 sm:space-y-20">
        {beats.map((beat, index) => (
          <StoryBeat key={beat.id} beat={beat} index={index} />
        ))}
      </ol>
    </div>
  );
}
