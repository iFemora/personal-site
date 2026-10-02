/* Act IV — "Before the tap", the build sheet. The reader plays program
   manager: pick who you are, meet the cast a card needs, choose where
   the money sits. ALL COPY IS DRAFT pending Femi's voice pass. Industry
   mechanisms in our own words; nothing here is any employer's internals. */

export type CompanyKey = "gig" | "neobank" | "expense" | "bank";
export type SeatKey = "network" | "bank" | "processor" | "program";
export type FundingKey =
  | "prefunded"
  | "jit"
  | "credit"
  | "deposits"
  | "balance";

export type Company = {
  key: CompanyKey;
  label: string;
  /** What the card is for, in one line. */
  purpose: string;
  /** A bank fills three of the four seats itself. */
  oneHouse: boolean;
  funding: FundingKey[];
};

export type Seat = {
  key: SeatKey;
  name: string;
  role: string;
  asks: string;
  /** What the seat looks like when a bank fills it itself. */
  inHouse?: string;
  depth: { title: string; intro: string; sections: { label: string; body: string }[] };
};

export type Funding = {
  key: FundingKey;
  label: string;
  nightBefore: string;
  atTap: string;
  hook: string;
  forYou: Partial<Record<CompanyKey, string>>;
};

export const COMPANIES: Company[] = [
  {
    key: "gig",
    label: "A gig platform",
    purpose:
      "You pay drivers the moment a ride ends, onto a card you issue, instead of a bank transfer on Friday.",
    oneHouse: false,
    funding: ["prefunded", "jit", "credit"],
  },
  {
    key: "neobank",
    label: "A neobank",
    purpose:
      "You are the bank in your customer's pocket: an app, a card, a balance, and no banking licence of your own.",
    oneHouse: false,
    funding: ["prefunded", "jit", "credit"],
  },
  {
    key: "expense",
    label: "An expense tool",
    purpose:
      "You hand company cards to employees, with a rule on every card about what it may buy and when.",
    oneHouse: false,
    funding: ["prefunded", "jit", "credit"],
  },
  {
    key: "bank",
    label: "A bank",
    purpose:
      "You already hold deposits and a licence. Most of the cast is you, which is the point of the comparison.",
    oneHouse: true,
    funding: ["deposits", "balance"],
  },
];

export const SEATS: Seat[] = [
  {
    key: "network",
    name: "The network",
    role: "Lends the card its reach, and the rules that come with it.",
    asks: "A certified program on a member bank's card range, and a fee on every transaction it carries.",
    depth: {
      title: "The network's part, before any tap",
      intro:
        "In Act I the network was eighty milliseconds of routing. Before that could happen, it had to know your card existed.",
      sections: [
        {
          label: "The range the card lives in",
          body: "Card numbers are handed out in ranges, and a range belongs to an issuing bank, never to a program. Your card carries the bank's range, which is exactly how the router in Act I knows whom to ask. A non-bank issuing a card is, in the network's eyes, a bank issuing a card with someone else's brand on it.",
        },
        {
          label: "Certification",
          body: "Before the first real tap, the program's cards are run through the network's test messages: approvals, declines, reversals, the odd cases. Nothing goes live until the answers come back in the shape the rules demand. It is slow and unglamorous, and it is why a card from a company founded last year works in a shop founded last century.",
        },
        {
          label: "The rules ride along",
          body: "Dispute rights, who is liable when a counterfeit card is used, the interchange table that split the hundred dollars in Act II: none of it is negotiated by the program. It arrives with the range. Choosing a network is choosing a rulebook.",
        },
      ],
    },
  },
  {
    key: "bank",
    name: "The sponsor bank",
    role: "The issuer of record. Its name is in the small print on your card.",
    asks: "Due diligence on you, reserves against what your cardholders might spend, and the final say on compliance.",
    inHouse:
      "You are the member the network recognises, and the regulator was already yours. No reserves to post, no sponsor to persuade.",
    depth: {
      title: "Why there has to be a bank",
      intro:
        "The network only deals with regulated members. A company that is not a bank borrows that standing from one that is, and pays for it.",
      sections: [
        {
          label: "The issuer of record",
          body: "Legally, the sponsor bank issued your card. It holds the card range, it is the member the network recognises, and its regulator holds it responsible for the program it sponsors. Your brand is on the front; the bank is on the back, in six-point type, because the law requires it to be somewhere.",
        },
        {
          label: "What it carries",
          body: "When the network nets up the night in Act II, the sponsor bank is the one that pays. It pays whether or not the program has paid it yet. That single fact explains almost everything a sponsor bank asks of a program: reserves held in advance, limits on how much can be outstanding, and the right to switch the program off.",
        },
        {
          label: "What it asks in return",
          body: "A look at your business before it says yes. Your customer checks run to its standard, not yours. Audit rights, reporting, and a fee per card or per transaction. A good sponsor bank is slow to approve and quick to answer; a bad one is the reverse, and programs have died waiting on both kinds.",
        },
        {
          label: "When the bank is you",
          body: "A bank issuing its own cards fills this seat itself, and usually the next two as well. The unbundled stack exists so that a non-bank can borrow this seat and buy the next one. Pick 'A bank' above and watch the cast collapse into one house.",
        },
      ],
    },
  },
  {
    key: "processor",
    name: "The issuer processor",
    role: "Answers in the two seconds, keeps the ledger, and gives you an API instead of a mainframe.",
    asks: "Your program's rules in advance, and an answer in milliseconds when it asks you one.",
    inHouse:
      "Your core banking system's authorization host, or a vendor's. Most banks rent this seat too; they just do not call it that.",
    depth: {
      title: "The two seconds, inside the issuer",
      intro:
        "In Act I the issuer was one stop on the rail. Open it up and there is a machine in there, and the machine is usually not the bank's.",
      sections: [
        {
          label: "What happens to the question",
          body: "The network's question arrives: this card, this amount, this shop, right now. The processor checks that the card is active, that the controls you set allow this merchant and this amount, that the velocity is sane. Then it either answers from the balance it holds, or, on a just-in-time program, turns to you and asks.",
        },
        {
          label: "The ledger",
          body: "Every card's balance, every hold placed at authorization, every clearing that lands a day later, every refund. The processor's ledger is the program's book of record, and reconciling it against the bank's and your own is a job someone on your team does every morning.",
        },
        {
          label: "The API",
          body: "Create a card with one call. Set a control per card: this merchant category only, this amount, these hours. Freeze it, replace it, read every transaction as it happens. This is what changed in the last decade: a card program became something a small product team could build, instead of something a bank's vendor delivered in eighteen months.",
        },
        {
          label: "Stand-in",
          body: "If the program is asked and cannot answer in time, the processor answers for it, by rules you wrote in advance. The two seconds do not wait for anyone. Programs that forget this learn it at a petrol station at midnight.",
        },
      ],
    },
  },
  {
    key: "program",
    name: "You, the program",
    role: "The product, the customers, the funding, and the support.",
    asks: "Of yourself: a reason the card should exist, and the money to stand behind it.",
    inHouse:
      "Your card product team: the same job, minus the recruiting. The customers were yours before the card was.",
    depth: {
      title: "What the program actually owns",
      intro:
        "Three other parties make the card possible. One party makes it worth having, and that is the seat you are sitting in.",
      sections: [
        {
          label: "The product",
          body: "The app, the brand, the reason a customer wants this card and not the one already in their wallet. Instant pay for a driver. A balance that shows up on a phone. A company card that refuses a bar tab. The cast behind you is the same for all three; the product is yours alone.",
        },
        {
          label: "Compliance is shared, not delegated",
          body: "You verify your customers, but to the sponsor bank's standard, with the sponsor bank able to check. You watch for fraud and money laundering on your program, because the regulator will ask the bank, and the bank will ask you.",
        },
        {
          label: "The support seat",
          body: "When the card declines at a till, the customer does not call the sponsor bank. They call you. Someone on your side needs to see the card, the transaction, the hold, and the reason, in seconds, while the customer is still at the counter. Building that tool well is its own discipline.",
        },
        {
          label: "What you earn",
          body: "A share of the interchange from Act II, on every tap, forever, plus whatever your product charges. That is why every fintech eventually wants to issue a card, and why the processor, which takes a slice of each program, is the quieter and better business.",
        },
      ],
    },
  },
];

