"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { anatomyEvent } from "@/lib/anatomyTrack";
import {
  DEFAULTS,
  DISCLAIMER,
  PRESETS,
  PROGRAM_TYPES,
  applyPreset,
  clampInput,
  derive,
  floatLine,
  formatInt,
  formatMoney,
  hookFor,
  stateLine,
  withProgramType,
  type InputKey,
  type Inputs,
  type Preset,
  type ProgramType,
} from "@/lib/program-economics";

/* The Card Program Simulator's view. No formulas live here: the model is
   src/lib/program-economics.ts and this file is its mirror. Controls on
   the left, results on the right (sticky), stacked on phones. ALL COPY
   DRAFT pending Femi's voice pass. */

const CLAMP_NOTE = "Negative values aren't meaningful here — set to 0.";

type Field = {
  key: InputKey;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  digits: number;
};

const SLIDERS: Field[] = [
  { key: "activeCards", label: "Active cards", min: 0, max: 200_000, step: 500, digits: 0 },
  { key: "avgSpendPerCard", label: "Spend per card, a month", unit: "$", min: 0, max: 3000, step: 10, digits: 0 },
  { key: "interchangeRate", label: "Interchange", unit: "%", min: 0, max: 4, step: 0.05, digits: 2 },
  { key: "cardholderFee", label: "Cardholder fee, a month", unit: "$", min: 0, max: 10, step: 0.25, digits: 2 },
];

const SHARED_FINE: Field[] = [
  { key: "schemeRate", label: "Network fee", unit: "%", min: 0, max: 1, step: 0.01, digits: 2 },
  { key: "processorPerAccount", label: "Processor, per account", unit: "$", min: 0, max: 10, step: 0.05, digits: 2 },
  { key: "fraudBps", label: "Fraud", unit: "bps", min: 0, max: 100, step: 1, digits: 0 },
  { key: "fixedCosts", label: "Fixed costs, a month", unit: "$", min: 0, max: 500_000, step: 500, digits: 0 },
];
const TREASURY_FINE: Field[] = [
  { key: "floatDays", label: "Days of spend prefunded", min: 0, max: 30, step: 1, digits: 0 },
  { key: "floatYieldAnnual", label: "Yield on the float, a year", unit: "%", min: 0, max: 10, step: 0.25, digits: 2 },
];
const RECEIVABLES_FINE: Field[] = [
  { key: "aprAnnual", label: "APR", unit: "%", min: 0, max: 40, step: 0.5, digits: 1 },
  { key: "revolveShare", label: "Share of volume that revolves", min: 0, max: 1, step: 0.05, digits: 2 },
  { key: "costOfFundsAnnual", label: "Cost of funds, a year", unit: "%", min: 0, max: 15, step: 0.25, digits: 2 },
  { key: "creditLossRate", label: "Credit losses, a year", unit: "%", min: 0, max: 20, step: 0.25, digits: 2 },
];

const pill = (on: boolean) =>
  `relative rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
    on ? "border-accent text-accent" : "border-rule text-muted hover:text-foreground"
  }`;

