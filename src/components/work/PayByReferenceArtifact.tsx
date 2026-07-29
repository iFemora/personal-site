import DecisionArtifact from "./DecisionArtifact";

const before = [
  "Book online",
  "Pay online, same session",
  "Abandon if the card fails",
];

const after = [
  "Book online",
  "Walk to any Paystack terminal",
  "Read out the booking reference",
  "Terminal pulls the booking",
  "Pay and go",
];

const carried = [
  {
    vertical: "Airlines",
    key: "Booking reference",
    resolved: "Route, passenger, fare due",
  },
  {
    vertical: "Insurance",
    key: "Policy number",
    resolved: "Insurer, cover, premium due",
  },
];

export default function PayByReferenceArtifact() {
  return (
    <DecisionArtifact
      label="One pattern, two industries"
      title="The product was never ticketing. It was paying against a reference."
      caption="Once a terminal could resolve a reference into an amount owed, the same rail carried policies as easily as flights."
    >
      <div className="grid gap-9 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Before
          </p>
          <ol className="mt-4 space-y-2.5">
            {before.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-snug">
                <span className="font-mono text-[10px] leading-5 text-rule">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-muted">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            After
          </p>
          <ol className="mt-4 space-y-2.5">
            {after.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-snug">
                <span className="font-mono text-[10px] leading-5 text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-10 border-t border-rule pt-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          What the terminal resolves
        </p>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2 sm:gap-8">
          {carried.map((row) => (
            <div key={row.vertical}>
              <dt className="font-serif text-lg leading-snug tracking-tight">
                {row.vertical}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                <span className="text-foreground">{row.key}</span> resolves to{" "}
                {row.resolved}.
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </DecisionArtifact>
  );
}
