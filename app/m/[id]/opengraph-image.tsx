import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MEVITE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#E8470A";
const BG = "#F5EFE6";

async function getMeviteData(id: string) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!projectId || !apiKey) return null;
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const { fields: f } = await res.json();
    if (!f) return null;
    return {
      sender:   f.sender?.stringValue   || f.who?.stringValue || "",
      bringing: f.bringing?.stringValue || "",
      why:      f.why?.stringValue      || "",
      when:     f.when?.stringValue     || "",
    };
  } catch { return null; }
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mevite = await getMeviteData(id);

  const sender   = mevite?.sender   || "Someone";
  const when     = mevite?.when     || "";
  const bringing = mevite?.bringing || "";
  const why      = mevite?.why      || "";

  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630, display: "flex",
        background: BG, position: "relative",
        fontFamily: fontData ? "Inter" : "system-ui",
      }}>
        {/* Door illustration — pure SVG, no image fetch */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Warm glow on floor */}
          <div style={{
            position: "absolute", bottom: 0, left: 40, right: 0, height: 260,
            background: "radial-gradient(ellipse 80% 60% at 60% 100%, rgba(232,71,10,0.25) 0%, transparent 70%)",
            display: "flex",
          }} />
          {/* Door frame */}
          <div style={{
            position: "absolute", right: 60, top: 60,
            width: 280, height: 420,
            border: `14px solid ${ORANGE}`,
            background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `inset 0 0 80px rgba(232,71,10,0.15), 0 0 60px rgba(232,71,10,0.2)`,
          }}>
            {/* Knob */}
            <div style={{
              position: "absolute", left: 28, top: "48%",
              width: 16, height: 16, borderRadius: "50%",
              background: "#333",
              display: "flex",
            }} />
          </div>
          {/* Door panel (open, perspective) */}
          <div style={{
            position: "absolute", right: 74 + 140, top: 74,
            width: 110, height: 392,
            background: ORANGE,
            transformOrigin: "left center",
            transform: "perspective(400px) rotateY(-40deg)",
            display: "flex",
          }} />
        </div>

        {/* Left content */}
        <div style={{
          position: "absolute", left: 72, top: 52, bottom: 52, width: 600,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>{sender}</span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>is coming</span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>
              over<span style={{ color: ORANGE }}>.</span>
            </span>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {when ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 28, height: 28, border: `2px solid ${ORANGE}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 12, height: 10, borderTop: `2px solid ${ORANGE}`, display: "flex" }} />
                </div>
                <span style={{ fontSize: 25, fontWeight: 600, color: "#222" }}>{when}</span>
              </div>
            ) : null}
            {bringing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 28, height: 28, border: `2px solid ${ORANGE}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} />
                <span style={{ fontSize: 25, fontWeight: 600, color: "#222" }}>Bringing: {bringing}</span>
              </div>
            ) : null}
            {why ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 25, fontWeight: 600, color: "#222", fontStyle: "italic" }}>"{why}"</span>
                <span style={{ fontSize: 19, fontWeight: 500, color: "#888" }}>– {sender}</span>
              </div>
            ) : null}
          </div>

          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.06em", color: "#111" }}>MEVITE</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
