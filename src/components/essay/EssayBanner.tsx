"use client";

import ProximityType from "@/components/motion/ProximityType";
import { spiralPath } from "@/lib/spiralPath";

type Line = { text: string; accent?: boolean };
type Motif =
  | "spiral"
  | "seal"
  | "shahada"
  | "book"
  | "timeline"
  | "venn"
  | "cross";

type Palette = {
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  rule: string;
  wm: string;
};

const LIGHT: Palette = {
  bg: "#efeae0",
  fg: "#1f1b16",
  muted: "#6f675c",
  accent: "#9a3b1e",
  rule: "rgba(31,27,22,0.16)",
  wm: "rgba(31,27,22,0.05)",
};

const DARK: Palette = {
  bg: "#1c1813",
  fg: "#ece6da",
  muted: "#9a9183",
  accent: "#cf7d56",
  rule: "rgba(236,230,218,0.16)",
  wm: "rgba(236,230,218,0.05)",
};

function Motif({ kind, c }: { kind: Motif; c: Palette }) {
  switch (kind) {
    case "spiral":
      return (
        <svg width="118" height="118" viewBox="0 0 100 100" fill="none">
          <path
            d={spiralPath()}
            stroke={c.accent}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.55}
          />
        </svg>
      );
    case "seal":
      return (
        <svg width="128" height="128" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" stroke={c.accent} strokeWidth="1.1" />
          <circle cx="50" cy="50" r="31" stroke={c.muted} strokeWidth="0.7" />
          <text
            x="50"
            y="47"
            textAnchor="middle"
            fontFamily="Fraunces, serif"
            fontStyle="italic"
            fontSize="12"
            fill={c.fg}
          >
            honoris
          </text>
          <text
            x="50"
            y="61"
            textAnchor="middle"
            fontFamily="Fraunces, serif"
            fontStyle="italic"
            fontSize="12"
            fill={c.fg}
          >
            causa
          </text>
        </svg>
      );
    case "shahada":
      return (
        <div className="w-[180px] space-y-2">
          <div
            className="flex items-center gap-2 rounded-sm border px-3 py-2"
            style={{ borderColor: c.rule }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6.5 5 9.5 10 3"
                stroke={c.muted}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-serif text-xs" style={{ color: c.fg }}>
              No god but God
            </span>
          </div>
          <div
            className="flex items-center gap-2 rounded-sm border px-3 py-2"
            style={{ borderColor: c.accent }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 3 9 9M9 3 3 9"
                stroke={c.accent}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-serif text-xs" style={{ color: c.fg }}>
              &hellip; and a stranger&rsquo;s name
            </span>
          </div>
        </div>
      );
    case "book":
      return (
        <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
          <path
            d="M75 26 C58 18 36 18 20 24 L20 92 C36 86 58 86 75 94 C92 86 114 86 130 92 L130 24 C114 18 92 18 75 26 Z"
            stroke={c.muted}
            strokeWidth="1.1"
            strokeDasharray="3 4"
          />
          <path d="M75 26 L75 94" stroke={c.muted} strokeWidth="1.1" strokeDasharray="3 4" />
          <text
            x="75"
            y="66"
            textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace"
            fontSize="9"
            letterSpacing="1.5"
            fill={c.accent}
          >
            INJĪL
          </text>
          <text
            x="75"
            y="78"
            textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace"
            fontSize="7"
            letterSpacing="1"
            fill={c.muted}
          >
            not found
          </text>
        </svg>
      );
    case "timeline":
      return (
        <svg width="190" height="70" viewBox="0 0 190 70" fill="none">
          <line x1="6" y1="34" x2="184" y2="34" stroke={c.muted} strokeWidth="0.8" />
          {[
            { x: 20, a: false },
            { x: 70, a: false },
            { x: 120, a: true },
            { x: 172, a: false },
          ].map((t, i) => (
            <line
              key={i}
              x1={t.x}
              y1={t.a ? 24 : 28}
              x2={t.x}
              y2={40}
              stroke={t.a ? c.accent : c.muted}
              strokeWidth={t.a ? 1.6 : 0.9}
            />
          ))}
          <text x="120" y="18" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill={c.accent}>
            570
          </text>
          <text x="20" y="56" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="7" fill={c.muted}>
            c.125
          </text>
          <text x="172" y="56" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="7" fill={c.muted}>
            c.1100
          </text>
        </svg>
      );
    case "venn":
      return (
        <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
          <circle cx="62" cy="60" r="40" stroke={c.muted} strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="98" cy="60" r="40" stroke={c.accent} strokeWidth="1.2" />
          <text x="40" y="58" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="7.5" letterSpacing="1" fill={c.muted}>
            NECESSARY
          </text>
          <text x="124" y="58" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="7.5" letterSpacing="1" fill={c.accent}>
            ATTESTED
          </text>
        </svg>
      );
    case "cross":
      return (
        <svg width="100" height="130" viewBox="0 0 100 130" fill="none">
          <line x1="50" y1="14" x2="50" y2="118" stroke={c.accent} strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="50" x2="80" y2="50" stroke={c.accent} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

type Props = {
  label: string;
  index?: string;
  lines: Line[];
  deck?: string;
  variant?: "light" | "dark";
  motif?: Motif;
  caption?: string;
  /** Big faint numeral; defaults to the part of `index` before the slash. */
  watermark?: string;
};

export default function EssayBanner({
  label,
  index,
  lines,
  deck,
  variant = "light",
  motif,
  caption,
  watermark,
}: Props) {
  const c = variant === "dark" ? DARK : LIGHT;
  const wm = watermark ?? (index ? index.split("/")[0].trim() : "");

  return (
    <figure className="my-12">
      <div
        className="relative overflow-hidden rounded-sm border px-7 py-8 sm:px-10 sm:py-10"
        style={
          {
            background: c.bg,
            borderColor: c.rule,
            color: c.fg,
            "--bnr-accent": c.accent,
          } as React.CSSProperties
        }
      >
        {wm && (
          <span
            aria-hidden
            className="pointer-events-none absolute -top-2 right-5 select-none font-serif font-semibold leading-none"
            style={{ fontSize: "clamp(6rem,20vw,11rem)", color: c.wm }}
          >
            {wm}
          </span>
        )}

        <div className="relative flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.22em] sm:text-xs">
          <span style={{ color: c.accent }}>{label}</span>
          {index && <span style={{ color: c.muted }}>{index}</span>}
        </div>

        <div className="relative mt-7 flex items-end justify-between gap-6 sm:mt-9">
          <ProximityType
            as="h2"
            lines={lines.map((l) => ({
              text: l.text,
              className: l.accent ? "italic text-[color:var(--bnr-accent)]" : "",
            }))}
            className="max-w-[14ch] font-serif text-[1.75rem] font-medium leading-[1.05] tracking-tight sm:text-[2.3rem]"
          />
          {motif && (
            <div className="hidden shrink-0 self-center sm:block">
              <Motif kind={motif} c={c} />
            </div>
          )}
        </div>

        {deck && (
          <p
            className="relative mt-7 max-w-[42ch] font-serif text-sm italic leading-relaxed sm:mt-9 sm:text-base"
            style={{ color: c.muted }}
          >
            {deck}
          </p>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 px-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
