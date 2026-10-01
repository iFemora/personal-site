import Link from "next/link";
import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import BookIntroLink from "@/components/BookIntroLink";
import HireMe, { EMAIL } from "@/components/HireMe";

export const metadata: Metadata = {
  title: "CV",
  description:
    "The long form: roles, dates, and detail. The conventional view of a decade of product leadership across regulated markets.",
  alternates: { canonical: "/cv" },
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
    dates: "Sep 2025 – Sep 2026",
    location: "Vancouver, BC (Remote)",
    summary:
      "Owned a four-product portfolio (Resolve, the contact-center support platform; Marqeta Dashboard; Marqeta IVR; and Identity & Access Management) for a global card-issuing platform processing billions in annual payment volume.",
    bullets: [
      "Led Resolve from concept to production in under five months: a purpose-built cardholder support portal designed side by side with the design team, informed by direct observation of agent workflows during Coinbase program support.",
      "Expanded Resolve after its first release to support debit, credit, and prepaid programs across payments, collections, disputes, fraud management, and account sub-status management.",
      "Led Resolve's credit expansion across FCRA disputes, collections and delinquency workflows, credit bureau reporting, and TCPA compliance.",
      "Built the automated testing workflow exclusively using Claude Code and Playwright in Terminal.",
      "Presented Resolve's product vision and roadmap to cross-functional leadership across Credit, Operations, and Engineering. Created demo content for BPO transition stakeholders.",
      "Led two cross-functional engineering pods across North America and India; earned an internal impact award within four months of joining.",
      "Managed the Marqeta Dashboard, the primary program-management tool for 400+ businesses and 17,000+ users, including programs run by Uber, Square, Klarna, and Coinbase. Redesigned it for enterprise program managers and defined KPIs for cardholder lifecycle management and settlement tracking.",
      "Led the design of a central, immutable audit log for use across the platform, compliant with PCI DSS, GLBA, and SOC 2.",
      "Owned Identity & Access Management on Auth0: a unified access-management platform with federated identity across Marqeta products, single sign-on, and just-in-time provisioning for program administrators, developers, and support agents. The work included user-access tooling, Self-Service Credential API provisioning, and IVR improvements, including AI agent management.",
    ],
  },
  {
    company: "First City Monument Bank",
    role: "Product Lead, Corporate Banking Solutions",
    dates: "Oct 2024 – Sep 2025",
    location: "Across three time zones (Canada, UK, Nigeria)",
    summary:
      "Led digital transformation of corporate banking across Nigeria and the UK: corporate internet banking, admin tools, core banking (Finacle/Fineract), API architecture, payroll, remittances, FX/trade management. Managed five direct reports across multiple product lines.",
    bullets: [
      "Built and led a team of five PMs: hiring APMs and scoping their features to grow them into full PMs, recruiting Senior PMs who advanced to Lead. Two mentees were promoted within three months of the engagement ending: one to Head of Products for the Retail Banking division, the other to Product Lead for Wealth Management.",
      "Led the design and launch of the CIB platform from scratch, serving 200,000+ SME and enterprise clients across both markets. Streamlined bulk transfers, bill payments, payroll, and FX operations. Monthly transaction volume scaled from ₦200M at alpha to over ₦70B (~$45M USD) within months of launch.",
      "Launched payroll management, FX & trade management, and Rova Business, a business remittance platform serving SME cross-border payments and the gig economy. Built the volume and unit-economics models that underpinned Rova's business case.",
      "Redesigned corporate client onboarding based on drop-off analysis and direct feedback from enterprise treasurers, achieving a 40% reduction in time-to-value. Managed KYC/AML integrations and regulatory compliance across both markets.",
      "Introduced real-time analytics dashboards so corporate treasurers could monitor activity more easily, improving client retention while meeting banking regulations.",
    ],
  },
  {
    company: "Paystack (a Stripe company, YC alum)",
    role: "Product Specialist (Product Management), Key & Strategic Accounts",
    dates: "Jun 2021 – Jan 2025",
    location: "Lagos, Nigeria",
    summary:
      "Managed core payment methods and strategic merchant solutions for Africa's leading payment gateway.",
    bullets: [
      "Managed the development of specialized solutions for Paystack's largest merchants, driving year-on-year 14% revenue growth and 5% net revenue growth.",
      "Expanded Paystack into airline ticketing, contributing to a $7M year-over-year revenue uplift. Built product changes for high-volume ticket purchases and managed relationships with airlines and industry partners.",
      "Collaborated on the launch of Direct Debit for recurring revenue collection, including Central Bank compliance and UX improvements for high-frequency transactions.",
      "Conceptualized a micro-transactions product and drove it to ₦14B (~$30M USD) in annualized transaction volume within 12 months. Payment-flow conversion +17%.",
      "Reduced merchant support tickets by 13% through improved product flows, clearer documentation, and long-term collaboration with key merchants' product teams to co-build and co-integrate solutions.",
    ],
  },
  {
    company: "Farmcrowdy (Techstars Toronto alum)",
    role: "Product Manager",
    dates: "Feb 2019 – Jun 2021",
    location: "Lagos, Nigeria",
    summary:
      "First product hire at the company. Owned the entire product portfolio across mobile (iOS and Android) and web platforms. Field-service software serving distinct personas at once: farmers in the field, the technicians supporting them, and the buyers on the other end.",
    bullets: [
      "Managed three mobile products (Farmers App, Farmcrowdy Foods, Meathub), scaling the Farmers App to 200,000+ users.",
      "Grew a new agricultural community from 3,200 to 25,000 users in under six months against a 12-month mandate through a series of product and distribution changes.",
      "Conducted user research across 29 Nigerian states, travelling physically to farms to interview the farmers and field technicians using the product, and fed it directly into roadmap, pricing, and UI design. Built financial models and vendor management workflows.",
    ],
  },
];

