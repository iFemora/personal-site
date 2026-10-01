"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Magnetic } from "@femora/design-system";
import { EASE } from "@femora/design-system/ease";
import { spiralPath } from "@femora/design-system/spiral-path";
import ThemeToggle from "@/components/ThemeToggle";
import PalettePicker, {
  ActiveDot,
  PaletteRows,
} from "@/components/PalettePicker";
import { trackEvent, type TrackedEvent } from "@/lib/track";

type NavLink = { href: string; label: string };
type Room = NavLink & {
  /** Which section accent the room's dot is painted in. */
  accent: "studio" | "writing" | "gallery" | "work";
};
type NavGroup = {
  label: string;
  /** The umbrella's own hub page, if it has one. */
  href?: string;
  rooms: Room[];
  /** Muted line under the rooms for an umbrella still filling up. */
  note?: string;
  /** Hub link copy, e.g. "The whole studio →". Needs `href`. */
  hubLabel?: string;
  openEvent: TrackedEvent;
};
type NavItem = NavLink | NavGroup;

const isGroup = (item: NavItem): item is NavGroup => "rooms" in item;

/* Umbrellas open from a sub-nav, the way the palette picker does, so the
   pill stays short. CV sits beside Work while the job search is on; it is
   the highest-intent page for recruiters. Knowledge launched 2026-09-30
   with one room on purpose: hiding Follow the Money during a job hunt
   cost more than a one-item dropdown does. */
const items: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/cv", label: "CV" },
  {
    href: "/studio",
    label: "Studio",
    hubLabel: "The whole studio →",
    openEvent: "nav_studio_open",
    rooms: [
      { href: "/studio/reel", label: "Reel", accent: "studio" },
      { href: "/writing", label: "Writing", accent: "writing" },
      { href: "/gallery", label: "Gallery", accent: "gallery" },
    ],
  },
  {
    label: "Knowledge",
    note: "More soon",
    openEvent: "nav_knowledge_open",
    rooms: [
      { href: "/follow-the-money", label: "Follow the Money", accent: "work" },
    ],
  },
  { href: "/field-notes", label: "Notes" },
  { href: "/love", label: "Love" },
];

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActiveItem(pathname: string, item: NavItem): boolean {
  if (isGroup(item)) {
    if (item.href && isActivePath(pathname, item.href)) return true;
    return item.rooms.some((r) => isActivePath(pathname, r.href));
  }
  return isActivePath(pathname, item.href);
}

function RoomDot({ accent }: { accent: Room["accent"] }) {
  return (
    <span
      aria-hidden
      className="h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ backgroundColor: `var(--accent-${accent})` }}
    />
  );
}

