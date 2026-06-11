"use client";

import { motion, useReducedMotion } from "motion/react";

// Quietly-alive house easing: fast start, long soft landing.
export const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  children: React.ReactNode;
  delay?: number;
  /** Render once on mount (heroes) instead of waiting for scroll into view. */
  immediate?: boolean;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  immediate = false,
  className,
}: Props) {
  const reduced = useReducedMotion();

  const initial = reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 };
  const visible = {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  };

  if (immediate) {
    return (
      <motion.div initial={initial} animate={visible} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
