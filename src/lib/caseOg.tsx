import { ImageResponse } from "next/og";
import { spiralPath } from "@femora/design-system/spiral-path";
import { ogFonts } from "@/lib/ogFonts";

/* Share card for a case study: the work section's slate teal, the title
   set large, the eyebrow (company and years) as the footer. Each
   src/app/work/<slug>/opengraph-image.tsx is a four-line file that
   calls this with its own strings. */

export const caseOgSize = { width: 1200, height: 630 };
export const caseOgContentType = "image/png";

const TEAL = "#2F5D62";

export async function caseOgImage({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string[];
}) {
  const joined = title.join(" ");
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
            stroke={TEAL}
            strokeWidth={0.5}
            strokeLinecap="round"
          />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
            <path
              d={spiralPath()}
              stroke={TEAL}
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
            A CASE STUDY — FEMI SIJI-KENNETH
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: joined.length > 28 ? 72 : 96,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 1000,
            color: TEAL,
          }}
        >
          {title.map((line) => (
            <div key={line}>{line}</div>
          ))}
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
          <span>{eyebrow}</span>
          <span>ifemora.dev/work</span>
        </div>
      </div>
    ),
    { ...caseOgSize, fonts: await ogFonts() }
  );
}
