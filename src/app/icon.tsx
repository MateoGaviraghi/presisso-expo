import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#C0160E",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "22px",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: 108,
          fontWeight: 900,
          fontFamily: "serif",
          letterSpacing: "-4px",
          marginTop: "12px",
        }}
      >
        p.
      </span>
    </div>,
    { ...size },
  );
}
