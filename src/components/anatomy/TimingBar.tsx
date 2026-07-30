"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";

const SEGMENTS = [
  { label: "Terminal", ms: 150 },
  { label: "Acquirer", ms: 120 },
  { label: "Network", ms: 80 },
  { label: "Issuer decides", ms: 900 },
  { label: "The way back", ms: 450 },
];

const TOTAL = SEGMENTS.reduce((s, x) => s + x.ms, 0);

/** Where the 1.7 seconds actually goes: mostly, the issuer thinking. */
export default function TimingBar() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <figure ref={ref} className="mt-9 border-y border-rule py-8">
      <div className="flex h-8 w-full overflow-hidden">
        {SEGMENTS.map((seg, i) => (
          <motion.div
            key={seg.label}
            className={i % 2 === 0 ? "h-full bg-accent/25" : "h-full bg-accent/60"}
            initial={reduced ? false : { flexGrow: 0 }}
            animate={inView ? { flexGrow: seg.ms } : undefined}
            style={reduced ? { flexGrow: seg.ms } : { flexBasis: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}
          />
        ))}
      </div>
      <dl className="mt-5 grid gap-2 sm:grid-cols-2">
        {SEGMENTS.map((seg, i) => (
          <div key={seg.label} className="flex items-baseline gap-3">
            <span
              aria-hidden
              className={`h-2.5 w-2.5 shrink-0 ${i % 2 === 0 ? "bg-accent/25" : "bg-accent/60"}`}
            />
            <dt className="text-sm text-muted">{seg.label}</dt>
            <dd className="ml-auto font-mono text-xs text-muted">
              ~{seg.ms} ms
            </dd>
          </div>
        ))}
        <div className="flex items-baseline gap-3 border-t border-rule pt-2 sm:col-span-2">
          <dt className="text-sm">Tap to beep</dt>
          <dd className="ml-auto font-mono text-xs text-accent">
            ~{(TOTAL / 1000).toFixed(1)} s
          </dd>
        </div>
      </dl>
      <figcaption className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
        Typical shape, not a benchmark — the issuer&apos;s decision dominates.
      </figcaption>
    </figure>
  );
}
