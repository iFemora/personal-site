"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { spiralPath } from "@femora/design-system/spiral-path";
import { anatomyEvent } from "@/lib/anatomyTrack";
import { ACTOR_DEPTH } from "@/lib/anatomyDepth";

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

const NODES = [
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
] as const;

const RETURN_MS = 450;
const TOTAL_MS = 1800;

/* The natural pace: simulated milliseconds run at half speed so the eye
   can ride along (Femi's call after living with real time). Real time
   and quarter speed stay one tap away. */
const NATURAL = 0.5;
const REALTIME = 1;
const SLOW = 0.25;

/* The pulse's journey as declarative keyframes: dwell at each stop,
   crawl into the issuer, sweep home. Times are fractions of the run. */
const PULSE_KEYFRAMES: { at: number; pos: number }[] = [
  { at: 0, pos: 0 },
  { at: 150, pos: 0 },
  { at: 210, pos: 1 },
  { at: 270, pos: 1 },
  { at: 310, pos: 2 },
  { at: 350, pos: 2 },
  { at: 450, pos: 3 },
  { at: 1350, pos: 3 },
  { at: 1800, pos: 0 },
];
const PULSE_TIMES = PULSE_KEYFRAMES.map((k) => k.at / TOTAL_MS);

/* The lit trail is monotonic: once traversed, the wire stays lit,
   holding through the way home. */
const TRAIL_POS = PULSE_KEYFRAMES.reduce<number[]>((acc, k) => {
  acc.push(Math.max(acc.length ? acc[acc.length - 1] : 0, k.pos));
  return acc;
}, []);

/* Which node speaks, and when it starts. */
const SPEAK_SCHEDULE: { at: number; node: number | null }[] = [
  { at: 0, node: 0 },
  { at: 150, node: 1 },
  { at: 270, node: 2 },
  { at: 350, node: 3 },
  { at: 1350, node: null }, // the way home
];

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
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
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

  return (approved: boolean) => {
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
}

/* ── the clock: its own island, so sixty ticks a second never touch
      the rest of the stage ─────────────────────────────────────────── */

