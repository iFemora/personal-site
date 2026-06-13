"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { useCursorField } from "./CursorField";

/**
 * A small accent dot that trails the pointer, grows over interactive
 * elements, and puffs slightly when you flick fast. Position and speed
 * come from the shared cursor field. Touch / reduced-motion: renders
 * nothing. The system cursor stays.
 */
export default function CursorDot() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const isTennis = pathname.startsWith("/tennis");
  const { x: fx, y: fy, speed } = useCursorField();

  const [enabled, setEnabled] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useSpring(fx, { stiffness: 400, damping: 40, mass: 0.6 });
  const y = useSpring(fy, { stiffness: 400, damping: 40, mass: 0.6 });
  // Flick puff: a fast move briefly swells the dot.
  const flickScale = useTransform(speed, [0, 1], [1, 1.6]);

  // First pointer movement reveals the dot.
  useMotionValueEvent(fx, "change", () => {
    if (!visible) setVisible(true);
  });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const enableTimer = window.setTimeout(() => setEnabled(true), 0);

    const leave = () => setVisible(false);
    const over = (e: Event) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      setHoveringLink(
        Boolean(t.closest("a, button, [role='button'], summary, audio"))
      );
    };

    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.clearTimeout(enableTimer);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerover", over);
    };
  }, [reduced]);

  if (!enabled) return null;

  const size = hoveringLink ? 34 : isTennis ? 12 : 8;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-accent"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        scale: reduced ? 1 : flickScale,
      }}
      animate={{
        width: size,
        height: size,
        opacity: visible ? (hoveringLink ? 0.25 : isTennis ? 0.85 : 0.6) : 0,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {isTennis && (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="h-full w-full"
          aria-hidden
        >
          {/* Tennis-ball seams, visible once the dot grows. */}
          <path
            d="M22,7 C44,30 44,70 22,93"
            stroke="var(--background)"
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.9}
          />
          <path
            d="M78,7 C56,30 56,70 78,93"
            stroke="var(--background)"
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.9}
          />
        </svg>
      )}
    </motion.div>
  );
}
