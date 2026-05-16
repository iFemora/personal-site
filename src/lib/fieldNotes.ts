import fieldNotesData from "@/../content/field-notes.json";

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

export const fieldNotes: FieldNote[] = fieldNotesData as FieldNote[];

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
