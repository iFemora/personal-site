"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";

/**
 * Re-mounts on every route change, giving each page a soft entrance.
 * Wraps page content only — header and footer (in layout) stay put.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
