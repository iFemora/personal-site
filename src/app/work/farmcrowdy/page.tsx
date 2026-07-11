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
            "The roadmap questions could not be answered from Lagos. I travelled across 30 states to sit with the farmers and field technicians using the products, and the field kept correcting my assumptions. The biggest correction: many farmers didn't own smartphones. Not couldn't use. Didn't own.",
          ],
          artifact: <NigeriaFieldMap />,
        },
        {
          label: "Design around it",
          paras: [
            "So the product met them where they were. We introduced SMS intake: text what you need and when you need it to a number, and it lands in our database for dispatch. We introduced micro-payment plans so a farmer could buy a smartphone in instalments, and for those who couldn't, we supplied the phone and recovered the cost gradually from the harvest revenue we helped generate.",
            "And because our users wrote to us in Pidgin, Yoruba, and Igbo, we translated. Manually, in-house, long before AI made that cheap. Localization was people.",
          ],
        },
        {
          label: "Growth in steps",
          paras: [
            "AgriSquare, the greenfield community platform for agricultural enthusiasts, grew from 3,200 to 25,000 users in under six months against a twelve-month mandate. There was no growth hack. I went where the enthusiasts already were: the farms I was visiting anyway, local-government farmer databases we could reach by SMS, university agriculture departments, agricultural conferences. Small additions, steadily compounding.",
          ],
        },
        {
          label: "The one that failed",
          paras: [
            "Meathub was the beautiful app that didn't work. We built the software well and never solved cold-chain logistics, so the launch failed on delivery, not on design. Farmcrowdy itself eventually folded on operational grounds, even where the digital products were figured out. I keep that lesson close: software is usually the part you can control, and rarely the part that kills you.",
          ],
        },
        {
          label: "Persona tension",
          paras: [
            "Farmers, technicians, students, and professionals shared one platform and did not share a language, literally or otherwise. The platform grew large; the cross-group interactions never matched its size. Multi-persona products live or die on whether the personas actually need each other. I have carried that test into every multi-persona product since.",
          ],
        },
      ]}
    />
  );
}
