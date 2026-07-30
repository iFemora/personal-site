import { track } from "@vercel/analytics";

/** Central funnel events for /anatomy — the case study will be written
    from these numbers, so every event goes through here. */
export function anatomyEvent(
  name:
    | "anatomy_card_tapped"
    | "anatomy_chapter"
    | "anatomy_scenario"
    | "anatomy_run_complete"
    | "anatomy_actor_opened"
    | "anatomy_slider_used"
    | "anatomy_sound"
    | "anatomy_complete",
  data?: Record<string, string | number>
) {
  try {
    track(name, data);
  } catch {
    /* analytics blocked — the story still plays */
  }
}
