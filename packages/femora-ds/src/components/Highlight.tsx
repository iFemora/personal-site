"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/ease";

export type HighlightProps = {
  children: React.ReactNode;
  /** Stagger order — highlights sweep in sequence as the block scrolls in. */
  order?: number;
};

/**
 * A marker swipe over a key phrase: the accent highlight draws itself
 * left-to-right when the text scrolls into view.
 */
export function Highlight({ children, order = 0 }: HighlightProps) {
  const reduced = useReducedMotion();

  return (
    <motion.em
      className="not-italic"
      style={{
        backgroundImage:
          "linear-gradient(transparent 58%, color-mix(in srgb, var(--accent) 28%, transparent) 58%)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left bottom",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
      initial={
        reduced ? { backgroundSize: "100% 100%" } : { backgroundSize: "0% 100%" }
      }
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{
        duration: 0.6,
        ease: EASE,
        delay: 0.3 + order * 0.25,
      }}
    >
      {children}
    </motion.em>
  );
}
