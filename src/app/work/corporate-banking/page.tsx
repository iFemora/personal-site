import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import BankingSystemMap from "@/components/work/BankingSystemMap";

export const metadata: Metadata = {
  title: "Corporate banking, from scratch",
  description:
    "A corporate internet banking platform for Nigeria and the UK, serving 50,000+ SME and enterprise clients.",
};

export default function CorporateBankingCaseStudy() {
  return (
    <CaseStudy
      eyebrow="First City Monument Bank · 2024 to 2025"
      title={["Corporate banking,", "from scratch"]}
      standfirst="A corporate internet banking platform for Nigeria and the UK, serving 50,000+ SME and enterprise clients."
      sections={[
        {
          label: "The start",
          paras: [
            "FCMB's corporate clients could sign in and look at their transactions. That was the platform. Opening an account meant physically walking into a branch, and onboarding took weeks. Authenticating on the app required a dedicated hardware token the bank had to issue you first.",
          ],
          figures: [
            {
              src: "/work/cib/old-login.png",
              alt: "The old FCMB Online business banking portal: a login form beside promotional banners and a cookie notice.",
              caption: "Where it started — the whole platform was this portal.",
              width: 2976,
              height: 2112,
            },
          ],
        },
        {
          label: "What we built",
          paras: [
            "Corporate internet banking across two markets, from scratch: digital onboarding that removed the branch visit, TOTP authentication in place of hardware tokens, transfers with multi-party approval, bulk payments, payroll, FX and trade management, and team management for the people who actually operate a company's money. Onboarding time-to-value fell by 40%.",
          ],
          artifact: <BankingSystemMap />,
          figures: [
            {
              src: "/work/cib/onboarding-entry.png",
              alt: "Onboarding entry screen offering two paths: set up internet banking for an existing corporate account, or open a new corporate account.",
              caption:
                "Onboarding starts with one question, not a branch visit.",
              width: 1440,
              height: 900,
            },
            {
              src: "/work/cib/two-factor.png",
              alt: "Two-factor authentication setup screen with an authenticator QR code.",
              caption: "TOTP replaced the hardware token the bank had to issue.",
              width: 2880,
              height: 1800,
            },
          ],
        },
        {
          label: "Moving money",
          paras: [
            "Corporate payments carry more weight than retail ones: higher values, FX legs, and several people who must agree before money leaves. The send-money flow shows every charge before you commit, down to who bears the offshore charge on an international transfer, and a bulk payment carries a whole payroll in one submission.",
          ],
          figures: [
            {
              src: "/work/cib/fx-fees.png",
              alt: "International payment form with an expanded fee breakdown: commission, VAT, telex, offshore and minimum charges, and a choice of who bears the offshore charge.",
              caption:
                "Every charge itemised before you commit — including who bears it.",
              width: 1440,
              height: 1668,
            },
            {
              src: "/work/cib/bulk-review.png",
              alt: "Review screen for a bulk staff payroll payment to 25 recipients, showing the multi-party approval chain it will pass through: treasury, then compliance, then the CFO.",
              caption:
                "One payroll, 25 recipients, and the approval chain it must survive.",
              width: 2880,
              height: 1800,
            },
          ],
        },
        {
          label: "Many personas",
          paras: [
            "The platform served four roles with different permissions and responsibilities. Initiators create payments, approvers authorize them, treasurers monitor cash, and administrators control access. We designed team permissions, multi-party approvals, transaction PINs, and authenticator checks around those responsibilities.",
            "Governance is the half of corporate banking nobody sees in a screenshot of a transfer: who may act, what they may approve, and a record of everything they did.",
          ],
          figures: [
            {
              src: "/work/cib/team-people.png",
              alt: "Team members list showing each person's role, last login, and two-factor authentication status.",
              caption: "The team, with 2FA status a column, not a setting.",
              width: 1440,
              height: 900,
            },
            {
              src: "/work/cib/roles.png",
              alt: "Roles screen listing default roles alongside a custom role created by the client.",
              caption: "Default roles, plus custom ones clients define.",
              width: 1440,
              height: 900,
            },
            {
              src: "/work/cib/approval-rules.png",
              alt: "Approval rules list: utility payments, international payments, high-value transfers, and scheduled payments, each with its own rule and status.",
              caption: "Approval rules by payment type and value.",
              width: 2880,
              height: 1784,
            },
            {
              src: "/work/cib/activity-log.png",
              alt: "Activity log recording who did what, when, and from where, including declined payment requests and team changes.",
              caption: "Every action logged: who, what, when, from where.",
              width: 2880,
              height: 1810,
            },
          ],
        },
        {
          label: "With design",
          paras: [
            "Design and I worked side by side in Figma on the accounts home, statements, send-money flow, and transfer approval chain before a line of code was written. I mapped the workflow logic and built prototypes. Design turned those prototypes into the final interface.",
            "The screens on this page are from those design files, shown with sample data.",
          ],
        },
      ]}
    />
  );
}
