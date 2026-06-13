"use client";

import {
  motion,
  useSpring,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { spiralPath } from "@/lib/spiralPath";
import { useCursorField } from "./CursorField";

/**
 * A huge ghost spiral living behind the page — rotates slowly with
 * scroll and drifts a few pixels toward the cursor. Weather, not decor.
 * Drift comes from the shared cursor field (no listener of its own).
 */
export default function BackgroundSpiral() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { x: fx, y: fy } = useCursorField();

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // Start at neutral 0 so SSR and first client render agree (no window
  // access during render); the field nudges these after mount.
  const driftX = useSpring(0, { stiffness: 40, damping: 20, mass: 1.2 });
  const driftY = useSpring(0, { stiffness: 40, damping: 20, mass: 1.2 });

  useMotionValueEvent(fx, "change", (v) => {
    if (reduced) return;
    driftX.set((v / window.innerWidth - 0.5) * 24);
  });
  useMotionValueEvent(fy, "change", (v) => {
    if (reduced) return;
    driftY.set((v / window.innerHeight - 0.5) * 24);
  });

  // Same archimedean math as the signature mark, more turns.
  const d = spiralPath(3.6, 13, 1.5);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed -right-[18vw] top-[8vh] z-0 text-accent print:hidden"
      style={reduced ? undefined : { rotate, x: driftX, y: driftY }}
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
