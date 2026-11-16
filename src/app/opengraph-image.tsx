import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#07080B",
          backgroundImage:
            "radial-gradient(circle at 18% 10%, rgba(124,92,255,0.55), transparent 45%), radial-gradient(circle at 85% 90%, rgba(34,211,238,0.35), transparent 45%)",
          color: "#EDEEF2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "radial-gradient(circle at 35% 30%, #B9A8FF, #7C5CFF 45%, #22D3EE)",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02 }}>
            <span>Know&nbsp;</span>
            <span style={{ backgroundImage: "linear-gradient(90deg, #7C5CFF, #22D3EE)", backgroundClip: "text", color: "transparent" }}>
              why
            </span>
            <span>&nbsp;your</span>
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02 }}>numbers moved.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#8A8F98" }}>{site.tagline}</div>
        </div>

        <div
          style={{
            height: 6,
            width: "100%",
            borderRadius: 999,
            backgroundImage: "linear-gradient(90deg, #7C5CFF, #22D3EE)",
          }}
        />
      </div>
    ),
    size,
  );
}