function NumberField({
  field,
  value,
  clamped,
  onChange,
  slider,
}: {
  field: Field;
  value: number;
  clamped: boolean;
  onChange: (v: number) => void;
  slider: boolean;
}) {
  const id = useId();
  // While the reader types, the field shows their draft; the moment they
  // leave it shows the model's value again, so presets and type switches
  // never fight a keystroke and no effect has to sync anything.
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? String(value);

  const commit = (raw: string) => {
    const n = raw.trim() === "" ? 0 : Number(raw);
    onChange(Number.isFinite(n) ? n : 0);
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {field.label}
        </label>
        <span className="inline-flex items-baseline gap-1 font-mono text-sm">
          {field.unit && field.unit !== "bps" && <span className="text-muted">{field.unit}</span>}
          <input
            id={slider ? `${id}-n` : id}
            type="number"
            inputMode="decimal"
            min={0}
            step={field.step}
            value={text}
            onChange={(e) => {
              setDraft(e.target.value);
              commit(e.target.value);
            }}
            onBlur={() => setDraft(null)}
            aria-label={slider ? `${field.label}, exact value` : undefined}
            className="w-24 border-b border-rule bg-transparent py-0.5 text-right font-mono text-sm text-foreground outline-none transition-colors focus-visible:border-accent"
          />
          {field.unit === "bps" && <span className="text-muted">bps</span>}
        </span>
      </div>
      {slider && (
        <input
          id={id}
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={Math.min(field.max, value)}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={field.label}
          className="mt-2 w-full accent-[var(--accent)]"
        />
      )}
      {clamped && (
        <p role="status" className="mt-1.5 text-[13px] leading-relaxed text-accent">
          {CLAMP_NOTE}
        </p>
      )}
    </div>
  );
}

