"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { anatomyEvent } from "@/lib/anatomyTrack";

/* ── Act III: the dispute, played as a case file.
   A different grammar on purpose: the two seconds and the night are
   journeys you watch; a dispute is an argument you sit inside. So this
   unfolds at the reader's pace, one filing at a time, with the reader
   making the calls at the two moments that decide everything — and a
   ledger that always shows whose money the $120 is right now.
   ALL COPY DRAFT pending Femi's voice pass. Days are typical, not
   promises; networks write their own rulebooks. ─────────────────────── */

type StepActor = "you" | "issuer" | "network" | "merchant";

type Step = {
  id: string;
  actor: StepActor;
  actorName: string;
  day: number;
  stage: string;
  moneyAt: string;
  body: string;
  choice?: {
    prompt: string;
    options: { label: string; to: string }[];
  };
  next?: string;
  end?: "accept" | "cardholder" | "merchant";
};

const STEPS: Record<string, Step> = {
  s1: {
    id: "s1",
    actor: "you",
    actorName: "You",
    day: 0,
    stage: "The discovery",
    moneyAt: "Gone from your account",
    body: "A $120 charge sits on your card, from a store you have never heard of, in a city you have never visited. You did not make it. You call your bank.",
    next: "s2",
  },
  s2: {
    id: "s2",
    actor: "issuer",
    actorName: "The issuer",
    day: 0,
    stage: "Containment",
    moneyAt: "Gone from your account",
    body: "First move: the card dies. Frozen, cancelled, a replacement ordered before the call ends, because whoever spent your $120 still holds the numbers. Then the dispute opens, filed under a reason code that names the kind of wrong. This one says fraud.",
    next: "s3",
  },
  s3: {
    id: "s3",
    actor: "issuer",
    actorName: "The issuer",
    day: 1,
    stage: "Provisional credit",
    moneyAt: "Back with you, on loan from the issuer",
    body: "The $120 reappears in your account. Read that carefully: it is not the merchant's money returned. It is the issuer's own money, fronted to you while the case runs. If the case is lost, it leaves again.",
    next: "s4",
  },
  s4: {
    id: "s4",
    actor: "network",
    actorName: "The network",
    day: 2,
    stage: "The chargeback travels",
    moneyAt: "Clawed from the merchant",
    body: "The dispute rides the same rail as the payment, backwards. The network carries it to the merchant's bank, which reaches into the merchant's account and pulls the $120 out, plus a chargeback fee for the trouble. The merchant discovers that money they counted last week is suddenly gone.",
    next: "c1",
  },
  c1: {
    id: "c1",
    actor: "merchant",
    actorName: "The merchant",
    day: 5,
    stage: "The merchant's move",
    moneyAt: "Clawed from the merchant",
    body: "The merchant reads the case. They have a window of weeks, not months, and two doors: accept the loss and move on, or fight back with evidence that the purchase was real. Fighting has a name, representment, because they are re-presenting the charge.",
    choice: {
      prompt: "What does the merchant do?",
      options: [
        { label: "They accept the loss", to: "endA" },
        { label: "They fight it", to: "s5" },
      ],
    },
  },
  endA: {
    id: "endA",
    actor: "issuer",
    actorName: "The issuer",
    day: 8,
    stage: "Case closed",
    moneyAt: "Yours, permanently",
    body: "No contest. Your provisional credit hardens into a permanent one, the merchant absorbs the $120 and the fee, and your replacement card is already in the post. Most fraud disputes end exactly here, quietly.",
    end: "accept",
  },
  s5: {
    id: "s5",
    actor: "merchant",
    actorName: "The merchant",
    day: 12,
    stage: "Representment",
    moneyAt: "Clawed from the merchant",
    body: "The evidence package arrives: a receipt, a delivery confirmation, device and network fingerprints from the checkout, a claim that the security code matched. The merchant's argument is simple. Someone made this purchase, and they believe it was you.",
    next: "c2",
  },
  c2: {
    id: "c2",
    actor: "issuer",
    actorName: "The issuer",
    day: 20,
    stage: "The ruling",
    moneyAt: "Clawed from the merchant",
    body: "Now the issuer sits where I used to work: the merchant's evidence on one screen, your history on the other, and a decision that cannot split the difference. Somebody has to say whose $120 this is. For this run, the chair is yours.",
    choice: {
      prompt: "You are the issuer. Rule.",
      options: [
        { label: "Rule for the cardholder", to: "endB" },
        { label: "Rule for the merchant", to: "endC" },
      ],
    },
  },
  endB: {
    id: "endB",
    actor: "issuer",
    actorName: "The issuer",
    day: 25,
    stage: "Case closed",
    moneyAt: "Yours, permanently",
    body: "The evidence never placed you behind the purchase, and the rules put the burden where the risk was taken. The merchant eats the $120 and the fees. If they still believe they are right, one road remains: arbitration, where the network itself judges and the loser pays fees that dwarf the charge. Almost nobody walks that road for $120.",
    end: "cardholder",
  },
  endC: {
    id: "endC",
    actor: "issuer",
    actorName: "The issuer",
    day: 25,
    stage: "Case closed",
    moneyAt: "Returned to the merchant",
    body: "The evidence held, and the ruling goes to the merchant. The provisional credit reverses, and the $120 leaves your account a second time, which is the moment most people discover a dispute was never a refund button. Escalation exists, up to arbitration where the network judges and the loser pays dearly for the privilege. For $120, almost nobody does.",
    end: "merchant",
  },
};

