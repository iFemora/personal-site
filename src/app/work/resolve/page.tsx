import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import ResolveReleaseArtifact from "@/components/work/ResolveReleaseArtifact";

export const metadata: Metadata = {
  title: "Resolve, a case study",
  description:
    "A cardholder support platform for a global card issuer, shipped in under five months and expanded through small releases.",
  alternates: { canonical: "/work/resolve" },
};

export default function ResolveCaseStudy() {
  return (
    <CaseStudy
      eyebrow="Marqeta · 2025 to now"
      title={["Resolve"]}
      standfirst="We shipped the first version in under five months and have expanded it in small releases since."
      sections={[
        {
          label: "Scope",
          paras: [
            "Resolve is the deepest of four product areas I carry at Marqeta. The others: the Marqeta Dashboard, the program-management tool I also own day to day, including customer issues, bulk-fix tickets, and QA; identity and access management across the platform; and the telephony suite behind Marqeta's IVR, including custom call flows, customer integrations, and containment and drop-off reporting. This case study covers Resolve, because it is the one I took from concept to production.",
          ],
        },
        {
          label: "The problem",
          paras: [
            "Marqeta's contact center supports dozens of card programs, and agents worked out of the Marqeta Dashboard: a program-management tool built to serve many jobs at once. Program management, BIN management, card issuing, transaction management, disputes, fraud reporting. Internal teams and external customers, all in one interface. Agents had to work through functions meant for program managers to answer basic cardholder questions. They clicked through layer after layer, and handle time showed it.",
            "The decision that support deserved its own tool predated me. What nobody had done was work out what to actually build.",
          ],
        },
        {
          label: "Discovery",
          paras: [
            "I listened to agent calls from across the programs, then sat beside agents and watched them work. One program carried the highest call volume, so I started there. The same problems appeared across other programs. The requested feature list was far too large for a first release. I narrowed it to the workflows behind the most calls and the longest handling times: transactions cardholders didn't recognize, transactions that hadn't completed, card status and activation, payments, account closure, and their neighbours. That scope gave us a first release we could ship in five months and measure against handle time.",
          ],
          artifact: <ResolveReleaseArtifact />,
        },
        {
          label: "Bulk disputes",
          paras: [
            "Fraud reports often involved several transactions. Agents had to file each dispute separately and repeat the same questionnaire, which could take most of a call. The API still accepted one dispute at a time, so we changed the agent workflow instead. The agent collects every disputed transaction through one questionnaire, and the system submits them individually in the background. A visual workflow shows each submission and lets the agent retry anything that fails. Agents enter the shared answers once.",
          ],
        },
        {
          label: "Small changes",
          paras: [
            "Search used to demand the customer's phone number formatted exactly as the database stored it, dashes and all. Cardholders read out their number; they don't dictate punctuation. We made search find the number in any format, in under two seconds. It is the least glamorous change in the product and one of the most felt.",
          ],
        },
        {
          label: "What v1 left out",
          paras: [
            "We left out credit limit management, collections, delinquency workflows, FCRA disputes, and credit bureau reporting because Marqeta's credit products were still young and delinquency takes time to exist. That decision made a five-month first release possible.",
            "We added them later across several releases: collections and delinquency management, charge-off predictions, re-age workflows, call dispositions, an AWS Connect integration, and sub-status management for accounts under regulation.",
          ],
        },
        {
          label: "With design",
          paras: [
            "After the PRD, I map the workflow in FigJam and review it with design. I also build a working prototype so we can test the flow before the visual design is final. Design owns the final interface decisions. I renamed Customer's Portal to Resolve because the name describes the agent's job.",
          ],
        },
        {
          label: "Where it stands",
          paras: [
            "Every program has moved from Dashboard to Resolve. It now supports debit, credit, and prepaid workflows across payments, collections, disputes, fraud, and account sub-statuses. Handle time has fallen, but I cannot publish Marqeta's internal figures or screenshots. This case study therefore focuses on the decisions and workflows.",
          ],
        },
      ]}
    />
  );
}
