import { ImageResponse } from "next/og";

export const alt = "Dealwijs — deal-analyse voor NL vastgoed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#f7f4ed",
          backgroundImage: "radial-gradient(ellipse 80% 60% at 15% 0%, rgba(29,107,79,0.12), transparent 60%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontSize: 96, fontWeight: 700, color: "#14503a", letterSpacing: "-2px" }}>
            Dealwijs
          </div>
          <div
            style={{
              transform: "rotate(-5deg)",
              border: "6px solid #1d6b4f",
              borderRadius: 12,
              color: "#1d6b4f",
              backgroundColor: "#e4f0e7",
              padding: "6px 22px",
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: "6px",
            }}
          >
            GO
          </div>
        </div>
        <div style={{ marginTop: 28, fontSize: 38, color: "#46544c", maxWidth: 900, lineHeight: 1.35 }}>
          Is deze woning een goede deal? Kosten, marge en rendement ná belasting —
          onder de regels van 2026.
        </div>
        <div style={{ marginTop: 44, display: "flex", gap: 14, fontSize: 24, color: "#74807a" }}>
          <div style={{ border: "1px solid #d8d2c4", borderRadius: 999, padding: "8px 22px" }}>8% overdrachtsbelasting</div>
          <div style={{ border: "1px solid #d8d2c4", borderRadius: 999, padding: "8px 22px" }}>Box 3 op WOZ</div>
          <div style={{ border: "1px solid #d8d2c4", borderRadius: 999, padding: "8px 22px" }}>Wet betaalbare huur</div>
        </div>
      </div>
    ),
    size,
  );
}
