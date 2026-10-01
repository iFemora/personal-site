import { caseOgImage, caseOgSize, caseOgContentType } from "@/lib/caseOg";

export const alt = "Corporate banking, from scratch — a case study by Femi Siji-Kenneth";
export const size = caseOgSize;
export const contentType = caseOgContentType;

export default function OGImage() {
  return caseOgImage({ eyebrow: "First City Monument Bank · 2024 to 2025", title: ["Corporate banking,", "from scratch"] });
}
