import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MEVITE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#E8470A";
const BASE = "https://mevite.vercel.app";

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

export default async function OGImage({ params }: { params: { id: string } }) {
  const mevite = await getMeviteData(params.id);

  const sender   = mevite?.sender   || "Someone";
  const when     = mevite?.when     || "";
  const bringing = mevite?.bringing || "";
  const why      = mevite?.why      || "";

  // Load the background plate
  const plateRes = await fetch(`${BASE}/og-plate.png`);
  const plateB64 = plateRes.ok
    ? `data:image/png;base64,${Buffer.from(await plateRes.arrayBuffer()).toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630,
        display: "flex",
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>

        {/* Background plate — door + wordmark already composited */}
        {plateB64 && (
          <img src={plateB64} style={{ position: "absolute", inset: 0, width: 1200, height: 630 }} />
        )}

        {/* Dynamic text layer — left column */}
        <div style={{
          position: "absolute",
          left: 64, top: 52, bottom: 52,
          width: 620,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.92, letterSpacing: "-0.03em" }}>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111" }}>{sender}</span>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111" }}>is coming</span>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111" }}>
              over<span style={{ color: ORANGE }}>.</span>
            </span>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {when && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="5" width="24" height="20" rx="3" stroke={ORANGE} strokeWidth="2.2" fill="none"/>
                  <path d="M2 11h24" stroke={ORANGE} strokeWidth="2.2"/>
                  <path d="M8 2v4M20 2v4" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 24, fontWeight: 600, color: "#222" }}>{when}</span>
              </div>
            )}
            {bringing && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="9" r="5" stroke={ORANGE} strokeWidth="2.2" fill="none"/>
                  <path d="M4 25c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                </svg>
                <span style={{ fontSize: 24, fontWeight: 600, color: "#222" }}>Bringing: {bringing}</span>
              </div>
            )}
            {why && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginTop: 3, flexShrink: 0 }}>
                  <path d="M14 3a11 11 0 100 18.9L24 25l-1.5-5.5A11 11 0 0014 3z" stroke={ORANGE} strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
                  <circle cx="10" cy="14" r="1.5" fill={ORANGE}/>
                  <circle cx="14" cy="14" r="1.5" fill={ORANGE}/>
                  <circle cx="18" cy="14" r="1.5" fill={ORANGE}/>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 24, fontWeight: 600, color: "#222", fontStyle: "italic" }}>&ldquo;{why}&rdquo;</span>
                  <span style={{ fontSize: 20, color: "#888" }}>– {sender}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    ),
    { ...size }
  );
}
