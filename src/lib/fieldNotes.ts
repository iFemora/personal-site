export type FieldNoteAudio = {
  src: string; // path under /public, e.g. "/field-notes/audio/2026-05-16-tennis.m4a"
  title?: string;
};

export type FieldNoteLink = {
  label: string;
  href: string;
};

export type FieldNote = {
  id: string; // unique slug, also used as the on-page anchor
  date: string; // ISO YYYY-MM-DD
  body?: string; // plain text; double newlines split into paragraphs
  audio?: FieldNoteAudio;
  transcript?: string;
  links?: FieldNoteLink[];
};

export const fieldNotes: FieldNote[] = [
  {
    id: "welcome",
    date: "2026-05-16",
    body: "Field notes is the place I'll put short observations — a sentence, a paragraph, occasionally a voice memo. Lower bar than an essay; higher than X. Some will turn into longer pieces on the writing page; most won't.\n\nAudio is coming. I want a phone-only workflow where I can record a memo and have it land here without touching a laptop. Until that's wired up, audio notes happen by AirDropping a voice memo from my phone to my Mac and pushing it like any other file.",
  },
];

export function getFieldNotes(): FieldNote[] {
  return [...fieldNotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatFieldNoteDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
