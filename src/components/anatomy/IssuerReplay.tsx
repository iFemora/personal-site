"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { anatomyEvent } from "@/lib/anatomyTrack";
import type { Company, Funding } from "@/lib/cardBuild";

/* ── Act IV, release two: the first tap, replayed. Act I showed the
   issuer as one stop with nine hundred milliseconds. This opens it: the
   processor, the program (asked only on a just-in-time card), and the
   books. Same grammar as the stage: a rail, a travelling light, a trail
   that stays lit, a clock that tells the true milliseconds, a status
   line that crossfades, a schedule owned by timers. ALL COPY DRAFT. ─── */

const ISSUER_BUDGET = 900;

type StopKey = "processor" | "program" | "books";

type Path = {
  key: string;
  /** Which stops the light dwells at, in order. The program stop is
      passed through, not visited, on a path that never asks it. */
  visits: StopKey[];
  approved: boolean;
  receipt: string;
  usedMs: number;
  lines: Record<StopKey, string>;
  skipped?: string;
  explain: string;
};

const PROCESSOR_LINE =
  "takes the question from the network: this card, this amount, this shop. Status, controls, velocity. All fine.";

function pathFor(company: Company, funding: Funding, slow: boolean): Path {
  const who =
    company.key === "gig"
      ? "the driver"
      : company.key === "expense"
        ? "the employee"
        : "the cardholder";
  switch (funding.key) {
    case "jit":
      return slow
        ? {
            key: "jit-slow",
            visits: ["processor", "program", "books"],
            approved: false,
            receipt: "DECLINED · 91",
            usedMs: 760,
            lines: {
              processor: PROCESSOR_LINE,
              program:
                "is asked: fund this one? Your service is slow tonight. Two hundred, four hundred, six hundred milliseconds. No answer. The window closes.",
              books:
                "records a stand-in. The processor answered for you, by the rule you wrote in advance. You wrote: decline.",
            },
            explain:
              "The two seconds did not wait for you. The processor stood in with the rule you set when nobody was watching, and the card said no at the counter. You will read about it in tomorrow's file; " +
              who +
              " found out tonight.",
          }
        : {
            key: "jit-ok",
            visits: ["processor", "program", "books"],
            approved: true,
            receipt: "APPROVED",
            usedMs: 350,
            lines: {
              processor: PROCESSOR_LINE,
              program:
                "is asked: fund this one? Your service checks its own ledger, finds the money is good for " +
                who +
                ", and says yes.",
              books:
                "places a hold against your settlement line. Nothing has moved yet; you owe it by morning.",
            },
            explain:
              "The card had no balance until this moment. Your service made the decision inside the issuer's window, which is the whole bargain of just-in-time: total control, and a clock you must never miss.",
          };
    case "prefunded":
      return {
        key: "prefunded",
        visits: ["processor", "books"],
        approved: true,
        receipt: "APPROVED",
        usedMs: 110,
        lines: {
          processor: PROCESSOR_LINE,
          program: "",
          books: "places a hold against the balance the program funded in advance.",
        },
        skipped: "not asked. The money was already here.",
        explain:
          "Nothing was asked of you. Your money sat at the sponsor bank the night before, so the processor answered alone, fast, and you learned about the tap when the file arrived.",
      };
    case "credit":
    case "balance":
      return {
        key: "credit",
        visits: ["processor", "books"],
        approved: true,
        receipt: "APPROVED",
        usedMs: 130,
        lines: {
          processor: PROCESSOR_LINE,
          program: "",
          books:
            "checks what is left of the limit, and records a loan that will exist the moment the clearing lands.",
        },
        skipped: "not asked. A limit was agreed in advance.",
        explain:
          "No money moved and none will until the clearing file arrives; what moved was a promise against a limit. The lender's exposure began at this tap, not at the statement.",
      };
    case "deposits":
    default:
      return {
        key: "deposits",
        visits: ["processor", "books"],
        approved: true,
        receipt: "APPROVED",
        usedMs: 120,
        lines: {
          processor:
            "your authorization host takes the question from the network. Status, controls, velocity. All fine.",
          program: "",
          books: "places a hold on the deposit account, in the core banking system you already run.",
        },
        skipped: "not asked. The product team is down the hall.",
        explain:
          "The whole issuer is one house, so the question never leaves the building. The same nine hundred milliseconds, and most of them unused.",
      };
  }
}

