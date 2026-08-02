"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { anatomyEvent } from "@/lib/anatomyTrack";

/* ── Act III: the dispute, played as a case file.
   A different grammar on purpose: the two seconds and the night are
   journeys you watch; a dispute is an argument you sit inside. So this
   unfolds at the reader's pace, one filing at a time, with the reader
   making the calls at the moments that decide everything, and a ledger
   that always shows whose money it is right now.

   Four cases, because "dispute" is not one thing. Each reason code has
   its own clock, its own evidence, and its own way of ending, so the
   cases are shaped differently on purpose: fraud and non-delivery run
   the full arc, the subscription turns on economics rather than proof,
   and the duplicate is short and can end before a dispute is even filed.
   ALL COPY DRAFT pending Femi's voice pass. Days are typical, not
   promises; networks write their own rulebooks. ─────────────────────── */

type StepActor = "you" | "issuer" | "network" | "merchant";

type Step = {
  id: string;
  actor: StepActor;
  actorName: string;
  day: number;
  stage: string;
  moneyAt: string;
  body: string;
  choice?: {
    prompt: string;
    options: { label: string; to: string }[];
  };
  next?: string;
  end?: "accept" | "cardholder" | "merchant" | "none";
};

type DisputeCaseFile = {
  id: string;
  label: string;
  blurb: string;
  amount: string;
  first: string;
  coda: string;
  steps: Record<string, Step>;
};

const FRAUD: DisputeCaseFile = {
  id: "fraud",
  label: "The charge you never made",
  blurb: "Someone else has your card numbers.",
  amount: "$120",
  first: "s1",
  coda: "Nobody refunds a dispute. The money is pried from whoever the rules say should hold it, and every party pays something for the argument itself. That is why good issuers fight fraud before it happens, and good merchants keep their dispute rate near zero. The argument costs more than the answer.",
  steps: {
    s1: {
      id: "s1",
      actor: "you",
      actorName: "You",
      day: 0,
      stage: "The discovery",
      moneyAt: "Gone from your account",
      body: "A $120 charge sits on your card, from a store you have never heard of, in a city you have never visited. You did not make it. You call your bank.",
      next: "s2",
    },
    s2: {
      id: "s2",
      actor: "issuer",
      actorName: "The issuer",
      day: 0,
      stage: "Containment",
      moneyAt: "Gone from your account",
      body: "First move: the card dies. Frozen, cancelled, a replacement ordered before the call ends, because whoever spent your $120 still holds the numbers. Then the dispute opens, filed under a reason code that names the kind of wrong. This one says fraud.",
      next: "s3",
    },
    s3: {
      id: "s3",
      actor: "issuer",
      actorName: "The issuer",
      day: 1,
      stage: "Provisional credit",
      moneyAt: "Back with you, on loan from the issuer",
      body: "The $120 reappears in your account. Read that carefully: it is not the merchant's money returned. It is the issuer's own money, fronted to you while the case runs. If the case is lost, it leaves again.",
      next: "s4",
    },
    s4: {
      id: "s4",
      actor: "network",
      actorName: "The network",
      day: 2,
      stage: "The chargeback travels",
      moneyAt: "Clawed from the merchant",
      body: "The dispute rides the same rail as the payment, backwards. The network carries it to the merchant's bank, which reaches into the merchant's account and pulls the $120 out, plus a chargeback fee for the trouble. The merchant discovers that money they counted last week is suddenly gone.",
      next: "c1",
    },
    c1: {
      id: "c1",
      actor: "merchant",
      actorName: "The merchant",
      day: 5,
      stage: "The merchant's move",
      moneyAt: "Clawed from the merchant",
      body: "The merchant reads the case. They have a window of weeks, not months, and two doors: accept the loss and move on, or fight back with evidence that the purchase was real. Fighting has a name, representment, because they are re-presenting the charge.",
      choice: {
        prompt: "What does the merchant do?",
        options: [
          { label: "They accept the loss", to: "endA" },
          { label: "They fight it", to: "s5" },
        ],
      },
    },
    endA: {
      id: "endA",
      actor: "issuer",
      actorName: "The issuer",
      day: 8,
      stage: "Case closed",
      moneyAt: "Yours, permanently",
      body: "No contest. Your provisional credit hardens into a permanent one, the merchant absorbs the $120 and the fee, and your replacement card is already in the post. Most fraud disputes end exactly here, quietly.",
      end: "accept",
    },
    s5: {
      id: "s5",
      actor: "merchant",
      actorName: "The merchant",
      day: 12,
      stage: "Representment",
      moneyAt: "Clawed from the merchant",
      body: "The evidence package arrives: a receipt, a delivery confirmation, device and network fingerprints from the checkout, a claim that the security code matched. The merchant's argument is simple. Someone made this purchase, and they believe it was you.",
      next: "c2",
    },
    c2: {
      id: "c2",
      actor: "issuer",
      actorName: "The issuer",
      day: 20,
      stage: "The ruling",
      moneyAt: "Clawed from the merchant",
      body: "Now the issuer sits where I used to work: the merchant's evidence on one screen, your history on the other, and a decision that cannot split the difference. Somebody has to say whose $120 this is. For this run, the chair is yours.",
      choice: {
        prompt: "You are the issuer. Rule.",
        options: [
          { label: "Rule for the cardholder", to: "endB" },
          { label: "Rule for the merchant", to: "endC" },
        ],
      },
    },
    endB: {
      id: "endB",
      actor: "issuer",
      actorName: "The issuer",
      day: 25,
      stage: "Case closed",
      moneyAt: "Yours, permanently",
      body: "The evidence never placed you behind the purchase, and the rules put the burden where the risk was taken. The merchant eats the $120 and the fees. If they still believe they are right, one road remains: arbitration, where the network itself judges and the loser pays fees that dwarf the charge. Almost nobody walks that road for $120.",
      end: "cardholder",
    },
    endC: {
      id: "endC",
      actor: "issuer",
      actorName: "The issuer",
      day: 25,
      stage: "Case closed",
      moneyAt: "Returned to the merchant",
      body: "The evidence held, and the ruling goes to the merchant. The provisional credit reverses, and the $120 leaves your account a second time, which is the moment most people discover a dispute was never a refund button. Escalation exists, up to arbitration where the network judges and the loser pays dearly for the privilege. For $120, almost nobody does.",
      end: "merchant",
    },
  },
};

