"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "./Reveal";

type Props = {
  className?: string;
  delay?: number;
  /** Draw on mount instead of on scroll into view. */
  immediate?: boolean;
};

/** A hairline rule that draws itself from left to right. */
export default function DrawnRule({
  className = "my-12",
  delay = 0,
  immediate = false,
}: Props) {
  const reduced = useReducedMotion();

  const initial = reduced ? { scaleX: 1 } : { scaleX: 0 };
  const visible = {
    scaleX: 1,
    transition: { duration: 0.9, ease: EASE, delay },
  };

  const common = {
    initial,
    className: `block h-px w-full origin-left bg-rule ${className}`,
    role: "separator" as const,
    "aria-hidden": true,
  };

  if (immediate) {
    return <motion.span {...common} animate={visible} />;
  }

  return (
    <motion.span
      {...common}
      whileInView={visible}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    />
  );
}
