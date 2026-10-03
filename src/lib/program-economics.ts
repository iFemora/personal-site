/* Card Program Simulator — the model. Pure functions, no React: every
   rule of the system lives here, so the arithmetic can be audited
   without reading a screen and reused on any surface. Rates are
   illustrative defaults, editable by the reader; nothing here is any
   issuer's real schedule. Spec: docs/program-simulator-spec.md. */

export type ProgramType = "prepaid" | "debit" | "credit";

export type Inputs = {
  programType: ProgramType;
  activeCards: number;
  avgSpendPerCard: number;
  /** Percent of volume, e.g. 1.1 means 1.10%. */
  interchangeRate: number;
  /** Percent of volume. */
  schemeRate: number;
  /** Dollars per active card per month. */
  processorPerAccount: number;
  /** Basis points of volume. */
  fraudBps: number;
  /** Dollars per active card per month. */
  cardholderFee: number;
  /** Dollars per month. */
  fixedCosts: number;
  /** Prepaid and debit: days of spend sitting prefunded. */
  floatDays: number;
  /** Percent per year. */
  floatYieldAnnual: number;
  /** Credit: percent per year. */
  aprAnnual: number;
  /** Credit: fraction of volume that revolves, 0 to 1. */
  revolveShare: number;
  /** Credit: percent per year. */
  costOfFundsAnnual: number;
  /** Credit: percent per year of receivables. */
  creditLossRate: number;
};

export type InputKey = Exclude<keyof Inputs, "programType">;

export type ProgramState = "profitable" | "underwater" | "unlaunched";

export type Line = { key: string; label: string; total: number; perCard: number | null };

export type Outputs = {
  state: ProgramState;
  gpv: number;
  revenue: Line[];
  costs: Line[];
  totalRevenue: number;
  totalCost: number;
  contribution: number;
  contributionPerCard: number | null;
  /** Null when contribution per card is not positive. */
  breakEvenCards: number | null;
  /** The single largest cost line, for the "never" message and the
      underwater lever. */
  largestCost: Line | null;
  /** Prepaid and debit only. */
  avgFloat: number | null;
  /** Credit only. */
  avgReceivables: number | null;
  warnings: string[];
};

export const INTERCHANGE_DEFAULT: Record<ProgramType, number> = {
  prepaid: 1.1,
  debit: 0.8,
  credit: 1.6,
};

export const DEFAULTS: Inputs = {
  programType: "prepaid",
  activeCards: 10_000,
  avgSpendPerCard: 400,
  interchangeRate: INTERCHANGE_DEFAULT.prepaid,
  schemeRate: 0.12,
  processorPerAccount: 1,
  fraudBps: 7,
  cardholderFee: 0,
  fixedCosts: 12_000,
  floatDays: 4,
  floatYieldAnnual: 4,
  aprAnnual: 24,
  revolveShare: 0.4,
  costOfFundsAnnual: 6,
  creditLossRate: 4,
};

export const PROGRAM_TYPES: { key: ProgramType; label: string; line: string }[] = [
  { key: "prepaid", label: "Prepaid", line: "They load it first." },
  { key: "debit", label: "Debit", line: "It pulls from their bank." },
  { key: "credit", label: "Credit", line: "You lend them the money." },
];

export type Preset = {
  key: string;
  label: string;
  line: string;
  inputs: Partial<Inputs> & { programType: ProgramType };
};

/* Proposed in the spec; Femi tunes them (review queue). Each one is a
   complete story, never an empty state. */
export const PRESETS: Preset[] = [
  {
    key: "gig",
    label: "Gig payouts",
    line: "Prepaid, 25,000 drivers, paid the moment the ride ends. The Act IV card.",
    inputs: { programType: "prepaid", activeCards: 25_000, avgSpendPerCard: 600, cardholderFee: 0 },
  },
  {
    key: "neobank",
    label: "Neobank debit",
    line: "Debit, 50,000 customers, a two-dollar monthly fee and regulated interchange.",
    inputs: { programType: "debit", activeCards: 50_000, avgSpendPerCard: 800, cardholderFee: 2 },
  },
  {
    key: "credit",
    label: "Credit builder",
    line: "Credit, 15,000 cards, the highest interchange and the longest tail.",
    inputs: { programType: "credit", activeCards: 15_000, avgSpendPerCard: 500, cardholderFee: 0 },
  },
];