export const FUNDING: Funding[] = [
  {
    key: "prefunded",
    label: "Prefunded",
    nightBefore:
      "Your money, already at the sponsor bank, in an account set aside for the program.",
    atTap:
      "The processor checks the balance it holds and answers alone. Nothing is asked of you.",
    hook: "You, and you already paid. The money was there before the tap.",
    forYou: {
      gig: "You load each driver's card after the ride; the float is yours until they spend it.",
      neobank:
        "The balance is your customer's own money, held at the sponsor bank in your name on their behalf.",
      expense:
        "The company tops up a float, and its employees spend it down.",
    },
  },
  {
    key: "jit",
    label: "Just-in-time",
    nightBefore: "Nothing. The card has no balance. The program has a promise.",
    atTap:
      "The processor asks you, inside the two seconds: fund this one? You answer yes or no from your own ledger.",
    hook:
      "You, by settlement. If you cannot pay, the sponsor bank pays the network anyway, which is why it took reserves from you first.",
    forYou: {
      gig: "The natural fit: a driver's card is funded the instant the ride clears, and nothing sits idle.",
      neobank:
        "Your app, not a prefunded pot, decides every tap, which means your app must be awake for every tap.",
      expense:
        "Every purchase is judged against the policy at the moment it happens, not reconciled against it afterwards.",
    },
  },
  {
    key: "credit",
    label: "Credit",
    nightBefore: "No money, a limit. Someone has agreed to lend.",
    atTap:
      "The processor checks the limit and the account's standing. The purchase becomes a loan.",
    hook:
      "The lender first, the cardholder in the end. Then the long tail: delinquency, collections, bureau reporting.",
    forYou: {
      gig: "Rare for drivers. The risk is yours, or a partner lender's.",
      neobank:
        "Needs a lender's balance sheet behind you; most rent one, and the lender gets a say in the product.",
      expense:
        "A corporate card: the company owes the balance at month end, and your underwriting is of the company, not the employee.",
    },
  },
  {
    key: "deposits",
    label: "Debit on deposits",
    nightBefore:
      "The customer's own deposit, in your core banking system, where it has always been.",
    atTap:
      "Your authorization host checks the account and holds the amount. No one outside the house is asked.",
    hook: "The customer. And you, if a hold slips or the system stands in while the core is down.",
    forYou: {
      bank: "Nothing to recruit; the card is a window onto an account you already keep.",
    },
  },
  {
    key: "balance",
    label: "Credit",
    nightBefore: "A limit against your own balance sheet.",
    atTap:
      "Limit and standing checked, in-house or by your processor. A loan is made.",
    hook: "You lend, the customer owes, and your collections team is the long tail.",
    forYou: {
      bank: "The oldest version of the product, and still the one that pays the most per card.",
    },
  },
];

export const ONE_HOUSE_NOTE =
  "A bank fills these three seats itself: it is the issuer of record, it runs or rents the processing, and it is its own program manager. The unbundled stack exists so that a non-bank can borrow the first seat and buy the second.";
