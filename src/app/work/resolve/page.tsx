import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import ResolveReleaseArtifact from "@/components/work/ResolveReleaseArtifact";

export const metadata: Metadata = {
  title: "Resolve, a case study",
  description:
    "A cardholder support platform for a global card issuer. Concept to production in under five months, then grown release by release.",
};

export default function ResolveCaseStudy() {
  return (
    <CaseStudy
      eyebrow="Marqeta · 2025 to now"
      title={["Resolve"]}
      standfirst="A cardholder support platform, concept to production in under five months. Then grown release by release."
      sections={[
        {
          label: "The problem",
          paras: [
            "Marqeta's contact center supports dozens of card programs, and agents worked out of the Marqeta Dashboard: a program-management tool built to serve many jobs at once. Program management, BIN management, card issuing, transaction management, disputes, fraud reporting. Internal teams and external customers, all in one interface. A tool built to do everything ends up serving nothing properly. Agents clicked through layer after layer to answer simple questions, and handle time showed it.",
            "The decision that support deserved its own tool predated me. What nobody had done was work out what to actually build.",
          ],
        },
        {
          label: "Discovery",
          paras: [
            "I listened to agent calls from across the programs, then sat beside agents and watched them work. Coinbase, the largest program, was the sharpest lens, but the pattern held everywhere. The feature ask was a laundry list; the product decision was scoping it down. I picked the eight workflows that drove the most calls: transactions cardholders didn't recognize, transactions that hadn't completed, card status and activation, payments, account closure, and their neighbours. Eight workflows, shipped fast, aimed squarely at handle time. Everything else could wait its turn.",
          ],
          artifact: <ResolveReleaseArtifact />,
        },
        {
          label: "Bulk disputes",
          paras: [
            "Most dispute calls are fraud reports, and fraud rarely touches one transaction. Filing disputes one at a time, each through its own questionnaire, could swallow most of an hour on a single call. The backend accepted one dispute at a time, and that wasn't going to change quickly. So the workflow changed instead: the agent collects every disputed transaction at once through a single questionnaire, the system submits them in batches behind the scenes, and a visual workflow shows each submission with a retry for anything that fails. The cardholder never sees the machinery. The agent stops re-typing the same answers.",
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
            "Credit limit management. Collections. Delinquency workflows. FCRA disputes and credit bureau reporting. Not because they didn't matter, but because Marqeta's credit products were still young and delinquency takes time to exist. Leaving them out is what made five months possible.",
            "They have since arrived in bits: collections and delinquency management, charge-off predictions, re-age workflows, call dispositions, an AWS Connect integration, sub-status management for accounts under regulation. Release by release, not one big launch.",
          ],
        },
        {
          label: "With design",
          paras: [
            "After the PRD, I build the workflow map in FigJam and sit with design to walk through it. Then I build a working prototype, in Claude Code these days, directly in Figma before that, and design iterates from there. Design makes the final design calls; that is their craft, and the product is better when I respect the line. I bring strong opinions when they earn their place: the product was called Customer's Portal when I arrived, and I named it Resolve, because that is what it is for.",
          ],
        },
        {
          label: "Where it stands",
          paras: [
            "Every program has migrated off the dashboard and onto Resolve, and it now spans debit, credit, and prepaid programs: payments and collections, disputes, fraud management, sub-status management. Handle time has fallen sharply and keeps falling. The specific numbers stay inside Marqeta, which is where they belong. It is also why this case study has no screenshots: Resolve is an internal tool, so the method is the artifact I can show.",
          ],
        },
      ]}
    />
  );
}
