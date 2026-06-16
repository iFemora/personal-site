import type { Metadata } from "next";
import { getFieldNotes, formatFieldNoteDate } from "@/lib/fieldNotes";
import AudioWaveform from "@/components/AudioWaveform";
import Reveal from "@/components/motion/Reveal";
import DrawnRule from "@/components/motion/DrawnRule";
import MaskedLines from "@/components/motion/MaskedLines";
import ProximityType from "@/components/motion/ProximityType";
import ExternalArrow from "@/components/ExternalArrow";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short observations and the occasional voice memo. Lower bar than essays; higher than X.",
};

export default function FieldNotesPage() {
  const notes = getFieldNotes();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Notes", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["Shorter than essays. Often half-finished thoughts."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      {notes.length === 0 ? (
        <p className="leading-relaxed text-muted">
          Nothing yet. First note coming soon.
        </p>
      ) : (
        <ol className="space-y-14 sm:space-y-20">
          {notes.map((note, i) => (
            <li key={note.id}>
              <Reveal delay={Math.min(i, 2) * 0.08}>
              <article
                id={note.id}
                className="grid scroll-mt-24 gap-4 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12"
              >
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted sm:pt-1 sm:text-right">
                  {formatFieldNoteDate(note.date)}
                </p>

                <div>
                {note.body &&
                  note.body.split("\n\n").map((para, i) => (
                    <p key={i} className="mt-4 text-lg leading-relaxed first:mt-0">
                      {para}
                    </p>
                  ))}

                {note.audio && (
                  <div className="mt-5 first:mt-0">
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
                          {l.label}
                          <ExternalArrow className="ml-1 text-accent" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                </div>
              </article>
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
