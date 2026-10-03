import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, DrawnRule, MaskedLines, ProximityType } from "@femora/design-system";
import ProgramSimulator from "@/components/anatomy/ProgramSimulator";

export const metadata: Metadata = {
  title: "Card Program Simulator",
  description:
    "Build a card program and watch its monthly economics move: interchange, float or interest, processor and network costs, break-even, and who is on the hook.",
  alternates: { canonical: "/follow-the-money/simulator" },
};

export default function SimulatorPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <Reveal immediate>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span className="text-accent">Follow the Money</span> · act six, in its own room
        </p>
      </Reveal>
      <ProximityType
        lines={[{ text: "Build", className: "wonk" }, { text: "a card program" }]}
        className="mt-6 font-serif text-[clamp(2.75rem,9vw,6.5rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={["Five acts said how the money moves.", "The sixth is what it costs to run the thing."]}
        delay={0.18}
        className="mt-6 max-w-[680px] font-serif text-xl italic leading-snug text-muted sm:text-2xl"
      />
      <Reveal immediate delay={0.3}>
        <p className="mt-8 max-w-[680px] text-lg leading-relaxed">
          Pick the kind of card, start from a story or set your own numbers,
          and watch a month of a card program add up: what the taps earn,
          what the cast you recruited in act five charges, where it breaks
          even, and the question this whole page carries, now as a
          consequence of your numbers. Nothing here is anyone&apos;s real rate
          card; every figure is illustrative and every one of them is yours
          to change.
        </p>
      </Reveal>

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.4} />

      <ProgramSimulator />

      <DrawnRule className="my-14 sm:my-20" />

      <Reveal>
        <p>
          <Link
            href="/follow-the-money#build"
            className="link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent"
          >
            ← Back to the acts
          </Link>
        </p>
      </Reveal>
    </main>
  );
}
