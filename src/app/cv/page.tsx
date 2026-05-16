import Link from "next/link";
import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "CV",
  description:
    "The long form — roles, dates, and detail. The conventional view of a decade of product work in payments and fintech.",
};

type Experience = {
  company: string;
  role: string;
  dates: string;
  location: string;
  summary: string;
  bullets: string[];
};

const experiences: Experience[] = [
  {
    company: "Marqeta",
    role: "Lead Product Manager",
    dates: "Sep 2025 – Present",
    location: "Toronto, ON (Remote)",
    summary:
      "Owns a four-product portfolio — Resolve (contact-center support portal), Marqeta Dashboard, Marqeta IVR, and Identity & Access Management — for a global card-issuing platform processing billions in payment volume.",
    bullets: [
      "Led Resolve from concept to production in under five months, delivering a purpose-built cardholder support portal informed by direct observation of agent workflows during Coinbase program support.",
      "Built the automated testing workflow exclusively using Claude Code and Playwright in Terminal.",
      "Championing Resolve's credit expansion: FCRA disputes, collections/delinquency workflows, credit bureau reporting, and TCPA compliance.",
      "Presented Resolve's product vision and roadmap to cross-functional leadership across Credit, Operations, and Engineering. Created demo content for BPO transition stakeholders.",
      "Re-imagining the Marqeta Dashboard for enterprise program managers — defining product narrative and KPIs for cardholder lifecycle management and settlement tracking.",
      "Leading the design of a central, immutable audit log compliant with PCI DSS, GLBA, and SOC 2 — framed as a platform-wide capability.",
      "Managing IVR improvements (including AI agent management) and Identity & Access Management on Auth0, including user-access tooling and credential lifecycle (Self-Service Credential API provisioning).",
    ],
  },
  {
    company: "First City Monument Bank",
    role: "Product Lead, Corporate Banking Solutions",
    dates: "Oct 2024 – Sep 2025",
    location: "Across three time zones (Canada, UK, Nigeria)",
    summary:
      "Led digital transformation of corporate banking across Nigeria and the UK — corporate internet banking, admin tools, core banking (Finacle/Fineract), API architecture, payroll, remittances, FX/trade management. Managed five direct reports across multiple product lines.",
    bullets: [
      "Built and led a team of five PMs — hiring APMs and scoping their features to grow them into full PMs, recruiting Senior PMs who advanced to Lead. One mentee eventually became Head of Products for the Retail Banking division.",
      "Directed the vision, execution, and successful launch of the CIB platform from scratch, serving 50,000+ SME and enterprise clients across both markets. Streamlined bulk transfers, bill payments, payroll, and FX operations.",
      "Launched payroll management, FX & trade management, and Rova Business — a business remittance platform serving SME cross-border payments and the gig economy.",
      "Redesigned corporate client onboarding based on drop-off analysis and direct feedback from enterprise treasurers, achieving a 40% reduction in time-to-value. Managed KYC/AML integrations and regulatory compliance across both markets.",
      "Introduced real-time analytics dashboards for corporate treasurers, improving client retention and platform stickiness while maintaining consumer-grade UX under strict banking regulations.",
    ],
  },
  {
    company: "Paystack (a Stripe company, YC alum)",
    role: "Senior Product Manager, Key & Strategic Accounts",
    dates: "Jun 2021 – Jan 2025",
    location: "Lagos, Nigeria",
    summary:
      "Managed core payment methods and strategic merchant solutions for Africa's leading payment gateway.",
    bullets: [
      "Conceptualized the \"Pay with Airtime\" micro-transactions product and drove it to ₦14B (~$30M USD) in annualized transaction volume within 12 months. Payment-flow conversion +17%.",
      "Led the end-to-end launch of Direct Debit for recurring revenue collection — Central Bank compliance, UX optimization for high-frequency transactions.",
      "Executed strategic expansion into the airline vertical, delivering a $7M revenue-driving campaign. Owned product enhancements for high-volume airline ticketing and managed key industry stakeholder relationships.",
      "Reduced merchant support tickets by 13% through proactive product improvements and better documentation.",
    ],
  },
  {
    company: "Farmcrowdy (Techstars Toronto alum)",
    role: "Product Manager",
    dates: "Feb 2019 – Jun 2021",
    location: "Lagos, Nigeria",
    summary:
      "First product hire at the company. Owned the entire product portfolio across mobile (iOS and Android) and web platforms.",
    bullets: [
      "Managed three mobile products — Farmers App, Farmcrowdy Foods, Meathub — scaling the Farmers App to 200,000+ users.",
      "Grew a greenfield vertical from 3,200 to 25,000 users in under six months against a 12-month mandate.",
      "Built financial models and vendor management workflows. Conducted user research across 29 Nigerian states — travelled physically — to inform roadmap, pricing, and UI design.",
    ],
  },
];

