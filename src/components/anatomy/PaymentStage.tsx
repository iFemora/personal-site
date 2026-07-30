"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { spiralPath } from "@femora/design-system/spiral-path";
import { anatomyEvent } from "@/lib/anatomyTrack";
import { ACTOR_DEPTH, type ActorKey } from "@/lib/anatomyDepth";

/* ── the script ─────────────────────────────────────────────────────── */

const SCENARIOS = [
  {
    key: "ok",
    label: "All good",
    approved: true,
    code: "00",
    receipt: "APPROVED",
    issuerLine: "checks the funds, checks the pattern… yes.",
    explain:
      "Funds are there, the card is active, nothing about this moment looks unusual. The issuer says yes, and nobody in the queue ever knows a question was asked.",
  },
  {
    key: "nsf",
    label: "Not enough money",
    approved: false,
    code: "51",
    receipt: "DECLINED · 51",
    issuerLine: "checks the funds… there isn't enough.",
    explain:
      "Insufficient funds, the most common no in the world. The terminal is deliberately vague about it; the code on the wire is precise.",
  },
  {
    key: "frozen",
    label: "Card frozen",
    approved: false,
    code: "57",
    receipt: "DECLINED · 57",
    issuerLine: "checks the card… it's switched off.",
    explain:
      "The cardholder froze the card in their app, or the issuer suspended it. The card in the hand is fine; the card in the system is off.",
  },
  {
    key: "fraud",
    label: "Looks like fraud",
    approved: false,
    code: "59",
    receipt: "DECLINED · 59",
    issuerLine: "checks the pattern… this doesn't fit.",
    explain:
      "The purchase does not fit the life of this card: wrong city, wrong hour, wrong size. A model scored it in milliseconds and the issuer chose caution over convenience.",
  },
] as const;

type Scenario = (typeof SCENARIOS)[number];

const NODES: {
  key: ActorKey;
  name: string;
  ms: number;
  active: string;
}[] = [
  {
    key: "terminal",
    name: "Terminal",
    ms: 150,
    active: "reads the card, builds the request",
  },
  {
    key: "acquirer",
    name: "Acquirer",
    ms: 120,
    active: "the merchant's bank stamps it, forwards it",
  },
  {
    key: "network",
    name: "Network",
    ms: 80,
    active: "reads the first digits, routes to your bank",
  },
  { key: "issuer", name: "Issuer", ms: 900, active: "" },
];

const RETURN_MS = 450;
const SIM_TOTAL = 1800;

/* ── two paces, one truth ───────────────────────────────────────────────
   Real time honors the true 1.8 s, where the terminal gets 150 ms and no
   human can read a word. Story pace is the default: the pulse dwells at
   each actor long enough to read its line, while the clock still travels
   through the true milliseconds for that stop, mapped piecewise. */

type Mode = "story" | "real";

type Timeline = {
  duration: number;
  pulse: { at: number; pos: number }[];
  speak: { at: number; node: number | null }[];
  clock: { wall: number; sim: number }[];
};

const TIMELINES: Record<Mode, Timeline> = {
  story: {
    duration: 12000,
    pulse: [
      { at: 0, pos: 0 },
      { at: 2000, pos: 0 },
      { at: 2600, pos: 1 },
      { at: 4600, pos: 1 },
      { at: 5200, pos: 2 },
      { at: 7200, pos: 2 },
      { at: 7900, pos: 3 },
      { at: 10500, pos: 3 },
      { at: 12000, pos: 0 },
    ],
    speak: [
      { at: 0, node: 0 },
      { at: 2600, node: 1 },
      { at: 5200, node: 2 },
      { at: 7900, node: 3 },
      { at: 10500, node: null },
    ],
    clock: [
      { wall: 0, sim: 0 },
      { wall: 2000, sim: 150 },
      { wall: 2600, sim: 210 },
      { wall: 4600, sim: 270 },
      { wall: 5200, sim: 310 },
      { wall: 7200, sim: 350 },
      { wall: 7900, sim: 450 },
      { wall: 10500, sim: 1350 },
      { wall: 12000, sim: 1800 },
    ],
  },
  real: {
    duration: 1800,
    pulse: [
      { at: 0, pos: 0 },
      { at: 150, pos: 0 },
      { at: 210, pos: 1 },
      { at: 270, pos: 1 },
      { at: 310, pos: 2 },
      { at: 350, pos: 2 },
      { at: 450, pos: 3 },
      { at: 1350, pos: 3 },
      { at: 1800, pos: 0 },
    ],
    speak: [
      { at: 0, node: 0 },
      { at: 150, node: 1 },
      { at: 270, node: 2 },
      { at: 350, node: 3 },
      { at: 1350, node: null },
    ],
    clock: [
      { wall: 0, sim: 0 },
      { wall: 1800, sim: 1800 },
    ],
  },
};

