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
        },
        {
          label: "What we built",
          paras: [
            "Corporate internet banking across two markets, from scratch: digital onboarding that removed the branch visit, TOTP authentication in place of hardware tokens, transfers with multi-party approval, bulk payments, payroll, FX and trade management, and team management for the people who actually operate a company's money. Onboarding time-to-value fell by 40%.",
          ],
          artifact: <BankingSystemMap />,
        },
        {
          label: "Many personas",
          paras: [
            "The platform served four roles with different permissions and responsibilities. Initiators create payments, approvers authorize them, treasurers monitor cash, and administrators control access. We designed team permissions, multi-party approvals, transaction PINs, and authenticator checks around those responsibilities.",
          ],
        },
        {
          label: "With design",
          paras: [
            "Design and I worked side by side in Figma on the accounts home, statements, send-money flow, and transfer approval chain before a line of code was written. I mapped the workflow logic and built prototypes. Design turned those prototypes into the final interface.",
          ],
        },
      ]}
    />
  );
}
