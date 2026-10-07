import type { Metadata } from "next";
import Link from "next/link";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";
import ChapterMark from "@/components/anatomy/ChapterMark";
import HireMe from "@/components/HireMe";
import PaymentStage from "@/components/anatomy/PaymentStage";
import InterchangeSlider from "@/components/anatomy/InterchangeSlider";
import SettlementTimeline from "@/components/anatomy/SettlementTimeline";
import DisputeCase from "@/components/anatomy/DisputeCase";
import CardBuild from "@/components/anatomy/CardBuild";
import { PRESETS, applyPreset, derive, formatMoney } from "@/lib/program-economics";

export const metadata: Metadata = {
  title: "Follow the Money",
  description:
    "Tap, swipe, or insert a card and follow it: the two seconds, the night the money actually moves, and the fight when it goes wrong.",
  alternates: { canonical: "/follow-the-money" },
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
        <Reveal immediate delay={0.3}>
          <p className="mt-8 text-lg leading-relaxed">
            Three people live inside every card payment: the one who taps, the
            shop that accepts, and the people who build the rails between
            them. This page works from any of those seats. Everything below is
            playable, so tap what invites tapping, and carry one question
            through all six acts: where is the money right now, and who is on
            the hook if this step fails?
          </p>
        </Reveal>

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
              So who pays for the two seconds? Not you, at least not
              directly. The merchant receives slightly less than you paid,
              and the difference is divided among everyone who carried the
              question: the issuer&apos;s share is called interchange, the
              network takes its fee, the acquirer keeps a margin. Drag the
              amount and watch the split — this small arithmetic is the
              business model of every card on earth.
            </p>
          </Reveal>
          <InterchangeSlider />
          <Reveal delay={0.08}>
            <dl className="mt-9 space-y-6">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  If you carry the card
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed">
                  Your rewards are not a gift. Points and cash-back are paid
                  out of interchange, which means the shop just funded your
                  miles. It is also why the corner store sets a card minimum:
                  on a small ticket, the fixed part of the fee eats the
                  margin.
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  If you run the shop
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed">
                  This split is what card acceptance actually costs you, and
                  most of it is set by the networks and not up for
                  discussion. The acquirer margin is the one line you can
                  shop around on. That is what you are really comparing when
                  you compare processors.
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  If you build the rails
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed">
                  Interchange is the gravity of the whole system. It funds
                  card programs, decides which products issuers push, and
                  explains why every fintech eventually wants to issue a
                  card. Follow it and most strategy in this industry starts
                  to make sense.
                </dd>
              </div>
            </dl>
          </Reveal>
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
              If the approval took two seconds, when does the shop actually
              get the money? Here is the part almost nobody knows: at the
              moment of approval, not one naira or cent has moved. The
              approval was a promise, the issuer saying I am good for this,
              hold my word. The money keeps that promise overnight — press
              play and watch eighteen hours in ten seconds.
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
              The argument after the money moved.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-lg leading-relaxed">
              Disputes are the part of payments people feel the most and
              understand the least, and they are not one thing. A stolen
              card, an order that never came, a subscription you cancelled
              twice, a charge that only looks doubled: same rail, four
              different arguments. So this act is a case file rather than a
              diagram. Pick one, and it plays out a filing at a time. You
              will make the calls.
            </p>
          </Reveal>
          <DisputeCase />
        </section>

        <DrawnRule className="my-14 sm:my-20" />

        <section id="build">
          <ChapterMark chapter="build" />
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              <span className="text-accent">05</span> · Before the tap
            </p>
            <h2 className="mt-4 font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
              Every card is a promise someone else keeps.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-lg leading-relaxed">
              Four acts started at the tap and moved outward. This one goes
              backward. Before any tap there had to be a card, and a card is
              a promise four parties make together behind one logo. A
              company that is not a bank can hand you one, and the question
              that carried you here turns with it: whose money is behind
              this card, and who promised the network it would be there?
              Sit in the program manager&apos;s seat and build one.
            </p>
          </Reveal>
          <CardBuild />
          <Reveal delay={0.08}>
            <dl className="mt-12 space-y-6">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  If you carry the card
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed">
                  The name on the front is not the bank. Turn the card over
                  and the small print names the bank that actually holds
                  your money, and that is the name worth looking up. A
                  decline at the till is usually a rule the program wrote,
                  not a judgement the shop made.
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  If you run the shop
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed">
                  A card from a company founded last year taps like one from
                  a bank founded last century, because to your terminal it
                  is one: the range belongs to a member bank, and the rules
                  arrived with it. You are paid the same way, on the same
                  night, whoever is on the front.
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  If you build the rails
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed">
                  Where the money sits is the whole design. Prefunded ties up
                  cash and sleeps well; just-in-time frees the cash and makes
                  your uptime the card&apos;s uptime; credit pays the most
                  and bills you a year later. Pick the funding first, and the
                  rest of the architecture follows from it.
                </dd>
              </div>
            </dl>
          </Reveal>
        </section>

        <DrawnRule className="my-14 sm:my-20" />

        <section id="program">
          <ChapterMark chapter="program" />
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              <span className="text-accent">06</span> · What it costs to run
            </p>
            <h2 className="mt-4 font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
              A card program is a business, not a feature.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-lg leading-relaxed">
              The card is built and the cast is paid. So does it pay? Act
              two showed where a hundred dollars goes at one tap; this act
              adds the taps up for a month, against what the network, the
              processor, the fraud and your own team cost, and asks the
              page&apos;s question one last time, now as a consequence of
              your numbers. Three stories to start from, then every number
              is yours to move.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <ul className="mt-9 max-w-[640px] border-t border-rule">
              {PRESETS.map((p) => {
                const out = derive(applyPreset(p));
                const largest = out.largestCost?.label.toLowerCase() ?? "";
                return (
                  <li key={p.key} className="border-b border-rule py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                        {p.label}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                        {formatMoney(out.contribution)} a month ·{" "}
                        {out.state === "profitable" ? "pays" : "underwater"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{p.line}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      Largest line: {largest}
                      {out.breakEvenCards !== null
                        ? ` · breaks even at ${out.breakEvenCards.toLocaleString("en-US")} cards`
                        : " · never breaks even at these settings"}
                      .
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 text-lg leading-relaxed">
              The sheet needs more room than this column has, so it sits in
              a room of its own:{" "}
              <Link href="/follow-the-money/simulator" className="link-swipe text-accent">
                build a card program
              </Link>
              .
            </p>
          </Reveal>
        </section>

        <DrawnRule className="my-14 sm:my-20" />

        <section>
          <ChapterMark chapter="outro" />
          <Reveal>
            <p className="text-lg leading-relaxed">
              I have spent ten years building the systems in this story, on
              the issuing side and the acquiring side, in Lagos, Toronto and
              Vancouver. The two seconds have been my working life.
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

      <DrawnRule className="my-14 sm:my-20" />

      <HireMe location="money_end" />
    </main>
  );
}