export default function ProgramSimulator() {
  const reduced = useReducedMotion();
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [clamped, setClamped] = useState<Partial<Record<InputKey, boolean>>>({});
  const [preset, setPreset] = useState<string | null>(null);
  const out = useMemo(() => derive(inputs), [inputs]);

  useEffect(() => {
    anatomyEvent("simulator_view");
  }, []);

  const set = (key: InputKey, raw: number) => {
    const { value, clamped: wasClamped } = clampInput(raw);
    setInputs((i) => ({ ...i, [key]: value }));
    setClamped((c) => ({ ...c, [key]: wasClamped }));
    setPreset(null);
  };

  const pickType = (t: ProgramType) => {
    if (t === inputs.programType) return;
    setInputs((i) => withProgramType(i, t));
    setPreset(null);
    anatomyEvent("simulator_program_type_changed", { type: t });
  };

  const pickPreset = (p: Preset) => {
    setInputs(applyPreset(p));
    setClamped({});
    setPreset(p.key);
    anatomyEvent("simulator_preset_applied", { preset: p.key });
  };

  const isCredit = inputs.programType === "credit";
  const fine = [...SHARED_FINE, ...(isCredit ? RECEIVABLES_FINE : TREASURY_FINE)];
  const unlaunched = out.state === "unlaunched";
  const dash = "—";
  const money = (n: number, d = 0) => (unlaunched ? dash : formatMoney(n, d));
  const per = (n: number | null) => (n === null ? dash : formatMoney(n, 2));
  const fade = (key: string, children: React.ReactNode, className = "") => (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      {/* ── Controls ────────────────────────────────────────────── */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          First, what kind of card
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROGRAM_TYPES.map((t) => {
            const on = t.key === inputs.programType;
            return (
              <button key={t.key} type="button" aria-pressed={on} onClick={() => pickType(t.key)} className={pill(on)}>
                {on && (
                  <motion.span
                    layoutId="sim-type-thumb"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-accent/10"
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 font-serif text-lg italic leading-snug text-muted">
          {PROGRAM_TYPES.find((t) => t.key === inputs.programType)?.line}
        </p>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Or start from a story
        </p>
        <ul className="mt-3 max-w-[560px] border-t border-rule">
          {PRESETS.map((p) => {
            const on = preset === p.key;
            return (
              <li key={p.key} className="border-b border-rule">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => pickPreset(p)}
                  className="group block w-full py-3.5 text-left"
                >
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 group-hover:text-accent ${
                      on ? "text-accent" : ""
                    }`}
                  >
                    {p.label}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-muted">{p.line}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Then tune the four that matter
        </p>
        <div className="mt-4 space-y-7">
          {SLIDERS.map((f) => (
            <NumberField
              key={f.key}
              field={f}
              value={inputs[f.key]}
              clamped={!!clamped[f.key]}
              onChange={(v) => set(f.key, v)}
              slider
            />
          ))}
        </div>

        <details className="group mt-10 border-t border-rule pt-5">
          <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">The fine print +</span>
            <span className="hidden group-open:inline">The fine print −</span>
          </summary>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {fine.map((f) => (
              <NumberField
                key={f.key}
                field={f}
                value={inputs[f.key]}
                clamped={!!clamped[f.key]}
                onChange={(v) => set(f.key, v)}
                slider={false}
              />
            ))}
          </div>
        </details>
      </div>

      {/* ── Results ─────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-[96px] lg:self-start">
        <div className="border-y border-rule py-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Contribution, a month
          </p>
          <p
            className={`mt-2 font-serif text-4xl tracking-tight sm:text-5xl ${
              out.state === "profitable" ? "text-accent" : "text-foreground"
            }`}
          >
            {money(out.contribution)}
          </p>
          {fade(
            `${out.state}-${out.largestCost?.key ?? ""}`,
            <p className="mt-3 max-w-[480px] text-[15px] leading-relaxed">{stateLine(inputs, out)}</p>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            <span>Line</span>
            <span className="flex gap-6">
              <span className="w-24 text-right">A month</span>
              <span className="w-20 text-right">Per card</span>
            </span>
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Revenue</p>
          <dl>
          {out.revenue.map((l) => (
            <div key={l.key} className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5">
              <dt className="text-sm">{l.label}</dt>
              <dd className="flex gap-6 font-mono text-sm">
                <span className="w-24 text-right">{money(l.total)}</span>
                <span className="w-20 text-right text-muted">{per(l.perCard)}</span>
              </dd>
            </div>
          ))}
          </dl>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Costs</p>
          <dl>
          {out.costs.map((l) => (
            <div key={l.key} className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5">
              <dt className="text-sm">{l.label}</dt>
              <dd className="flex gap-6 font-mono text-sm">
                <span className="w-24 text-right">{money(l.total)}</span>
                <span className="w-20 text-right text-muted">{per(l.perCard)}</span>
              </dd>
            </div>
          ))}
          </dl>
          <dl>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm">Contribution</dt>
              <dd className="flex gap-6 font-mono text-sm">
                <span className="w-24 text-right">{money(out.contribution)}</span>
                <span className="w-20 text-right text-muted">{per(out.contributionPerCard)}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 grid gap-6 border-t border-rule pt-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Break-even</p>
            <p className="mt-2 font-serif text-2xl tracking-tight">
              {unlaunched ? dash : out.breakEvenCards === null ? "Never at these settings" : `${formatInt(out.breakEvenCards)} cards`}
            </p>
            {!unlaunched && out.breakEvenCards === null && out.largestVariableCost && (
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Every card loses money on its own; {out.largestVariableCost.label.toLowerCase()} is the largest line
                {out.largestVariableCost.perCard !== null ? ` at ${formatMoney(out.largestVariableCost.perCard, 2)} per card` : ""}.
              </p>
            )}
            {!unlaunched && out.breakEvenCards !== null && out.state === "underwater" && (
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {formatInt(out.breakEvenCards - inputs.activeCards)} more than you have today.
              </p>
            )}
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Volume, a month</p>
            <p className="mt-2 font-serif text-2xl tracking-tight">{money(out.gpv)}</p>
            {!unlaunched && floatLine(inputs, out) && (
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{floatLine(inputs, out)}</p>
            )}
            {!unlaunched && out.avgReceivables !== null && (
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                About {formatMoney(out.avgReceivables)} revolving at any time: the money you have lent out.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 border border-rule p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Who is on the hook</p>
          {fade(
            `${inputs.programType}-${out.state}-${out.largestCost?.key ?? ""}`,
            <p className="mt-3 text-[15px] leading-relaxed">{hookFor(inputs, out)}</p>
          )}
        </div>

        {out.warnings.map((w) => (
          <p key={w} role="status" className="mt-4 text-[13px] leading-relaxed text-accent">
            {w}
          </p>
        ))}
        <p className="mt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
