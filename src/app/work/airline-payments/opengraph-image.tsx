import { caseOgImage, caseOgSize, caseOgContentType } from "@/lib/caseOg";

export const alt = "Pay by reference — a case study by Femi Siji-Kenneth";
export const size = caseOgSize;
export const contentType = caseOgContentType;

export default function OGImage() {
  return caseOgImage({ eyebrow: "Paystack · 2021 to 2024", title: ["Pay by reference"] });
}
