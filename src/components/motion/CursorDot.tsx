"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

/**
 * A small accent dot that trails the pointer and grows over
 * interactive elements. Renders nothing on touch devices and
 * for users who prefer reduced motion. The system cursor stays.
 */
export default function CursorDot() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 400, damping: 40, mass: 0.6 });
  const y = useSpring(my, { stiffness: 400, damping: 40, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // Defer so the enable flag flips after hydration, not during the effect pass.
    const enableTimer = window.setTimeout(() => setEnabled(true), 0);

    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const over = (e: Event) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      setHoveringLink(
        Boolean(t.closest("a, button, [role='button'], summary, audio"))
      );
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.clearTimeout(enableTimer);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerover", over);
    };
  }, [reduced, mx, my]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-accent"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: hoveringLink ? 34 : 8,
        height: hoveringLink ? 34 : 8,
        opacity: visible ? (hoveringLink ? 0.18 : 0.6) : 0,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    />
  );
}
