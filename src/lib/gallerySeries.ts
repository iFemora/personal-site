import seriesData from "@/../content/gallery-series.json";

export type SeriesFrame = {
  id: string;
  src: string; // under /public/gallery/<slug>/
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Overrides the series location on the caption line. */
  location?: string;
  /** Overrides the series date on the caption line. */
  date?: string;
  /** Consecutive frames sharing a group render side by side (2 = pair, 3 = triptych). */
  group?: string;
};

export type SeriesChapter = {
  title: string;
  /** A short line under the chapter title. */
  note?: string;
  frames: SeriesFrame[];
};

export type GallerySeries = {
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  location: string;
  date: string;
  /** Frame ids used for the strip on /gallery, in order. */
  cover: string[];
  hero: SeriesFrame;
  chapters: SeriesChapter[];
};

export type SeriesSummary = Pick<
  GallerySeries,
  "slug" | "title" | "tagline" | "location" | "date"
> & {
  count: number;
  cover: SeriesFrame[];
};

const series: GallerySeries[] = seriesData as GallerySeries[];

export function getSeries(): GallerySeries[] {
  return series;
}

export function getSeriesBySlug(slug: string): GallerySeries | undefined {
  return series.find((s) => s.slug === slug);
}

export function getSeriesFrames(s: GallerySeries): SeriesFrame[] {
  return [s.hero, ...s.chapters.flatMap((c) => c.frames)];
}

export function getSeriesSummaries(): SeriesSummary[] {
  return series.map((s) => {
    const frames = getSeriesFrames(s);
    const byId = new Map(frames.map((f) => [f.id, f]));
    const cover = s.cover
      .map((id) => byId.get(id))
      .filter((f): f is SeriesFrame => Boolean(f));
    return {
      slug: s.slug,
      title: s.title,
      tagline: s.tagline,
      location: s.location,
      date: s.date,
      count: frames.length,
      cover: cover.length > 0 ? cover : frames.slice(0, 5),
    };
  });
}
