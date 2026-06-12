import { ImageResponse } from "next/og";
import { spiralPath } from "@/lib/spiralPath";

export const alt = "Femi Siji-Kenneth — Thinker. Tinkerer.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Ghost spiral, echoing the site's background weather */}
        <svg
          width="560"
          height="560"
          viewBox="0 0 100 100"
          fill="none"
          style={{ position: "absolute", right: -120, top: 40, opacity: 0.07 }}
        >
          <path
            d={spiralPath(3.6, 13, 1.5)}
            stroke="#9A3B1E"
            strokeWidth={0.5}
            strokeLinecap="round"
          />
        </svg>

        <svg width="72" height="72" viewBox="0 0 100 100" fill="none">
          <path
            d={spiralPath()}
            stroke="#9A3B1E"
            strokeWidth={6}
            strokeLinecap="round"
          />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Femi Siji-Kenneth
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 40,
              fontStyle: "italic",
              color: "#6F675C",
            }}
          >
            Thinker. Tinkerer.
          </div>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 22,
            color: "#6F675C",
            display: "flex",
            gap: 16,
          }}
        >
          <span>Toronto</span>
          <span>·</span>
          <span>Product · Payments · Essays</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
