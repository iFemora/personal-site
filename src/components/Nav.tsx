"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Magnetic } from "@femora/design-system";
import { EASE } from "@femora/design-system/ease";
import { spiralPath } from "@femora/design-system/spiral-path";
import ThemeToggle from "@/components/ThemeToggle";

const items = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/field-notes", label: "Notes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/love", label: "Love" },
];

export default function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isHome = pathname === "/";
  const pillRef = useRef<HTMLDivElement>(null);

  // On narrow screens the pill scrolls; keep the current page in view.
  useEffect(() => {
    const active = pillRef.current?.querySelector<HTMLElement>(
      '[aria-current="page"]'
    );
    active?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <nav className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.18em] sm:gap-6">
      <Magnetic strength={0.35}>
        <Link
          href="/"
          aria-label="Home"
          aria-current={isHome ? "page" : undefined}
          className="group inline-flex h-9 w-9 items-center justify-center text-accent"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden
            className="transition-transform duration-700 ease-out group-hover:rotate-180"
          >
            <path
              d={spiralPath()}
              stroke="currentColor"
              strokeWidth={5}
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </Magnetic>

      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <div
          ref={pillRef}
          className="no-scrollbar flex min-w-0 items-center overflow-x-auto rounded-full border border-rule p-1"
        >
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-full px-3 py-2 text-[11px] transition-colors duration-300 sm:px-3.5 sm:py-1.5 ${
                  isActive ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {isActive &&
                  (reduced ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent/10"
                    />
                  ) : (
                    <motion.span
                      layoutId="nav-active-thumb"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent/10"
                      transition={{ duration: 0.45, ease: EASE }}
                    />
                  ))}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <Magnetic strength={0.3}>
          <ThemeToggle />
        </Magnetic>
      </div>
    </nav>
  );
}
