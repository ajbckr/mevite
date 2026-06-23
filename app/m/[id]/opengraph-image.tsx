import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const alt = "MEVITE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#E8470A";

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Load everything from filesystem — no network calls
  const pub = path.join(process.cwd(), "public");

  const [font900, font600, plateBuffer] = await Promise.all([
    readFile(path.join(pub, "inter-900.woff2")),
    readFile(path.join(pub, "inter-600.woff2")),
    readFile(path.join(pub, "og-plate.png")),
  ]);

  const plate = `data:image/png;base64,${plateBuffer.toString("base64")}`;

  // Fetch Mevite data
  let sender = "Someone", when = "", bringing = "", why = "";
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (projectId && apiKey) {
      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const { fields: f } = await res.json();
        if (f) {
          sender   = f.sender?.stringValue || f.who?.stringValue || "Someone";
          when     = f.when?.stringValue     || "";
          bringing = f.bringing?.stringValue || "";
          why      = f.why?.stringValue      || "";
        }
      }
    }
  } catch { /* fall through to defaults */ }

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative" }}>

        {/* Plate */}
        <img src={plate} style={{ position: "absolute", inset: 0, width: 1200, height: 630 }} />

        {/* Text */}
        <div style={{
          position: "absolute", left: 64, top: 48, bottom: 48, width: 580,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span style={{ fontFamily: "Inter", fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>{sender}</span>
            <span style={{ fontFamily: "Inter", fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>is coming</span>
            <span style={{ fontFamily: "Inter", fontSize: 108, fontWeight: 900, color: "#111", lineHeight: 0.92, letterSpacing: "-0.03em" }}>over<span style={{ color: ORANGE }}>.</span></span>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {when ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="5" width="24" height="21" rx="3" fill={ORANGE} opacity="0.12" stroke={ORANGE} strokeWidth="1.8"/>
                  <path d="M2 11h24" stroke={ORANGE} strokeWidth="1.8"/>
                  <path d="M8 2v5M20 2v5" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: "Inter", fontSize: 25, fontWeight: 600, color: "#222" }}>{when}</span>
              </div>
            ) : null}
            {bringing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="5" fill={ORANGE} opacity="0.12" stroke={ORANGE} strokeWidth="1.8"/>
                  <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: "Inter", fontSize: 25, fontWeight: 600, color: "#222" }}>Bringing: {bringing}</span>
              </div>
            ) : null}
            {why ? (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginTop: 3, flexShrink: 0 }}>
                  <path d="M14 2C7.373 2 2 6.925 2 13c0 2.1.63 4.05 1.72 5.68L2 26l7.5-1.87A12.6 12.6 0 0014 24c6.627 0 12-4.925 12-11S20.627 2 14 2z" fill={ORANGE} opacity="0.12" stroke={ORANGE} strokeWidth="1.8" strokeLinejoin="round"/>
                  <circle cx="9" cy="13" r="1.4" fill={ORANGE}/>
                  <circle cx="14" cy="13" r="1.4" fill={ORANGE}/>
                  <circle cx="19" cy="13" r="1.4" fill={ORANGE}/>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontFamily: "Inter", fontSize: 25, fontWeight: 600, color: "#222", fontStyle: "italic" }}>"{why}"</span>
                  <span style={{ fontFamily: "Inter", fontSize: 19, fontWeight: 500, color: "#888" }}>– {sender}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: font900.buffer as ArrayBuffer, weight: 900, style: "normal" },
        { name: "Inter", data: font600.buffer as ArrayBuffer, weight: 600, style: "normal" },
      ],
    }
  );
}
