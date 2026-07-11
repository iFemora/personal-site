"use client";

import { sendGAEvent } from "@next/third-parties/google";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        sendGAEvent("event", "cv_download", { label: "cv" });
        window.print();
      }}
      className="text-sm text-accent underline underline-offset-4 hover:no-underline"
    >
      Download as PDF →
    </button>
  );
}
