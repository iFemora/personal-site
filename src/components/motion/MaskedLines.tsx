"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "./Reveal";

type Line = string | { text: string; className?: string };

type Props = {
  /** Each entry renders as one masked line; objects can carry per-line classes. */
  lines: Line[];
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
      {lines.map((line, i) => {
        const text = typeof line === "string" ? line : line.text;
        const extra = typeof line === "string" ? "" : line.className ?? "";
        return (
          <span key={i} className="block overflow-hidden">
            <motion.span
              className={`block ${lineClassName ?? ""} ${extra}`}
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
              {text}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