/* ── story-pace timelines, one per path shape ───────────────────────────
   Two shapes: a three-visit path and a two-visit path that passes
   through the program stop without dwelling. Wall time in ms; sim time
   is the issuer's own clock, 0 to ~900. */

type Timeline = {
  duration: number;
  pulse: { at: number; pos: number }[];
  speak: { at: number; stop: StopKey | null }[];
  clock: { wall: number; sim: number }[];
};

function timelineFor(path: Path): Timeline {
  if (path.visits.length === 3) {
    const slow = path.key === "jit-slow";
    const programDwell = slow ? 4200 : 2600;
    const t1 = 2200; // leave processor
    const t2 = t1 + 700; // arrive program
    const t3 = t2 + programDwell; // leave program
    const t4 = t3 + 700; // arrive books
    const t5 = t4 + 2000; // leave books
    const end = t5 + 600;
    return {
      duration: end,
      pulse: [
        { at: 0, pos: 0 },
        { at: t1, pos: 0 },
        { at: t2, pos: 1 },
        { at: t3, pos: 1 },
        { at: t4, pos: 2 },
        { at: t5, pos: 2 },
        { at: end, pos: 2 },
      ],
      speak: [
        { at: 0, stop: "processor" },
        { at: t2, stop: "program" },
        { at: t4, stop: "books" },
        { at: t5, stop: null },
      ],
      clock: [
        { wall: 0, sim: 0 },
        { wall: t1, sim: 70 },
        { wall: t2, sim: 90 },
        { wall: t3, sim: slow ? 700 : 300 },
        { wall: t4, sim: slow ? 720 : 310 },
        { wall: t5, sim: path.usedMs },
        { wall: end, sim: path.usedMs },
      ],
    };
  }
  const t1 = 2200;
  const t2 = t1 + 1400; // glide through the program stop to the books
  const t3 = t2 + 2000;
  const end = t3 + 600;
  return {
    duration: end,
    pulse: [
      { at: 0, pos: 0 },
      { at: t1, pos: 0 },
      { at: t2, pos: 2 },
      { at: t3, pos: 2 },
      { at: end, pos: 2 },
    ],
    speak: [
      { at: 0, stop: "processor" },
      { at: t1 + 700, stop: "program" },
      { at: t2, stop: "books" },
      { at: t3, stop: null },
    ],
    clock: [
      { wall: 0, sim: 0 },
      { wall: t1, sim: 70 },
      { wall: t2, sim: 80 },
      { wall: t3, sim: path.usedMs },
      { wall: end, sim: path.usedMs },
    ],
  };
}

function interpolate(points: { wall: number; sim: number }[], wall: number): number {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (wall <= b.wall)
      return a.sim + ((wall - a.wall) / (b.wall - a.wall)) * (b.sim - a.sim);
  }
  return points[points.length - 1].sim;
}

/* ── glyphs: a chip for the processor, a person for the program, a
   ledger for the books ──────────────────────────────────────────────── */

function Glyph({ kind }: { kind: StopKey }) {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
      {kind === "processor" && (
        <>
          <rect x="6" y="6" width="12" height="12" rx="2" {...stroke} />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" {...stroke} />
          <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" {...stroke} />
        </>
      )}
      {kind === "program" && (
        <>
          <circle cx="12" cy="8" r="3.5" {...stroke} />
          <path d="M5 20.5c0-3.9 3.1-7 7-7s7 3.1 7 7" {...stroke} />
        </>
      )}
      {kind === "books" && (
        <>
          <path d="M4.5 4.5h15v15h-15Z" {...stroke} />
          <path d="M8 9h8M8 12.5h8M8 16h5" {...stroke} />
        </>
      )}
    </svg>
  );
}

/* ── the clock island ───────────────────────────────────────────────── */

function IssuerClock({
  running,
  done,
  usedMs,
  clock,
  duration,
}: {
  running: boolean;
  done: boolean;
  usedMs: number;
  clock: Timeline["clock"];
  duration: number;
}) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const wall = Math.min(duration, now - start);
      setMs(interpolate(clock, wall));
      if (wall < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, clock, duration]);

  return (
    <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
      {running ? (
        <span className="text-accent">
          {String(Math.round(ms)).padStart(3, "0")} of {ISSUER_BUDGET} ms
        </span>
      ) : done ? (
        <span>
          {usedMs} of {ISSUER_BUDGET} ms used
        </span>
      ) : (
        <span>The issuer&apos;s window: {ISSUER_BUDGET} ms</span>
      )}
    </p>
  );
}

