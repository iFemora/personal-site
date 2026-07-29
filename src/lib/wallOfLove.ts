import wallData from "@/../content/wall-of-love.json";

export type WallEntry = {
  id: string;
  name: string;
  /** What they do, in their words (lightly tidied). */
  role?: string;
  /** "How do we know each other?", verbatim from the form. */
  how?: string;
  date?: string; // YYYY-MM-DD, from the form timestamp
  /** Why they love me: the work, the character, or just love. Work entries feed the /work testimonials later. */
  kind?: "work" | "character" | "love";
  /** Double newlines break into paragraphs. */
  quote: string;
  /** An exact substring of the quote that gets the marker swipe. */
  highlight?: string;
  image?: { src: string; alt: string; width: number; height: number };
  /** Hand-picked for the /work page testimonial strip. */
  featured?: boolean;
};

export const wallEntries = wallData as WallEntry[];

export function getWallEntries(): WallEntry[] {
  return wallEntries;
}
