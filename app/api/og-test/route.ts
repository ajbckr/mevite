import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ORANGE = "#E8470A";
const BG = "#F5EFE6";

export async function GET() {
  const font900 = await readFile(path.join(process.cwd(), "public", "inter-900.woff2"));
  const font600 = await readFile(path.join(process.cwd(), "public", "inter-600.woff2"));

  const toAB = (buf: Buffer): ArrayBuffer => {
    const ab = new ArrayBuffer(buf.length);
    new Uint8Array(ab).set(buf);
    return ab;
  };

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: BG, display: "flex", position: "relative", fontFamily: "Inter" }}>

        {/* Left text zone */}
        <div style={{ position: "absolute", left: 72, top: 52, bottom: 52, width: 620, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

          <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.88, letterSpacing: "-0.04em" }}>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", fontFamily: "Inter" }}>Andrew</span>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", fontFamily: "Inter" }}>is coming</span>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", fontFamily: "Inter" }}>over<span style={{ color: ORANGE }}>.</span></span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="30" height="30" viewBox="0 0 28 28" fill="none"><rect x="2" y="5" width="24" height="21" rx="3" fill={ORANGE} opacity="0.2" stroke={ORANGE} strokeWidth="2.2"/><path d="M2 11h24" stroke={ORANGE} strokeWidth="2.2"/><path d="M8 2v5M20 2v5" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter" }}>Thursday, June 20 at 8:00 PM</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="30" height="30" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="10" r="5" fill={ORANGE} opacity="0.2" stroke={ORANGE} strokeWidth="2.2"/><path d="M4 26c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter" }}>Bringing: Beer and my dog</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <svg width="30" height="30" viewBox="0 0 28 28" fill="none" style={{ marginTop: 3, flexShrink: 0 }}><path d="M14 2C7.4 2 2 6.9 2 13c0 2.1.6 4 1.7 5.7L2 26l7.5-1.9A12.6 12.6 0 0014 24c6.6 0 12-4.9 12-11S20.6 2 14 2z" fill={ORANGE} opacity="0.2" stroke={ORANGE} strokeWidth="2.2" strokeLinejoin="round"/><circle cx="9" cy="13" r="1.5" fill={ORANGE}/><circle cx="14" cy="13" r="1.5" fill={ORANGE}/><circle cx="19" cy="13" r="1.5" fill={ORANGE}/></svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter", fontStyle: "italic" }}>"It's been too long."</span>
                <span style={{ fontSize: 20, fontWeight: 500, color: "#888", fontFamily: "Inter" }}>– Andrew</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right zone placeholder */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 13, color: "#CCC", fontFamily: "Inter", letterSpacing: "0.06em" }}>PLATE GOES HERE →</span>
        </div>

      </div>
    ),
    {
      width: 1200, height: 630,
      fonts: [
        { name: "Inter", data: toAB(font900), weight: 900, style: "normal" },
        { name: "Inter", data: toAB(font600), weight: 600, style: "normal" },
      ],
    }
  );
}
