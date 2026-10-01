import DecisionArtifact from "./DecisionArtifact";

const personas = ["Initiator", "Approver", "Treasurer", "Administrator"];
const capabilities = [
  "Digital onboarding",
  "Bulk payments",
  "Payroll",
  "FX + trade",
  "Team controls",
  "TOTP security",
];

export default function BankingSystemMap() {
  return (
    <DecisionArtifact
      label="Product system"
      title="The platform served two markets and four user roles."
      caption="This simplified map shows the public roles and capabilities described in the case study. It does not reproduce FCMB’s internal architecture."
    >
      <div className="grid gap-7">
        <div className="grid grid-cols-2 gap-px bg-rule">
          <div className="bg-background p-4 transition-colors duration-300 group-hover:bg-accent/5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Market 01
            </p>
            <p className="mt-2 font-serif text-2xl italic">Nigeria</p>
          </div>
          <div className="bg-background p-4 text-right transition-colors duration-300 group-hover:bg-accent/5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Market 02
            </p>
            <p className="mt-2 font-serif text-2xl italic">United Kingdom</p>
          </div>
        </div>

        <div className="relative py-2">
          <div aria-hidden className="absolute left-1/2 top-0 h-full w-px bg-rule" />
          <div className="relative mx-auto max-w-[340px] bg-background px-4 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              Corporate banking platform
            </p>
            <p className="mt-2 font-serif text-xl">Shared platform</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              People doing different jobs
            </p>
            <ul className="mt-3 grid grid-cols-2 border-l border-t border-rule">
              {personas.map((persona) => (
                <li
                  key={persona}
                  className="border-b border-r border-rule p-3 text-sm transition-colors duration-300 group-hover:border-accent/35"
                >
                  {persona}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Core capabilities
            </p>
            <ul className="mt-3 grid grid-cols-2 border-l border-t border-rule">
              {capabilities.map((capability) => (
                <li
                  key={capability}
                  className="border-b border-r border-rule p-3 text-sm transition-colors duration-300 group-hover:border-accent/35"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 border-t border-rule pt-5 sm:grid-cols-3 sm:gap-4">
          <div>
            <p className="wonk font-serif text-3xl italic leading-none text-accent">
              200,000+
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              SME + enterprise clients
            </p>
          </div>
          <div className="sm:text-center">
            <p className="wonk font-serif text-3xl italic leading-none text-accent">
              ₦70B+
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Monthly volume at scale
            </p>
          </div>
          <div className="sm:text-right">
            <p className="wonk font-serif text-3xl italic leading-none text-accent">
              −40%
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Onboarding time-to-value
            </p>
          </div>
        </div>
      </div>
    </DecisionArtifact>
  );
}