function ClockReadout({
  running,
  factor,
  done,
  approved,
}: {
  running: boolean;
  factor: number;
  done: boolean;
  approved: boolean;
}) {
  // Fresh-mounted per run (key={runId} at the call site), so the clock
  // starts at zero without a reset that would cascade renders.
  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(TOTAL_MS, (now - start) * factor);
      setMs(t);
      if (t < TOTAL_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, factor]);

  return (
    <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
      {running ? (
        <span className="text-accent">
          {String(Math.round(ms)).padStart(4, "0")} ms
        </span>
      ) : done ? (
        <span>
          {TOTAL_MS} ms · {approved ? "approved" : "declined"}
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
  const [runFactor, setRunFactor] = useState(NATURAL);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [reached, setReached] = useState(-1);
  const [returning, setReturning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [everRan, setEverRan] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const [openActor, setOpenActor] = useState<"issuer" | null>(null);
  const timers = useRef<number[]>([]);
  const beep = useBeep(muted);

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

  function run(factor = NATURAL) {
    if (phase === "running") return;
    clearTimers();
    if (!everRan) {
      setEverRan(true);
      anatomyEvent("anatomy_card_tapped");
    }
    setRunFactor(factor);
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
        speed: factor === REALTIME ? "real" : factor === SLOW ? "slow" : "natural",
      });
    };

    if (reduced) {
      timers.current.push(window.setTimeout(finish, 250));
      return;
    }

    // The speaking schedule and completion are timer-owned: they survive
    // a backgrounded tab, and the stage re-renders five times per run
    // instead of sixty times a second.
    for (const step of SPEAK_SCHEDULE) {
      timers.current.push(
        window.setTimeout(() => {
          setSpeaking(step.node);
          setReturning(step.node === null);
          // Once the pulse reaches an actor it stays lit for the run.
          setReached((r) => (step.node === null ? 3 : Math.max(r, step.node)));
        }, step.at / factor)
      );
    }
    timers.current.push(window.setTimeout(finish, TOTAL_MS / factor));
  }

  function pickScenario(s: Scenario) {
    if (phase === "running") return;
    setScenario(s);
    setPhase("idle");
    setReached(-1);
    anatomyEvent("anatomy_scenario", { scenario: s.key });
  }

  function toggleIssuer() {
    setOpenActor((cur) => {
      const next = cur === "issuer" ? null : "issuer";
      if (next) anatomyEvent("anatomy_actor_opened", { actor: "issuer" });
      return next;
    });
  }

  const running = phase === "running";
  const done = phase === "done";
  const depth = ACTOR_DEPTH.issuer!;

  const issuerStatus = (i: number) =>
    i === 3 ? scenario.issuerLine : NODES[i].active;

  /* Pulse keyframes for the current orientation. On desktop the four
     actor centers sit at 12.5 / 37.5 / 62.5 / 87.5 percent, so the rail
     and the dot begin at the terminal and end at the issuer — exactly. */
  const axisPercent = (pos: number) =>
    isWide
      ? `calc(${12.5 + (pos / 3) * 75}% - 4px)`
      : `calc(${4 + (pos / 3) * 88}%)`;
  const pulseFrames = PULSE_KEYFRAMES.map((k) => axisPercent(k.pos));

  const trailWide = TRAIL_POS.map((p) => `${(p / 3) * 75}%`);
  const trailNarrow = TRAIL_POS.map((p) => `${(p / 3) * 88}%`);

  const lit = (i: number) => i <= reached || speaking === i;

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
            factor={runFactor}
            done={done}
            approved={scenario.approved}
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
            {/* The wire: terminal center to issuer center, through the
                glyphs' vertical middle. */}
            <div className="absolute left-[12.5%] right-[12.5%] top-[15px] h-px bg-rule" />
            {/* The lit trail the pulse leaves behind. */}
            {running && !reduced && (
              <motion.div
                key={`trail-${runId}`}
                aria-hidden
                className="absolute left-[12.5%] top-[15px] h-px bg-accent"
                initial={{ width: trailWide[0] }}
                animate={{ width: trailWide }}
                transition={{
                  duration: TOTAL_MS / 1000 / runFactor,
                  times: PULSE_TIMES,
                  ease: "linear",
                }}
              />
            )}
            {done && (
              <div
                aria-hidden
                className="absolute left-[12.5%] top-[15px] h-px w-[75%] bg-accent"
              />
            )}
            {running && !reduced && (
              <motion.div
                key={`pulse-${runId}`}
                aria-hidden
                className="absolute top-[11px] z-10 h-[9px] w-[9px] rounded-full bg-accent"
                initial={{ left: pulseFrames[0], opacity: 0 }}
                animate={{ left: pulseFrames, opacity: 1 }}
                transition={{
                  left: {
                    duration: TOTAL_MS / 1000 / runFactor,
                    times: PULSE_TIMES,
                    ease: "linear",
                  },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
            <div className="relative flex">
              {NODES.map((node, i) => {
                const on = speaking === i;
                const isIssuer = node.key === "issuer";
                const NodeTag = isIssuer ? "button" : "div";
                return (
                  <NodeTag
                    key={node.key}
                    type={isIssuer ? "button" : undefined}
                    onClick={isIssuer ? toggleIssuer : undefined}
                    aria-expanded={isIssuer ? openActor === "issuer" : undefined}
                    className={`flex flex-1 flex-col items-center gap-2 text-center ${
                      isIssuer ? "group cursor-pointer" : ""
                    }`}
                  >
                    <motion.span
                      animate={
                        reduced
                          ? undefined
                          : { scale: on ? 1.12 : 1 }
                      }
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`flex h-[30px] items-center bg-background px-1.5 transition-colors duration-300 ${
                        lit(i) || (isIssuer && openActor === "issuer")
                          ? "text-accent"
                          : isIssuer
                            ? "text-muted group-hover:text-accent"
                            : "text-muted"
                      }`}
                    >
                      <Glyph kind={node.key} />
                    </motion.span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                        lit(i) || (isIssuer && openActor === "issuer")
                          ? "text-accent"
                          : "text-muted"
                      }`}
                    >
                      {node.name}
                    </span>
                    <StatusLine
                      className="min-h-9 max-w-36 text-xs leading-snug text-muted"
                      text={on ? issuerStatus(i) : done ? `~${node.ms} ms` : ""}
                    />
                    {isIssuer && (
                      <span
                        className={`-mt-1 font-mono text-[10px] uppercase tracking-[0.14em] underline underline-offset-4 transition-colors duration-300 ${
                          openActor === "issuer"
                            ? "text-accent"
                            : "text-muted group-hover:text-accent"
                        }`}
                      >
                        {openActor === "issuer" ? "close −" : "go deeper +"}
                      </span>
                    )}
                  </NodeTag>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-3 left-[12px] top-3 w-px bg-rule" />
            {running && !reduced && (
              <motion.div
                key={`trail-v-${runId}`}
                aria-hidden
                className="absolute left-[12px] top-3 w-px bg-accent"
                initial={{ height: trailNarrow[0] }}
                animate={{ height: trailNarrow }}
                transition={{
                  duration: TOTAL_MS / 1000 / runFactor,
                  times: PULSE_TIMES,
                  ease: "linear",
                }}
              />
            )}
            {done && (
              <div
                aria-hidden
                className="absolute left-[12px] top-3 h-[88%] w-px bg-accent"
              />
            )}
            {running && !reduced && (
              <motion.div
                key={`pulse-v-${runId}`}
                aria-hidden
                className="absolute left-[8.5px] z-10 h-[9px] w-[9px] rounded-full bg-accent"
                initial={{ top: pulseFrames[0], opacity: 0 }}
                animate={{ top: pulseFrames, opacity: 1 }}
                transition={{
                  top: {
                    duration: TOTAL_MS / 1000 / runFactor,
                    times: PULSE_TIMES,
                    ease: "linear",
                  },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
            <div className="flex flex-col gap-8">
              {NODES.map((node, i) => {
                const on = speaking === i;
                const isIssuer = node.key === "issuer";
                const NodeTag = isIssuer ? "button" : "div";
                return (
                  <NodeTag
                    key={node.key}
                    type={isIssuer ? "button" : undefined}
                    onClick={isIssuer ? toggleIssuer : undefined}
                    aria-expanded={isIssuer ? openActor === "issuer" : undefined}
                    className={`flex items-start gap-4 pl-8 text-left ${
                      isIssuer ? "group cursor-pointer" : ""
                    }`}
                  >
                    <span
                      className={`-ml-8 bg-background py-1 transition-colors duration-300 ${
                        lit(i) || (isIssuer && openActor === "issuer")
                          ? "text-accent"
                          : "text-muted"
                      }`}
                    >
                      <Glyph kind={node.key} />
                    </span>
                    <div>
                      <p
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                          lit(i) || (isIssuer && openActor === "issuer")
                            ? "text-accent"
                            : "text-muted"
                        }`}
                      >
                        {node.name}
                        {done && <span className="ml-3">~{node.ms} ms</span>}
                        {isIssuer && (
                          <span className="ml-3 underline underline-offset-4">
                            {openActor === "issuer" ? "close −" : "go deeper +"}
                          </span>
                        )}
                      </p>
                      <StatusLine
                        className="mt-1 min-h-4 text-xs leading-snug text-muted"
                        text={on ? issuerStatus(i) : ""}
                      />
                    </div>
                  </NodeTag>
                );
              })}
            </div>
          </div>
        )}
        <StatusLine
          className="mt-4 min-h-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
          text={
            returning
              ? "The answer races home…"
              : done
                ? `…and ~${RETURN_MS} ms for the way home.`
                : ""
          }
        />
      </div>

      {/* Depth on demand: inside the issuer */}
      <AnimatePresence initial={false}>
        {openActor === "issuer" && (
          <motion.div
            key="issuer-depth"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={
              reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }
            }
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-8 border-y border-rule py-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Going deeper · the issuer
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
                  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
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

      {/* The verdict */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-8 max-w-[480px] border border-rule p-5"
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
                onClick={() => run(NATURAL)}
                className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Run it again
              </button>
              <button
                type="button"
                onClick={() => run(REALTIME)}
                className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Real time · 1.8 s
              </button>
              <button
                type="button"
                onClick={() => run(SLOW)}
                className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Slow motion · ¼
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
