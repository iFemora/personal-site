"use client";

import { useState } from "react";
import {
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

const SHOTS = 3; // arcs over the net across the full scroll
const GROUND = 60;
const LEFT_X = 6;
const RIGHT_X = 94;
const ARC_PEAK = 34; // how high the ball flies above the baseline

function ballAt(progress: number): { x: number; y: number } {
  const p = Math.min(Math.max(progress, 0), 1);
  const t = p * SHOTS;
  const shot = Math.min(Math.floor(t), SHOTS - 1);
  const lt = t - shot;
  const leftToRight = shot % 2 === 0;
  const x = leftToRight
    ? LEFT_X + lt * (RIGHT_X - LEFT_X)
    : RIGHT_X - lt * (RIGHT_X - LEFT_X);
  const y = GROUND - ARC_PEAK * 4 * lt * (1 - lt);
  return { x, y };
}

/**
 * The tennis page's background: a side-view court in the same ghost
 * strokes as the spiral, with a ball that plays a rally as you scroll —
 * left to right and back, one arc per shot.
 */
export default function TennisRally() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [ball, setBall] = useState(() => ballAt(0));

  useMotionValueEvent(scrollYProgress, "change", (p) => setBall(ballAt(p)));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-[6vh] left-1/2 z-0 w-[92vw] max-w-[1300px] -translate-x-1/2 text-accent print:hidden"
    >
      <svg viewBox="0 0 100 64" fill="none" className="h-auto w-full">
        <g opacity={0.09} stroke="currentColor" strokeLinecap="round">
          {/* Baseline */}
          <path d={`M2,${GROUND} L98,${GROUND}`} strokeWidth={0.35} />
          {/* Net */}
          <path d={`M50,${GROUND - 13} L50,${GROUND}`} strokeWidth={0.35} />
          <path
            d={`M48.5,${GROUND - 13} L51.5,${GROUND - 13}`}
            strokeWidth={0.35}
          />
          {/* Service ticks */}
          <path
            d={`M26,${GROUND - 2.5} L26,${GROUND}`}
            strokeWidth={0.35}
          />
          <path
            d={`M74,${GROUND - 2.5} L74,${GROUND}`}
            strokeWidth={0.35}
          />
        </g>

        {reduced ? (
          <circle
            cx={LEFT_X}
            cy={GROUND - 1.6}
            r={1.6}
            fill="currentColor"
            opacity={0.2}
          />
        ) : (
          <circle
            cx={ball.x}
            cy={ball.y}
            r={1.6}
            fill="currentColor"
            opacity={0.22}
          />
        )}
      </svg>
    </div>
  );
}
