"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";

const links = [
  { label: "email", href: "mailto:oluwafemiakinseye@gmail.com" },
  { label: "linkedin", href: "https://linkedin.com/in/ifemora" },
  { label: "x", href: "https://x.com/iFemora" },
  { label: "medium", href: "https://medium.com/@iFemora" },
  { label: "substack", href: "https://substack.com/@ifemora" },
];

export default function FooterLinks() {
  const reduced = useReducedMotion();

  return (
    <motion.ul
      className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {links.map((link) => (
        <motion.li
          key={link.label}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: EASE },
            },
          }}
        >
          <a
            href={link.href}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}
