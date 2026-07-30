import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import OperatingModelArtifact from "@/components/work/OperatingModelArtifact";

export const metadata: Metadata = {
  title: "Making a bank product-led, a case study",
  description:
    "First product hire at a sales-driven bank: five product managers across three time zones, and a pipeline the group CEO came to enforce.",
};

export default function ProductTeamCaseStudy() {
  return (
    <CaseStudy
      eyebrow="FCMB · 2024 to 2025"
      title={["Making a bank", "product-led"]}
      standfirst="I was the first product hire at a company that sold everything and built almost nothing. It is product-led now."
      sections={[
        {
          label: "Scope",
          paras: [
            <>
              Product Lead, Corporate Solutions. Five product managers at
              levels from APM to Senior PM, across three time zones: Nigeria,
              the UK, and Canada. Four product lines: corporate and investment
              banking, payroll, FX and trade, and{" "}
              <a
                href="https://www.rovabusiness.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-swipe text-accent"
              >
                ROVA Business
              </a>
              , a new business-banking proposition. Reported into the CPO and
              represented the team at the stakeholder level above.
            </>,
          ],
        },
        {
          label: "What I inherited",
          paras: [
            "FCMB sold. That was the culture, end to end. There was a website, and there was a place to sign in and look at your balance, and that was the extent of it. If you wanted to move money you went into a branch, in person.",
            "The company had just hired a CPO to change that. I was his first hire, which meant there was no product function to join, only one to build.",
          ],
        },
        {
          label: "The pipeline",
          paras: [
            "The old path was short: the business named a feature, engineering built the feature, nobody asked whether it was the right feature. There was no discovery anywhere in the company, so I wrote the discovery framework and then had to teach people why a written problem beats a confident request.",
            "None of that would have held on my authority alone. What made it permanent was the group COO backing the gate, so work had to come through the pipeline before it got built. A process nobody enforces is a document. A process the COO enforces is how the company works.",
          ],
          artifact: <OperatingModelArtifact />,
        },
        {
          label: "Three time zones",
          paras: [
            "I was in Nigeria building for the UK, which does not work if one person tries to hold both. So I assigned one of my PMs to the UK and let them own it: their market, their feedback loop, their read on what was different. That is what made two genuinely different products possible instead of one product with exceptions bolted on.",
            "Then I relocated to Canada and the arithmetic got worse. My engineers and stakeholders were five and six hours ahead, so I started at four in the morning, every day. Mornings were meetings because it was already midday for them; the actual work happened after they logged off. I would not run it that way again, and I want to be precise about the cost rather than describe distributed teams as though goodwill covers it.",
          ],
        },
        {
          label: "Giving the work away",
          paras: [
            "One PM took internal tools, the systems our own people needed to service what we were shipping. When payroll arrived I hired a junior APM and gave them the discovery, not a list of tickets. They brought findings to me for validation, and once we agreed on the problem I walked them through turning it into user stories they wrote themselves.",
            "The person who became Head of Products for the retail division joined as a Senior PM. Retail was as large as corporate, and he was the only one on it, so we hired APMs around him. Our working rhythm was that strategy was ours together, then he wrote the PRDs and the stories alone. We reviewed, and I carried the outcome up to the CPO and the stakeholder meetings and brought the direction and the business KPIs back down to him. He implemented against it. He was promoted after I left, which is the version of this outcome I trust most, because it happened without me in the room.",
          ],
        },
        {
          label: "What I would do differently",
          paras: [
            "I made myself the single point of dependency. I wrote the templates, convened UAT even though there was a UAT team, ran the discovery, reviewed every spec, and represented the team upward. That is how you get a function started, and it is also how you become the thing the function cannot run without. I should have handed the rituals to owners far earlier than I did, and let the pipeline survive a week without me as the test of whether it was real.",
            "I would also manage the backlog directly. We wrote the stories and put them in Linear, but I left the backlog itself to the engineering managers because I had no time, and priority is not something to delegate by accident.",
            "And I would stay closer to the codebase. Too many bugs surfaced at UAT that a look at what was actually being merged would have caught weeks earlier. I had reasons not to be in GitHub, and none of them were as expensive as finding out at QA.",
          ],
        },
        {
          label: "Where it stands",
          paras: [
            <>
              The company is product-led today. Payroll and FX and trade were
              ready but had not gone to market when I left, and{" "}
              <a
                href="https://www.rovabusiness.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-swipe text-accent"
              >
                ROVA Business
              </a>{" "}
              launched after my last day, on the launch artefacts I had
              already written. Developer documentation, which I packaged
              their API to make possible, still has not shipped.
            </>,
          ],
        },
      ]}
    />
  );
}
