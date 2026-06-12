import { ImageResponse } from "next/og";
import { spiralPath } from "@/lib/spiralPath";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#9A3B1E",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <path
            d={spiralPath()}
            stroke="#FAF7F0"
            strokeWidth={6}
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
