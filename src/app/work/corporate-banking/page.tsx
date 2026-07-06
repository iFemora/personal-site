import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";

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
        },
        {
          label: "Many personas",
          paras: [
            "A corporate bank is a multi-persona product wearing one interface. The person who initiates a payment is not the person who approves it, is not the treasurer watching cash flow, is not the admin deciding who may do what. Team management and approval workflows carry that weight: initiator and approver roles, multi-party approval on transfers, and a transaction PIN plus an authenticator standing between intent and money moving.",
          ],
        },
        {
          label: "With design",
          paras: [
            "Design and I worked side by side in Figma: the accounts home, statements, the send-money flow, and the transfer approval chain, mapped end to end before a line of code. My part was the workflow logic and the prototypes; design made it feel like a bank you would trust.",
          ],
        },
      ]}
    />
  );
}
