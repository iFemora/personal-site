"use client";

import { motion, useReducedMotion } from "motion/react";
import { spiralPath } from "@/lib/spiralPath";

type Props = {
  size?: number;
  delay?: number;
  className?: string;
};

/**
 * The signature mark: a thin archimedean spiral that draws itself
 * outward from the center. A nod to "minds that think in spirals."
 */
export default function Spiral({ size = 28, delay = 0.8, className }: Props) {
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
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay }}
      />
    </svg>
  );
}