const education = [
  {
    school: "Nigerian University of Technology and Management",
    detail:
      "Post-Graduate Diploma, Technology, Design & Entrepreneurship · MasterCard Foundation Scholar",
    year: "2021",
  },
  {
    school: "University of Lagos",
    detail:
      "Bachelor of Science, Mass Communication · CGPA 4.22/5 (Top 3% of class)",
    year: "2019",
  },
];

const toolGroups: { label: string; items: string }[] = [
  {
    label: "Code & AI",
    items: "Claude Code, Cursor, Codex, GitHub",
  },
  {
    label: "Product & PM",
    items: "Jira, Confluence, Linear, Notion, Miro, Figma",
  },
  {
    label: "Data & Analytics",
    items:
      "Mixpanel, Amplitude, Segment, Metabase, Tableau, Looker, Snowflake, Redshift, GA4, SQL",
  },
  {
    label: "API & Documentation",
    items: "Postman, Swagger",
  },
  {
    label: "Support & CX",
    items: "Intercom, Zendesk, AWS Connect, Twilio, Salesforce, ServiceNow",
  },
];

export default function CVPage() {
  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20 print:max-w-none print:px-0 print:py-0">
      <p className="mb-12 font-serif italic text-muted print:hidden">
        This is the long form. The short form lives on the{" "}
        <Link
          href="/work"
          className="text-accent underline underline-offset-4 hover:no-underline"
        >
          work
        </Link>{" "}
        page.
        <br />— Femi
      </p>

      <header>
        <h1 className="font-serif text-5xl tracking-tight sm:text-6xl print:text-3xl">
          Femi Siji-Kenneth
        </h1>
        <p className="mt-2 font-serif text-xl italic text-muted print:text-base">
          Group Product Manager · Payments & Fintech
        </p>
        <p className="mt-4 font-mono text-sm text-muted">
          Toronto, ON · oluwafemiakinseye@gmail.com · linkedin.com/in/ifemora
        </p>
      </header>

      <div className="mt-6 print:hidden">
        <PrintButton />
      </div>

      <hr className="my-10 border-t border-rule" />

      <section>
        <h2 className="font-serif text-2xl tracking-tight">Summary</h2>
        <p className="mt-4 leading-relaxed">
          Product leader with nine-plus years building and scaling payment
          platforms, B2B fintech products, and enterprise operational tools
          across card issuing, payment gateways and processing, and banking
          (corporate and retail). Track record of shipping high-impact
          products from zero to scale — including a self-conceptualized
          micro-payment method that reached $30M+ in annualized volume within
          twelve months, and a cardholder support platform delivered from
          concept to production in under five months. Experienced people
          manager who has hired, mentored, and grown product managers from
          associate to lead level. Hands-on builder who works directly from
          codebases and ships prototypes using Claude Code and modern AI
          tooling.
        </p>
      </section>

      <hr className="my-10 border-t border-rule" />

      <section>
        <h2 className="font-serif text-2xl tracking-tight">Experience</h2>
        <div className="mt-6 space-y-10 print:space-y-6">
          {experiences.map((job) => (
            <article
              key={`${job.company}-${job.dates}`}
              className="print:break-inside-avoid"
            >
              <h3 className="font-serif text-xl leading-snug tracking-tight">
                {job.role}
                <span className="text-muted"> · {job.company}</span>
              </h3>
              <p className="mt-1 font-mono text-sm text-muted">
                {job.dates} · {job.location}
              </p>
              <p className="mt-3 leading-relaxed">{job.summary}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed marker:text-muted">
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <hr className="my-10 border-t border-rule" />

      <section>
        <h2 className="font-serif text-2xl tracking-tight">Education</h2>
        <ul className="mt-6 space-y-5">
          {education.map((ed) => (
            <li key={ed.school}>
              <p className="font-serif text-lg leading-snug">{ed.school}</p>
              <p className="mt-1 text-sm leading-relaxed">{ed.detail}</p>
              <p className="mt-1 font-mono text-sm text-muted">{ed.year}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-10 border-t border-rule" />

      <section>
        <h2 className="font-serif text-2xl tracking-tight">Certifications</h2>
        <p className="mt-4 leading-relaxed">
          Certified Scrum Product Owner (CSPO)
        </p>
      </section>

      <hr className="my-10 border-t border-rule" />

      <section className="print:break-inside-avoid">
        <h2 className="font-serif text-2xl tracking-tight">Tools</h2>
        <dl className="mt-6 space-y-4">
          {toolGroups.map((group) => (
            <div
              key={group.label}
              className="flex flex-col gap-1 sm:flex-row sm:gap-6"
            >
              <dt className="font-mono text-sm text-muted sm:w-44 sm:shrink-0">
                {group.label}
              </dt>
              <dd className="leading-relaxed">{group.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <hr className="mt-10 border-t border-rule print:hidden" />

      <p className="mt-6 text-sm print:hidden">
        <Link
          href="/work"
          className="text-accent underline underline-offset-4 hover:no-underline"
        >
          ← Back to the short form
        </Link>
      </p>
    </main>
  );
}
