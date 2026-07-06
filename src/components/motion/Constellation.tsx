"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useCursorField } from "@/components/motion/CursorField";

type Beat = { id: string; year: string; title: string };

type Props = { beats: Beat[] };

/* Node layout: the life laid along the house spiral — earliest year at the
   centre, "Now" at the outer end. Coordinates live in a 100×100 box and
   scale with the container, so SSR output is deterministic. */
const TURNS = 2.35;
const INNER = 5;
const R_MAX = 45;

function layout(n: number) {
  const b = (R_MAX - INNER) / (TURNS * 2 * Math.PI);
  return Array.from({ length: n }, (_, i) => {
    const theta = (i / Math.max(n - 1, 1)) * TURNS * 2 * Math.PI - Math.PI / 2;
    const r = INNER + b * (theta + Math.PI / 2);
    return {
      x: 50 + r * Math.cos(theta),
      y: 50 + r * Math.sin(theta),
      // Unit radial direction, for pushing year labels away from the thread.
      ux: Math.cos(theta),
      uy: Math.sin(theta),
    };
  });
}

const PULL_RADIUS = 150; // px within which a node leans toward the cursor
const PULL_MAX = 11; // px of travel — house rule: small
const DRIFT = 2.4; // px of idle breathing

export default function Constellation({ beats }: Props) {
  const reduced = useReducedMotion();
  const field = useCursorField();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const points = useMemo(() => layout(beats.length), [beats.length]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const color = (v: string) => rootStyles.getPropertyValue(v).trim();

    let raf = 0;
    let running = false;
    let inView = true;
    const offsets = points.map(() => ({ x: 0, y: 0 }));
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (rect: DOMRect) => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      const px = (i: number) => ({
        x: (points[i].x / 100) * rect.width + offsets[i].x,
        y: (points[i].y / 100) * rect.height + offsets[i].y,
      });

      // The thread of the life — a hairline through every beat.
      ctx.beginPath();
      const first = px(0);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < points.length; i++) {
        const prev = px(i - 1);
        const here = px(i);
        const mx = (prev.x + here.x) / 2;
        const my = (prev.y + here.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      const last = px(points.length - 1);
      ctx.lineTo(last.x, last.y);
      ctx.strokeStyle = color("--rule");
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // A soft accent breath under the active beat.
      const a = activeRef.current;
      if (a !== null) {
        const p = px(a);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 34);
        glow.addColorStop(0, color("--accent"));
        glow.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - 34, p.y - 34, 68, 68);
        ctx.globalAlpha = 1;
      }
    };

    const staticPaint = () => {
      fit();
      draw(wrap.getBoundingClientRect());
    };

    const loop = (t: number) => {
      if (!running) return;
      const rect = wrap.getBoundingClientRect();
      const cx = field.x.get();
      const cy = field.y.get();

      for (let i = 0; i < points.length; i++) {
        let ox = reduced ? 0 : Math.sin(t * 0.0005 + i * 2.1) * DRIFT;
        let oy = reduced ? 0 : Math.cos(t * 0.0006 + i * 1.7) * DRIFT;

        if (finePointer && !reduced) {
          const nx = rect.left + (points[i].x / 100) * rect.width;
          const ny = rect.top + (points[i].y / 100) * rect.height;
          const dx = cx - nx;
          const dy = cy - ny;
          const dist = Math.hypot(dx, dy);
          if (dist < PULL_RADIUS && dist > 0.001) {
            const pull = (1 - dist / PULL_RADIUS) * PULL_MAX;
            ox += (dx / dist) * pull;
            oy += (dy / dist) * pull;
          }
        }

        offsets[i].x = ox;
        offsets[i].y = oy;
        const btn = btnRefs.current[i];
        if (btn) {
          btn.style.transform = `translate(calc(-50% + ${ox.toFixed(
            2
          )}px), calc(-50% + ${oy.toFixed(2)}px))`;
        }
      }

      draw(rect);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(staticPaint);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(wrap);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    staticPaint();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [points, reduced, field.x, field.y]);

  // Repaint the static frame when the active beat changes without a loop.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const jump = (id: string) => {
    document.getElementById(`beat-${id}`)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  };

  const current = active === null ? null : beats[active];

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-square w-full max-w-[540px]"
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        {beats.map((beat, i) => {
          const p = points[i];
          const endpoint = i === 0 || i === beats.length - 1;
          return (
            <button
              key={beat.id}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              type="button"
              onClick={() => jump(beat.id)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive((a) => (a === i ? null : a))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((a) => (a === i ? null : a))}
              aria-label={`${beat.year} — ${beat.title}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                className={`block h-[7px] w-[7px] rounded-full transition-[background-color,transform] duration-300 ${
                  active === i
                    ? "scale-150 bg-accent"
                    : "bg-muted/70 group-hover:bg-accent"
                }`}
              />
              <span
                className={`pointer-events-none absolute left-1/2 top-1/2 select-none whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  active === i ? "text-accent" : "text-muted"
                } ${endpoint ? "" : "hidden sm:block"}`}
                style={{
                  transform: `translate(calc(-50% + ${(p.ux * 22).toFixed(
                    1
                  )}px), calc(-50% + ${(p.uy * 16).toFixed(1)}px))`,
                }}
              >
                {beat.year}
              </span>
            </button>
          );
        })}
      </div>
      <p
        aria-live="polite"
        className="mx-auto mt-2 min-h-[1.6em] max-w-[540px] text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted"
      >
        {current ? (
          <>
            <span className="text-accent">{current.year}</span> —{" "}
            {current.title}
          </>
        ) : (
          <>A life in spirals — touch a year, click to jump.</>
        )}
      </p>
    </div>
  );
}
