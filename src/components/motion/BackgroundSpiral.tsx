"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useEffect } from "react";
import { spiralPath } from "@/lib/spiralPath";

/**
 * A huge ghost spiral living behind the page — rotates slowly with
 * scroll and drifts a few pixels toward the cursor. Weather, not decor.
 */
export default function BackgroundSpiral() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const driftX = useSpring(mx, { stiffness: 40, damping: 20, mass: 1.2 });
  const driftY = useSpring(my, { stiffness: 40, damping: 20, mass: 1.2 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 24);
      my.set((e.clientY / window.innerHeight - 0.5) * 24);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, mx, my]);

  // Same archimedean math as the signature mark, more turns.
  const d = spiralPath(3.6, 13, 1.5);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed -right-[18vw] top-[8vh] z-0 text-accent print:hidden"
      style={
        reduced
          ? undefined
          : { rotate, x: driftX, y: driftY }
      }
    >
      <svg
        width="62vw"
        height="62vw"
        viewBox="0 0 100 100"
        fill="none"
        className="opacity-[0.05]"
      >
        <path
          d={d}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
