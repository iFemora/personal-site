import DecisionArtifact from "./DecisionArtifact";

const v1Workflows = [
  "Unrecognized transactions",
  "Pending transactions",
  "Card status",
  "Activation",
  "Payments",
  "Account closure",
  "Dispute intake",
  "Customer search",
];

const releases = [
  { marker: "01", title: "Resolve v1", detail: "Eight call drivers" },
  { marker: "02", title: "Migration", detail: "Debit + prepaid" },
  { marker: "03", title: "Credit", detail: "Collections + delinquency" },
  { marker: "04", title: "Connected ops", detail: "Calls + dispositions" },
  { marker: "05", title: "Platform", detail: "Fraud + sub-status" },
];

export default function ResolveReleaseArtifact() {
  return (
    <DecisionArtifact
      label="Scope, then sequence"
      title="The first release was a boundary, not a miniature of the final platform."
      caption="An editorial reconstruction from the case-study method; no confidential interface or company artifact is reproduced."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            <span>V1 · five months</span>
            <span className="text-accent">8 workflows</span>
          </div>
          <ol className="mt-3 grid grid-cols-2 border-l border-t border-rule">
            {v1Workflows.map((workflow, i) => (
              <li
                key={workflow}
                className="min-h-20 border-b border-r border-rule p-3 transition-colors duration-300 group-hover:border-accent/35"
              >
                <span className="font-mono text-[9px] tracking-[0.16em] text-accent">
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
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Release by release
          </p>
          <ol className="relative mt-5 space-y-5 before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-px before:bg-rule">
            {releases.map((release, i) => (
              <li key={release.marker} className="relative grid grid-cols-[28px_1fr] gap-4">
                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[8px] transition-colors duration-300 ${
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
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
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
