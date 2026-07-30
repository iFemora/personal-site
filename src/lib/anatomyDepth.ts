/* Depth-on-demand content for the anatomy stage: one chapter per actor.
   ALL COPY IS DRAFT pending Femi's voice pass. Facts in our own words. */

export type ActorKey = "terminal" | "acquirer" | "network" | "issuer";

export type DepthSection = {
  label: string;
  body: string;
};

export type ActorDepth = {
  actor: ActorKey;
  title: string;
  intro: string;
  sections: DepthSection[];
};

export const ACTOR_DEPTH: Record<ActorKey, ActorDepth> = {
  terminal: {
    actor: "terminal",
    title: "Inside the terminal",
    intro:
      "A hundred and fifty milliseconds here, and most of what people assume about card fraud is settled by what this small machine does first.",
    sections: [
      {
        label: "A conversation, not a reading",
        body: "The terminal does not copy your card. A tap or a chip insert is a short challenge and response: the terminal presents the details of this exact purchase, and the chip signs them with a key that never leaves the card. That signature, the cryptogram, is minted fresh for every transaction. Yesterday's is worthless today, which is why overhearing the conversation gets a thief nothing.",
      },
      {
        label: "Why the number alone is not the card",
        body: "The old magnetic stripe stored the same secrets every swipe, so copying it made a working clone. The chip ended that: a stolen card number can still try its luck online, where different defenses apply, but it cannot fake a chip's signature in person. The world has spent two decades retiring the stripe for exactly this reason.",
      },
      {
        label: "What actually leaves the shop",
        body: "One small message: which card, how much, where, what kind of merchant, right now, plus the cryptogram that proves the card itself was present. A few hundred bytes. Your name is not even required to travel. Everything the issuer will decide in the next second, it decides from this.",
      },
      {
        label: "One machine, many masters",
        body: "The terminal belongs to the merchant's world but speaks for everyone: it carries the merchant's identity and category, the acquirer's routing, and the networks' rules about what a valid request looks like. The category code it stamps decides, hours later, what slice of your payment each party earns.",
      },
    ],
  },
  acquirer: {
    actor: "acquirer",
    title: "Inside the acquirer",
    intro:
      "The acquirer is the merchant's side of the story: a hundred and twenty milliseconds in the live moment, and the whole relationship the rest of the time.",
    sections: [
      {
        label: "The merchant's bank",
        body: "The acquirer underwrites the merchant, opens the account the money will land in, and vouches for them to the networks. When you pay a shop, the network does not know the shop. It knows the acquirer, who does.",
      },
      {
        label: "Stamp and forward",
        body: "In the moment of your payment its job is deliberately small: confirm the merchant is real and in good standing, stamp the request with the merchant's identity, and hand it to the right network. The speed is the product; the diligence happened earlier, when the merchant signed up.",
      },
      {
        label: "How a small shop gets in",
        body: "Direct acquiring means underwriting, paperwork, and volume commitments, which suits supermarkets. Most small merchants ride in through a facilitator: one company holds a master relationship with the acquirer and onboards thousands of merchants beneath it in minutes. It is why a market stall can take cards the same afternoon it decides to.",
      },
      {
        label: "Risk lives here",
        body: "If a merchant takes your money and never delivers, the refunds and disputes land on the acquirer. That is why riskier trades pay more to be acquired, why acquirers watch dispute rates like blood pressure, and why some businesses cannot find an acquirer at any price.",
      },
    ],
  },
  network: {
    actor: "network",
    title: "Inside the network",
    intro:
      "Eighty milliseconds, the shortest stop, and the reason any card works anywhere. The network's whole job is knowing who to ask.",
    sections: [
      {
        label: "A router with rules",
        body: "The network reads the first digits of your card number and knows immediately which bank issued the card, then routes the question there. Around that one trick it runs everything else: the rules every member plays by, the standards a message must meet, and the running score of what every bank owes every other bank.",
      },
      {
        label: "Open and closed",
        body: "On an open network, the card's bank and the shop's bank are different institutions, and the network sits between thousands of each. A closed network is one company playing issuer, acquirer, and network at once: accepted in fewer places, but it sees both sides of every purchase it carries.",
      },
      {
        label: "Messages now, money later",
        body: "What crosses the network in the live moment is only the question and the answer. No money moves at all. The money follows in bulk, in the netting and settlement you can watch below, hours after everyone has gone home.",
      },
      {
        label: "The toll",
        body: "For carrying the question and keeping the score, the network takes its assessment, the thinnest slice in the split above. Thin, multiplied by every card payment on earth, which is how the toll booth became one of the most valuable businesses alive.",
      },
    ],
  },
  issuer: {
    actor: "issuer",
    title: "Inside the issuer",
    intro:
      "Nine hundred of your milliseconds are spent here, because this is the only party with the standing to answer. The issuer gave you the card, holds your money, and carries the risk of saying yes.",
    sections: [
      {
        label: "Who actually answers",
        body: "The issuer is the bank behind your card. On a traditional card that is the bank whose name is on the plastic. On a fintech card it usually is not: a licensed sponsor bank holds the regulatory permission, and a program manager runs the product you actually experience, the app, the controls, the support line. The name you know may never touch the money.",
      },
      {
        label: "The checks, in order",
        body: "First, is this card real and present: the chip signed this exact transaction with a one-time cryptogram, which is why a photographed card number is not a working card. Second, is the card alive: not frozen in an app, not expired, not reported. Third, is the money there, or the credit line. Fourth, does this purchase fit the card's life: the city it wakes up in, the hours it keeps, the size of its habits. Any check can end the conversation.",
      },
      {
        label: "How modern issuers decide",
        body: "For most of card history the answer came from a batch-fed mainframe that knew last night's balance. Modern issuer processors put software in the decision path: the program can score the transaction, apply its own spending rules, even fund the account at the exact moment of authorization rather than in advance. That last trick is how a corporate card can enforce a policy per purchase. Building this decision path is my day job.",
      },
      {
        label: "The answer itself",
        body: "What travels back is small: approved, or a two-digit reason. Insufficient funds is 51. A frozen card is 57. Suspected fraud is 59. The receipt stays polite and vague on purpose; the wire is always precise. Every decline you have ever suffered had a name, you were just never told it.",
      },
    ],
  },
};
