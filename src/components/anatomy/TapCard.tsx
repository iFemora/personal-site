"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { spiralPath } from "@femora/design-system/spiral-path";
import { anatomyEvent } from "@/lib/anatomyTrack";

/** The story starts the way every payment does: with a tap. */
export default function TapCard() {
  const reduced = useReducedMotion();
  const [tapped, setTapped] = useState(false);
  const [ripple, setRipple] = useState(0);

  function tap() {
    setRipple((r) => r + 1);
    if (!tapped) {
      setTapped(true);
      anatomyEvent("anatomy_card_tapped");
    }
  }

  return (
    <div className="mt-10 flex flex-col items-start gap-5">
      <button
        type="button"
        onClick={tap}
        aria-label="Tap the card to begin"
        className="group relative block w-64 select-none rounded-2xl border border-rule bg-background p-5 text-left transition-colors duration-300 hover:border-accent sm:w-72"
        style={{ aspectRatio: "1.586" }}
      >
        {ripple > 0 && !reduced && (
          <motion.span
            key={ripple}
            aria-hidden
            className="absolute inset-0 rounded-2xl border border-accent"
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        )}
        <svg
          width="26"
          height="26"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
          className="text-accent"
        >
          <path
            d={spiralPath()}
            stroke="currentColor"
            strokeWidth={6}
            strokeLinecap="round"
          />
        </svg>
        {/* Contactless mark */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="absolute right-5 top-5 text-muted transition-colors duration-300 group-hover:text-accent"
        >
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
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            •••• 2026
          </span>
          <span className="font-serif italic text-muted">F. S-K</span>
        </div>
      </button>

      <p
        aria-live="polite"
        className="min-h-5 font-mono text-xs uppercase tracking-[0.18em]"
      >
        {tapped ? (
          <motion.span
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-block text-accent"
          >
            Approved · 1.8 seconds
          </motion.span>
        ) : (
          <span className="text-muted">Tap the card</span>
        )}
      </p>
    </div>
  );
}
