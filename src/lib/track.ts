import { sendGAEvent } from "@next/third-parties/google";

export type TrackedEvent =
  | "palette_picker_open"
  | "palette_selected"
  | "theme_toggle"
  | "gallery_section_select"
  | "gallery_series_open"
  | "studio_video_play"
  | "studio_room_open"
  | "nav_studio_open"
  | "love_filter_select"
  | "love_search"
  | "love_entry_open"
  | "social_link_click"
  | "field_note_complete"
  | "field_note_transcript_open"
  | "tennis_video_play"
  | "book_intro_click";

/** GA4 custom events beyond the original three (cv_download,
    field_note_play, gallery_photo_view), which call sendGAEvent
    directly. New events go through here so a blocked or unloaded
    gtag never throws. */
export function trackEvent(
  name: TrackedEvent,
  params?: Record<string, string | number>
) {
  try {
    sendGAEvent("event", name, params ?? {});
  } catch {
    /* analytics blocked — the site keeps working */
  }
}
