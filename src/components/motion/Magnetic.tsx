"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

type Props = {
  children: React.ReactNode;
  /** How far the element leans toward the cursor, as a fraction of offset. */
  strength?: number;
  className?: string;
};

/** Wraps an element so it leans gently toward the pointer on hover. */
export default function Magnetic({
  children,
  strength = 0.3,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 250, damping: 18, mass: 0.5 });

  function onPointerMove(e: React.PointerEvent) {
    if (reduced || !ref.current) return;
    if (e.pointerType !== "mouse") return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    my.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onPointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
