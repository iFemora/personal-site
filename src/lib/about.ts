import timelineData from "@/../content/about-timeline.json";

export type AboutBeat = {
  id: string;
  year: string; // "2019", "20XX" (placeholder), or "Now"
  title: string;
  caption?: string;
  image?: { src: string; alt: string }; // optional photo, treated duotone → color
};

export const aboutTimeline: AboutBeat[] = timelineData as AboutBeat[];

/** Chronological, earliest first; "Now" and unknown years sort to the end. */
export function getAboutTimeline(): AboutBeat[] {
  const rank = (y: string) =>
    /^\d+$/.test(y) ? parseInt(y, 10) : Number.POSITIVE_INFINITY;
  return [...aboutTimeline].sort((a, b) => rank(a.year) - rank(b.year));
}
