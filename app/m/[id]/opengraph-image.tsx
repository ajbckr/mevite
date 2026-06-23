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
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`,
      { cache: "no-store", signal: controller.signal }
    );
    if (!res.ok) return null;
    const { fields: f } = await res.json();
    if (!f) return null;
    return {
      sender:   f.sender?.stringValue || f.who?.stringValue || "",
      bringing: f.bringing?.stringValue || "",
      why:      f.why?.stringValue || "",
      when:     f.when?.stringValue || "",
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

  // Load Inter 900 from public URL — small woff2, fast at edge
  const fontRes = await fetch(`${BASE}/inter-900.woff2`);
  const font900 = fontRes.ok ? await fontRes.arrayBuffer() : null;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative", fontFamily: "Inter" }}>

        {/* Plate via URL — ImageResponse resolves this natively */}
        <img src={`${BASE}/og-plate.jpg`} style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover" }} />

        {/* Text overlay */}
        <div style={{
          position: "absolute",
          left: 72, top: 48, bottom: 48, width: 590,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.88, letterSpacing: "-0.04em" }}>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", fontFamily: "Inter" }}>{sender}</span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", fontFamily: "Inter" }}>is coming</span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", fontFamily: "Inter" }}>
              over<span style={{ color: ORANGE }}>.</span>
            </span>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {when ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <rect x="2" y="5" width="26" height="23" rx="3" fill={ORANGE} opacity="0.2" stroke={ORANGE} strokeWidth="2.2"/>
                  <path d="M2 12h26" stroke={ORANGE} strokeWidth="2.2"/>
                  <path d="M9 2v5M21 2v5" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 26, fontWeight: 600, color: "#111", fontFamily: "Inter" }}>{when}</span>
              </div>
            ) : null}
            {bringing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="10" r="5.5" fill={ORANGE} opacity="0.2" stroke={ORANGE} strokeWidth="2.2"/>
                  <path d="M4 28c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 26, fontWeight: 600, color: "#111", fontFamily: "Inter" }}>Bringing: {bringing}</span>
              </div>
            ) : null}
            {why ? (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" style={{ marginTop: 3, flexShrink: 0 }}>
                  <path d="M15 3C8.37 3 3 7.925 3 14c0 2.34.78 4.51 2.1 6.3L3 27l7.2-1.8A12.8 12.8 0 0015 25c6.63 0 12-4.925 12-11S21.63 3 15 3z" fill={ORANGE} opacity="0.2" stroke={ORANGE} strokeWidth="2.2" strokeLinejoin="round"/>
                  <circle cx="10" cy="14" r="1.8" fill={ORANGE}/>
                  <circle cx="15" cy="14" r="1.8" fill={ORANGE}/>
                  <circle cx="20" cy="14" r="1.8" fill={ORANGE}/>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 26, fontWeight: 600, color: "#111", fontFamily: "Inter", fontStyle: "italic" }}>"{why}"</span>
                  <span style={{ fontSize: 20, fontWeight: 500, color: "#666", fontFamily: "Inter" }}>– {sender}</span>
                </div>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    ),
    {
      ...size,
      fonts: font900 ? [{ name: "Inter", data: font900, weight: 900, style: "normal" as const }] : [],
    }
  );
}
