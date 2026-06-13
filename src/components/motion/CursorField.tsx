"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

type Field = {
  x: MotionValue<number>; // raw pointer clientX (smoothed by consumers)
  y: MotionValue<number>; // raw pointer clientY
  speed: MotionValue<number>; // 0..1 eased pointer speed (flick intensity)
};

const CursorFieldContext = createContext<Field | null>(null);

/** Single source of cursor truth. Always rendered, so the value is non-null. */
export function useCursorField(): Field {
  const ctx = useContext(CursorFieldContext);
  if (!ctx) {
    throw new Error("useCursorField must be used within CursorFieldProvider");
  }
  return ctx;
}

/**
 * Owns the ONE pointermove listener and ONE animation frame for the whole
 * app. Tracks position and an eased speed (so effects can respond to how
 * fast you flick, not just where you are). Consumers subscribe via context
 * instead of each attaching their own listener.
 */
export function CursorFieldProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const speed = useMotionValue(0);
  const raw = useRef({ px: -100, py: -100, vx: 0, vy: 0, last: 0 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rafId = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const r = raw.current;
      const dt = r.last ? Math.min(now - r.last, 64) : 16;
      r.vx = (e.clientX - r.px) / dt;
      r.vy = (e.clientY - r.py) / dt;
      r.px = e.clientX;
      r.py = e.clientY;
      r.last = now;
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const loop = () => {
      if (!running) return;
      const r = raw.current;
      const inst = Math.min(Math.hypot(r.vx, r.vy) / 2.5, 1);
      speed.set(speed.get() + (inst - speed.get()) * 0.2);
      r.vx *= 0.9;
      r.vy *= 0.9;
      rafId = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [x, y, speed]);

  return (
    <CursorFieldContext.Provider value={{ x, y, speed }}>
      {children}
    </CursorFieldContext.Provider>
  );
}
