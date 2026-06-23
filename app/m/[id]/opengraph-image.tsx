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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`,
      { cache: "no-store", signal: controller.signal }
    );
    clearTimeout(timeout);
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
        fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
      }}>
        {/* Door illustration */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 540, display: "flex" }}>
          {/* Warm floor glow */}
          <div style={{
            position: "absolute", bottom: 0, left: 20, right: 0, height: 320,
            background: `radial-gradient(ellipse 90% 60% at 50% 100%, rgba(232,71,10,0.35) 0%, rgba(232,71,10,0.12) 50%, transparent 75%)`,
            display: "flex",
          }} />
          {/* Open door panel — perspective foreshortened left side */}
          <div style={{
            position: "absolute", right: 330, top: 50,
            width: 80, height: 420,
            background: `linear-gradient(to right, rgba(180,60,0,0.9), ${ORANGE})`,
            display: "flex",
          }} />
          {/* Door frame */}
          <div style={{
            position: "absolute", right: 50, top: 50,
            width: 300, height: 440,
            border: `18px solid ${ORANGE}`,
            background: "rgba(255,255,255,0.98)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 80px rgba(232,71,10,0.25), inset 0 0 40px rgba(232,71,10,0.08)`,
          }}>
            {/* Knob */}
            <div style={{
              position: "absolute", left: 20, top: "50%",
              width: 16, height: 16, borderRadius: "50%", background: "#222",
              display: "flex",
            }} />
          </div>
        </div>

        {/* Left text */}
        <div style={{
          position: "absolute", left: 72, top: 52, bottom: 52, width: 590,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>{sender}</span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>is coming</span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>
              over<span style={{ color: ORANGE }}>.</span>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {when ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 26, height: 26, border: `2.5px solid ${ORANGE}`, borderRadius: 5, flexShrink: 0, display: "flex" }} />
                <span style={{ fontSize: 24, fontWeight: 700, color: "#222" }}>{when}</span>
              </div>
            ) : null}
            {bringing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 26, height: 26, border: `2.5px solid ${ORANGE}`, borderRadius: "50%", flexShrink: 0, display: "flex" }} />
                <span style={{ fontSize: 24, fontWeight: 700, color: "#222" }}>Bringing: {bringing}</span>
              </div>
            ) : null}
            {why ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: "#222", fontStyle: "italic" }}>"{why}"</span>
                <span style={{ fontSize: 18, fontWeight: 500, color: "#888" }}>– {sender}</span>
              </div>
            ) : null}
          </div>

          <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "0.08em", color: "#111" }}>MEVITE</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
