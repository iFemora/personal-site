import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import PayByReferenceArtifact from "@/components/work/PayByReferenceArtifact";

export const metadata: Metadata = {
  title: "Pay by reference, a case study",
  description:
    "Turning a reconciliation gap into a payment channel: airline ticketing at the terminal, then insurance premiums on the same rail.",
  alternates: { canonical: "/work/airline-payments" },
};

export default function AirlinePaymentsCaseStudy() {
  return (
    <CaseStudy
      eyebrow="Paystack · 2021 to 2024"
      title={["Pay by reference"]}
      standfirst="A booking you could not finish paying for became a booking you could pay for anywhere, and the same rail went on to carry insurance."
      sections={[
        {
          label: "Scope",
          paras: [
            "Terminal expansion into airline ticketing, then insurance. Airlines, the airports authority, and insurers as counterparties. The work contributed to a $7M year-over-year revenue uplift.",
          ],
        },
        {
          label: "Not a payments gap",
          paras: [
            "Paystack already owned airline payments online. This was never about whether a card would work. It was about where a passenger could stand when they paid.",
            "Checkout assumed one session: book and pay in the same sitting, or lose the booking. Nobody could book online and pay later at a terminal, because nothing could turn a booking reference into an amount owed. The reference and the terminal had no way to find each other.",
          ],
        },
        {
          label: "The pattern",
          paras: [
            "We integrated with the airlines' systems so a booking reference resolved at the terminal. A passenger books online, walks up to any Paystack terminal, reads out the reference, sees their own booking, pays, and leaves. Any time, any terminal.",
            "That framing matters more than the vertical. We had not built airline ticketing. We had built paying against a reference, and a reference is not fussy about what it points to.",
          ],
          artifact: <PayByReferenceArtifact />,
        },
        {
          label: "Access before product",
          paras: [
            "The opening came from a different job. We built tap-to-pay for the Federal Airports Authority of Nigeria, for the toll gates at airport entry. I was not on that build. I was on the strategy and the pitch, and the pitch is where I earned a relationship with the authority's managing director.",
            "So instead of selling airline by airline, I organised a conference and asked her to speak. The airlines came for her, not for us: local carriers and international ones, Qatar Airways among them. They came because the body that governs them was in the room and they had things they needed heard, and they used the day to raise those things.",
            "We convened it. That was the whole play. By the time we showed the terminal product to that room, we were not a vendor cold-calling an industry. We were the people who had got everyone around one table, and the trust that came from facilitating was what made the sale possible. Most of the room adopted.",
          ],
        },
        {
          label: "Then insurance",
          paras: [
            "Insurers had the same shape of problem in different clothes. A policyholder could pay at the insurer's office or on the insurer's website, and nowhere else. Premiums went unpaid for want of a counter.",
            "We integrated the terminals with the insurers in our database. Hand your policy number to anyone with a Paystack terminal, including a shop or a betting outlet, and it resolves the insurer, the cover, and the premium due. You pay there. I signed the first one, Leadway Insurance, and it moved out into the industry from there.",
          ],
        },
      ]}
    />
  );
}
