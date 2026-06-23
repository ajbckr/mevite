import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MEVITE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#E8470A";
const BG = "#F5EFE6";
const BASE = "https://mevite.vercel.app";

async function getMeviteData(id: string) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!projectId || !apiKey) return null;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.fields;
    if (!f) return null;
    return {
      sender:   f.sender?.stringValue   || f.who?.stringValue || "",
      bringing: f.bringing?.stringValue || "",
      why:      f.why?.stringValue      || "",
      when:     f.when?.stringValue     || "",
    };
  } catch {
    return null;
  }
}

export default async function OGImage({ params }: { params: { id: string } }) {
  const mevite = await getMeviteData(params.id);

  const sender   = mevite?.sender   || "Someone";
  const when     = mevite?.when     || "";
  const bringing = mevite?.bringing || "";
  const why      = mevite?.why      || "";

  // Fetch images from hardcoded production URL — reliable at edge
  const [doorRes, wordmarkRes] = await Promise.all([
    fetch(`${BASE}/og-door.png`),
    fetch(`${BASE}/mevite-wordmark.png`),
  ]);

  const doorB64     = doorRes.ok
    ? `data:image/png;base64,${Buffer.from(await doorRes.arrayBuffer()).toString("base64")}`
    : null;
  const wordmarkB64 = wordmarkRes.ok
    ? `data:image/png;base64,${Buffer.from(await wordmarkRes.arrayBuffer()).toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630,
        background: BG,
        display: "flex",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Door image — right half */}
        {doorB64 && (
          <img
            src={doorB64}
            style={{
              position: "absolute",
              right: 0, top: 0,
              width: 560, height: 630,
              objectFit: "cover",
              objectPosition: "left center",
            }}
          />
        )}

        {/* Fade left edge of door into bg */}
        <div style={{
          position: "absolute",
          left: 360, top: 0, bottom: 0, width: 280,
          background: `linear-gradient(to right, ${BG} 0%, transparent 100%)`,
          display: "flex",
        }} />

        {/* Left content column */}
        <div style={{
          position: "absolute",
          left: 64, top: 0, bottom: 0, width: 660,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 0 50px",
        }}>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span style={{ fontSize: 104, fontWeight: 900, color: "#111", lineHeight: 0.9, letterSpacing: "-0.03em" }}>
              {sender}
            </span>
            <span style={{ fontSize: 104, fontWeight: 900, color: "#111", lineHeight: 0.9, letterSpacing: "-0.03em" }}>
              is coming
            </span>
            <span style={{ fontSize: 104, fontWeight: 900, color: "#111", lineHeight: 0.9, letterSpacing: "-0.03em" }}>
              over<span style={{ color: ORANGE }}>.</span>
            </span>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {when && (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="5" width="24" height="20" rx="3" stroke={ORANGE} strokeWidth="2.2" fill="none"/>
                  <path d="M2 11h24" stroke={ORANGE} strokeWidth="2.2"/>
                  <path d="M8 2v4M20 2v4" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 24, fontWeight: 600, color: "#222" }}>{when}</span>
              </div>
            )}
            {bringing && (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="9" r="5" stroke={ORANGE} strokeWidth="2.2" fill="none"/>
                  <path d="M4 25c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                </svg>
                <span style={{ fontSize: 24, fontWeight: 600, color: "#222" }}>Bringing: {bringing}</span>
              </div>
            )}
            {why && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none" style={{ marginTop: 3, flexShrink: 0 }}>
                  <path d="M14 3a11 11 0 100 18.9L24 25l-1.5-5.5A11 11 0 0014 3z" stroke={ORANGE} strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
                  <circle cx="10" cy="14" r="1.5" fill={ORANGE}/>
                  <circle cx="14" cy="14" r="1.5" fill={ORANGE}/>
                  <circle cx="18" cy="14" r="1.5" fill={ORANGE}/>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 600, color: "#222", fontStyle: "italic" }}>&ldquo;{why}&rdquo;</span>
                  <span style={{ fontSize: 19, color: "#888" }}>– {sender}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MEVITE wordmark — bottom right */}
        {wordmarkB64 && (
          <img
            src={wordmarkB64}
            style={{
              position: "absolute",
              bottom: 44,
              right: 52,
              height: 34,
              width: "auto",
            }}
          />
        )}

      </div>
    ),
    { ...size }
  );
}
