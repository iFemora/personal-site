import { ImageResponse } from "next/og";
import { spiralPath } from "@femora/design-system/spiral-path";
import { ogFonts } from "@/lib/ogFonts";

/* The page's own share card, in its banknote green, so a link to the
   model unfurls as the model and not as the home card. The simulator
   route inherits it. */

export const alt =
  "Follow the Money — a working model of card payments by Femi Siji-Kenneth. Six acts, playable.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GREEN = "#2E6B47";

export default async function OGImage() {
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
            stroke={GREEN}
            strokeWidth={0.5}
            strokeLinecap="round"
          />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
            <path d={spiralPath()} stroke={GREEN} strokeWidth={6} strokeLinecap="round" />
          </svg>
          <div
            style={{
              fontFamily: "IBM Plex Mono",
              fontSize: 22,
              letterSpacing: "0.18em",
              color: "#6F675C",
            }}
          >
            A WORKING MODEL — FEMI SIJI-KENNETH
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: GREEN,
            }}
          >
            <div>Follow</div>
            <div>the money</div>
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 34,
              fontStyle: "italic",
              color: "#6F675C",
              maxWidth: 900,
            }}
          >
            Where is the money right now, and who is on the hook?
          </div>
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
          <span>Six acts, playable</span>
          <span>ifemora.dev/follow-the-money</span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() }
  );
}
