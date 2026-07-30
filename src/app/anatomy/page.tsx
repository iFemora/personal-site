import type { Metadata } from "next";
import Link from "next/link";
import {
  Reveal,
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";
import ChapterMark from "@/components/anatomy/ChapterMark";
import TapCard from "@/components/anatomy/TapCard";
import NetworkHops from "@/components/anatomy/NetworkHops";
import DeclineSwitch from "@/components/anatomy/DeclineSwitch";
import InterchangeSlider from "@/components/anatomy/InterchangeSlider";
import TimingBar from "@/components/anatomy/TimingBar";

export const metadata: Metadata = {
  title: "The Anatomy of a Payment",
  description:
    "What actually happens in the two seconds after you tap your card, told by someone who builds these systems.",
};

type Chapter = {
  id: string;
  label: string;
  title: string;
  paras: string[];
  interactive?: React.ReactNode;
};

const chapters: Chapter[] = [
  {
    id: "terminal",
    label: "The terminal",
    title: "The beep is a question, not an answer.",
    paras: [
      "The terminal does not know you. It does not know your balance, your bank, or whether this card was cancelled an hour ago. What it knows is how to ask.",
      "In the moment of the tap, your card and the terminal have a short cryptographic conversation, and out of it the terminal builds a single message: who is asking, on which card, for how much, where, right now. An authorization request. Everything that follows is that message looking for someone with the authority to answer it.",
    ],
  },
  {
    id: "wire",
    label: "The wire",
    title: "Four stops each way.",
    paras: [
      "The message leaves the shop and goes to the merchant's bank, the acquirer, which stamps it and passes it to the network: Visa, Mastercard, Verve, the postal service of money. The network reads one thing, the card number's first digits, and knows exactly which bank issued your card. It routes the question there.",
      "Because the only party who can answer is the bank that gave you the card. Not the shop, not the terminal, not the network. Your issuer. The whole journey exists to put one question in front of one institution.",
    ],
    interactive: <NetworkHops />,
  },
  {
    id: "decision",
    label: "The decision",
    title: "Yes is one word. No has a hundred.",
    paras: [
      "The issuer has most of a second, and spends it asking its own questions. Is the money there. Is the card active. Does this purchase fit the life of this card, the city it wakes up in, the hours it keeps, the size of its habits.",
      "Approvals all look the same. Declines are a language: every no travels home with a code that says which kind of no it is. Flip the scenarios below and watch the same tap meet four different fates.",
    ],
    interactive: <DeclineSwitch />,
  },
  {
    id: "wayback",
    label: "The way back",
    title: "Where the two seconds go.",
    paras: [
      "The answer retraces the whole route: issuer to network to acquirer to terminal, and the terminal finally beeps. To you it was one moment. On the wire it was a round trip through four institutions, and most of it was spent inside the issuer, deciding.",
    ],
    interactive: <TimingBar />,
  },
  {
    id: "economics",
    label: "The economics",
    title: "The beep is free. The system is not.",
    paras: [
      "Somebody pays for the machine that answered in two seconds, and it is not you, at least not directly. The merchant receives slightly less than you paid, and the difference is divided among everyone who carried the question: the issuer's share is called interchange, the network takes its fee, the acquirer keeps a margin.",
      "Drag the amount and watch the split. The rates here are illustrative, the mechanic is real, and this small arithmetic is the business model of every card on earth.",
    ],
    interactive: <InterchangeSlider />,
  },
  {
    id: "settlement",
    label: "The epilogue",
    title: "No money moved today.",
    paras: [
      "Here is the part almost nobody knows: at the moment of the beep, not one naira or cent has moved. The approval was a promise, the issuer saying I am good for this, hold my word.",
      "The money moves later, quietly and in bulk. Tonight the merchant's terminal batches the day's promises and submits them. The networks total up what every bank owes every other bank, and settle the difference. A day or two after your two seconds, the money arrives where you thought you had already sent it.",
    ],
  },
];

export default function AnatomyPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <Reveal immediate>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span className="text-accent">A field guide</span> · two seconds,
          closely observed
        </p>
      </Reveal>
      <ProximityType
        lines={[
          { text: "The anatomy", className: "wonk" },
          { text: "of a payment" },
        ]}
        className="mt-6 font-serif text-[clamp(2.75rem,9vw,6.5rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={[
          "You tap. It beeps. Here is everything",
          "that happened in between.",
        ]}
        delay={0.18}
        className="mt-6 max-w-[680px] font-serif text-xl italic leading-snug text-muted sm:text-2xl"
      />

      <div className="max-w-[680px]">
        <Reveal immediate delay={0.4}>
          <TapCard />
        </Reveal>

        <DrawnRule className="my-14 sm:my-20" immediate delay={0.5} />

        <div className="space-y-16 sm:space-y-24">
          {chapters.map((chapter, i) => (
            <section key={chapter.id} id={chapter.id}>
              <ChapterMark chapter={chapter.id} />
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  <span className="text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  · {chapter.label}
                </p>
                <h2 className="mt-4 font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
                  {chapter.title}
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-5 space-y-5">
                  {chapter.paras.map((p, j) => (
                    <p key={j} className="text-lg leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
              {chapter.interactive}
            </section>
          ))}
        </div>

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
          </Reveal>
        </section>
      </div>
    </main>
  );
}
