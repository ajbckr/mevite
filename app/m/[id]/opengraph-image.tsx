import { ImageResponse } from "next/og";

export const runtime = "nodejs";
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
  } catch (e) {
    console.error("OG fetch error:", e);
    return null;
  }
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mevite = await getMeviteData(id);

  const sender   = mevite?.sender   || "Someone";
  const when     = mevite?.when     || "";
  const bringing = mevite?.bringing || "";
  const why      = mevite?.why      || "";

  // Load Inter font
  const fontRes = await fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2");
  const fontBold = fontRes.ok ? await fontRes.arrayBuffer() : null;

  // Load background plate
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
      }}>
        {/* Background plate — door + wordmark already in it */}
        {plateB64 && (
          <img src={plateB64} style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}

        {/* Text overlay — left column only */}
        <div style={{
          position: "absolute",
          left: 64, top: 48, bottom: 48,
          width: 580,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em", fontFamily: "Inter" }}>
              {sender}
            </span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em", fontFamily: "Inter" }}>
              is coming
            </span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em", fontFamily: "Inter", display: "flex", alignItems: "flex-end" }}>
              over<span style={{ color: ORANGE, fontFamily: "Inter" }}>.</span>
            </span>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingBottom: 8 }}>
            {when && (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Calendar — clean flat */}
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <rect x="2" y="6" width="26" height="22" rx="3" fill={ORANGE} opacity="0.15"/>
                  <rect x="2" y="6" width="26" height="22" rx="3" stroke={ORANGE} strokeWidth="2"/>
                  <line x1="2" y1="12" x2="28" y2="12" stroke={ORANGE} strokeWidth="2"/>
                  <line x1="9" y1="3" x2="9" y2="9" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"/>
                  <line x1="21" y1="3" x2="21" y2="9" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter", letterSpacing: "-0.01em" }}>{when}</span>
              </div>
            )}
            {bringing && (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Person — clean flat */}
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="10" r="5.5" fill={ORANGE} opacity="0.15" stroke={ORANGE} strokeWidth="2"/>
                  <path d="M4 27c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter", letterSpacing: "-0.01em" }}>Bringing: {bringing}</span>
              </div>
            )}
            {why && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                {/* Speech bubble — clean flat */}
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" style={{ marginTop: 4, flexShrink: 0 }}>
                  <path d="M15 3C8.373 3 3 7.925 3 14c0 2.34.78 4.51 2.1 6.3L3 27l7.2-1.8A12.8 12.8 0 0015 25c6.627 0 12-4.925 12-11S21.627 3 15 3z" fill={ORANGE} opacity="0.15" stroke={ORANGE} strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="10" cy="14" r="1.5" fill={ORANGE}/>
                  <circle cx="15" cy="14" r="1.5" fill={ORANGE}/>
                  <circle cx="20" cy="14" r="1.5" fill={ORANGE}/>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter", letterSpacing: "-0.01em", fontStyle: "italic" }}>
                    &ldquo;{why}&rdquo;
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 500, color: "#888", fontFamily: "Inter" }}>– {sender}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontBold ? [{ name: "Inter", data: fontBold, weight: 900, style: "normal" }] : [],
    }
  );
}
