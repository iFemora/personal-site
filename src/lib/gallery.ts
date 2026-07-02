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
  /** "photo" (contact sheet), "art" (made things), or "book" (the shelf). Defaults to photo. All render duotone until hover. */
  kind?: "photo" | "art" | "book";
  /** Optional outbound link surfaced on the caption. */
  href?: string;
  /** A small line rendered beneath the frame (e.g. a dedication, or a book's author). */
  note?: string;
  /** Shelf only: where the book sits in the reading life. */
  status?: "reading" | "queued" | "finished";
  /** Shelf only: a one-line marginalia verdict, rendered beneath the note. */
  verdict?: string;
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

export function getBooks(): GalleryFrame[] {
  return galleryFrames.filter((f) => f.kind === "book");
}
