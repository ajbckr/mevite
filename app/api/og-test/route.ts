import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ORANGE = "#E8470A";
const BG = "#F5EFE6";

export async function GET() {
  const [f900, f600] = await Promise.all([
    readFile(path.join(process.cwd(), "public", "inter-900.woff2")),
    readFile(path.join(process.cwd(), "public", "inter-600.woff2")),
  ]);

  const ab = (b: Buffer) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: BG, display: "flex", fontFamily: "Inter", position: "relative" }}>
        <div style={{ position: "absolute", left: 72, top: 52, bottom: 52, width: 620, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", letterSpacing: "-0.04em" }}>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88 }}>Andrew</span>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88 }}>is coming</span>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88 }}>over<span style={{ color: ORANGE }}>.</span></span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={{ fontSize: 26, fontWeight: 600, color: "#222" }}>📅 Thursday, June 20 at 8:00 PM</span>
            <span style={{ fontSize: 26, fontWeight: 600, color: "#222" }}>🎒 Bringing: Beer and my dog</span>
            <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontStyle: "italic" }}>"It's been too long." – Andrew</span>
          </div>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 14, color: "#CCC", letterSpacing: "0.06em" }}>← PLATE GOES HERE</span>
        </div>
      </div>
    ),
    {
      width: 1200, height: 630,
      fonts: [
        { name: "Inter", data: ab(f900), weight: 900, style: "normal" },
        { name: "Inter", data: ab(f600), weight: 600, style: "normal" },
      ],
    }
  );
}