function monotonic(pulse: Timeline["pulse"]): number[] {
  const out: number[] = [];
  for (const k of pulse) out.push(Math.max(out.length ? out[out.length - 1] : 0, k.pos));
  return out;
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

/* ── small glyphs, one per institution ──────────────────────────────── */

function Glyph({ kind }: { kind: string }) {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
      {kind === "terminal" && (
        <>
          <rect x="5.5" y="2.5" width="13" height="19" rx="2" {...stroke} />
          <rect x="8.5" y="5.5" width="7" height="4.5" {...stroke} />
          <path d="M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01" {...stroke} />
        </>
      )}
      {kind === "acquirer" && (
        <>
          <path d="M3.5 9.5 12 3.5l8.5 6h-17Z" {...stroke} />
          <path d="M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8" {...stroke} />
          <path d="M3.5 20.5h17" {...stroke} />
        </>
      )}
      {kind === "network" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...stroke} />
          <ellipse cx="12" cy="12" rx="4" ry="8.5" {...stroke} />
          <path d="M3.5 12h17" {...stroke} />
        </>
      )}
      {kind === "issuer" && (
        <>
          <path
            d="M12 2.5 20 6v6c0 5-3.5 8.2-8 9.5C7.5 20.2 4 17 4 12V6l8-3.5Z"
            {...stroke}
          />
          <circle cx="12" cy="10.5" r="2" {...stroke} />
          <path d="M12 12.5v3.5" {...stroke} />
        </>
      )}
    </svg>
  );
}

/* ── the sound ──────────────────────────────────────────────────────── */

function useBeep(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  /* iPhones only allow audio to start inside a touch. The tap that
     starts the run warms the context; the beep at the end then plays
     from an already-running engine instead of asking permission from a
     timer, which iOS refuses. */
  const warm = () => {
    try {
      ctxRef.current ??= new AudioContext();
      if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    } catch {
      /* no audio available */
    }
  };

  const play = (approved: boolean) => {
    if (muted) return;
    try {
      ctxRef.current ??= new AudioContext();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const tone = (freq: number, at: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime + at);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + at + dur
        );
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + at);
        osc.stop(ctx.currentTime + at + dur + 0.02);
      };
      if (approved) {
        tone(1318, 0, 0.12);
      } else {
        tone(392, 0, 0.13);
        tone(392, 0.2, 0.13);
      }
    } catch {
      /* no audio — the run still plays */
    }
  };

  return { warm, play };
}

/* ── the clock: its own island, mapping wall time to simulated
      milliseconds so story pace still tells the truth ───────────────── */

function ClockReadout({
  running,
  done,
  approved,
  clock,
  duration,
}: {
  running: boolean;
  done: boolean;
  approved: boolean;
  clock: { wall: number; sim: number }[];
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
          {String(Math.round(ms)).padStart(4, "0")} ms
        </span>
      ) : done ? (
        <span>
          {SIM_TOTAL} ms · {approved ? "approved" : "declined"}
        </span>
      ) : (
        <span>Then tap the card</span>
      )}
    </p>
  );
}

/* ── status line with a soft crossfade ──────────────────────────────── */