export const INTERCHANGE_WARN_ABOVE = 2.5;

export const DISCLAIMER =
  "Illustrative rates — real schedules vary by card, merchant, and country.";

export const INTERCHANGE_WARNING =
  "Above typical market ranges — and above the EU (0.20% debit / 0.30% credit) and US regulated-debit caps. Illustrative only.";

/** Switching type resets the type's own default interchange and keeps
    everything else the reader set. */
export function withProgramType(inputs: Inputs, programType: ProgramType): Inputs {
  if (inputs.programType === programType) return inputs;
  return { ...inputs, programType, interchangeRate: INTERCHANGE_DEFAULT[programType] };
}

export function applyPreset(inputs: Inputs, preset: Preset): Inputs {
  const typed = withProgramType(inputs, preset.inputs.programType);
  return { ...typed, ...preset.inputs };
}

/** Negative numbers are not meaningful anywhere in this model; they
    clamp to zero and the UI says so. NaN clamps to zero too. */
export function clampInput(value: number): { value: number; clamped: boolean } {
  if (!Number.isFinite(value)) return { value: 0, clamped: true };
  if (value < 0) return { value: 0, clamped: true };
  return { value, clamped: false };
}

const safe = (n: number) => (Number.isFinite(n) ? n : 0);
/* Division guard: never NaN, never Infinity, never -0 on screen. */
const perCard = (total: number, cards: number): number | null =>
  cards > 0 ? safe(total / cards) + 0 : null;

export function derive(raw: Inputs): Outputs {
  const i: Inputs = { ...raw };
  for (const k of Object.keys(i) as (keyof Inputs)[]) {
    if (k === "programType") continue;
    i[k] = clampInput(i[k]).value;
  }
  const cards = i.activeCards;
  const gpv = cards * i.avgSpendPerCard;

  const interchangeRevenue = (gpv * i.interchangeRate) / 100;
  const schemeCost = (gpv * i.schemeRate) / 100;
  const processorCost = cards * i.processorPerAccount;
  const fraudCost = (gpv * i.fraudBps) / 10_000;
  const feeRevenue = cards * i.cardholderFee;

  const isCredit = i.programType === "credit";
  const avgFloat = isCredit ? null : (gpv * i.floatDays) / 30;
  const floatIncome = avgFloat === null ? 0 : (avgFloat * (i.floatYieldAnnual / 100)) / 12;
  const avgReceivables = isCredit ? gpv * i.revolveShare : null;
  const interestIncome =
    avgReceivables === null ? 0 : (avgReceivables * (i.aprAnnual / 100)) / 12;
  const fundingCost =
    avgReceivables === null ? 0 : (avgReceivables * (i.costOfFundsAnnual / 100)) / 12;
  const creditLosses =
    avgReceivables === null ? 0 : (avgReceivables * (i.creditLossRate / 100)) / 12;

  const line = (key: string, label: string, total: number): Line => ({
    key,
    label,
    total: safe(total),
    perCard: perCard(total, cards),
  });

  const revenue: Line[] = [
    line("interchange", "Interchange", interchangeRevenue),
    line("fees", "Cardholder fees", feeRevenue),
    isCredit
      ? line("interest", "Interest on revolved balances", interestIncome)
      : line("float", "Yield on the float", floatIncome),
  ];
  const costs: Line[] = [
    line("scheme", "Network fees", schemeCost),
    line("processor", "Processor, per account", processorCost),
    line("fraud", "Fraud losses", fraudCost),
    ...(isCredit
      ? [
          line("funding", "Cost of funds", fundingCost),
          line("losses", "Credit losses", creditLosses),
        ]
      : []),
    line("fixed", "Fixed costs", i.fixedCosts),
  ];

  const totalRevenue = revenue.reduce((s, l) => s + l.total, 0);
  const totalCost = costs.reduce((s, l) => s + l.total, 0);
  const contribution = safe(totalRevenue - totalCost) + 0;
  const contributionPerCard = perCard(contribution, cards);
  const breakEvenCards =
    contributionPerCard !== null && contributionPerCard > 0
      ? Math.ceil(i.fixedCosts / contributionPerCard)
      : null;
  const largestCost =
    costs.length > 0 ? costs.reduce((a, b) => (b.total > a.total ? b : a)) : null;

  const state: ProgramState =
    cards === 0 ? "unlaunched" : contribution > 0 ? "profitable" : "underwater";

  const warnings: string[] = [];
  if (i.interchangeRate > INTERCHANGE_WARN_ABOVE) warnings.push(INTERCHANGE_WARNING);

  return {
    state,
    gpv,
    revenue,
    costs,
    totalRevenue,
    totalCost,
    contribution,
    contributionPerCard,
    breakEvenCards,
    largestCost,
    avgFloat,
    avgReceivables,
    warnings,
  };
}

