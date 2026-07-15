import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import NigeriaFieldMap from "@/components/work/NigeriaFieldMap";

export const metadata: Metadata = {
  title: "Field-service software, learned in the field",
  description:
    "Three mobile apps and a web platform for farmers, technicians, and buyers, researched in person across 29 Nigerian states.",
};

export default function FarmcrowdyCaseStudy() {
  return (
    <CaseStudy
      eyebrow="Farmcrowdy · 2019 to 2021"
      title={["Field-service software,", "learned in the field"]}
      standfirst="First product hire. Three mobile apps and a web platform for farmers, technicians, and buyers, researched across 29 Nigerian states."
      sections={[
        {
          label: "Go to the field",
          paras: [
            "The roadmap questions could not be answered from Lagos. I travelled across 29 states to sit with the farmers and field technicians using the products. Each visit changed something in the roadmap. The most important finding was simple: many farmers did not own smartphones.",
          ],
          artifact: <NigeriaFieldMap />,
        },
        {
          label: "Design around it",
          paras: [
            "We added ways to use the service without a smartphone. We introduced SMS intake: text what you need and when you need it to a number, and it lands in our database for dispatch. We introduced micro-payment plans so a farmer could buy a smartphone in instalments, and for those who couldn't, we supplied the phone and recovered the cost gradually from the harvest revenue we helped generate.",
            "Our users wrote to us in Pidgin, Yoruba, and Igbo, so staff translated the content manually, in house.",
          ],
        },
        {
          label: "Growth in steps",
          paras: [
            "AgriSquare, the community platform for agricultural enthusiasts, grew from 3,200 to 25,000 users in under six months against a twelve-month mandate. Growth came from direct outreach, partnerships, universities, conferences, technicians, and local government relationships. Those channels added users steadily.",
          ],
        },
        {
          label: "The one that failed",
          paras: [
            "Meathub failed even though the app worked. We never solved cold-chain delivery, so the product failed at fulfilment. Farmcrowdy later closed for operational reasons too. Both taught me to test the operating model as seriously as the software.",
          ],
        },
        {
          label: "Persona tension",
          paras: [
            "Farmers, technicians, students, and professionals used the same platform for different reasons. The user base grew, but interaction between those groups stayed low. Since then, I ask early whether the personas in a shared product genuinely need one another.",
          ],
        },
      ]}
    />
  );
}
