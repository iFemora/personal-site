"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/ease";

function FlipWord({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  const advance = () => setIndex((i) => (i + 1) % words.length);

  if (words.length === 1) {
    return <span className={className}>{words[0]}</span>;
  }

  /* Same markup whether or not motion is reduced: useReducedMotion is
     null on the server, so a structural branch mismatches on hydration.
     Reduced motion keeps the word deck and drops the roll. */
  return (
    <span
      role="button"
      tabIndex={0}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") advance();
      }}
      onClick={advance}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          advance();
        }
      }}
      aria-label={`${words[0]} — and more; activate to cycle`}
      className={`relative inline-block cursor-pointer overflow-hidden align-bottom ${
        className ?? ""
      }`}
    >
      {/* Invisible sizer keeps layout stable at the widest word. */}
      <span aria-hidden className="invisible block">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
          className={`absolute inset-0 block ${index === 0 ? "" : "text-accent"}`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export type IdentityFlipProps = {
  /** Each word independently rolls through its list on hover/tap, then wraps. */
  first: string[];
  second: string[];
  className?: string;
};

/**
 * A pair of words as a deck of identities — each rolls through its list of
 * selves on hover/tap, returning to the start. ("Thinker. Tinkerer.")
 */
export function IdentityFlip({ first, second, className }: IdentityFlipProps) {
  return (
    <p className={className}>
      <FlipWord words={first} /> <FlipWord words={second} />
    </p>
  );
}
