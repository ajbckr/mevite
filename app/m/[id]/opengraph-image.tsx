import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MEVITE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
      sender: f.sender?.stringValue || f.who?.stringValue || "Someone",
      who:    f.who?.stringValue || "a friend",
      why:    f.why?.stringValue || "",
      when:   f.when?.stringValue || "",
    };
  } catch {
    return null;
  }
}

export default async function OGImage({ params }: { params: { id: string } }) {
  const mevite = await getMeviteData(params.id);

  const sender = mevite?.sender || "Someone";
  const why    = mevite?.why    || "It's been too long.";
  const when   = mevite?.when   || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Top: sender + headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{
              background: "#E8470A",
              borderRadius: 6,
              width: 10, height: 10,
            }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: "#AAA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              THIS IS HAPPENING
            </span>
          </div>

          <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", color: "#111", display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#E8470A" }}>{sender}</span>
            <span>is coming</span>
            <span>over<span style={{ color: "#E8470A" }}>.</span></span>
          </div>
        </div>

        {/* Bottom: why quote + meta + wordmark */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* Why quote */}
          <div style={{
            borderLeft: "4px solid #E8470A",
            paddingLeft: 24,
            maxWidth: 680,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <span style={{ fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "#111", lineHeight: 1.3 }}>
              &ldquo;{why}&rdquo;
            </span>
            {when && (
              <span style={{ fontSize: 18, color: "#888", fontWeight: 500 }}>
                {when}
              </span>
            )}
          </div>

          {/* Wordmark */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: "#111",
            }}>
              MEVITE
            </span>
            <span style={{ fontSize: 14, color: "#AAA", letterSpacing: "0.04em" }}>
              mevite.vercel.app
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
