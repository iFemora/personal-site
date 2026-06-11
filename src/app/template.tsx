"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";

/**
 * Re-mounts on every route change, giving each page a soft entrance.
 * Wraps page content only — header and footer (in layout) stay put.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