const FIRST_STEP = "s1";

function ActorGlyph({ kind }: { kind: StepActor }) {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      {kind === "you" && (
        <>
          <circle cx="12" cy="8" r="4" {...stroke} />
          <path d="M4.5 20.5c1.5-4 4-6 7.5-6s6 2 7.5 6" {...stroke} />
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
      {kind === "network" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...stroke} />
          <ellipse cx="12" cy="12" rx="4" ry="8.5" {...stroke} />
          <path d="M3.5 12h17" {...stroke} />
        </>
      )}
      {kind === "merchant" && (
        <>
          <path d="M4 9.5 5.5 4h13L20 9.5" {...stroke} />
          <path d="M4 9.5c0 1.4 1.2 2.5 2.7 2.5S9.3 10.9 9.3 9.5c0 1.4 1.2 2.5 2.7 2.5s2.7-1.1 2.7-2.5c0 1.4 1.2 2.5 2.7 2.5S20 10.9 20 9.5" {...stroke} />
          <path d="M5.5 12v8.5h13V12" {...stroke} />
          <path d="M9.5 20.5v-5h5v5" {...stroke} />
        </>
      )}
    </svg>
  );
}

export default function DisputeCase() {
  const reduced = useReducedMotion();
  const [path, setPath] = useState<string[]>([]);
  const [runId, setRunId] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  // Mirror of the path tail, so a stale button (still visible during
  // its exit animation) can't advance the case twice on fast taps.
  const tailRef = useRef<string | null>(null);

  const current = path.length ? STEPS[path[path.length - 1]] : null;
  const ended = current?.end !== undefined;

  useEffect(() => {
    tailRef.current = path.length ? path[path.length - 1] : null;
  }, [path]);

  useEffect(() => {
    if (!path.length || reduced) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [path, reduced]);

  function open() {
    setPath([FIRST_STEP]);
    setRunId((r) => r + 1);
    anatomyEvent("anatomy_dispute_opened");
  }

  function advance(from: string, to: string, viaChoice?: string) {
    if (tailRef.current !== from) return; // stale tap during an exit
    tailRef.current = to;
    if (viaChoice) anatomyEvent("anatomy_dispute_choice", { choice: viaChoice });
    const step = STEPS[to];
    setPath((p) => [...p, to]);
    if (step.end) anatomyEvent("anatomy_dispute_end", { ending: step.end });
  }

  function reset() {
    setPath([]);
  }

  return (
    <div className="mt-9">
      {path.length === 0 ? (
        <button
          type="button"
          onClick={open}
          className="rounded-full border border-rule px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          Open the case
        </button>
      ) : (
        <div key={runId}>
          {/* The ledger: always in sight, because whose money it is
              right now IS the lesson. Sits below the sticky nav. */}
          <div className="sticky top-[72px] z-30 border-y border-rule bg-background/90 py-2.5 backdrop-blur-md sm:top-[76px]">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.15em]">
              <span className="text-accent">Day {current!.day}</span>
              <span className="text-foreground">$120 · {current!.moneyAt}</span>
              <span className="text-muted">{current!.stage}</span>
            </div>
          </div>

          {/* The filings */}
          <ol className="mt-8 space-y-8">
            {path.map((id) => {
              const step = STEPS[id];
              return (
                <motion.li
                  key={id}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="flex items-start gap-4"
                >
                  <span className="mt-0.5 shrink-0 text-accent">
                    <ActorGlyph kind={step.actor} />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                      <span className="text-accent">Day {step.day}</span> ·{" "}
                      {step.actorName} · {step.stage}
                    </p>
                    <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <div ref={endRef} className="mt-7 pl-10">
            {/* No exit choreography here on purpose: the next action must
                be tappable the instant it exists. */}
            <>
              {current!.choice ? (
                <motion.div
                  key={`choice-${current!.id}`}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {current!.choice.prompt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {current!.choice.options.map((o) => (
                      <button
                        key={o.to}
                        type="button"
                        onClick={() => advance(current!.id, o.to, o.label)}
                        className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : ended ? (
                <motion.div
                  key="coda"
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="max-w-[560px] font-serif italic leading-relaxed text-muted">
                    Nobody refunds a dispute. The money is pried from whoever
                    the rules say should hold it, and every party pays
                    something for the argument itself. That is why good
                    issuers fight fraud before it happens, and good merchants
                    keep their dispute rate near zero. The argument costs
                    more than the answer.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-5 rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    Reopen the case
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key={`continue-${current!.id}`}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  type="button"
                  onClick={() => advance(current!.id, current!.next!)}
                  className="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  Continue →
                </motion.button>
              )}
            </>
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
            Days are typical, not promises — every network writes its own
            rulebook. Amounts illustrative.
          </p>
        </div>
      )}
    </div>
  );
}
