"use client";

import { useState } from "react";
import Image from "next/image";
import type { StudioVideo } from "@/lib/studio";
import { trackEvent } from "@/lib/track";

type Props = {
  video: StudioVideo;
  title: string;
  poster: { src: string; alt: string; width: number; height: number };
  /** Analytics label. */
  id: string;
};

function embedSrc(video: StudioVideo): string {
  if (video.provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
  }
  return `https://player.vimeo.com/video/${video.id}?autoplay=1&badge=0&byline=0&portrait=0&title=0&dnt=1`;
}

/**
 * A poster with a play button; the third-party player only loads once
 * someone asks for it. The poster sits duotone like every other frame
 * on the site and floods to colour on hover.
 */
export default function VideoEmbed({ video, title, poster, id }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-rule bg-foreground/[0.04]">
      {playing ? (
        <iframe
          src={embedSrc(video)}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            trackEvent("studio_video_play", { label: id });
          }}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 block h-full w-full cursor-pointer text-left"
        >
          <Image
            src={poster.src}
            alt={poster.alt}
            width={poster.width}
            height={poster.height}
            sizes="(max-width: 640px) 100vw, 860px"
            className="block h-full w-full object-cover transition-[filter,transform] duration-500 ease-out grayscale-[0.85] sepia-[0.12] group-hover:scale-[1.015] group-hover:grayscale-0 group-hover:sepia-0"
          />
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-background/80 to-transparent px-5 pb-4 pt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">
            <span className="inline-flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-background"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M3 1.5v9l7-4.5z" />
                </svg>
              </span>
              <span className="text-accent">Play</span>
            </span>
            {video.duration && (
              <span className="text-muted">{video.duration}</span>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