function StatusLine({ text, className }: { text: string; className: string }) {
  return (
    <span className={`relative block ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={text || "empty"}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── the replay ─────────────────────────────────────────────────────── */

type Phase = "idle" | "running" | "done";
const STOPS: StopKey[] = ["processor", "program", "books"];
const pillClass =
  "rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent";

export default function IssuerReplay({
  company,
  funding,
}: {
  company: Company;
  funding: Funding;
}) {
  const reduced = useReducedMotion();
  const [slow, setSlow] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [runId, setRunId] = useState(0);
  const [speaking, setSpeaking] = useState<StopKey | null>(null);
  const [reached, setReached] = useState(-1);
  const [isWide, setIsWide] = useState(true);
  const timers = useRef<number[]>([]);

  const isJit = funding.key === "jit";
  const path = pathFor(company, funding, isJit && slow);
  const tl = timelineFor(path);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const sync = () => setIsWide(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  // A new card or funding choice remounts this stage (keyed by the
  // parent), so a run in flight is abandoned rather than finished
  // against the wrong path. The slow/fast toggle resets it by hand.
  const reset = () => {
    clearTimers();
    setPhase("idle");
    setSpeaking(null);
    setReached(-1);
  };

  function run() {
    if (phase === "running") return;
    clearTimers();
    setPhase("running");
    setSpeaking(null);
    setReached(-1);
    setRunId((r) => r + 1);
    anatomyEvent("anatomy_replay_run", {
      company: company.key,
      funding: funding.key,
      path: path.key,
    });

    const finish = () => {
      clearTimers();
      setSpeaking(null);
      setReached(2);
      setPhase("done");
    };

    if (reduced) {
      timers.current.push(window.setTimeout(finish, 250));
      return;
    }
    for (const step of tl.speak) {
      timers.current.push(
        window.setTimeout(() => {
          setSpeaking(step.stop);
          if (step.stop) setReached((r) => Math.max(r, STOPS.indexOf(step.stop!)));
        }, step.at)
      );
    }
    timers.current.push(window.setTimeout(finish, tl.duration));
  }

  const running = phase === "running";
  const done = phase === "done";
  const times = tl.pulse.map((k) => k.at / tl.duration);
  const trailPos = tl.pulse.reduce<number[]>((out, k) => {
    out.push(Math.max(out.length ? out[out.length - 1] : 0, k.pos));
    return out;
  }, []);

  /* Three stops: centers at 16.67 / 50 / 83.33 percent on desktop. */
  const axisPercent = (pos: number) =>
    isWide ? `calc(${16.667 + pos * 33.333}% - 6px)` : `calc(${6 + pos * 44}%)`;
  const pulseFrames = tl.pulse.map((k) => axisPercent(k.pos));
  const trailWide = trailPos.map((p) => `${p * 33.333}%`);
  const trailNarrow = trailPos.map((p) => `${p * 44}%`);

  const visited = (stop: StopKey) => path.visits.includes(stop);
  const lit = (i: number) => (i <= reached || speaking === STOPS[i]) && visited(STOPS[i]);
  const name = (stop: StopKey) =>
    stop === "processor"
      ? company.oneHouse
        ? "Auth host"
        : "Processor"
      : stop === "program"
        ? company.oneHouse
          ? "Product team"
          : "Your program"
        : company.oneHouse
          ? "Core ledger"
          : "The books";
  const lineFor = (stop: StopKey) =>
    visited(stop) ? path.lines[stop] : (path.skipped ?? "");

  return (
    <div className="mt-8">
      {isJit && (
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { v: false, label: "Your service answers in time" },
            { v: true, label: "Your service is too slow" },
          ].map((opt) => {
            const on = slow === opt.v;
            return (
              <button
                key={String(opt.v)}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  if (running || slow === opt.v) return;
                  setSlow(opt.v);
                  reset();
                }}
                className={`relative rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                  on ? "border-accent text-accent" : "border-rule text-muted hover:text-foreground"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="replay-scenario-thumb"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-accent/10"
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                )}
                <span className="relative">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className={`${pillClass} px-4 py-2 disabled:cursor-default disabled:hover:border-rule disabled:hover:text-muted`}
        >
          {done ? "Replay the tap" : running ? "Inside the issuer…" : "Replay the first tap"}
        </button>
        <IssuerClock
          key={`${runId}-${path.key}`}
          running={running}
          done={done}
          usedMs={path.usedMs}
          clock={tl.clock}
          duration={tl.duration}
        />
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        In from the network →
      </p>

      {/* The rail */}
      <div className="relative mt-3">
        {isWide ? (
          <div className="relative pb-2 pt-1">
            <div className="absolute left-[16.667%] right-[16.667%] top-[18px] h-[2px] bg-rule" />
            {running && !reduced && (
              <motion.div
                key={`trail-${runId}`}
                aria-hidden
                className="absolute left-[16.667%] top-[18px] h-[2px] bg-accent"
                initial={{ width: trailWide[0] }}
                animate={{ width: trailWide }}
                transition={{ duration: tl.duration / 1000, times, ease: "linear" }}
              />
            )}
            {done && (
              <div aria-hidden className="absolute left-[16.667%] top-[18px] h-[2px] w-[66.667%] bg-accent" />
            )}
            {running && !reduced && (
              <motion.div
                key={`pulse-${runId}`}
                aria-hidden
                className="absolute top-[13px] z-10 h-3 w-3 rounded-full bg-accent"
                initial={{ left: pulseFrames[0], opacity: 0 }}
                animate={{ left: pulseFrames, opacity: 1 }}
                transition={{
                  left: { duration: tl.duration / 1000, times, ease: "linear" },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
            <div className="relative flex">
              {STOPS.map((stop, i) => {
                const on = speaking === stop;
                const dim = !visited(stop);
                return (
                  <div key={stop} className="flex flex-1 flex-col items-center gap-2 text-center">
                    <motion.span
                      animate={reduced ? undefined : { scale: on && !dim ? 1.12 : 1 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`flex h-[38px] items-center bg-background px-2 transition-colors duration-300 ${
                        lit(i) ? "text-accent" : dim ? "text-rule" : "text-muted"
                      }`}
                    >
                      <Glyph kind={stop} />
                    </motion.span>
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                        lit(i) ? "text-accent" : "text-muted"
                      }`}
                    >
                      {name(stop)}
                    </span>
                    <StatusLine
                      className="min-h-16 max-w-52 text-[13px] leading-snug text-muted"
                      text={on || (done && dim) ? lineFor(stop) : ""}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-3 left-[16px] top-3 w-[2px] bg-rule" />
            {running && !reduced && (
              <motion.div
                key={`trail-v-${runId}`}
                aria-hidden
                className="absolute left-[16px] top-3 w-[2px] bg-accent"
                initial={{ height: trailNarrow[0] }}
                animate={{ height: trailNarrow }}
                transition={{ duration: tl.duration / 1000, times, ease: "linear" }}
              />
            )}
            {done && (
              <div aria-hidden className="absolute left-[16px] top-3 h-[88%] w-[2px] bg-accent" />
            )}
            {running && !reduced && (
              <motion.div
                key={`pulse-v-${runId}`}
                aria-hidden
                className="absolute left-[11px] z-10 h-3 w-3 rounded-full bg-accent"
                initial={{ top: pulseFrames[0], opacity: 0 }}
                animate={{ top: pulseFrames, opacity: 1 }}
                transition={{
                  top: { duration: tl.duration / 1000, times, ease: "linear" },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
            <div className="flex flex-col gap-9">
              {STOPS.map((stop, i) => {
                const on = speaking === stop;
                const dim = !visited(stop);
                return (
                  <div key={stop} className="flex items-start gap-4 pl-10 text-left">
                    <span
                      className={`-ml-10 bg-background py-1 transition-colors duration-300 ${
                        lit(i) ? "text-accent" : dim ? "text-rule" : "text-muted"
                      }`}
                    >
                      <Glyph kind={stop} />
                    </span>
                    <div>
                      <p
                        className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                          lit(i) ? "text-accent" : "text-muted"
                        }`}
                      >
                        {name(stop)}
                      </p>
                      <StatusLine
                        className="mt-1 min-h-4 text-[13px] leading-snug text-muted"
                        text={on || (done && dim) ? lineFor(stop) : ""}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <StatusLine
          className="mt-4 min-h-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
          text={done ? "→ Back to the network, and home to the terminal." : ""}
        />
      </div>

      {/* The verdict */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-10 max-w-[480px] border border-rule p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              What the network hears
            </p>
            <p
              className={`mt-3 font-mono text-xl tracking-[0.08em] ${
                path.approved ? "text-accent" : "text-foreground"
              }`}
            >
              {path.receipt}
            </p>
            <p className="mt-4 border-t border-rule pt-4 text-sm leading-relaxed text-muted">
              {path.explain}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
