"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/** Momentum scrolling via Lenis. Disabled for reduced-motion users. */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.1 }}>
      {children}
    </ReactLenis>
  );
}