const NOT_RECEIVED: DisputeCaseFile = {
  id: "not-received",
  label: "The order that never came",
  blurb: "They took the money. Nothing arrived.",
  amount: "$240",
  first: "n1",
  coda: "Non-delivery is the dispute people get wrong most often. It is not theft and it is not a refund button. It asks one narrow question, whether the merchant did what they promised, and it answers with tracking numbers rather than fairness. Ask the merchant first, keep the email, and watch a clock that starts on the day the chair was due, not the day you paid.",
  steps: {
    n1: {
      id: "n1",
      actor: "you",
      actorName: "You",
      day: 0,
      stage: "The order",
      moneyAt: "With the merchant",
      body: "You buy a chair. $240, delivery promised inside a week. Three weeks later there is no chair, no tracking that moves, and no reply to your emails. Nobody stole your card. Somebody simply failed to send you a chair, which the rules treat as a completely different kind of wrong.",
      choice: {
        prompt: "What do you do?",
        options: [
          { label: "Chase the merchant", to: "n2" },
          { label: "Call the bank now", to: "n1b" },
        ],
      },
    },
    n1b: {
      id: "n1b",
      actor: "issuer",
      actorName: "The issuer",
      day: 0,
      stage: "Sent back",
      moneyAt: "With the merchant",
      body: "The bank asks a question you did not expect: have you contacted the merchant? For goods that never arrived, most rulebooks want evidence you tried to resolve it first. A dispute here is a last resort, not a first call. You are sent away to write the email.",
      next: "n2",
    },
    n2: {
      id: "n2",
      actor: "you",
      actorName: "You",
      day: 15,
      stage: "The silence",
      moneyAt: "With the merchant",
      body: "Fifteen days of nothing. That silence is not only maddening, it is evidence, and it is the thing your case will be built on. Note which clock is running: the network counts from the delivery date you were promised, which is how a merchant who stalls politely can quietly run you out of time.",
      next: "n3",
    },
    n3: {
      id: "n3",
      actor: "issuer",
      actorName: "The issuer",
      day: 16,
      stage: "The filing",
      moneyAt: "Back with you, on loan from the issuer",
      body: "The dispute opens under a different reason code from fraud: goods or services not received. Your card is not cancelled, because nothing about it was compromised. The $240 returns to your account as provisional credit, the issuer's money, lent to you while the case runs.",
      next: "n4",
    },
    n4: {
      id: "n4",
      actor: "network",
      actorName: "The network",
      day: 18,
      stage: "The chargeback travels",
      moneyAt: "Clawed from the merchant",
      body: "Back down the wire it goes. The merchant's bank pulls $240 out of the merchant's account, adds a chargeback fee, and hands them a deadline. For a small shop this is the week they learn that a dispute costs more than the sale ever earned.",
      next: "nc1",
    },
    nc1: {
      id: "nc1",
      actor: "merchant",
      actorName: "The merchant",
      day: 24,
      stage: "The merchant's move",
      moneyAt: "Clawed from the merchant",
      body: "The merchant opens the case and finds a tracking number attached to your order. Two doors again: absorb it, or re-present the charge with delivery evidence behind it.",
      choice: {
        prompt: "What does the merchant do?",
        options: [
          { label: "They accept the loss", to: "nEndA" },
          { label: "They produce tracking", to: "n5" },
        ],
      },
    },
    nEndA: {
      id: "nEndA",
      actor: "issuer",
      actorName: "The issuer",
      day: 27,
      stage: "Case closed",
      moneyAt: "Yours, permanently",
      body: "No contest. The credit hardens, the merchant absorbs the $240 and the fee, and somewhere your chair is still sitting in a warehouse. Most non-delivery disputes end here, because a merchant who cannot show delivery has nothing to argue with.",
      end: "accept",
    },
    n5: {
      id: "n5",
      actor: "merchant",
      actorName: "The merchant",
      day: 30,
      stage: "Representment",
      moneyAt: "Clawed from the merchant",
      body: "The evidence lands: a carrier record showing the chair delivered on day nine, to your address, signed for. You never saw it. Under the rules those two statements are not in conflict, which is the uncomfortable heart of this kind of case.",
      next: "nc2",
    },
    nc2: {
      id: "nc2",
      actor: "issuer",
      actorName: "The issuer",
      day: 38,
      stage: "The ruling",
      moneyAt: "Clawed from the merchant",
      body: "Delivery evidence against your word. This is where non-delivery cases turn, and where the rules stop asking what is fair and start asking what can be proved. The chair is yours to award.",
      choice: {
        prompt: "You are the issuer. Rule.",
        options: [
          { label: "Rule for the cardholder", to: "nEndB" },
          { label: "Rule for the merchant", to: "nEndC" },
        ],
      },
    },
    nEndB: {
      id: "nEndB",
      actor: "issuer",
      actorName: "The issuer",
      day: 42,
      stage: "Case closed",
      moneyAt: "Yours, permanently",
      body: "The address on the carrier record is not quite yours, and the signature belongs to nobody anyone can name. Proof that fails to survive a careful reading is not proof, and the burden falls back on the merchant. They lose the $240 and the fee, and their argument now lies with the carrier they chose.",
      end: "cardholder",
    },
    nEndC: {
      id: "nEndC",
      actor: "issuer",
      actorName: "The issuer",
      day: 42,
      stage: "Case closed",
      moneyAt: "Returned to the merchant",
      body: "Delivered is delivered. The credit reverses and the $240 leaves your account again. This is the ending people find hardest to accept, because the network never asked whether you received the chair. It asked whether the merchant sent it. If it was lifted from your doorstep, your argument is with the carrier or your insurer, and it never was with the card.",
      end: "merchant",
    },
  },
};

