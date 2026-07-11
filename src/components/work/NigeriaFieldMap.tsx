import DecisionArtifact from "./DecisionArtifact";

const fieldStops = [
  [35, 18], [46, 17], [57, 18], [68, 20], [29, 27], [40, 27], [51, 28],
  [62, 29], [74, 29], [23, 37], [35, 37], [47, 38], [59, 39], [72, 39],
  [81, 41], [20, 48], [32, 48], [44, 49], [56, 50], [69, 50], [80, 52],
  [25, 59], [38, 59], [51, 61], [64, 61], [76, 63], [35, 70], [49, 72],
  [63, 73],
] as const;

export default function NigeriaFieldMap() {
  return (
    <DecisionArtifact
      label="Field research"
      title="The roadmap covered more ground because the research did first."
      caption="A schematic field map: 29 of Nigeria’s 36 states visited. Exact routes and chronology can be added when the original itinerary is reconstructed."
    >
      <div className="grid items-center gap-8 sm:grid-cols-[1fr_180px]">
        <svg
          viewBox="0 0 100 92"
          role="img"
          aria-label="Schematic outline of Nigeria marked with 29 field-research stops"
          className="mx-auto w-full max-w-[420px] overflow-visible text-rule"
        >
          <path
            d="M19 12 32 8l12 4 14-5 12 6 13 2 5 12-5 10 6 11-4 12-10 7-4 12-13 2-9-6-12 5-9-7-9-2-3-11-7-8 4-11-1-12 9-8 1-13Z"
            fill="color-mix(in srgb, var(--accent) 5%, transparent)"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
          <path
            d="M23 37h58M20 48h65M25 59h51M35 70h29M35 18l3 52M50 15l-1 60M64 17v57M75 28l-2 37"
            fill="none"
            stroke="currentColor"
            strokeDasharray="1.5 2.5"
            strokeWidth="0.35"
            opacity="0.7"
          />
          {fieldStops.map(([cx, cy], i) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={i === fieldStops.length - 1 ? 1.65 : 1.25}
              fill="var(--accent)"
              className="origin-center transition-[r,opacity] duration-300 group-hover:opacity-90"
              opacity={0.68 + (i % 4) * 0.08}
            />
          ))}
          <path
            d="M35 18 57 18 74 29 81 41 69 50 76 63 63 73 49 72 35 70 25 59 20 48 23 37 29 27Z"
            fill="none"
            stroke="var(--accent)"
            strokeDasharray="2 3"
            strokeWidth="0.55"
            opacity="0.45"
          />
        </svg>

        <dl className="border-y border-rule py-4">
          <div className="flex items-end justify-between gap-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Visited
            </dt>
            <dd className="wonk font-serif text-5xl italic leading-none text-accent">
              29
            </dd>
          </div>
          <div className="mt-4 flex items-end justify-between gap-4 border-t border-rule pt-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              States
            </dt>
            <dd className="font-serif text-2xl leading-none text-muted">36</dd>
          </div>
          <p className="mt-5 text-sm italic leading-relaxed text-muted">
            Farms, technicians, local governments, universities, conferences.
            The field kept correcting the roadmap.
          </p>
        </dl>
      </div>
    </DecisionArtifact>
  );
}
