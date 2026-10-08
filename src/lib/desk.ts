import deskData from "@/../content/desk.json";
import { getAllWriting } from "@/lib/writing";
import { getFieldNotes } from "@/lib/fieldNotes";

export type DeskItem = {
  label: string;
  title: string;
  body: string;
  href?: string;
  /** Link text; defaults to "Read more". */
  cta?: string;
};

export type Desk = {
  updated: string;
  items: DeskItem[];
};

/** "Updated {Month YYYY}" follows the freshest essay or field note, so
    the label can't go stale the way a hand-typed month did. */
function latestActivity(): string {
  const dates = [
    ...getAllWriting().map((w) => w.date),
    ...getFieldNotes().map((n) => n.date),
  ].filter(Boolean);
  const latest = dates.reduce((a, b) => (b > a ? b : a));
  return new Date(latest).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getDesk(): Desk {
  return { updated: latestActivity(), items: deskData.items as DeskItem[] };
}
