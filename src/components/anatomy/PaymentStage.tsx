"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { spiralPath } from "@femora/design-system/spiral-path";
import { anatomyEvent } from "@/lib/anatomyTrack";

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

/* Where the pulse is at time t: [ms, position 0..3] waypoints —
   dwell at each stop, crawl into the issuer, sweep home. */
const WAYPOINTS: [number, number][] = [
  [0, 0],
  [150, 0],
  [210, 1],
  [270, 1],
  [310, 2],
  [350, 2],
  [450, 3],
  [1350, 3],
  [1800, 0],
];

function pulsePosition(t: number): number {
  for (let i = 1; i < WAYPOINTS.length; i++) {
    const [t1, p1] = WAYPOINTS[i - 1];
    const [t2, p2] = WAYPOINTS[i];
    if (t <= t2) return p1 + ((t - t1) / (t2 - t1)) * (p2 - p1);
  }
  return 0;
}

/* Which node is "speaking" at time t. */
function activeNode(t: number): number | null {
  if (t < 150) return 0;
  if (t < 270) return 1;
  if (t < 350) return 2;
  if (t < 1350) return 3;
  return null; // the way home
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

/* ── the stage ──────────────────────────────────────────────────────── */

type Phase = "idle" | "running" | "done";

export default function PaymentStage() {
  const reduced = useReducedMotion();
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [clock, setClock] = useState(0);
  const [slow, setSlow] = useState(false);
  const [muted, setMuted] = useState(false);
  const [everRan, setEverRan] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const raf = useRef(0);
  const timer = useRef(0);
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
      cancelAnimationFrame(raf.current);
      window.clearTimeout(timer.current);
    },
    []
  );

  function run(asSlow = slow) {
    if (phase === "running") return;
    cancelAnimationFrame(raf.current);
    window.clearTimeout(timer.current);
    if (!everRan) {
      setEverRan(true);
      anatomyEvent("anatomy_card_tapped");
    }
    setPhase("running");
    setClock(0);

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf.current);
      setClock(TOTAL_MS);
      setPhase("done");
      beep(scenario.approved);
      anatomyEvent("anatomy_run_complete", {
        scenario: scenario.key,
        speed: asSlow ? "slow" : "real",
      });
    };

    if (reduced) {
      timer.current = window.setTimeout(finish, 250);
      return;
    }

    const factor = asSlow ? 0.25 : 1;
    // The timer owns completion (it survives a backgrounded tab, where
    // rAF is paused); frames only paint the clock in between.
    timer.current = window.setTimeout(finish, TOTAL_MS / factor);
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) * factor;
      if (t >= TOTAL_MS) return;
      setClock(t);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  function pickScenario(s: Scenario) {
    if (phase === "running") return;
    setScenario(s);
    setPhase("idle");
    setClock(0);
    anatomyEvent("anatomy_scenario", { scenario: s.key });
  }

  const running = phase === "running";
  const done = phase === "done";
  const speaking = running ? activeNode(clock) : null;
  const pos = running ? pulsePosition(clock) : 0;
  const returning = running && clock >= 1350;

  const issuerStatus = (i: number) =>
    i === 3 ? scenario.issuerLine : NODES[i].active;

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
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                on
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-rule text-muted hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* The card */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <button
          type="button"
          onClick={() => run()}
          aria-label={running ? "Payment in flight" : "Tap the card to run the payment"}
          className="group relative block w-72 select-none rounded-2xl border border-rule bg-background p-5 text-left transition-colors duration-300 hover:border-accent sm:w-80"
          style={{ aspectRatio: "1.586" }}
        >
          {running && !reduced && (
            <motion.span
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
          {/* Chip */}
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
          <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {running ? (
              <span className="text-accent">{String(Math.round(clock)).padStart(4, "0")} ms</span>
            ) : done ? (
              <span>{TOTAL_MS} ms · {scenario.approved ? "approved" : "declined"}</span>
            ) : (
              <span>Then tap the card</span>
            )}
          </p>
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
      <div className={`relative mt-10 ${isWide ? "" : "ml-1"}`}>
        {isWide ? (
          <div className="relative pb-2 pt-1">
            <div className="absolute left-[7%] right-[7%] top-[13px] h-px bg-rule" />
            {(running || done) && !reduced && (
              <motion.div
                aria-hidden
                className="absolute top-[9px] z-10 h-[9px] w-[9px] rounded-full bg-accent"
                animate={{ left: `calc(${7 + (pos / 3) * 86}% - 4px)`, opacity: running ? 1 : 0 }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            )}
            <div className="relative flex">
              {NODES.map((node, i) => {
                const on = speaking === i;
                return (
                  <div key={node.key} className="flex flex-1 flex-col items-center gap-2 text-center">
                    <span className={`transition-colors duration-300 ${on ? "text-accent" : "text-muted"}`}>
                      <Glyph kind={node.key} />
                    </span>
                    <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${on ? "text-accent" : "text-muted"}`}>
                      {node.name}
                    </span>
                    <span className="min-h-9 max-w-36 text-xs leading-snug text-muted">
                      {on
                        ? issuerStatus(i)
                        : done
                          ? `~${node.ms} ms`
                          : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-3 left-[12px] top-3 w-px bg-rule" />
            {(running || done) && !reduced && (
              <motion.div
                aria-hidden
                className="absolute left-[8.5px] z-10 h-[9px] w-[9px] rounded-full bg-accent"
                animate={{ top: `calc(${4 + (pos / 3) * 88}% )`, opacity: running ? 1 : 0 }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            )}
            <div className="flex flex-col gap-8">
              {NODES.map((node, i) => {
                const on = speaking === i;
                return (
                  <div key={node.key} className="flex items-start gap-4 pl-8">
                    <span className={`-ml-8 bg-background py-1 transition-colors duration-300 ${on ? "text-accent" : "text-muted"}`}>
                      <Glyph kind={node.key} />
                    </span>
                    <div>
                      <p className={`font-mono text-[10px] uppercase tracking-[0.14em] ${on ? "text-accent" : "text-muted"}`}>
                        {node.name}
                        {done && <span className="ml-3">~{node.ms} ms</span>}
                      </p>
                      <p className="mt-1 min-h-4 text-xs leading-snug text-muted">
                        {on ? issuerStatus(i) : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <p className="mt-4 min-h-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {returning
            ? "The answer races home…"
            : done
              ? `…and ~${RETURN_MS} ms for the way home.`
              : ""}
        </p>
      </div>

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
            <p className={`mt-3 font-mono text-xl tracking-[0.08em] ${scenario.approved ? "text-accent" : "text-foreground"}`}>
              {scenario.receipt}
            </p>
            <p className="mt-4 border-t border-rule pt-4 text-sm leading-relaxed text-muted">
              {scenario.explain}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => run(false)}
                className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Run it again
              </button>
              <button
                type="button"
                aria-pressed={slow}
                onClick={() => {
                  setSlow(true);
                  run(true);
                }}
                className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Slow motion · ¼ speed
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