const SUBSCRIPTION: DisputeCaseFile = {
  id: "subscription",
  label: "The subscription that would not die",
  blurb: "You cancelled. It kept charging.",
  amount: "$14.99",
  first: "r1",
  coda: "Subscriptions are the disputes least about money. $14.99 is not the point, the mandate is, and the two are handled by different machinery. A chargeback argues about one charge that already happened. A stop instruction ends the ones that have not. Cancel in writing, keep the confirmation, and check that the next month actually stays quiet.",
  steps: {
    r1: {
      id: "r1",
      actor: "you",
      actorName: "You",
      day: 0,
      stage: "The fourth charge",
      moneyAt: "With the merchant",
      body: "You cancelled in January. It is April, and $14.99 has left your account four times since. The app said cancelled. The statement disagrees. Four charges, one grievance, and only some of them still within reach.",
      choice: {
        prompt: "Which charges do you dispute?",
        options: [
          { label: "All four", to: "r1b" },
          { label: "The most recent", to: "r2" },
        ],
      },
    },
    r1b: {
      id: "r1b",
      actor: "issuer",
      actorName: "The issuer",
      day: 0,
      stage: "Out of time",
      moneyAt: "With the merchant",
      body: "Each charge is its own dispute with its own clock, and the oldest has already run out. It cannot be reached at all, which is the quiet cost of not reading a statement for three months. What is left is the recent ones.",
      next: "r2",
    },
    r2: {
      id: "r2",
      actor: "issuer",
      actorName: "The issuer",
      day: 1,
      stage: "Two jobs, not one",
      moneyAt: "Back with you, on loan from the issuer",
      body: "The issuer does two separate things here, and most people only think to ask for the first. It disputes the charge under cancelled recurring transaction. It also puts a stop instruction against the mandate so the next one cannot land. Clawing back April does nothing about May. Killing the mandate is the part that actually ends this.",
      next: "r3",
    },
    r3: {
      id: "r3",
      actor: "network",
      actorName: "The network",
      day: 3,
      stage: "The economics",
      moneyAt: "Clawed from the merchant",
      body: "$14.99 comes out of the merchant's account. The chargeback fee that arrives with it is $25. The merchant is now down more in fees than the subscription was ever worth, which quietly decides most of what happens next.",
      next: "rc1",
    },
    rc1: {
      id: "rc1",
      actor: "merchant",
      actorName: "The merchant",
      day: 6,
      stage: "The merchant's move",
      moneyAt: "Clawed from the merchant",
      body: "Two doors, and for once the cheaper one is obvious. Fighting costs staff time and the fee stays lost either way.",
      choice: {
        prompt: "What does the merchant do?",
        options: [
          { label: "They let it go", to: "rEndA" },
          { label: "They fight it", to: "r4" },
        ],
      },
    },
    rEndA: {
      id: "rEndA",
      actor: "merchant",
      actorName: "The merchant",
      day: 8,
      stage: "Case closed",
      moneyAt: "Yours, permanently",
      body: "They take the loss, because arguing about $14.99 costs considerably more than $14.99. Your credit hardens and the mandate stays dead. Most subscription disputes end here, settled by arithmetic rather than by who was actually right.",
      end: "accept",
    },
    r4: {
      id: "r4",
      actor: "merchant",
      actorName: "The merchant",
      day: 14,
      stage: "Representment",
      moneyAt: "Clawed from the merchant",
      body: "The merchant sends their terms: cancellation happens on the account page, not in the app, and their logs show no cancellation at all. They attach a sign-in from your device in March. Their case is not that you are lying. It is that you meant to cancel and never finished.",
      next: "rc2",
    },
    rc2: {
      id: "rc2",
      actor: "issuer",
      actorName: "The issuer",
      day: 21,
      stage: "The ruling",
      moneyAt: "Clawed from the merchant",
      body: "Your memory of a tap against their record of no tap. Cancelled recurring cases are won on paper: a confirmation email, a screenshot, a ticket number. Whoever kept the receipt tends to win.",
      choice: {
        prompt: "You are the issuer. Rule.",
        options: [
          { label: "Rule for the cardholder", to: "rEndB" },
          { label: "Rule for the merchant", to: "rEndC" },
        ],
      },
    },
    rEndB: {
      id: "rEndB",
      actor: "issuer",
      actorName: "The issuer",
      day: 26,
      stage: "Case closed",
      moneyAt: "Yours, permanently",
      body: "You kept the confirmation email. A cancellation the merchant cannot find in their own logs is still a cancellation when the customer is holding the receipt for it. The charge stays reversed and the mandate stays stopped.",
      end: "cardholder",
    },
    rEndC: {
      id: "rEndC",
      actor: "issuer",
      actorName: "The issuer",
      day: 26,
      stage: "Case closed",
      moneyAt: "Returned to the merchant",
      body: "No confirmation, no ticket, no screenshot, and the terms were on the page when you signed up. The $14.99 goes back. The mandate, though, stays dead, so this is the strange ending where you lose the argument and still stop the bleeding, which for a subscription is most of what you came for.",
      end: "merchant",
    },
  },
};

