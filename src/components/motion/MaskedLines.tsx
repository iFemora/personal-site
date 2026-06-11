"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "./Reveal";

type Props = {
  /** Each string renders as one masked line. */
  lines: string[];
  as?: "h1" | "h2" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Type-being-set reveal: each line rises out of an overflow mask,
 * one after the other.
 */
export default function MaskedLines({
  lines,
  as: Tag = "div",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={reduced ? { y: 0 } : { y: "110%" }}
            animate={{
              y: 0,
              transition: {
                duration: 0.85,
                ease: EASE,
                delay: delay + i * stagger,
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
