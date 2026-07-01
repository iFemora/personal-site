import galleryData from "@/../content/gallery.json";

export type GalleryFrame = {
  id: string;
  src: string; // under /public/gallery/
  alt: string;
  caption?: string;
  location?: string;
  date?: string; // freeform: "2026" or "2026-06-01"
  width: number;
  height: number;
  /** "photo" (duotone contact sheet) or "art" (full colour). Defaults to photo. */
  kind?: "photo" | "art";
  /** Optional outbound link surfaced on the caption. */
  href?: string;
  /** A small line rendered beneath the frame (e.g. a dedication). */
  note?: string;
};

export const galleryFrames: GalleryFrame[] = galleryData as GalleryFrame[];

export function getGalleryFrames(): GalleryFrame[] {
  return galleryFrames;
}

export function getPhotos(): GalleryFrame[] {
  return galleryFrames.filter((f) => (f.kind ?? "photo") === "photo");
}

export function getArt(): GalleryFrame[] {
  return galleryFrames.filter((f) => f.kind === "art");
}
