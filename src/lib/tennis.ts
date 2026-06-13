import tennisData from "@/../content/tennis.json";

export type TennisMedia = {
  src: string; // under /public, e.g. "/tennis/2026-06-01-rally.jpg"
  alt?: string;
  caption?: string;
  /** Intrinsic dimensions for images, used to reserve layout space. */
  width?: number;
  height?: number;
  poster?: string; // videos only
};

export type TennisEntry = {
  id: string;
  date: string; // ISO YYYY-MM-DD
  title?: string;
  body?: string; // double newlines split into paragraphs
  image?: TennisMedia;
  video?: TennisMedia;
};

export const tennisEntries: TennisEntry[] = tennisData as TennisEntry[];

export function getTennisEntries(): TennisEntry[] {
  return [...tennisEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatTennisDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
