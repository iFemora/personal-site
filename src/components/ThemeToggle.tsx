"use client";

import { useId, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { trackEvent } from "@/lib/track";

type Theme = "light" | "dark";

function effectiveTheme(): Theme {
  const forced = document.documentElement.dataset.theme;
  if (forced === "light" || forced === "dark") return forced;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener("ifemora:themechange", onStoreChange);
  return () => window.removeEventListener("ifemora:themechange", onStoreChange);
}

function getThemeServerSnapshot(): Theme | null {
  return null;
}

/**
 * Sun ↔ moon, in the site's hand: the rays retract while a shadow slides
 * across the disc to carve a crescent. The choice persists in
 * localStorage; a pre-paint script in the layout applies it before first
 * render so reloads never flash the wrong theme.
 */
export default function ThemeToggle() {
  const reduced = useReducedMotion();
  const maskId = useId();
  const theme = useSyncExternalStore(
    subscribeTheme,
    effectiveTheme,
    getThemeServerSnapshot
  );

  function toggle() {
    if (!theme) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    trackEvent("theme_toggle", { theme_to: next });
    const root = document.documentElement;
    // Cross-fade the flip (skipped for reduced motion via CSS).
    root.setAttribute("data-theme-transitioning", "");
    window.setTimeout(
      () => root.removeAttribute("data-theme-transitioning"),
      500
    );
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private browsing — the flip still works for this visit */
    }
    window.dispatchEvent(new Event("ifemora:themechange"));
  }

  const isDark = theme === "dark";
  const spring = reduced
    ? { duration: 0 }
    : { duration: 0.5, ease: EASE };

  const rays = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      aria-pressed={isDark}
      title={isDark ? "Lights on" : "Lights off"}
      className="group inline-flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-accent"
      style={{ opacity: theme === null ? 0 : 1, transition: "opacity 0.3s" }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          {/* The shadow that carves the crescent. Parked off-disc in light. */}
          <motion.circle
            r="8"
            fill="black"
            initial={false}
            animate={{ cx: isDark ? 17 : 30, cy: isDark ? 7 : 0 }}
            transition={spring}
          />
        </mask>

        {/* Disc — sun core, then the masked moon face. */}
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: isDark ? 8.5 : 4.6 }}
          transition={spring}
        />

        {/* Rays — retract and vanish as night falls. */}
        <motion.g
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.45 : 1,
            rotate: isDark ? -40 : 0,
          }}
          transition={spring}
          style={{ transformOrigin: "12px 12px" }}
        >
          {rays.map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="2.4"
              x2="12"
              y2="5.2"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </motion.g>
      </svg>
    </button>
  );
}
