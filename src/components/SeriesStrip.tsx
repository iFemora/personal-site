"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@femora/design-system";
import type { SeriesSummary } from "@/lib/gallerySeries";
import { trackEvent } from "@/lib/track";

type Props = { series: SeriesSummary[] };

/** A filmstrip per series above the contact sheet: sequenced work, kept out of the shuffle. */
export default function SeriesStrip({ series }: Props) {
  if (series.length === 0) return null;

  return (
    <div className="space-y-10">
      {series.map((s, i) => (
        <Reveal key={s.slug} delay={i * 0.05}>
          <Link
            href={`/gallery/${s.slug}`}
            onClick={() => trackEvent("gallery_series_open", { label: s.slug })}
            className="group block"
          >
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {s.cover.map((f) => (
                <span
                  key={f.id}
                  className="block aspect-[4/5] overflow-hidden rounded-sm"
                >
                  <Image
                    src={f.src}
                    alt=""
                    width={f.width}
                    height={f.height}
                    sizes="(max-width: 640px) 20vw, 220px"
                    className="block h-full w-full object-cover transition-[filter,transform] duration-500 ease-out grayscale-[0.85] sepia-[0.12] group-hover:scale-[1.015] group-hover:grayscale-0 group-hover:sepia-0"
                  />
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="font-serif text-lg leading-snug sm:text-xl">
                <span className="text-accent underline underline-offset-4 group-hover:no-underline">
                  {s.title}
                </span>
                <span className="italic text-muted"> — {s.tagline}</span>
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                {s.count} frames · {s.location} · {s.date} →
              </p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
