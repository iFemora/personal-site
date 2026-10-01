import { caseOgImage, caseOgSize, caseOgContentType } from "@/lib/caseOg";

export const alt = "Resolve — a case study by Femi Siji-Kenneth";
export const size = caseOgSize;
export const contentType = caseOgContentType;

export default function OGImage() {
  return caseOgImage({ eyebrow: "Marqeta · 2025 – 2026", title: ["Resolve"] });
}
