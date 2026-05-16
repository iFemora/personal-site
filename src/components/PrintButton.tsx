"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm text-accent underline underline-offset-4 hover:no-underline"
    >
      Download as PDF →
    </button>
  );
}
