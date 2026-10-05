import DecisionArtifact from "./DecisionArtifact";

const v1Workflows = [
  "Card management",
  "Account transition",
  "Enhanced customer search",
  "Bulk dispute intake",
  "Payments",
  "Transactions management",
  "A proper customer overview",
];

const releases = [
  { marker: "01", title: "Resolve v1", detail: "Core call drivers" },
  { marker: "02", title: "Improvement", detail: "Debit + prepaid" },
  {
    marker: "03",
    title: "Credit",
    detail: "Collections · delinquency · sub-status · statement · rewards",
  },
  {
    marker: "04",
    title: "Connected ops",
    detail: "Call dispositions + AWS Amazon Connect",
  },
  {
    marker: "05",
    title: "Credit extension",
    detail: "FCRA disputes + credit bureau reporting",
  },
];

export default function ResolveReleaseArtifact() {
  return (
    <DecisionArtifact
      label="Scope, then sequence"
      title="The first release covered the workflows agents used most."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span>V1 · five months</span>
            <span className="text-accent">Core workflows</span>
          </div>
          <ol className="mt-3 grid grid-cols-2 border-l border-t border-rule">
            {v1Workflows.map((workflow, i) => (
              <li
                key={workflow}
                className={`min-h-20 border-b border-r border-rule p-3 transition-colors duration-300 group-hover:border-accent/35 ${
                  i === v1Workflows.length - 1 ? "col-span-2" : ""
                }`}
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-2 block text-sm leading-snug">
                  {workflow}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Release by release
          </p>
          <ol className="relative mt-5 space-y-5 before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-px before:bg-rule">
            {releases.map((release, i) => (
              <li key={release.marker} className="relative grid grid-cols-[28px_1fr] gap-4">
                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[11px] transition-colors duration-300 ${
                    i === 0
                      ? "border-accent bg-accent text-background"
                      : "border-rule bg-background text-muted group-hover:border-accent/60"
                  }`}
                >
                  {release.marker}
                </span>
                <div className="pt-0.5">
                  <p className="font-serif text-base leading-none">
                    {release.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                    {release.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DecisionArtifact>
  );
}
