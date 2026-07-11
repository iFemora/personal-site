import deskData from "@/../content/desk.json";

export type DeskItem = {
  label: string;
  title: string;
  body: string;
  href?: string;
};

export type Desk = {
  updated: string;
  items: DeskItem[];
};

export function getDesk(): Desk {
  return deskData as Desk;
}
