"use client";

import { trackEvent } from "@/lib/track";

type Props = {
  noteId: string;
  transcript: string;
};

export default function NoteTranscript({ noteId, transcript }: Props) {
  return (
    <details
      className="group mt-4 text-sm text-muted"
      onToggle={(e) => {
        if (e.currentTarget.open) {
          trackEvent("field_note_transcript_open", { note_id: noteId });
        }
      }}
    >
      <summary className="cursor-pointer select-none underline underline-offset-4 hover:text-foreground hover:no-underline">
        Transcript
      </summary>
      <div className="mt-3 leading-relaxed">
        {transcript.split("\n\n").map((para, i) => (
          <p key={i} className={i === 0 ? "" : "mt-3"}>
            {para}
          </p>
        ))}
      </div>
    </details>
  );
}
