import type { Metadata } from "next";
import { getFieldNotes, formatFieldNoteDate } from "@/lib/fieldNotes";
import AudioWaveform from "@/components/AudioWaveform";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short observations and the occasional voice memo. Lower bar than essays; higher than X.",
};

export default function FieldNotesPage() {
  const notes = getFieldNotes();

  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20">
      <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">Notes</h1>
      <p className="mt-3 font-serif text-xl italic text-muted">
        Shorter than essays. Often half-finished thoughts.
      </p>

      <hr className="my-12 border-t border-rule" />

      {notes.length === 0 ? (
        <p className="leading-relaxed text-muted">
          Nothing yet. First note coming soon.
        </p>
      ) : (
        <ol className="space-y-12 sm:space-y-16">
          {notes.map((note) => (
            <li key={note.id}>
              <article id={note.id} className="scroll-mt-24">
                <p className="font-mono text-sm text-muted">
                  {formatFieldNoteDate(note.date)}
                </p>

                {note.body &&
                  note.body.split("\n\n").map((para, i) => (
                    <p key={i} className="mt-4 leading-relaxed">
                      {para}
                    </p>
                  ))}

                {note.audio && (
                  <div className="mt-5">
                    {note.audio.title && (
                      <p className="mb-3 font-serif italic text-muted">
                        {note.audio.title}
                      </p>
                    )}
                    <AudioWaveform src={note.audio.src} />
                  </div>
                )}

                {note.transcript && (
                  <details className="group mt-4 text-sm text-muted">
                    <summary className="cursor-pointer select-none underline underline-offset-4 hover:text-foreground hover:no-underline">
                      Transcript
                    </summary>
                    <div className="mt-3 leading-relaxed">
                      {note.transcript.split("\n\n").map((para, i) => (
                        <p key={i} className={i === 0 ? "" : "mt-3"}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </details>
                )}

                {note.links && note.links.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm">
                    {note.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline underline-offset-4 hover:no-underline"
                        >
                          {l.label} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
