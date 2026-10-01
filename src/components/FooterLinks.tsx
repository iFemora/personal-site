"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { trackEvent } from "@/lib/track";

/** Routes that already end on the hire-me block. */
const PROFESSIONAL = ["/", "/work", "/cv", "/follow-the-money"];

function isProfessional(pathname: string) {
  return PROFESSIONAL.some(
    (p) => pathname === p || (p !== "/" && pathname.startsWith(`${p}/`))
  );
}

/** The footer's big ask. Personality pages get the tennis line; the
    professional pages, which end on HireMe, get nothing extra. */
export function FooterClose() {
  const pathname = usePathname();
  if (isProfessional(pathname)) return null;
  return (
    <p className="max-w-[680px] font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
      Building something <s className="text-muted">in payments</s>{" "}
      <span className="italic text-accent">genuinely good</span>? Or just
      want to debate tennis? <SayHelloLink />
    </p>
  );
}

const links: { label: string; href: string; network?: string }[] = [
  { label: "email", href: "mailto:oluwafemiakinseye@gmail.com", network: "email" },
  { label: "linkedin", href: "https://linkedin.com/in/ifemora", network: "linkedin" },
  { label: "x", href: "https://x.com/iFemora", network: "x" },
  { label: "substack", href: "https://substack.com/@ifemora", network: "substack" },
  { label: "cv", href: "/cv" },
  { label: "colophon", href: "/colophon" },
];

/** The "Say hello →" mailto in the footer paragraph — a client island so
    the click can be counted (mailto links escape GA's outbound tracking). */
export function SayHelloLink() {
  return (
    <a
      href="mailto:oluwafemiakinseye@gmail.com"
      onClick={() =>
        trackEvent("social_link_click", {
          network: "email",
          link_location: "footer_hello",
        })
      }
      className="link-swipe whitespace-nowrap text-accent"
    >
      Say hello →
    </a>
  );
}

export default function FooterLinks() {
  const reduced = useReducedMotion();

  return (
    <motion.ul
      className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-muted"
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
            onClick={() => {
              if (link.network) {
                trackEvent("social_link_click", {
                  network: link.network,
                  link_location: "footer_links",
                });
              }
            }}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}
