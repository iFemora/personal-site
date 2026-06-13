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
};

export const galleryFrames: GalleryFrame[] = galleryData as GalleryFrame[];

export function getGalleryFrames(): GalleryFrame[] {
  return galleryFrames;
}
