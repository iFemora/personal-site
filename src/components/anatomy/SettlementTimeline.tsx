"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { anatomyEvent } from "@/lib/anatomyTrack";

/* ── Act II: the approval was a promise; this is the money keeping it.
   Eighteen hours compressed into ten seconds, in the same grammar as
   the two seconds above: a rail, a travelling light, scenes that stay
   lit once reached. ALL COPY DRAFT pending Femi's voice pass. ───────── */

const SCENES = [
  {
    key: "tap",
    time: "5:03 PM",
    minutes: 17 * 60 + 3,
    name: "The tap",
    line: "Your approval, a promise on file. No money has moved.",
  },
  {
    key: "batch",
    time: "10:14 PM",
    minutes: 22 * 60 + 14,
    name: "Batch close",
    line: "The shop closes out. Every promise of the day leaves in one clearing file.",
  },
  {
    key: "netting",
    time: "2:00 AM",
    minutes: 26 * 60,
    name: "The netting",
    line: "The network totals what every bank owes every other bank. A million payments become a short list of numbers.",
  },
  {
    key: "settle",
    time: "9:00 AM",
    minutes: 33 * 60,
    name: "Settlement",
    line: "Banks square up over the central bank's rails. This is the moment money actually moves.",
  },
  {
    key: "arrive",
    time: "11:30 AM",
    minutes: 35 * 60 + 30,
    name: "Arrival",
    line: "The merchant's account receives yesterday — minus the fees you watched above.",
  },
] as const;

const PLAY_MS = 10000;
const START_MIN = SCENES[0].minutes;
const END_MIN = SCENES[SCENES.length - 1].minutes;
const SPAN_MIN = END_MIN - START_MIN;

/* Scene positions along the rail: evenly spaced, centers at
   10 / 30 / 50 / 70 / 90 percent (five stops). */
const posPercent = (i: number) => 10 + i * 20;

/* When each scene is reached, as a fraction of the play: proportional
   to real elapsed time, so the night reads long and the morning short. */
const SCENE_AT = SCENES.map((s) => (s.minutes - START_MIN) / SPAN_MIN);

