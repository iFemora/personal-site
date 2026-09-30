"use client";

import ExternalArrow from "@/components/ExternalArrow";
import { trackEvent } from "@/lib/track";

/** Google Calendar appointment schedule ("Meet with Femi"). Hours and
    timezone are managed in Google Calendar, not here. */
export const BOOKING_URL = "https://calendar.app.google/yviSTFyCSgA2VHvd8";

/** The recruiter CTA under the hero tagline. A client island so the
    click can be counted before the tab opens. */
export default function BookIntroLink({
  location = "hero",
}: {
  location?: string;
}) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("book_intro_click", { link_location: location })}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-background transition-colors duration-300 hover:bg-foreground sm:text-xs"
    >
      Book an intro
      <ExternalArrow className="text-background" />
    </a>
  );
}
