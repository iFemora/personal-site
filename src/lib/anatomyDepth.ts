/* Depth-on-demand content for the anatomy stage. One entry per actor;
   only the issuer is written so far (Act I starts on home turf).
   ALL COPY IS DRAFT pending Femi's voice pass. Facts in our own words —
   the territory is public knowledge and lived experience, never a
   reproduction of anyone's book. */

export type DepthSection = {
  label: string;
  body: string;
};

export type ActorDepth = {
  actor: "terminal" | "acquirer" | "network" | "issuer";
  title: string;
  intro: string;
  sections: DepthSection[];
};

export const ACTOR_DEPTH: Partial<Record<ActorDepth["actor"], ActorDepth>> = {
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
