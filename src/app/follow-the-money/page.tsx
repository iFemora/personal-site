import type { Metadata } from "next";
import Link from "next/link";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";
import ChapterMark from "@/components/anatomy/ChapterMark";
import PaymentStage from "@/components/anatomy/PaymentStage";
import InterchangeSlider from "@/components/anatomy/InterchangeSlider";
import SettlementTimeline from "@/components/anatomy/SettlementTimeline";
import DisputeCase from "@/components/anatomy/DisputeCase";

export const metadata: Metadata = {
  title: "Follow the Money",
  description:
    "Tap, swipe, or insert a card and follow it: the two seconds, the night the money actually moves, and the fight when it goes wrong.",
};

export default function FollowTheMoneyPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <Reveal immediate>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span className="text-accent">A working model</span> · two seconds,
          at real speed
        </p>
      </Reveal>
      <ProximityType
        lines={[
          { text: "Follow", className: "wonk" },
          { text: "the money" },
        ]}
        className="mt-6 font-serif text-[clamp(2.75rem,9vw,6.5rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={[
          "You tap, you swipe, or you insert the card.",
          "This is everything that happens next, live.",
        ]}
        delay={0.18}
        className="mt-6 max-w-[680px] font-serif text-xl italic leading-snug text-muted sm:text-2xl"
      />

      <div className="max-w-[680px]">
        <ChapterMark chapter="stage" />
        <Reveal immediate delay={0.4}>
          <PaymentStage />
        </Reveal>

        <DrawnRule className="my-14 sm:my-20" />

        <section id="economics">
          <ChapterMark chapter="economics" />
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              <span className="text-accent">02</span> · The economics
            </p>
            <h2 className="mt-4 font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
              The tap is free. The system is not.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-lg leading-relaxed">
              The merchant receives slightly less than you paid, and the
              difference is divided among everyone who carried the question:
              the issuer&apos;s share is called interchange, the network takes
              its fee, the acquirer keeps a margin. Drag the amount and watch
              the split — this small arithmetic is the business model of every
              card on earth.
            </p>
          </Reveal>
          <InterchangeSlider />
        </section>

        <DrawnRule className="my-14 sm:my-20" />

        <section id="settlement">
          <ChapterMark chapter="settlement" />
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              <span className="text-accent">03</span> · That night, and the
              next day
            </p>
            <h2 className="mt-4 font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
              No money moved when you paid.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-lg leading-relaxed">
              Here is the part almost nobody knows: at the moment of
              approval, not one naira or cent has moved. The approval was a
              promise, the issuer saying I am good for this, hold my word.
              The money keeps that promise overnight — press play and watch
              eighteen hours in ten seconds.
            </p>
          </Reveal>
          <SettlementTimeline />
        </section>

        <DrawnRule className="my-14 sm:my-20" />

        <section id="dispute">
          <ChapterMark chapter="dispute" />
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              <span className="text-accent">04</span> · When it goes wrong
            </p>
            <h2 className="mt-4 font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
              The charge you didn&apos;t make.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-lg leading-relaxed">
              Disputes are the part of payments people feel the most and
              understand the least. So this act is a case, not a diagram:
              a $120 charge you never made, and the argument that follows
              it back down the wire. You will make the calls.
            </p>
          </Reveal>
          <DisputeCase />
        </section>

        <DrawnRule className="my-14 sm:my-20" />

        <section>
          <ChapterMark chapter="outro" />
          <Reveal>
            <p className="text-lg leading-relaxed">
              I have spent ten years building the systems in this story, on
              the issuing side and the acquiring side, in Lagos and Toronto.
              The two seconds are my day job.
            </p>
            <p className="mt-5 text-lg leading-relaxed">
              If you want the longer version, the{" "}
              <Link href="/work" className="link-swipe text-accent">
                work
              </Link>{" "}
              is here.
            </p>
            <p className="mt-8 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-muted">
              Further reading: The Anatomy of the Swipe, Ahmed Siddiqui —
              the book that maps this territory in full.
            </p>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
