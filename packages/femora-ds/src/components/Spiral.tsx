"use client";

import { motion, useReducedMotion } from "motion/react";
import { spiralPath } from "../lib/spiralPath";

export type SpiralProps = {
  size?: number;
  delay?: number;
  className?: string;
};

/**
 * The signature mark: a thin archimedean spiral that draws itself
 * outward from the center. A nod to "minds that think in spirals."
 * Colored by `currentColor` — set `text-accent` (or any text color) on it.
 */
export function Spiral({ size = 28, delay = 0.8, className }: SpiralProps) {
  const reduced = useReducedMotion();
  const d = spiralPath();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      className={className}
    >
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 1.6, ease: "easeOut", delay }
        }
      />
    </svg>
  );
}
