import type { Metadata } from "next";
import { getFieldNotes, formatFieldNoteDate } from "@/lib/fieldNotes";
import AudioWaveform from "@/components/AudioWaveform";
import Reveal from "@/components/motion/Reveal";
import DrawnRule from "@/components/motion/DrawnRule";
import MaskedLines from "@/components/motion/MaskedLines";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short observations and the occasional voice memo. Lower bar than essays; higher than X.",
};

export default function FieldNotesPage() {
  const notes = getFieldNotes();

  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20">
      <MaskedLines
        as="h1"
        lines={["Notes"]}
        className="font-serif text-5xl tracking-tight sm:text-6xl"
      />
      <MaskedLines
        as="p"
        lines={["Shorter than essays. Often half-finished thoughts."]}
        delay={0.18}
        className="mt-3 font-serif text-xl italic text-muted"
      />

      <DrawnRule className="my-12" immediate delay={0.35} />

      {notes.length === 0 ? (
        <p className="leading-relaxed text-muted">
          Nothing yet. First note coming soon.
        </p>
      ) : (
        <ol className="space-y-12 sm:space-y-16">
          {notes.map((note, i) => (
            <li key={note.id}>
              <Reveal delay={Math.min(i, 2) * 0.08}>
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
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
