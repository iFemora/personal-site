import { ImageResponse } from "next/og";
import { spiralPath } from "@femora/design-system/spiral-path";
import { ogFonts } from "@/lib/ogFonts";
import {
  getInternalPosts,
  getInternalPostBySlug,
  formatPostDate,
} from "@/lib/writing";

/* Per-essay share card: the writing section's moss accent instead of the
   house rust, the essay's own title set large, the spiral as the byline. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getInternalPosts().map((p) => ({ slug: p.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getInternalPostBySlug(slug);
  return [{ id: 0, alt: post?.title ?? "Essay", size, contentType }];
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getInternalPostBySlug(slug);
  const title = post?.title ?? "Writing";
  const MOSS = "#5F6E3D";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#FAF7F0",
          color: "#1F1B16",
          fontFamily: "Fraunces",
          position: "relative",
        }}
      >
        <svg
          width="560"
          height="560"
          viewBox="0 0 100 100"
          fill="none"
          style={{ position: "absolute", right: -120, top: 40, opacity: 0.07 }}
        >
          <path
            d={spiralPath(3.6, 13, 1.5)}
            stroke={MOSS}
            strokeWidth={0.5}
            strokeLinecap="round"
          />
        </svg>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
            <path
              d={spiralPath()}
              stroke={MOSS}
              strokeWidth={6}
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              fontFamily: "IBM Plex Mono",
              fontSize: 22,
              letterSpacing: "0.18em",
              color: "#6F675C",
            }}
          >
            AN ESSAY — FEMI SIJI-KENNETH
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 32 ? 64 : 84,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            maxWidth: 980,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontFamily: "IBM Plex Mono",
            fontSize: 22,
            color: "#6F675C",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span>{post ? formatPostDate(post.date) : ""}</span>
          <span>ifemora.dev/writing</span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() }
  );
}
