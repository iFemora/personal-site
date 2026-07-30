"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { anatomyEvent } from "@/lib/anatomyTrack";

/** Invisible funnel beacon: fires once when its chapter scrolls into
    view, so drop-off per chapter is measurable from day one. */
export default function ChapterMark({ chapter }: { chapter: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const sent = useRef(false);

  useEffect(() => {
    if (!inView || sent.current) return;
    sent.current = true;
    if (chapter === "outro") {
      anatomyEvent("anatomy_complete");
    } else {
      anatomyEvent("anatomy_chapter", { chapter });
    }
  }, [inView, chapter]);

  return <span ref={ref} aria-hidden />;
}
