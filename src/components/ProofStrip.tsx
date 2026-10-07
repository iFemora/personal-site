import { Reveal } from "@femora/design-system";
import { pick } from "@/lib/proof";

/** Four numbers under the home hero, the same ones the CV opens with.
    Hairlines and type only; the figures do the work. */
export default function ProofStrip() {
  const items = pick(["months", "volume", "clients", "pms"]);
  return (
    <section aria-label="In sixty seconds" className="mt-14 sm:mt-20">
      <Reveal immediate delay={0.5}>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span className="text-accent">In sixty seconds</span>
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-rule pt-6 sm:grid-cols-4">
          {items.map((n) => (
            <div key={n.value}>
              <dt className="font-serif text-3xl leading-none tracking-tight sm:text-4xl">
                {n.value}
              </dt>
              <dd className="mt-2 max-w-[240px] text-sm leading-snug text-muted">
                {n.label}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
