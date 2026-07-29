import DecisionArtifact from "./DecisionArtifact";

const before = [
  { step: "Business names a feature", note: "Straight to engineering" },
  { step: "Engineering builds it", note: "No discovery, no spec" },
  { step: "Branch absorbs the gap", note: "Customers go in person" },
];

const after = [
  { step: "Discovery", note: "Framework, interviews, written problem" },
  { step: "PRD", note: "One template, every product" },
  { step: "Design", note: "Handoff, against a real design system" },
  { step: "Build", note: "Tracked in Linear, stories not requests" },
  { step: "UAT", note: "Convened, not assumed" },
];

const installed = [
  "Linear, for issues engineering could actually see",
  "PRD, roadmap, and design-handoff templates",
  "A design system, built from nothing with design",
  "Standups, a weekly engineering-design-product forum, a team-lead review",
  "A discovery framework, where discovery had never happened",
];

export default function OperatingModelArtifact() {
  return (
    <DecisionArtifact
      label="Installing a pipeline"
      title="The company did not need a process document. It needed a gate somebody enforced."
      caption="The group CEO backing the gate is what turned a set of rituals into how the company works."
    >
      <div className="grid gap-9 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            How it worked
          </p>
          <ol className="mt-4 space-y-4">
            {before.map((row, i) => (
              <li key={row.step} className="flex gap-3">
                <span className="font-mono text-[10px] leading-5 text-rule">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-sm leading-snug text-muted">
                    {row.step}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-rule">
                    {row.note}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            How it works now
          </p>
          <ol className="mt-4 space-y-4">
            {after.map((row, i) => (
              <li key={row.step} className="flex gap-3">
                <span className="font-mono text-[10px] leading-5 text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-sm leading-snug">{row.step}</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {row.note}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-10 border-t border-rule pt-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          What I had to build before any of it held
        </p>
        <ul className="mt-4 space-y-2">
          {installed.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-snug">
              <span aria-hidden className="text-accent">
                ·
              </span>
              <span className="text-muted">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </DecisionArtifact>
  );
}
