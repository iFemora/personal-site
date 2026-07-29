"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Magnetic } from "@femora/design-system";
import { EASE } from "@femora/design-system/ease";
import { spiralPath } from "@femora/design-system/spiral-path";
import ThemeToggle from "@/components/ThemeToggle";
import PalettePicker, { PaletteRows } from "@/components/PalettePicker";
import { applyPalette, isPaletteId } from "@/lib/palettes";

const items = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/field-notes", label: "Notes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/love", label: "Love" },
];

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"menu" | "palette">("menu");
  const menuRef = useRef<HTMLDivElement>(null);
  const slidTo = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Slide-through selection: drag along the open stack, release to go.
  // Rows carry data-href (navigate) or data-action (panel swaps, palette
  // picks) — pointer capture on the menu means row onClick never fires,
  // so every row goes through this.
  const rowUnderPoint = (clientY: number): string | null => {
    const rows = menuRef.current?.querySelectorAll<HTMLElement>(
      "[data-href], [data-action]"
    );
    if (!rows) return null;
    for (const r of rows) {
      const rect = r.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom)
        return r.dataset.href ?? r.dataset.action ?? null;
    }
    return null;
  };

  const releaseRow = (value: string) => {
    if (value.startsWith("/")) {
      router.push(value);
      setOpen(false);
    } else if (value === "panel:palette") {
      setPanel("palette");
    } else if (value === "panel:menu") {
      setPanel("menu");
    } else if (value.startsWith("palette:")) {
      const id = value.slice("palette:".length);
      if (isPaletteId(id)) applyPalette(id);
    }
  };

  const thumb = (layoutId: string) =>
    reduced ? (
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-accent/10"
      />
    ) : (
      <motion.span
        layoutId={layoutId}
        aria-hidden
        className="absolute inset-0 rounded-full bg-accent/10"
        transition={{ duration: 0.45, ease: EASE }}
      />
    );

  return (
    <nav className="relative flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.18em] sm:gap-6">
      <div className="flex items-center gap-3 sm:gap-5">
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
        <PalettePicker />
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Desktop: the pill inline. */}
        <div className="hidden items-center rounded-full border border-rule p-1 sm:flex">
          {items.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] transition-colors duration-300 ${
                  active ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {active && thumb("nav-thumb-desktop")}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Phone: menu button beside the theme toggle. */}
        <div className="sm:hidden" ref={menuRef}>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setPanel("menu");
              setOpen((o) => !o);
            }}
            className="inline-flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-foreground"
          >
            <span className="relative block h-3.5 w-5" aria-hidden>
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ease-out ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-full bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ease-out ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                className={`absolute right-0 top-full z-[70] mt-3 touch-none rounded-3xl border border-rule bg-background p-1 ${
                  panel === "palette" ? "w-60" : "w-52"
                }`}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                onPointerDown={(e) => {
                  slidTo.current = rowUnderPoint(e.clientY);
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                    // pointer already gone (fast tap); click handles it
                  }
                }}
                onPointerMove={(e) => {
                  if (e.buttons) slidTo.current = rowUnderPoint(e.clientY);
                }}
                onPointerUp={() => {
                  if (slidTo.current) releaseRow(slidTo.current);
                  slidTo.current = null;
                }}
              >
                {panel === "menu" ? (
                  <>
                    {items.map((item) => {
                      const active = isActivePath(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          data-href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`relative block rounded-full px-4 py-2.5 transition-colors duration-300 ${
                            active ? "text-accent" : "text-muted"
                          }`}
                        >
                          {active && thumb("nav-thumb-phone")}
                          <span className="relative">{item.label}</span>
                        </Link>
                      );
                    })}
                    <div className="mx-4 my-1 border-t border-rule" />
                    <button
                      type="button"
                      data-action="panel:palette"
                      onClick={() => setPanel("palette")}
                      className="block w-full whitespace-nowrap rounded-full px-4 py-2.5 text-left uppercase text-muted transition-colors duration-300 hover:text-foreground"
                    >
                      Pick Your Palette
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      data-action="panel:menu"
                      onClick={() => setPanel("menu")}
                      className="block w-full rounded-full px-4 py-2.5 text-left uppercase text-muted transition-colors duration-300 hover:text-foreground"
                    >
                      ← Menu
                    </button>
                    <div className="mx-4 my-1 border-t border-rule" />
                    <PaletteRows />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Magnetic strength={0.3}>
          <ThemeToggle />
        </Magnetic>
      </div>
    </nav>
  );
}
