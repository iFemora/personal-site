"use client";

import { sendGAEvent } from "@next/third-parties/google";

/** The CV as a file. public/cv/femi-siji-kenneth.pdf is produced by
    `npm run cv:pdf` after any change to src/app/cv/page.tsx. */
export const CV_PDF = "/cv/femi-siji-kenneth.pdf";

export default function PrintButton() {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <a
        href={CV_PDF}
        download="Femi Siji-Kenneth CV.pdf"
        onClick={() => sendGAEvent("event", "cv_download", { label: "pdf" })}
        className="text-accent underline underline-offset-4 hover:no-underline"
      >
        Download as PDF →
      </a>
      <button
        type="button"
        onClick={() => {
          sendGAEvent("event", "cv_download", { label: "print" });
          window.print();
        }}
        className="text-muted underline underline-offset-4 hover:text-accent hover:no-underline"
      >
        Print
      </button>
    </span>
  );
}