const DUPLICATE: DisputeCaseFile = {
  id: "duplicate",
  label: "Charged twice for one dinner",
  blurb: "A processing error. Possibly not an error at all.",
  amount: "$68",
  first: "d1",
  coda: "Processing errors are the disputes most worth filing and the easiest to win, because nobody argues with arithmetic. They are also the ones most often filed by mistake, against an authorization that was going to vanish on its own. Read the pending line before you pick up the phone. Act two of this page is the whole explanation: approval and settlement are different events, and only one of them moves money.",
  steps: {
    d1: {
      id: "d1",
      actor: "you",
      actorName: "You",
      day: 0,
      stage: "Two lines",
      moneyAt: "Unclear, which is the point",
      body: "Dinner cost $68. Your statement shows $68 twice, four minutes apart, same restaurant, same night. The obvious conclusion is that they charged you twice. The obvious conclusion is wrong about half the time.",
      choice: {
        prompt: "What do you do?",
        options: [
          { label: "Read the two lines properly", to: "d2" },
          { label: "Dispute it now", to: "d3" },
        ],
      },
    },
    d2: {
      id: "d2",
      actor: "you",
      actorName: "You",
      day: 0,
      stage: "Pending and posted",
      moneyAt: "One is real, one is a promise",
      body: "One line says pending. The other is posted. The pending one is an authorization, the terminal's first attempt, which hung on a bad connection and was keyed again. It was never captured, no money was ever taken against it, and it will fall off by itself within about a week.",
      choice: {
        prompt: "Do you still want to dispute it?",
        options: [
          { label: "Wait it out", to: "dEndZ" },
          { label: "Ten days on, still there", to: "d3" },
        ],
      },
    },
    dEndZ: {
      id: "dEndZ",
      actor: "you",
      actorName: "You",
      day: 6,
      stage: "No case",
      moneyAt: "Yours, and it never left",
      body: "The pending line disappears on its own. There was never a second $68, only a promise the restaurant made and never collected on. No dispute, no fee, no argument, and no week of everybody's time. The best outcome in this entire act is the one where you read your statement properly and file nothing.",
      end: "none",
    },
    d3: {
      id: "d3",
      actor: "issuer",
      actorName: "The issuer",
      day: 2,
      stage: "The filing",
      moneyAt: "Back with you, on loan from the issuer",
      body: "This files under processing error, and it is the plainest dispute there is. Fraud argues about identity. Non-delivery argues about promises. This one argues about two identical captures of the same amount on the same card, which is not really an argument at all.",
      next: "d4",
    },
    d4: {
      id: "d4",
      actor: "network",
      actorName: "The network",
      day: 4,
      stage: "The chargeback travels",
      moneyAt: "Clawed from the merchant",
      body: "The merchant's bank pulls $68 back and lands a fee on top. The restaurant opens their own batch file and finds exactly what you found: one ticket captured twice, because somebody keyed it again when the terminal appeared to hang.",
      next: "dc1",
    },
    dc1: {
      id: "dc1",
      actor: "merchant",
      actorName: "The merchant",
      day: 7,
      stage: "The merchant's move",
      moneyAt: "Clawed from the merchant",
      body: "There is a version of this where the merchant fights and wins, and it is rarer than they think. It requires the second charge to have been real all along.",
      choice: {
        prompt: "What does the merchant do?",
        options: [
          { label: "They accept it", to: "dEndA" },
          { label: "They show two real tickets", to: "dEndC" },
        ],
      },
    },
    dEndA: {
      id: "dEndA",
      actor: "issuer",
      actorName: "The issuer",
      day: 10,
      stage: "Case closed",
      moneyAt: "Yours, permanently",
      body: "Nobody argues with arithmetic. The credit hardens, the merchant absorbs the $68 and the fee, and the terminal that double-keyed it earns a service call. Processing errors are the highest win rate a cardholder will ever see.",
      end: "accept",
    },
    dEndC: {
      id: "dEndC",
      actor: "issuer",
      actorName: "The issuer",
      day: 16,
      stage: "Case closed",
      moneyAt: "Returned to the merchant",
      body: "Two itemised tickets arrive, timestamped forty minutes apart, different items on each. One dinner, one round afterwards, both $68 by coincidence. The credit reverses and the money goes back, and the lesson is that a duplicate is only a duplicate until somebody reads the receipt.",
      end: "merchant",
    },
  },
};

