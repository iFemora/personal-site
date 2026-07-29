import wallData from "@/../content/wall-of-love.json";

export type WallEntry = {
  id: string;
  name: string;
  /** What they do, in their words (lightly tidied). */
  role?: string;
  /** Where they work — joins the role line, and feeds the /work strip later. */
  company?: string;
  /** "How do we know each other?", verbatim from the form. */
  how?: string;
  date?: string; // YYYY-MM-DD, from the form timestamp
  /** Why they love me: the work, the character, or just love. Work entries feed the /work testimonials later. */
  kind?: "work" | "character" | "love";
  /** Double newlines break into paragraphs. */
  quote: string;
  /** Exact substrings of the quote that get the marker swipe. */
  highlights?: string[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** CSS object-position for the avatar crop, e.g. "50% 28%" to keep a face in frame. */
    position?: string;
  };
  /** Hand-picked for the /work page testimonial strip. */
  featured?: boolean;
};

export const wallEntries = wallData as WallEntry[];

export function getWallEntries(): WallEntry[] {
  return wallEntries;
}
