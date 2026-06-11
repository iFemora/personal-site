"use client";

import { motion, useReducedMotion } from "motion/react";

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

  // Archimedean spiral: r = a + b·θ, sampled into a polyline path.
  const cx = 50;
  const cy = 50;
  const turns = 2.75;
  const b = 16 / (2 * Math.PI); // radial growth per radian
  const steps = 120;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * turns * 2 * Math.PI;
    const r = 2 + b * theta;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const d = pts.join(" ");

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
