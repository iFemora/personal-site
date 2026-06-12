import { ImageResponse } from "next/og";
import { spiralPath } from "@/lib/spiralPath";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF7F0",
          borderRadius: 7,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
          <path
            d={spiralPath()}
            stroke="#9A3B1E"
            strokeWidth={7}
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
