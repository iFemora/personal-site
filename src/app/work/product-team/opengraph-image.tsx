import { caseOgImage, caseOgSize, caseOgContentType } from "@/lib/caseOg";

export const alt = "Making a bank product-led — a case study by Femi Siji-Kenneth";
export const size = caseOgSize;
export const contentType = caseOgContentType;

export default function OGImage() {
  return caseOgImage({ eyebrow: "FCMB · 2024 to 2025", title: ["Making a bank", "product-led"] });
}
