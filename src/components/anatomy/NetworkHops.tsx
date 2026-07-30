"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const STOPS = [
  { key: "terminal", label: "Terminal" },
  { key: "acquirer", label: "Acquirer" },
  { key: "network", label: "Network" },
  { key: "issuer", label: "Issuer" },
] as const;

/** The request travels out along the wire and the answer races back:
    one pulse, four stops, there and home again. */
export default function NetworkHops() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <figure ref={ref} className="mt-9 border-y border-rule py-8">
      <div className="relative mx-2">
        {/* The wire */}
        <div className="absolute left-0 right-0 top-[7px] h-px bg-rule" />
        {/* The pulse: out to the issuer, then home. */}
        {!reduced && inView && (
          <motion.div
            aria-hidden
            className="absolute top-[3px] h-[9px] w-[9px] rounded-full bg-accent"
            initial={{ left: "0%" }}
            animate={{ left: ["0%", "98%", "0%"] }}
            transition={{
              duration: 3.2,
              times: [0, 0.55, 1],
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1.6,
            }}
          />
        )}
        <div className="relative flex justify-between">
          {STOPS.map((stop, i) => (
            <div key={stop.key} className="flex flex-col items-center gap-3">
              <span
                className={`h-[15px] w-[15px] rounded-full border ${
                  reduced && i === STOPS.length - 1
                    ? "border-accent bg-accent"
                    : "border-rule bg-background"
                }`}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[11px]">
                {stop.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
        The question rides out, the answer rides home. Four stops each way.
      </figcaption>
    </figure>
  );
}