/* ── interpretation: every number gets a "so what" ─────────────────── */

export function leverFor(largest: Line | null): string {
  switch (largest?.key) {
    case "processor":
      return "the fastest fix is scale or a renegotiated per-account rate";
    case "fixed":
      return "fixed costs are a scale problem: more cards, or a smaller team";
    case "scheme":
      return "network fees scale with volume; the lever is a better interchange rate on the other side";
    case "fraud":
      return "fraud is a controls problem before it is a cost problem";
    case "funding":
      return "the cost of funds decides a credit program; cheaper capital or less revolving balance";
    case "losses":
      return "credit losses scale with receivables, not with cards; tighten underwriting";
    default:
      return "scale or price";
  }
}

export function hookFor(inputs: Inputs, out: Outputs): string {
  if (out.state === "unlaunched")
    return "Nobody yet. Every program starts at zero, and the sponsor bank is already asking what you will post against the first card.";
  const t = inputs.programType;
  if (t === "credit") {
    const lossHeavy = (out.costs.find((c) => c.key === "losses")?.total ?? 0) >
      (out.costs.find((c) => c.key === "funding")?.total ?? 0);
    if (out.state === "underwater")
      return lossHeavy
        ? "You lent it, and enough of them are not paying it back. Losses scale with receivables, not with cards; every new card adds exposure before it adds margin."
        : "You are, and so is whoever funds your receivables. The interest is not covering the cost of the money plus the losses, and that gap grows with every revolved dollar.";
    return "The lender, which is you or whoever stands behind your line. The margin is real while losses stay where you modelled them; the day they move, this page turns red before your statement does.";
  }
  if (t === "prepaid") {
    if (out.state === "underwater")
      return "You are. The float is other people's money, not margin; every card below break-even deepens the hole, and the sponsor bank's reserve call lands before the losses do.";
    return "Nobody, for now. The float is other people's money sitting at the sponsor bank; what you earn on it is yours, and what they spend is already theirs.";
  }
  if (out.state === "underwater")
    return "You are. Debit pays the least per tap, so the program lives or dies on fees and scale; at these numbers it is dying quietly.";
  return "Nobody, for now. Regulated interchange keeps the margin thin, and the fee line is doing the quiet work; watch what happens when you set it to zero.";
}

export function stateLine(inputs: Inputs, out: Outputs): string {
  if (out.state === "unlaunched")
    return "Add cardholders to see the economics. Every program starts at zero.";
  if (out.state === "underwater") {
    const l = out.largestCost;
    return l
      ? `Underwater. ${l.label} is the largest line${
          l.perCard !== null ? ` at ${formatMoney(l.perCard, 2)} per card` : ""
        }; ${leverFor(l)}.`
      : "Underwater.";
  }
  return "Profitable at these settings.";
}

export function floatLine(inputs: Inputs, out: Outputs): string | null {
  if (out.avgFloat === null) return null;
  const days = inputs.floatDays;
  return `${days} ${days === 1 ? "day" : "days"} of spend sitting prefunded: about ${formatMoney(out.avgFloat, 0)} of other people's money at the sponsor bank on an average day.`;
}

/* ── formatting: display rounds, the math does not ─────────────────── */

const moneyFmt = new Map<number, Intl.NumberFormat>();
export function formatMoney(n: number, digits = 0): string {
  const v = safe(n) + 0; // kills -0
  let f = moneyFmt.get(digits);
  if (!f) {
    f = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    moneyFmt.set(digits, f);
  }
  return f.format(Math.abs(v) < 0.5 / 10 ** digits ? 0 : v);
}

const intFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
export function formatInt(n: number): string {
  return intFmt.format(safe(n) + 0);
}
