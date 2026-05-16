import { ImageResponse } from "next/og";

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
          background: "#FAFAF7",
          color: "#1A1A1A",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            background: "#8B3A1F",
            color: "#FAFAF7",
            fontSize: 44,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            borderRadius: 10,
          }}
        >
          F
        </div>

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
              color: "#6B6B6B",
            }}
          >
            Thinker. Tinkerer.
          </div>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 22,
            color: "#6B6B6B",
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