const CASES: DisputeCaseFile[] = [FRAUD, NOT_RECEIVED, SUBSCRIPTION, DUPLICATE];

function ActorGlyph({ kind }: { kind: StepActor }) {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      {kind === "you" && (
        <>
          <circle cx="12" cy="8" r="4" {...stroke} />
          <path d="M4.5 20.5c1.5-4 4-6 7.5-6s6 2 7.5 6" {...stroke} />
        </>
      )}
      {kind === "issuer" && (
        <>
          <path
            d="M12 2.5 20 6v6c0 5-3.5 8.2-8 9.5C7.5 20.2 4 17 4 12V6l8-3.5Z"
            {...stroke}
          />
          <circle cx="12" cy="10.5" r="2" {...stroke} />
          <path d="M12 12.5v3.5" {...stroke} />
        </>
      )}
      {kind === "network" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...stroke} />
          <ellipse cx="12" cy="12" rx="4" ry="8.5" {...stroke} />
          <path d="M3.5 12h17" {...stroke} />
        </>
      )}
      {kind === "merchant" && (
        <>
          <path d="M4 9.5 5.5 4h13L20 9.5" {...stroke} />
          <path d="M4 9.5c0 1.4 1.2 2.5 2.7 2.5S9.3 10.9 9.3 9.5c0 1.4 1.2 2.5 2.7 2.5s2.7-1.1 2.7-2.5c0 1.4 1.2 2.5 2.7 2.5S20 10.9 20 9.5" {...stroke} />
          <path d="M5.5 12v8.5h13V12" {...stroke} />
          <path d="M9.5 20.5v-5h5v5" {...stroke} />
        </>
      )}
    </svg>
  );
}

