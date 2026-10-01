"use client";

import { useRef, useState } from "react";
import { anatomyEvent } from "@/lib/anatomyTrack";

/** Illustrative economics of one card purchase. The rates are teaching
    numbers, not anyone's real schedule — the mechanic is the lesson. */
const RATES = {
  interchange: { pct: 0.016, fixed: 0.1, label: "Interchange · to the issuer" },
  scheme: { pct: 0.0013, fixed: 0.02, label: "Network fee · to the scheme" },
  acquirer: { pct: 0.004, fixed: 0.05, label: "Acquirer margin" },
};

function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function InterchangeSlider() {
  const [amount, setAmount] = useState(100);
  const tracked = useRef(false);

  const parts = Object.values(RATES).map((r) => ({
    label: r.label,
    value: amount * r.pct + r.fixed,
  }));
  const feeTotal = parts.reduce((s, p) => s + p.value, 0);
  const merchant = amount - feeTotal;

  function onSlide(v: number) {
    setAmount(v);
    if (!tracked.current) {
      tracked.current = true;
      anatomyEvent("anatomy_slider_used");
    }
  }

  return (
    <figure className="mt-9 border-y border-rule py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <label
          htmlFor="anatomy-amount"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
        >
          You pay
        </label>
        <span className="font-serif text-3xl tracking-tight">
          {money(amount)}
        </span>
      </div>
      <input
        id="anatomy-amount"
        type="range"
        min={10}
        max={500}
        step={5}
        value={amount}
        onChange={(e) => onSlide(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--accent)]"
      />

      <dl className="mt-7 space-y-4">
        {parts.map((p) => (
          <div key={p.label}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted">{p.label}</dt>
              <dd className="font-mono text-sm">{money(p.value)}</dd>
            </div>
            <div className="mt-1.5 h-[3px] bg-rule">
              <div
                className="h-[3px] bg-accent transition-[width] duration-300"
                style={{ width: `${(p.value / feeTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-4">
          <dt className="text-sm">The merchant keeps</dt>
          <dd className="font-serif text-xl tracking-tight text-accent">
            {money(merchant)}
          </dd>
        </div>
      </dl>

      <figcaption className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">
        Illustrative rates, for the mechanic — real schedules vary by card,
        merchant, and country.
      </figcaption>
    </figure>
  );
}
