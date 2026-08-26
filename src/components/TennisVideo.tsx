"use client";

import { useRef } from "react";
import { trackEvent } from "@/lib/track";

type Props = {
  src: string;
  poster?: string;
};

export default function TennisVideo({ src, poster }: Props) {
  const playTrackedRef = useRef(false);

  return (
    <video
      src={src}
      poster={poster}
      controls
      preload="metadata"
      playsInline
      className="w-full rounded-sm"
      onPlay={() => {
        // First play only — resumes after pause shouldn't recount.
        if (playTrackedRef.current) return;
        playTrackedRef.current = true;
        trackEvent("tennis_video_play", {
          video_id: src.split("/").pop() ?? src,
        });
      }}
    />
  );
}
