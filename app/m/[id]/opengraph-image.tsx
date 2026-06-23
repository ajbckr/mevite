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
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.fields;
    if (!f) return null;
    return {
      sender:   f.sender?.stringValue   || f.who?.stringValue || "Someone",
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

  // Load the door image and wordmark as base64
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const [doorRes, wordmarkRes] = await Promise.all([
    fetch(`${baseUrl}/og-door.png`),
    fetch(`${baseUrl}/mevite-wordmark.png`),
  ]);

  const doorBuf     = await doorRes.arrayBuffer();
  const wordmarkBuf = await wordmarkRes.arrayBuffer();
  const doorB64     = `data:image/png;base64,${Buffer.from(doorBuf).toString("base64")}`;
  const wordmarkB64 = `data:image/png;base64,${Buffer.from(wordmarkBuf).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630,
        background: BG,
        display: "flex",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Door image — right half */}
        <img
          src={doorB64}
          style={{
            position: "absolute",
            right: 0, top: 0,
            width: 580, height: 630,
            objectFit: "cover",
            objectPosition: "left center",
          }}
        />

        {/* Subtle left fade so text reads cleanly */}
        <div style={{
          position: "absolute",
          left: 380, top: 0, bottom: 0, width: 200,
          background: `linear-gradient(to right, ${BG}, transparent)`,
          display: "flex",
        }} />

        {/* Left content column */}
        <div style={{
          position: "absolute",
          left: 64, top: 0, bottom: 0, width: 640,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 0 52px",
        }}>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.92, letterSpacing: "-0.03em" }}>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111" }}>{sender}</span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111" }}>is coming</span>
            <span style={{ fontSize: 108, fontWeight: 900, color: "#111" }}>
              over<span style={{ color: ORANGE }}>.</span>
            </span>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {when && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Calendar icon */}
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="5" width="24" height="20" rx="3" stroke={ORANGE} strokeWidth="2" fill="none"/>
                  <path d="M2 11h24" stroke={ORANGE} strokeWidth="2"/>
                  <path d="M8 2v4M20 2v4" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 24, fontWeight: 600, color: "#222" }}>{when}</span>
              </div>
            )}
            {bringing && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Person icon */}
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="9" r="5" stroke={ORANGE} strokeWidth="2" fill="none"/>
                  <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
                <span style={{ fontSize: 24, fontWeight: 600, color: "#222" }}>Bringing: {bringing}</span>
              </div>
            )}
            {why && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Quote icon */}
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                  <path d="M14 4a10 10 0 100 18H22l2 2v-4a10 10 0 00-10-16z" stroke={ORANGE} strokeWidth="2" fill="none" strokeLinejoin="round"/>
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

        {/* MEVITE wordmark — bottom right */}
        <img
          src={wordmarkB64}
          style={{
            position: "absolute",
            bottom: 48,
            right: 56,
            height: 36,
            width: "auto",
          }}
        />

      </div>
    ),
    { ...size }
  );
}