export default function DisputeCase() {
  const reduced = useReducedMotion();
  const [picking, setPicking] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [runId, setRunId] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  // Mirror of the path tail, so a stale button (still visible during
  // its exit animation) can't advance the case twice on fast taps.
  const tailRef = useRef<string | null>(null);

  const active = caseId ? CASES.find((c) => c.id === caseId)! : null;
  const current =
    active && path.length ? active.steps[path[path.length - 1]] : null;
  const ended = current?.end !== undefined;

  useEffect(() => {
    tailRef.current = path.length ? path[path.length - 1] : null;
  }, [path]);

  useEffect(() => {
    if (!path.length || reduced) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [path, reduced]);

  function openCase(file: DisputeCaseFile) {
    setCaseId(file.id);
    setPicking(false);
    setPath([file.first]);
    tailRef.current = file.first;
    setRunId((r) => r + 1);
    anatomyEvent("anatomy_dispute_opened", { case: file.id });
  }

  function advance(from: string, to: string, viaChoice?: string) {
    if (!active) return;
    if (tailRef.current !== from) return; // stale tap during an exit
    tailRef.current = to;
    if (viaChoice)
      anatomyEvent("anatomy_dispute_choice", {
        case: active.id,
        choice: viaChoice,
      });
    const step = active.steps[to];
    setPath((p) => [...p, to]);
    if (step.end)
      anatomyEvent("anatomy_dispute_end", {
        case: active.id,
        ending: step.end,
      });
  }

  function runAgain() {
    if (!active) return;
    setPath([active.first]);
    tailRef.current = active.first;
    setRunId((r) => r + 1);
  }

  function backToPicker() {
    setCaseId(null);
    setPath([]);
    tailRef.current = null;
    setPicking(true);
  }

  const pillClass =
    "rounded-full border border-rule px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent";

  return (
    <div className="mt-9">
      {!active ? (
        !picking ? (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="rounded-full border border-rule px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Open the case
          </button>
        ) : (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Four disputes. Each one argues differently.
            </p>
            <ul className="mt-4 max-w-[560px] border-t border-rule">
              {CASES.map((c) => (
                <li key={c.id} className="border-b border-rule">
                  <button
                    type="button"
                    onClick={() => openCase(c)}
                    className="group block w-full py-3.5 text-left"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 group-hover:text-accent">
                        {c.label}
                      </span>
                      <span className="font-mono text-[10px] text-muted">
                        {c.amount}
                      </span>
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-muted">
                      {c.blurb}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )
      ) : (
        <div key={runId}>
          {/* The ledger: always in sight, because whose money it is
              right now IS the lesson. Sits below the sticky nav. */}
          <div className="sticky top-[72px] z-30 border-y border-rule bg-background/90 py-2.5 backdrop-blur-md sm:top-[76px]">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.15em]">
              <span className="text-accent">Day {current!.day}</span>
              <span className="text-foreground">
                {active.amount} · {current!.moneyAt}
              </span>
              <span className="text-muted">{current!.stage}</span>
            </div>
          </div>

          {/* The filings */}
          <ol className="mt-8 space-y-8">
            {path.map((id) => {
              const step = active.steps[id];
              return (
                <motion.li
                  key={id}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="flex items-start gap-4"
                >
                  <span className="mt-0.5 shrink-0 text-accent">
                    <ActorGlyph kind={step.actor} />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                      <span className="text-accent">Day {step.day}</span> ·{" "}
                      {step.actorName} · {step.stage}
                    </p>
                    <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <div ref={endRef} className="mt-7 pl-10">
            {/* No exit choreography here on purpose: the next action must
                be tappable the instant it exists. */}
            <>
              {current!.choice ? (
                <motion.div
                  key={`choice-${current!.id}`}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {current!.choice.prompt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {current!.choice.options.map((o) => (
                      <button
                        key={o.to}
                        type="button"
                        onClick={() => advance(current!.id, o.to, o.label)}
                        className={pillClass}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : ended ? (
                <motion.div
                  key="coda"
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="max-w-[560px] font-serif italic leading-relaxed text-muted">
                    {active.coda}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={runAgain}
                      className={pillClass}
                    >
                      Run it again
                    </button>
                    <button
                      type="button"
                      onClick={backToPicker}
                      className={pillClass}
                    >
                      Try another dispute
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key={`continue-${current!.id}`}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  type="button"
                  onClick={() => advance(current!.id, current!.next!)}
                  className={pillClass}
                >
                  Continue →
                </motion.button>
              )}
            </>
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
            Days are typical, not promises. Every network writes its own
            rulebook. Amounts illustrative.
          </p>
        </div>
      )}
    </div>
  );
}
