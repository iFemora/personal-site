import studioData from "@/../content/studio.json";

export type StudioVideo = {
  provider: "youtube" | "vimeo";
  id: string;
  /** Shown on the play button, e.g. "1:08". */
  duration?: string;
};

export type StudioPiece = {
  id: string;
  /** Eyebrow, e.g. "Documentary" or "Addict Creative". */
  kind: string;
  title: string;
  /** One line under the title, e.g. "Promo video". */
  subtitle?: string;
  /** Mono meta lines beside the numeral: year, runtime, place. */
  meta: string[];
  role: string;
  body: string;
  /** A one-line note on the craft, rendered under the player. */
  caption?: string;
  /** Who else made it, rendered under the caption. */
  credits?: string;
  video?: StudioVideo;
  poster: { src: string; alt: string; width: number; height: number };
  link?: { href: string; label: string };
};

export type Studio = {
  tagline: string;
  intro: string[];
  pieces: StudioPiece[];
};

export const studio: Studio = studioData as Studio;

export function getStudio(): Studio {
  return studio;
}
