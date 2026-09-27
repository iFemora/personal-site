"use client";

import Filmstrip from "@/components/Filmstrip";
import type { SeriesSummary } from "@/lib/gallerySeries";

type Props = { series: SeriesSummary[] };

/** A filmstrip per series above the contact sheet: sequenced work, kept out of the shuffle. */
export default function SeriesStrip({ series }: Props) {
  if (series.length === 0) return null;

  return (
    <div className="space-y-10">
      {series.map((s, i) => (
        <Filmstrip
          key={s.slug}
          href={`/gallery/${s.slug}`}
          frames={s.cover}
          title={s.title}
          tagline={s.tagline}
          meta={`${s.count} frames · ${s.location} · ${s.date}`}
          event={{ name: "gallery_series_open", label: s.slug }}
          delay={i * 0.05}
        />
      ))}
    </div>
  );
}