function clockLabel(minutes: number): string {
  const m = Math.round(minutes) % (24 * 60);
  const h24 = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm} ${ampm}`;
}

function SceneGlyph({ kind }: { kind: string }) {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      {kind === "tap" && (
        <>
          {[4.5, 8, 11.5].map((r) => (
            <path
              key={r}
              d={`M ${8 + r * 0.18} ${12 - r} A ${r} ${r} 0 0 1 ${8 + r * 0.18} ${12 + r}`}
              {...stroke}
            />
          ))}
        </>
      )}
      {kind === "batch" && (
        <>
          <path d="M6.5 3.5h8l3 3v14h-11v-17Z" {...stroke} />
          <path d="M14.5 3.5v3h3" {...stroke} />
          <path d="M9 11h6M9 14.5h6M9 18h3.5" {...stroke} />
        </>
      )}
      {kind === "netting" && (
        <>
          <path d="M4 7h13M17 7l-3-3M17 7l-3 3" {...stroke} />
          <path d="M20 17H7M7 17l3-3M7 17l3 3" {...stroke} />
        </>
      )}
      {kind === "settle" && (
        <>
          <path d="M3.5 9.5 12 3.5l8.5 6h-17Z" {...stroke} />
          <path d="M6 9.5v8M12 9.5v8M18 9.5v8" {...stroke} />
          <path d="M3.5 20.5h17" {...stroke} />
          <circle cx="12" cy="6.9" r="1" {...stroke} />
        </>
      )}
      {kind === "arrive" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...stroke} />
          <path d="m8 12.3 2.6 2.7L16 9.5" {...stroke} />
        </>
      )}
    </svg>
  );
}

/* The overnight clock: its own island, ticking wall-clock time. */
function NightClock({
  playing,
  done,
}: {
  playing: boolean;
  done: boolean;
}) {
  const [frac, setFrac] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const f = Math.min(1, (now - start) / PLAY_MS);
      setFrac(f);
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const minutes = START_MIN + (done ? SPAN_MIN : frac * SPAN_MIN);
  const label = playing || done ? clockLabel(minutes) : "5:03 PM";
  const nextDay = minutes >= 24 * 60;

  return (
    <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
      <span className={playing ? "text-accent" : ""}>{label}</span>
      {(playing || done) && nextDay && (
        <span className="ml-2 text-muted">· next day</span>
      )}
    </p>
  );
}

export default function SettlementTimeline() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [playId, setPlayId] = useState(0);
  const [reached, setReached] = useState(-1);
  const [isWide, setIsWide] = useState(true);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const sync = () => setIsWide(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(
    () => () => timers.current.forEach((t) => window.clearTimeout(t)),
    []
  );

  function play() {
    if (phase === "playing") return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPhase("playing");
    setReached(-1);
    setPlayId((p) => p + 1);
    anatomyEvent("anatomy_night_played");

    const finish = () => {
      setReached(SCENES.length - 1);
      setPhase("done");
    };

    if (reduced) {
      timers.current.push(window.setTimeout(finish, 250));
      return;
    }

    SCENE_AT.forEach((f, i) => {
      timers.current.push(
        window.setTimeout(() => setReached((r) => Math.max(r, i)), f * PLAY_MS)
      );
    });
    timers.current.push(window.setTimeout(finish, PLAY_MS));
  }

  const playing = phase === "playing";
  const done = phase === "done";

  const axisPos = (i: number) => posPercent(i);
  const dotFrames = SCENE_AT.map((_, i) =>
    isWide ? `calc(${axisPos(i)}% - 4px)` : `calc(${4 + (i / (SCENES.length - 1)) * 88}%)`
  );
  const trailFramesWide = SCENE_AT.map((_, i) => `${axisPos(i) - 10}%`);
  const trailFramesNarrow = SCENE_AT.map(
    (_, i) => `${(i / (SCENES.length - 1)) * 88}%`
  );

  return (
    <section className="mt-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={play}
          className="rounded-full border border-rule px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          {done ? "Play the night again" : playing ? "The night is running…" : "Play the night"}
        </button>
        <NightClock key={playId} playing={playing} done={done} />
      </div>

      <div className="relative mt-9">
        {isWide ? (
          <div className="relative pb-2 pt-1">
            <div className="absolute left-[10%] right-[10%] top-[14px] h-px bg-rule" />
            {playing && !reduced && (
              <motion.div
                key={`ntrail-${playId}`}
                aria-hidden
                className="absolute left-[10%] top-[14px] h-px bg-accent"
                initial={{ width: trailFramesWide[0] }}
                animate={{ width: trailFramesWide }}
                transition={{
                  duration: PLAY_MS / 1000,
                  times: SCENE_AT,
                  ease: "linear",
                }}
              />
            )}
            {done && (
              <div aria-hidden className="absolute left-[10%] top-[14px] h-px w-[80%] bg-accent" />
            )}
            {playing && !reduced && (
              <motion.div
                key={`ndot-${playId}`}
                aria-hidden
                className="absolute top-[10px] z-10 h-[9px] w-[9px] rounded-full bg-accent"
                initial={{ left: dotFrames[0], opacity: 0 }}
                animate={{ left: dotFrames, opacity: 1 }}
                transition={{
                  left: {
                    duration: PLAY_MS / 1000,
                    times: SCENE_AT,
                    ease: "linear",
                  },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
            <div className="relative flex">
              {SCENES.map((scene, i) => {
                const on = i <= reached;
                return (
                  <div key={scene.key} className="flex flex-1 flex-col items-center gap-2 text-center">
                    <span
                      className={`flex h-[28px] items-center bg-background px-1.5 transition-colors duration-300 ${
                        on ? "text-accent" : "text-muted"
                      }`}
                    >
                      <SceneGlyph kind={scene.key} />
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                        on ? "text-accent" : "text-muted"
                      }`}
                    >
                      {scene.time}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {scene.name}
                    </span>
                    <AnimatePresence>
                      {on && (
                        <motion.span
                          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="max-w-40 text-xs leading-snug text-muted"
                        >
                          {scene.line}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-3 left-[11px] top-3 w-px bg-rule" />
            {playing && !reduced && (
              <motion.div
                key={`ntrail-v-${playId}`}
                aria-hidden
                className="absolute left-[11px] top-3 w-px bg-accent"
                initial={{ height: trailFramesNarrow[0] }}
                animate={{ height: trailFramesNarrow }}
                transition={{
                  duration: PLAY_MS / 1000,
                  times: SCENE_AT,
                  ease: "linear",
                }}
              />
            )}
            {done && (
              <div aria-hidden className="absolute left-[11px] top-3 h-[88%] w-px bg-accent" />
            )}
            {playing && !reduced && (
              <motion.div
                key={`ndot-v-${playId}`}
                aria-hidden
                className="absolute left-[7.5px] z-10 h-[9px] w-[9px] rounded-full bg-accent"
                initial={{ top: dotFrames[0], opacity: 0 }}
                animate={{ top: dotFrames, opacity: 1 }}
                transition={{
                  top: {
                    duration: PLAY_MS / 1000,
                    times: SCENE_AT,
                    ease: "linear",
                  },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
            <div className="flex flex-col gap-7">
              {SCENES.map((scene, i) => {
                const on = i <= reached;
                return (
                  <div key={scene.key} className="flex items-start gap-4 pl-8">
                    <span
                      className={`-ml-8 bg-background py-1 transition-colors duration-300 ${
                        on ? "text-accent" : "text-muted"
                      }`}
                    >
                      <SceneGlyph kind={scene.key} />
                    </span>
                    <div>
                      <p
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                          on ? "text-accent" : "text-muted"
                        }`}
                      >
                        {scene.time} · {scene.name}
                      </p>
                      <AnimatePresence>
                        {on && (
                          <motion.p
                            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="mt-1 text-xs leading-snug text-muted"
                          >
                            {scene.line}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {done && (
          <motion.p
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-7 max-w-[480px] font-serif italic leading-relaxed text-muted"
          >
            Eighteen and a half hours after your two seconds, the promise
            became money. You were already home.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
