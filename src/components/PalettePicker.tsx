"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import {
  PALETTES,
  applyPalette,
  currentPalette,
  subscribePalette,
  type PaletteId,
} from "@/lib/palettes";
import { trackEvent } from "@/lib/track";

type Mode = "light" | "dark";

function effectiveMode(): Mode {
  const forced = document.documentElement.dataset.theme;
  if (forced === "light" || forced === "dark") return forced;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeMode(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("ifemora:themechange", onStoreChange);
  media.addEventListener("change", onStoreChange);
  return () => {
    window.removeEventListener("ifemora:themechange", onStoreChange);
    media.removeEventListener("change", onStoreChange);
  };
}

const nullSnapshot = () => null;

export function usePaletteState() {
  const palette = useSyncExternalStore(
    subscribePalette,
    currentPalette,
    nullSnapshot
  );
  const mode = useSyncExternalStore(subscribeMode, effectiveMode, nullSnapshot);
  return { palette, mode };
}

function SwatchDots({ id, mode }: { id: PaletteId; mode: Mode }) {
  const palette = PALETTES.find((p) => p.id === id);
  if (!palette) return null;
  return (
    <span aria-hidden className="flex items-center gap-1">
      {palette.swatches[mode].map((color, i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-full border border-rule"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

/** A dot in the live accent, so the control reads as state and not just
    an invitation — a visitor returning to a palette they chose months ago
    can see the site is painted in their choice, not repainted in mine. */
export function ActiveDot() {
  return (
    <span
      aria-hidden
      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
    />
  );
}

/** The palette rows themselves — shared between the desktop dropdown
    and the phone menu's palette panel in Nav. */
export function PaletteRows({
  surface = "desktop",
}: {
  surface?: "desktop" | "mobile";
}) {
  const { palette, mode } = usePaletteState();
  if (palette === null || mode === null) return null;
  return (
    <>
      {PALETTES.map((p) => {
        const active = p.id === palette;
        return (
          <button
            key={p.id}
            type="button"
            title={p.note}
            aria-pressed={active}
            onClick={() => {
              if (!active) {
                trackEvent("palette_selected", {
                  palette_name: p.id,
                  surface,
                });
              }
              applyPalette(p.id);
            }}
            className={`flex w-full items-center justify-between gap-4 rounded-full px-4 py-2.5 text-left uppercase transition-colors duration-300 ${
              active ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            <span>{p.label}</span>
            <SwatchDots id={p.id} mode={mode} />
          </button>
        );
      })}
    </>
  );
}

/** Desktop-only "Pick Your Palette" control beside the spiral mark.
    On phones the same rows live inside the nav menu instead. */
export default function PalettePicker() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="relative hidden sm:block" ref={wrapRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Pick your palette"
        onClick={() => {
          if (!open) trackEvent("palette_picker_open", { surface: "desktop" });
          setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-rule px-3 py-2 text-[11px] uppercase transition-colors duration-300 lg:px-4 ${
          open
            ? "bg-accent/10 text-accent"
            : "text-muted hover:text-foreground"
        }`}
      >
        <ActiveDot />
        {/* Below lg the pill is dot-only so the nav fits beside it. */}
        <span className="hidden lg:inline">Pick Your Palette</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-full z-[70] mt-3 w-56 rounded-3xl border border-rule bg-background p-1"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <PaletteRows />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
