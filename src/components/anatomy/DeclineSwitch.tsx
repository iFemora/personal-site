"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { anatomyEvent } from "@/lib/anatomyTrack";

const SCENARIOS = [
  {
    key: "ok",
    label: "All good",
    approved: true,
    code: "00",
    receipt: "APPROVED",
    explain:
      "Funds are there, the card is active, nothing about this moment looks unusual. The issuer says yes and nobody in the queue ever knows a question was asked.",
  },
  {
    key: "nsf",
    label: "Not enough money",
    approved: false,
    code: "51",
    receipt: "DECLINED · 51",
    explain:
      "Insufficient funds, the most common no in the world. The terminal is deliberately vague about it; the code on the wire is precise.",
  },
  {
    key: "frozen",
    label: "Card frozen",
    approved: false,
    code: "57",
    receipt: "DECLINED · 57",
    explain:
      "The cardholder froze the card in their app, or the issuer suspended it. The card in the hand is fine; the card in the system is off.",
  },
  {
    key: "fraud",
    label: "Looks like fraud",
    approved: false,
    code: "59",
    receipt: "DECLINED · 59",
    explain:
      "The purchase does not fit the pattern of this card's life: wrong city, wrong hour, wrong size. A model scored it in milliseconds and the issuer chose caution over convenience.",
  },
] as const;

/** The issuer's decision, made flippable: same tap, four fates. */
export default function DeclineSwitch() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<(typeof SCENARIOS)[number]>(
    SCENARIOS[0]
  );

  function choose(s: (typeof SCENARIOS)[number]) {
    if (s.key === active.key) return;
    setActive(s);
    anatomyEvent("anatomy_decline_flipped", { scenario: s.key });
  }

  return (
    <figure className="mt-9 border-y border-rule py-8">
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => {
          const on = s.key === active.key;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={on}
              onClick={() => choose(s)}
              className={`relative rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
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

      <div className="mt-7 max-w-[420px] border border-rule p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          What the terminal shows
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={active.key}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={`mt-3 font-mono text-xl tracking-[0.08em] ${
              active.approved ? "text-accent" : "text-foreground"
            }`}
          >
            {active.receipt}
          </motion.p>
        </AnimatePresence>
        <p className="mt-4 border-t border-rule pt-4 text-sm leading-relaxed text-muted">
          {active.explain}
        </p>
      </div>

      <figcaption className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
        Response codes are real; the wording on receipts varies by terminal.
      </figcaption>
    </figure>
  );
}
