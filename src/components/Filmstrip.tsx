"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@femora/design-system";
import { trackEvent, type TrackedEvent } from "@/lib/track";

export type FilmstripFrame = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

type Props = {
  href: string;
  frames: FilmstripFrame[];
  title: string;
  tagline?: string;
  meta: string;
  /** Frame shape: portrait contact-sheet frames or 16:9 stills. */
  aspect?: "portrait" | "video";
  event?: { name: TrackedEvent; label: string };
  delay?: number;
};

/** A strip of small duotone frames that link somewhere as one; colour floods on hover. */
export default function Filmstrip({
  href,
  frames,
  title,
  tagline,
  meta,
  aspect = "portrait",
  event,
  delay = 0,
}: Props) {
  const cols =
    frames.length >= 5
      ? "grid-cols-5"
      : frames.length === 4
        ? "grid-cols-4"
        : frames.length === 3
          ? "grid-cols-3"
          : "grid-cols-2";

  return (
    <Reveal delay={delay}>
      <Link
        href={href}
        onClick={() => {
          if (event) trackEvent(event.name, { label: event.label });
        }}
        className="group block"
      >
        <div className={`grid ${cols} gap-1 sm:gap-1.5`}>
          {frames.map((f) => (
            <span
              key={f.id}
              className={`block overflow-hidden rounded-sm ${
                aspect === "video" ? "aspect-video" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={f.src}
                alt=""
                width={f.width}
                height={f.height}
                sizes="(max-width: 640px) 25vw, 260px"
                className="block h-full w-full object-cover transition-[filter,transform] duration-500 ease-out grayscale-[0.85] sepia-[0.12] group-hover:scale-[1.015] group-hover:grayscale-0 group-hover:sepia-0"
              />
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-serif text-lg leading-snug sm:text-xl">
            <span className="text-accent underline underline-offset-4 group-hover:no-underline">
              {title}
            </span>
            {tagline && <span className="italic text-muted"> — {tagline}</span>}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            {meta} →
          </p>
        </div>
      </Link>
    </Reveal>
  );
}
