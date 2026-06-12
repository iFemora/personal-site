"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "./Reveal";

type Props = {
  /** First word shown; hover/tap rolls through the rest, then wraps. */
  words: string[];
  className?: string;
};

function FlipWord({ words, className }: Props) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  const advance = () => setIndex((i) => (i + 1) % words.length);

  if (reduced) {
    return <span className={className}>{words[0]}</span>;
  }

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
          transition={{ duration: 0.4, ease: EASE }}
          className={`absolute inset-0 block ${
            index === 0 ? "" : "text-accent"
          }`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * "Thinker. Tinkerer." as a deck of identities — each word rolls
 * through the seven selves on hover/tap, returning to the start.
 */
export default function IdentityFlip({
  first,
  second,
  className,
}: {
  first: string[];
  second: string[];
  className?: string;
}) {
  return (
    <p className={className}>
      <FlipWord words={first} /> <FlipWord words={second} />
    </p>
  );
}