function StatusLine({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
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

/* ── the stage ──────────────────────────────────────────────────────── */

type Phase = "idle" | "running" | "done";

export default function PaymentStage() {
  const reduced = useReducedMotion();
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [runId, setRunId] = useState(0);
  const [runMode, setRunMode] = useState<Mode>("story");
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [reached, setReached] = useState(-1);
  const [returning, setReturning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [everRan, setEverRan] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const [openActor, setOpenActor] = useState<ActorKey | null>(null);
  const timers = useRef<number[]>([]);
  const { warm: warmAudio, play: beep } = useBeep(muted);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const sync = () => setIsWide(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    []
  );

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function run(mode: Mode = "story") {
    if (phase === "running") return;
    clearTimers();
    // Inside the user's tap: the only moment iOS lets audio start.
    warmAudio();
    if (!everRan) {
      setEverRan(true);
      anatomyEvent("anatomy_card_tapped");
    }
    const tl = TIMELINES[mode];
    setRunMode(mode);
    setPhase("running");
    setReturning(false);
    setReached(-1);
    setRunId((r) => r + 1);

    const finish = () => {
      clearTimers();
      setSpeaking(null);
      setReturning(false);
      setReached(3);
      setPhase("done");
      beep(scenario.approved);
      anatomyEvent("anatomy_run_complete", {
        scenario: scenario.key,
        speed: mode,
      });
    };

    if (reduced) {
      timers.current.push(window.setTimeout(finish, 250));
      return;
    }

    // Timer-owned schedule: survives a backgrounded tab, and the stage
    // re-renders a handful of times per run instead of per frame.
    for (const step of tl.speak) {
      timers.current.push(
        window.setTimeout(() => {
          setSpeaking(step.node);
          setReturning(step.node === null);
          setReached((r) => (step.node === null ? 3 : Math.max(r, step.node)));
        }, step.at)
      );
    }
    timers.current.push(window.setTimeout(finish, tl.duration));
  }

  function pickScenario(s: Scenario) {
    if (phase === "running") return;
    setScenario(s);
    setPhase("idle");
    setReached(-1);
    anatomyEvent("anatomy_scenario", { scenario: s.key });
  }

  function toggleActor(actor: ActorKey) {
    setOpenActor((cur) => {
      const next = cur === actor ? null : actor;
      if (next) anatomyEvent("anatomy_actor_opened", { actor });
      return next;
    });
  }

  const running = phase === "running";
  const done = phase === "done";
  const depth = openActor ? ACTOR_DEPTH[openActor] : null;

  const tl = TIMELINES[runMode];
  const times = tl.pulse.map((k) => k.at / tl.duration);
  const trailPos = monotonic(tl.pulse);

  const issuerStatus = (i: number) =>
    i === 3 ? scenario.issuerLine : NODES[i].active;

  /* Actor centers: 12.5 / 37.5 / 62.5 / 87.5 percent on desktop. */
  const axisPercent = (pos: number) =>
    isWide
      ? `calc(${12.5 + (pos / 3) * 75}% - 6px)`
      : `calc(${4 + (pos / 3) * 88}%)`;
  const pulseFrames = tl.pulse.map((k) => axisPercent(k.pos));
  const trailWide = trailPos.map((p) => `${(p / 3) * 75}%`);
  const trailNarrow = trailPos.map((p) => `${(p / 3) * 88}%`);

  const lit = (i: number) => i <= reached || speaking === i;
  const open = (key: ActorKey) => openActor === key;

  return (
    <section className="mt-10">
      {/* Choose a fate */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        First, choose this tap&apos;s fate
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => {
          const on = s.key === scenario.key;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={on}
              onClick={() => pickScenario(s)}
              className={`relative rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                on
                  ? "border-accent text-accent"
                  : "border-rule text-muted hover:text-foreground"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="anatomy-scenario-thumb"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-accent/10"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* The card */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <button
          type="button"
          onClick={() => run()}
          aria-label={
            running ? "Payment in flight" : "Tap the card to run the payment"
          }
          className="group relative block w-72 select-none rounded-2xl border border-rule bg-background p-5 text-left transition-colors duration-300 hover:border-accent sm:w-80"
          style={{ aspectRatio: "1.586" }}
        >
          {running && !reduced && (
            <motion.span
              key={runId}
              aria-hidden
              className="absolute inset-0 rounded-2xl border border-accent"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 1.12 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          )}
          <div className="flex items-start justify-between">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" aria-hidden className="text-accent">
              <path d={spiralPath()} stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="text-muted transition-colors duration-300 group-hover:text-accent">
              {[5, 9, 13].map((r) => (
                <path
                  key={r}
                  d={`M ${7 + r * 0.2} ${12 - r} A ${r} ${r} 0 0 1 ${7 + r * 0.2} ${12 + r}`}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
          <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden className="mt-2 text-muted">
            <rect x="1" y="1" width="32" height="24" rx="5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1 9h10M1 17h10M23 9h10M23 17h10M17 1v8M17 17v8M11 9c2 2 10 2 12 0M11 17c2-2 10-2 12 0" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          <p className="mt-3 font-mono text-sm tracking-[0.22em] text-foreground">
            •••• •••• •••• 2026
          </p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                Valid thru 12/29
              </p>
              <p className="mt-1 font-serif text-sm italic tracking-wide">
                F. Siji-Kenneth
              </p>
            </div>
            <svg width="34" height="22" viewBox="0 0 34 22" aria-hidden className="text-muted">
              <circle cx="12" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="22" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </div>
        </button>

        <div className="flex items-baseline gap-5">
          <ClockReadout
            key={runId}
            running={running}
            done={done}
            approved={scenario.approved}
            clock={tl.clock}
            duration={tl.duration}
          />
          <button
            type="button"
            onClick={() => {
              setMuted((m) => {
                anatomyEvent("anatomy_sound", { muted: m ? "off" : "on" });
                return !m;
              });
            }}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
        </div>
      </div>

      {/* The route */}
      <div className="relative mt-10">
        {isWide ? (
          <div className="relative pb-2 pt-1">
            <div className="absolute left-[12.5%] right-[12.5%] top-[18px] h-[2px] bg-rule" />
            {running && !reduced && (
              <motion.div
                key={`trail-${runId}`}
                aria-hidden
                className="absolute left-[12.5%] top-[18px] h-[2px] bg-accent"
                initial={{ width: trailWide[0] }}
                animate={{ width: trailWide }}
                transition={{
                  duration: tl.duration / 1000,
                  times,
                  ease: "linear",
                }}
              />
            )}
            {done && (
              <div
                aria-hidden
                className="absolute left-[12.5%] top-[18px] h-[2px] w-[75%] bg-accent"
              />
            )}
            {running && !reduced && (
              <motion.div
                key={`pulse-${runId}`}
                aria-hidden
                className="absolute top-[13px] z-10 h-3 w-3 rounded-full bg-accent"
                initial={{ left: pulseFrames[0], opacity: 0 }}
                animate={{ left: pulseFrames, opacity: 1 }}
                transition={{
                  left: {
                    duration: tl.duration / 1000,
                    times,
                    ease: "linear",
                  },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
            <div className="relative flex">
              {NODES.map((node, i) => {
                const on = speaking === i;
                return (
                  <button
                    key={node.key}
                    type="button"
                    onClick={() => toggleActor(node.key)}
                    aria-expanded={open(node.key)}
                    className="group flex flex-1 cursor-pointer flex-col items-center gap-2 text-center"
                  >
                    <motion.span
                      animate={reduced ? undefined : { scale: on ? 1.12 : 1 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`flex h-[38px] items-center bg-background px-2 transition-colors duration-300 ${
                        lit(i) || open(node.key)
                          ? "text-accent"
                          : "text-muted group-hover:text-accent"
                      }`}
                    >
                      <Glyph kind={node.key} />
                    </motion.span>
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                        lit(i) || open(node.key) ? "text-accent" : "text-muted"
                      }`}
                    >
                      {node.name}
                    </span>
                    <StatusLine
                      className="min-h-10 max-w-44 text-[13px] leading-snug text-muted"
                      text={on ? issuerStatus(i) : done ? `~${node.ms} ms` : ""}
                    />
                    <span
                      className={`-mt-1 font-mono text-[11px] uppercase tracking-[0.14em] underline underline-offset-4 transition-colors duration-300 ${
                        open(node.key)
                          ? "text-accent"
                          : "text-muted group-hover:text-accent"
                      }`}
                    >
                      {open(node.key) ? "close −" : "go deeper +"}
                    </span>
                  </button>
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
                transition={{
                  duration: tl.duration / 1000,
                  times,
                  ease: "linear",
                }}
              />
            )}
            {done && (
              <div
                aria-hidden
                className="absolute left-[16px] top-3 h-[88%] w-[2px] bg-accent"
              />
            )}
            {running && !reduced && (
              <motion.div
                key={`pulse-v-${runId}`}
                aria-hidden
                className="absolute left-[11px] z-10 h-3 w-3 rounded-full bg-accent"
                initial={{ top: pulseFrames[0], opacity: 0 }}
                animate={{ top: pulseFrames, opacity: 1 }}
                transition={{
                  top: {
                    duration: tl.duration / 1000,
                    times,
                    ease: "linear",
                  },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
            <div className="flex flex-col gap-9">
              {NODES.map((node, i) => {
                const on = speaking === i;
                return (
                  <button
                    key={node.key}
                    type="button"
                    onClick={() => toggleActor(node.key)}
                    aria-expanded={open(node.key)}
                    className="group flex cursor-pointer items-start gap-4 pl-10 text-left"
                  >
                    <span
                      className={`-ml-10 bg-background py-1 transition-colors duration-300 ${
                        lit(i) || open(node.key) ? "text-accent" : "text-muted"
                      }`}
                    >
                      <Glyph kind={node.key} />
                    </span>
                    <div>
                      <p
                        className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                          lit(i) || open(node.key)
                            ? "text-accent"
                            : "text-muted"
                        }`}
                      >
                        {node.name}
                        {done && <span className="ml-3">~{node.ms} ms</span>}
                        <span
                          className={`ml-3 underline underline-offset-4 ${
                            open(node.key) ? "text-accent" : ""
                          }`}
                        >
                          {open(node.key) ? "close −" : "go deeper +"}
                        </span>
                      </p>
                      <StatusLine
                        className="mt-1 min-h-4 text-[13px] leading-snug text-muted"
                        text={on ? issuerStatus(i) : ""}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <StatusLine
          className="mt-4 min-h-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
          text={
            returning
              ? "The answer races home…"
              : done
                ? `…and ~${RETURN_MS} ms for the way home.`
                : ""
          }
        />
      </div>

      {/* Depth on demand: one door per actor */}
      <AnimatePresence initial={false} mode="wait">
        {depth && (
          <motion.div
            key={depth.actor}
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-8 border-y border-rule py-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Going deeper · the {depth.actor}
              </p>
              <h3 className="mt-3 font-serif text-xl leading-snug tracking-tight sm:text-2xl">
                {depth.title}
              </h3>
              <p className="mt-4 max-w-[560px] font-serif italic leading-relaxed text-muted">
                {depth.intro}
              </p>
              <motion.dl
                className="mt-7 space-y-6"
                initial={reduced ? undefined : "hidden"}
                animate={reduced ? undefined : "show"}
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.09, delayChildren: 0.25 },
                  },
                }}
              >
                {depth.sections.map((s) => (
                  <motion.div
                    key={s.label}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.55, ease: EASE },
                      },
                    }}
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      {s.label}
                    </dt>
                    <dd className="mt-2 max-w-[560px] text-[15px] leading-relaxed">
                      {s.body}
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The verdict — held a little lower so the doors above can breathe */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-12 max-w-[480px] border border-rule p-5 sm:mt-16"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              What the terminal shows
            </p>
            <p
              className={`mt-3 font-mono text-xl tracking-[0.08em] ${scenario.approved ? "text-accent" : "text-foreground"}`}
            >
              {scenario.receipt}
            </p>
            <p className="mt-4 border-t border-rule pt-4 text-sm leading-relaxed text-muted">
              {scenario.explain}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => run("story")}
                className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Run it again
              </button>
              <button
                type="button"
                onClick={() => run("real")}
                className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Real time · 1.8 s
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
