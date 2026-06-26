import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { ImageResponse } = await import("next/og");
    const { readFile } = await import("fs/promises");
    const { default: path } = await import("path");

    const [f900, f600] = await Promise.all([
      readFile(path.join(process.cwd(), "public", "inter-900.woff2")),
      readFile(path.join(process.cwd(), "public", "inter-600.woff2")),
    ]);

    const ab = (b: Buffer): ArrayBuffer => {
      const copy = new ArrayBuffer(b.length);
      new Uint8Array(copy).set(b);
      return copy;
    };

    const ORANGE = "#E8470A";
    const BG = "#F5EFE6";

    return new ImageResponse(
      (
        <div style={{ width: 1200, height: 630, background: BG, display: "flex", fontFamily: "Inter", position: "relative" }}>
          <div style={{ position: "absolute", left: 72, top: 52, bottom: 52, width: 620, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", letterSpacing: "-0.04em" }}>
              <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88, fontFamily: "Inter" }}>Andrew</span>
              <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88, fontFamily: "Inter" }}>is coming</span>
              <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88, fontFamily: "Inter" }}>over<span style={{ color: ORANGE }}>.</span></span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter" }}>Thursday, June 20 at 8:00 PM</span>
              <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter" }}>Bringing: Beer and my dog</span>
              <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontFamily: "Inter", fontStyle: "italic" }}>"It's been too long." – Andrew</span>
            </div>
          </div>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, color: "#CCC", fontFamily: "Inter", letterSpacing: "0.06em" }}>PLATE GOES HERE</span>
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
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
