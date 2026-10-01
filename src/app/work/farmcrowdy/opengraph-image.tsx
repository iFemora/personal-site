import { caseOgImage, caseOgSize, caseOgContentType } from "@/lib/caseOg";

export const alt = "Field-service software, learned in the field — a case study by Femi Siji-Kenneth";
export const size = caseOgSize;
export const contentType = caseOgContentType;

export default function OGImage() {
  return caseOgImage({ eyebrow: "Farmcrowdy · 2019 to 2021", title: ["Field-service software,", "learned in the field"] });
}
