"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "./Reveal";

type Line = { text: string; className?: string };

type Props = {
  lines: Line[];
  className?: string;
  delay?: number;
  stagger?: number;
  /** Element to render. Defaults to h1; use h2/div when there's already a page h1. */
  as?: "h1" | "h2" | "div";
};

/**
 * Display type that breathes under the cursor: letters near the pointer
 * grow heavier and wonkier (Fraunces variable axes), relaxing with
 * distance. Falls back to a plain masked reveal for touch/reduced-motion.
 */
export default function ProximityType({
  lines,
  className,
  delay = 0,
  stagger = 0.12,
  as: Tag = "h1",
}: Props) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const letters = Array.from(
      root.querySelectorAll<HTMLSpanElement>("[data-letter]")
    );
    const RADIUS = 180;

    const update = (px: number, py: number) => {
      for (const el of letters) {
        const r = el.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - dist / RADIUS); // 0 far → 1 under cursor
        const weight = 500 + t * 200;
        const soft = t * 60;
        el.style.fontVariationSettings = `"WONK" 1, "SOFT" ${soft.toFixed(
          1
        )}, "wght" ${weight.toFixed(0)}`;
      }
    };

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => update(e.clientX, e.clientY));
    };
    const onLeave = () => {
      cancelAnimationFrame(raf.current);
      for (const el of letters) {
        el.style.fontVariationSettings = `"WONK" 1, "SOFT" 0, "wght" 500`;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <Tag ref={rootRef as React.Ref<HTMLHeadingElement>} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${line.className ?? ""}`}
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
            {/* Group letters by word so words never break mid-letter. */}
            {line.text.split(/(\s+)/).map((token, k) =>
              token.trim() === "" ? (
                <span key={k}> </span>
              ) : (
                <span key={k} className="inline-block whitespace-nowrap">
                  {Array.from(token).map((ch, j) => (
                    <span
                      key={j}
                      data-letter
                      className="inline-block"
                      style={{
                        fontVariationSettings: `"WONK" 1, "SOFT" 0, "wght" 500`,
                        transition: "font-variation-settings 0.18s ease-out",
                      }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              )
            )}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
