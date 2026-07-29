import type { Metadata } from "next";
import { getWallEntries } from "@/lib/wallOfLove";
import WallOfLove from "@/components/WallOfLove";
import {
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";

export const metadata: Metadata = {
  title: "Wall of Love",
  description:
    "Kind words from friends, family, and colleagues, on the record.",
};

export default function WallOfLovePage() {
  const entries = getWallEntries();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Wall of Love", className: "wonk" }]}
        className="font-serif text-[clamp(2.75rem,9vw,6.5rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["Kind words from people who know me. Lightly solicited."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />
      <MaskedLines
        as="p"
        lines={[`${String(entries.length).padStart(2, "0")} voices, counting`]}
        delay={0.3}
        className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-muted"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      {entries.length === 0 ? (
        <p className="leading-relaxed text-muted">
          The wall is bare. First words coming soon.
        </p>
      ) : (
        <WallOfLove entries={entries} />
      )}

      <DrawnRule className="mt-4 sm:mt-8" />
      <p className="mt-6 font-serif text-sm italic text-muted">
        Their words, verbatim. I only fixed the typos.
      </p>
    </main>
  );
}
