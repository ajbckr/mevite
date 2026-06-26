import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import React from "react";

export const runtime = "nodejs";
export const alt = "MEVITE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#E8470A";
const BASE = "https://mevite.me";

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

  const [mevite, font900, font600, plateBuffer] = await Promise.all([
    getMeviteData(id),
    readFile(path.join(process.cwd(), "public", "inter-900.woff2")),
    readFile(path.join(process.cwd(), "public", "inter-600.woff2")),
    readFile(path.join(process.cwd(), "public", "og-plate.jpg")),
  ]);

  const ab = (b: Buffer): ArrayBuffer => {
    const copy = new ArrayBuffer(b.length);
    new Uint8Array(copy).set(b);
    return copy;
  };

  const plate = `data:image/jpeg;base64,${plateBuffer.toString("base64")}`;

  const sender   = mevite?.sender   || "Someone";
  const when     = mevite?.when     || "";
  const bringing = mevite?.bringing || "";
  const why      = mevite?.why      || "";

  const CAL_CENTER = 72 + 15; // LEFT + ICON_SIZE/2
  const BRING_X = CAL_CENTER - 18; // center of 36px bring icon
  const TEXT_LEFT = 72 + 36 + 14;
  const ROW_H = 50;
  const DETAIL_TOP = 630 - 52 - ROW_H * 3;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: "#F5EFE6", display: "flex", position: "relative", fontFamily: "Inter" }}>

        {/* Plate — right 480px column */}
        <img src={{plate}} style={{ position: "absolute", right: 0, top: 0, width: 480, height: 630, objectFit: "cover" }} />

        {/* Left text zone */}
        <div style={{ position: "absolute", left: 72, top: 52, bottom: 52, width: 590, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", letterSpacing: "-0.04em" }}>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88 }}>{{sender}}</span>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88 }}>is coming</span>
            <span style={{ fontSize: 112, fontWeight: 900, color: "#111", lineHeight: 0.88 }}>over<span style={{ color: ORANGE }}>.</span></span>
          </div>

          {/* Detail rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {when ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14, height: ROW_H }}>
                <svg width="30" height="30" viewBox="0 0 60.88 60.36" fill="none" style={{ flexShrink: 0 }}>
                  <path fill="#E8470A" d="M54.66,5.8h-5.9V1.61c0-.89-.72-1.61-1.61-1.61s-1.61.72-1.61,1.61v4.19H15.35V1.61c0-.89-.72-1.61-1.61-1.61s-1.61.72-1.61,1.61v4.19h-5.9c-3.43,0-6.22,2.79-6.22,6.22v8.54h60.88v-8.54c0-3.43-2.79-6.22-6.22-6.22ZM13.74,16.86c-2.33,0-4.22-1.89-4.22-4.22,0-1.53.82-2.87,2.04-3.61.18-.11.38-.21.58-.29v3.9c0,.89.72,1.61,1.61,1.61s1.61-.72,1.61-1.61v-3.9c.2.08.39.18.58.29,1.22.74,2.04,2.08,2.04,3.61,0,2.33-1.89,4.22-4.22,4.22ZM47.14,16.86c-2.33,0-4.22-1.89-4.22-4.22,0-1.53.82-2.87,2.04-3.61.18-.11.38-.21.58-.29v3.9c0,.89.72,1.61,1.61,1.61s1.61-.72,1.61-1.61v-3.9c.2.08.39.18.58.29,1.22.74,2.04,2.08,2.04,3.61,0,2.33-1.89,4.22-4.22,4.22Z"/>
<path fill="#E8470A" d="M0,54.14c0,3.43,2.79,6.22,6.22,6.22h48.43c3.43,0,6.22-2.79,6.22-6.22v-30.28H0v30.28ZM57.7,54.13v.19h0c0-.06,0-.13,0-.19ZM19.12,38.68c.69-.56,1.71-.46,2.27.23l6.04,7.41,12.12-16.51c.53-.72,1.54-.87,2.25-.35.72.53.87,1.54.35,2.25l-13.35,18.19c-.3.4-.76.65-1.26.66-.01,0-.03,0-.04,0-.48,0-.94-.22-1.25-.59l-7.35-9.03c-.56-.69-.46-1.71.23-2.27Z"/>
                </svg>
                <span style={{ fontSize: 26, fontWeight: 600, color: "#222" }}>{{when}}</span>
              </div>
            ) : null}
            {bringing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14, height: ROW_H }}>
                <div style={{ width: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="36" height="36" viewBox="0 0 45.92 61.57" fill="none">
                    <polygon fill="#E8470A" points="0 37.11 4.02 31.25 21.78 36.3 17.76 42.16 0 37.11"/>
<path fill="#E8470A" d="M22.25,61.57l-17.82-5.1v-16.6l13.41,3.81c.32.09.66-.03.84-.31l3.56-5.2v23.4Z"/>
<path fill="#E8470A" d="M39.87,30.32l-16.91,4.8-16.9-4.8,8.06-2.29c.52.96,1,1.93,1.44,2.93.33.76,1.09,1.22,1.88,1.22.26,0,.52-.05.77-.15.25-.11.48-.26.67-.45.19-.19.34-.42.44-.67.06-.16.11-.32.13-.49.37.53.99.87,1.67.87.06,0,.12,0,.17,0h0c.55-.05,1.04-.31,1.39-.73.12-.14.22-.3.29-.47.07.17.17.33.29.47.35.42.85.68,1.39.73h.01c.05,0,.11,0,.16,0,.67,0,1.29-.34,1.66-.86.02.16.07.33.13.48.21.51.6.91,1.11,1.12.25.1.51.15.77.15.79,0,1.54-.46,1.88-1.22.43-.99.91-1.97,1.44-2.93l8.06,2.29Z"/>
<path fill="#E8470A" d="M41.49,56.47l-17.8,5.1v-23.37l3.55,5.18c.19.27.53.4.84.31l13.41-3.81v16.6Z"/>
<polygon fill="#E8470A" points="28.16 42.16 24.14 36.29 41.9 31.25 45.92 37.11 28.16 42.16"/>
<path fill="#E8470A" d="M33.16,23.35c-1.57,2.17-2.95,4.57-4.05,7.07-.15.33-.53.49-.87.35h0c-.34-.14-.51-.54-.36-.88,1.12-2.57,2.54-5.06,4.18-7.32.13-.17.33-.28.54-.28h0c.55,0,.86.62.54,1.06Z"/>
<path fill="#E8470A" d="M17.67,30.77h0c-.34.14-.72-.02-.87-.35-1.09-2.5-2.48-4.9-4.05-7.07-.32-.44,0-1.06.54-1.06h0c.21,0,.41.1.54.27,1.64,2.26,3.06,4.75,4.19,7.33.15.34-.01.74-.36.88Z"/>
<path fill="#E8470A" d="M21.16,29.92h0c-.36.03-.68-.23-.72-.6-.39-3.7-1.35-7.38-2.74-10.65-.19-.44.13-.93.61-.93h0c.27,0,.51.16.61.4.09.21.18.42.26.64,1.31,3.26,2.2,6.84,2.57,10.4.04.37-.24.7-.61.73Z"/>
<path fill="#E8470A" d="M28.23,18.67c-1.39,3.27-2.35,6.95-2.74,10.65-.04.36-.36.63-.72.6h0c-.37-.03-.65-.36-.61-.73.37-3.56,1.26-7.15,2.57-10.4.09-.21.17-.43.26-.64.1-.25.35-.4.61-.4h0c.48,0,.8.49.61.93Z"/>
<path fill="#E8470A" d="M10.91,10.83l.96,2.51,2.71.11c.51.02.72.67.31.98l-2.11,1.64.73,2.56c.14.49-.4.88-.82.61l-2.29-1.48-2.29,1.48c-.42.27-.96-.12-.82-.61l.73-2.56-2.11-1.64c-.4-.31-.2-.96.31-.98l2.71-.11.96-2.51c.18-.47.84-.47,1.02,0Z"/>
<path fill="#E8470A" d="M36.03,10.83l.96,2.51,2.71.11c.51.02.72.67.31.98l-2.11,1.64.73,2.56c.14.49-.4.88-.82.61l-2.29-1.48-2.29,1.48c-.42.27-.96-.12-.82-.61l.73-2.56-2.11-1.64c-.4-.31-.2-.96.31-.98l2.71-.11.96-2.51c.18-.47.84-.47,1.02,0Z"/>
<path fill="#E8470A" d="M23.47.36l1.64,4.39,4.68.2c.51.02.71.66.32.97l-3.67,2.91,1.26,4.52c.14.49-.41.88-.83.6l-3.91-2.59-3.91,2.59c-.42.28-.96-.11-.83-.6l1.26-4.52-3.67-2.91c-.4-.31-.19-.95.32-.97l4.68-.2,1.64-4.39c.18-.47.85-.47,1.02,0Z"/>
                  </svg>
                </div>
                <span style={{ fontSize: 26, fontWeight: 600, color: "#222" }}>Bringing: {{bringing}}</span>
              </div>
            ) : null}
            {why ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14, height: ROW_H }}>
                <svg width="30" height="30" viewBox="0 0 60.02 60.02" fill="none" style={{ flexShrink: 0 }}>
                  <path fill="#E8470A" d="M59.54,24.65l-8.41-5.83V1.11c0-.29-.12-.58-.33-.79-.21-.21-.49-.33-.79-.33H10c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79v17.71L.48,24.65c-.15.1-.27.24-.35.4-.08.16-.13.34-.13.52v31.12c0,.88.35,1.73.98,2.36.63.63,1.47.98,2.36.98h53.35c.88,0,1.73-.35,2.36-.98.63-.62.98-1.47.98-2.36v-31.12c0-.18-.04-.36-.13-.52-.08-.16-.2-.3-.35-.4ZM2.22,27.69l20.06,13.89L2.22,56.69v-29ZM24.21,42.91l3.9,2.7c.56.39,1.22.6,1.9.6.68,0,1.34-.21,1.9-.6l3.9-2.7,19.77,14.89H4.44l19.77-14.89ZM37.74,41.58l20.06-13.89v29l-20.06-15.11ZM56.96,25.57l-5.83,4.03v-8.07l5.83,4.04ZM48.91,2.22v28.92l-18.26,12.64c-.19.13-.41.2-.63.2-.23,0-.45-.07-.63-.2l-18.26-12.64V2.22h37.79ZM8.89,29.6l-5.83-4.03,5.83-4.04v8.07Z"/>
<path fill="#E8470A" d="M16.67,11.12h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
<path fill="#E8470A" d="M16.67,15.56h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
<path fill="#E8470A" d="M16.67,20.01h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
<path fill="#E8470A" d="M16.67,24.45h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
<path fill="#E8470A" d="M16.67,28.9h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
<path fill="#E8470A" d="M37.79,31.12h-15.56c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33h15.56c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33Z"/>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 26, fontWeight: 600, color: "#222", fontStyle: "italic" }}>"{{why}}"</span>
                  <span style={{ fontSize: 20, fontWeight: 500, color: "#888" }}>– {{sender}}</span>
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
        { name: "Inter", data: ab(font900), weight: 900, style: "normal" },
        { name: "Inter", data: ab(font600), weight: 600, style: "normal" },
      ],
    }
  );
}