const education = [
  {
    school: "Nigerian University of Technology and Management",
    detail:
      "NUTM Scholars Program · Technology, Entrepreneurship and Design · MasterCard Foundation Scholar",
    year: "2020–2021",
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
    label: "Design & Prototyping",
    items: "Figma, Miro, working prototypes in Claude Code",
  },
  {
    label: "Product & PM",
    items: "Jira, Confluence, Linear, Notion",
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
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20 print:max-w-none print:px-0 print:py-0 print:text-[11px] print:leading-snug">
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
          Product Leader · Product Teams, Digital Experiences & Regulated
          Markets
        </p>
        <p className="mt-4 font-mono text-sm text-muted">
          Vancouver, BC ·{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="underline underline-offset-4 hover:text-accent print:no-underline"
          >
            {EMAIL}
          </a>{" "}
          ·{" "}
          <a
            href="https://linkedin.com/in/ifemora"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-accent print:no-underline"
          >
            linkedin.com/in/ifemora
          </a>
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 print:hidden">
        <BookIntroLink location="cv_header" />
        <PrintButton />
      </div>

      <hr className="my-10 border-t border-rule print:my-3" />

      <section>
        <h2 className="font-serif text-2xl tracking-tight print:text-lg">
          Summary
        </h2>
        <p className="mt-4 leading-relaxed print:mt-2 print:leading-snug">
          Ten years leading product in regulated, operationally messy markets:
          card issuing, corporate banking, agriculture, and the tools that keep
          them running. I have built and led PM teams, coaching product
          managers from associate to lead, and taken products from concept to
          national scale. My approach is consistent: meet customers where they
          work, partner closely with design, and ship in small releases. That
          has taken me from farms in 29 Nigerian states to contact centres
          supporting global card programmes. I also build working prototypes in
          Claude Code so I can test product ideas before asking a team to
          commit to them.
        </p>
        <p className="mt-4 leading-relaxed print:mt-2 print:leading-snug">
          I am now open to Solutions Architect, Customer Success, and Product
          leadership roles, in Vancouver or remote across Canada.
        </p>
      </section>

      <hr className="my-10 border-t border-rule print:my-3" />

      <section>
        <h2 className="font-serif text-2xl tracking-tight print:text-lg">
          Experience
        </h2>
        <div className="mt-6 space-y-10 print:mt-3 print:space-y-3">
          {experiences.map((job) => (
            <article key={`${job.company}-${job.dates}`}>
              <div className="print:break-inside-avoid">
                <h3 className="font-serif text-xl leading-snug tracking-tight print:text-[15px]">
                  {job.role}
                  <span className="text-muted"> · {job.company}</span>
                </h3>
                <p className="mt-1 font-mono text-sm text-muted print:text-[10.5px]">
                  {job.dates} · {job.location}
                </p>
                <p className="mt-3 leading-relaxed print:mt-1.5 print:leading-snug">
                  {job.summary}
                </p>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed marker:text-muted print:mt-1.5 print:space-y-1 print:leading-snug">
                {job.bullets.map((b, i) => (
                  <li key={i} className="print:break-inside-avoid">
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <hr className="my-10 border-t border-rule print:my-3" />

      <section>
        <h2 className="font-serif text-2xl tracking-tight print:text-lg">
          Education
        </h2>
        <ul className="mt-6 space-y-5 print:mt-3 print:space-y-2">
          {education.map((ed) => (
            <li key={ed.school} className="print:break-inside-avoid">
              <p className="font-serif text-lg leading-snug print:text-[14px]">
                {ed.school}
              </p>
              <p className="mt-1 text-sm leading-relaxed print:leading-snug">
                {ed.detail}
              </p>
              <p className="mt-1 font-mono text-sm text-muted print:text-[10.5px]">
                {ed.year}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-10 border-t border-rule print:my-3" />

      <section className="print:break-inside-avoid">
        <h2 className="font-serif text-2xl tracking-tight print:text-lg">
          Certifications
        </h2>
        <p className="mt-4 leading-relaxed print:mt-2">
          Certified Scrum Product Owner (CSPO) · Scrum Alliance · May 2025 –
          May 2027
        </p>
      </section>

      <hr className="my-10 border-t border-rule print:my-3" />

      <section>
        <h2 className="font-serif text-2xl tracking-tight print:text-lg">
          Tools
        </h2>
        <dl className="mt-6 space-y-4 print:mt-3 print:space-y-1.5">
          {toolGroups.map((group) => (
            <div
              key={group.label}
              className="flex flex-col gap-1 sm:flex-row sm:gap-6"
            >
              <dt className="font-mono text-sm text-muted sm:w-44 sm:shrink-0 print:text-[10.5px]">
                {group.label}
              </dt>
              <dd className="leading-relaxed print:leading-snug">
                {group.items}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <hr className="mt-10 border-t border-rule print:hidden" />

      <div className="mt-10 print:hidden">
        <HireMe location="cv_end" />
      </div>

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