export default function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"menu" | "palette">("menu");
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!open && !openGroup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenGroup(null);
      }
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target)) setOpen(false);
      const insideGroup = Object.values(groupRefs.current).some((el) =>
        el?.contains(target)
      );
      if (!insideGroup) setOpenGroup(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open, openGroup]);

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

  const segmentClass = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 lg:px-3.5 lg:tracking-[0.18em] ${
      active ? "text-accent" : "text-muted hover:text-foreground"
    }`;

  const panelClass =
    "absolute z-[70] mt-3 rounded-3xl border border-rule bg-background p-1";
  const panelMotion = {
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -6 },
    transition: { duration: 0.25, ease: EASE },
  };

  const noteRow = (note: string, className = "") => (
    <p
      className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted/70 ${className}`}
    >
      {note}
    </p>
  );

  const roomRows = (group: NavGroup, surface: "desktop" | "mobile") => (
    <>
      {group.rooms.map((room) => {
        const active = isActivePath(pathname, room.href);
        return (
          <Link
            key={room.href}
            href={room.href}
            onClick={() => setOpenGroup(null)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-4 rounded-full px-4 py-2.5 uppercase transition-colors duration-300 ${
              active
                ? "bg-accent/10 text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            <span className="whitespace-nowrap">{room.label}</span>
            <RoomDot accent={room.accent} />
          </Link>
        );
      })}
      {group.href && group.hubLabel && (
        <>
          <div className="mx-4 my-1 border-t border-rule" />
          <Link
            href={group.href}
            onClick={() => {
              trackEvent("studio_room_open", { label: "studio", surface });
              setOpenGroup(null);
            }}
            className="block rounded-full px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-foreground"
          >
            {group.hubLabel}
          </Link>
        </>
      )}
      {group.note && (
        <>
          <div className="mx-4 my-1 border-t border-rule" />
          {noteRow(group.note)}
        </>
      )}
    </>
  );

  return (
    <nav className="relative flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.18em] lg:gap-6">
      <div className="flex items-center gap-3 lg:gap-5">
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

      <div className="flex items-center gap-3 lg:gap-5">
        {/* Desktop: the pill inline. */}
        <div className="hidden items-center rounded-full border border-rule p-1 sm:flex">
          {items.map((item) => {
            const active = isActiveItem(pathname, item);
            if (isGroup(item)) {
              const isOpen = openGroup === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  ref={(el) => {
                    groupRefs.current[item.label] = el;
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      if (!isOpen)
                        trackEvent(item.openEvent, { surface: "desktop" });
                      setOpenGroup(isOpen ? null : item.label);
                    }}
                    className={segmentClass(active)}
                  >
                    {active && thumb("nav-thumb-desktop")}
                    <span className="relative">{item.label}</span>
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden
                      className={`relative transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M1 2.5l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth={1.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className={`${panelClass} left-1/2 top-full min-w-48 -translate-x-1/2`}
                        {...panelMotion}
                      >
                        {roomRows(item, "desktop")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={segmentClass(active)}
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
                className={`${panelClass} right-0 top-full ${
                  panel === "palette" ? "w-60" : "w-56"
                }`}
                {...panelMotion}
              >
                {panel === "menu" ? (
                  <>
                    {items.map((item) => {
                      const active = isActiveItem(pathname, item);
                      if (isGroup(item)) {
                        const hubActive =
                          !!item.href && isActivePath(pathname, item.href);
                        const parentClass = `relative block rounded-full px-4 py-2.5 transition-colors duration-300 ${
                          active ? "text-accent" : "text-muted"
                        }`;
                        return (
                          <div key={item.label}>
                            {item.href ? (
                              <Link
                                href={item.href}
                                onClick={() => setOpen(false)}
                                aria-current={hubActive ? "page" : undefined}
                                className={parentClass}
                              >
                                {hubActive && thumb("nav-thumb-phone")}
                                <span className="relative">{item.label}</span>
                              </Link>
                            ) : (
                              <p className={parentClass}>
                                <span className="relative">{item.label}</span>
                              </p>
                            )}
                            {item.rooms.map((room) => {
                              const roomActive = isActivePath(
                                pathname,
                                room.href
                              );
                              return (
                                <Link
                                  key={room.href}
                                  href={room.href}
                                  onClick={() => setOpen(false)}
                                  aria-current={roomActive ? "page" : undefined}
                                  className={`relative ml-4 flex items-center gap-2.5 rounded-full px-4 py-2 text-[11px] tracking-[0.16em] transition-colors duration-300 ${
                                    roomActive ? "text-accent" : "text-muted"
                                  }`}
                                >
                                  {roomActive && thumb("nav-thumb-phone")}
                                  <RoomDot accent={room.accent} />
                                  <span className="relative">{room.label}</span>
                                </Link>
                              );
                            })}
                            {item.note && noteRow(item.note, "ml-4 py-1.5")}
                          </div>
                        );
                      }
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
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
                      onClick={() => {
                        trackEvent("palette_picker_open", { surface: "mobile" });
                        setPanel("palette");
                      }}
                      className="flex w-full items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-left uppercase text-muted transition-colors duration-300 hover:text-foreground"
                    >
                      <ActiveDot />
                      Pick Your Palette
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setPanel("menu")}
                      className="block w-full rounded-full px-4 py-2.5 text-left uppercase text-muted transition-colors duration-300 hover:text-foreground"
                    >
                      ← Menu
                    </button>
                    <div className="mx-4 my-1 border-t border-rule" />
                    <PaletteRows surface="mobile" />
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
