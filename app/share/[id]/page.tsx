"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMevite } from "@/lib/mevite";
import { Mevite } from "@/lib/types";
import { MeviteFooter } from "@/components/MeviteFooter";
import { trackSharePageView, trackShareSMS, trackShareWhatsApp, trackShareEmail } from "@/lib/analytics";

const ORANGE = "#E8470A";
const F = "Inter, system-ui, sans-serif";

// Icon paths from your custom icon set
function DateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 60.88 60.36" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <path fill={ORANGE} d="M54.66,5.8h-5.9V1.61c0-.89-.72-1.61-1.61-1.61s-1.61.72-1.61,1.61v4.19H15.35V1.61c0-.89-.72-1.61-1.61-1.61s-1.61.72-1.61,1.61v4.19h-5.9c-3.43,0-6.22,2.79-6.22,6.22v8.54h60.88v-8.54c0-3.43-2.79-6.22-6.22-6.22ZM13.74,16.86c-2.33,0-4.22-1.89-4.22-4.22,0-1.53.82-2.87,2.04-3.61.18-.11.38-.21.58-.29v3.9c0,.89.72,1.61,1.61,1.61s1.61-.72,1.61-1.61v-3.9c.2.08.39.18.58.29,1.22.74,2.04,2.08,2.04,3.61,0,2.33-1.89,4.22-4.22,4.22ZM47.14,16.86c-2.33,0-4.22-1.89-4.22-4.22,0-1.53.82-2.87,2.04-3.61.18-.11.38-.21.58-.29v3.9c0,.89.72,1.61,1.61,1.61s1.61-.72,1.61-1.61v-3.9c.2.08.39.18.58.29,1.22.74,2.04,2.08,2.04,3.61,0,2.33-1.89,4.22-4.22,4.22Z"/>
      <path fill={ORANGE} d="M0,54.14c0,3.43,2.79,6.22,6.22,6.22h48.43c3.43,0,6.22-2.79,6.22-6.22v-30.28H0v30.28ZM19.12,38.68c.69-.56,1.71-.46,2.27.23l6.04,7.41,12.12-16.51c.53-.72,1.54-.87,2.25-.35.72.53.87,1.54.35,2.25l-13.35,18.19c-.3.4-.76.65-1.26.66-.01,0-.03,0-.04,0-.48,0-.94-.22-1.25-.59l-7.35-9.03c-.56-.69-.46-1.71.23-2.27Z"/>
    </svg>
  );
}

function BringIcon() {
  return (
    <svg width="13" height="18" viewBox="0 0 45.92 61.57" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <polygon fill={ORANGE} points="0 37.11 4.02 31.25 21.78 36.3 17.76 42.16 0 37.11"/>
      <path fill={ORANGE} d="M22.25,61.57l-17.82-5.1v-16.6l13.41,3.81c.32.09.66-.03.84-.31l3.56-5.2v23.4Z"/>
      <path fill={ORANGE} d="M39.87,30.32l-16.91,4.8-16.9-4.8,8.06-2.29c.52.96,1,1.93,1.44,2.93.33.76,1.09,1.22,1.88,1.22.26,0,.52-.05.77-.15.25-.11.48-.26.67-.45.19-.19.34-.42.44-.67.06-.16.11-.32.13-.49.37.53.99.87,1.67.87.06,0,.12,0,.17,0h0c.55-.05,1.04-.31,1.39-.73.12-.14.22-.3.29-.47.07.17.17.33.29.47.35.42.85.68,1.39.73h.01c.05,0,.11,0,.16,0,.67,0,1.29-.34,1.66-.86.02.16.07.33.13.48.21.51.6.91,1.11,1.12.25.1.51.15.77.15.79,0,1.54-.46,1.88-1.22.43-.99.91-1.97,1.44-2.93l8.06,2.29Z"/>
      <path fill={ORANGE} d="M41.49,56.47l-17.8,5.1v-23.37l3.55,5.18c.19.27.53.4.84.31l13.41-3.81v16.6Z"/>
      <polygon fill={ORANGE} points="28.16 42.16 24.14 36.29 41.9 31.25 45.92 37.11 28.16 42.16"/>
      <path fill={ORANGE} d="M33.16,23.35c-1.57,2.17-2.95,4.57-4.05,7.07-.15.33-.53.49-.87.35h0c-.34-.14-.51-.54-.36-.88,1.12-2.57,2.54-5.06,4.18-7.32.13-.17.33-.28.54-.28h0c.55,0,.86.62.54,1.06Z"/>
      <path fill={ORANGE} d="M17.67,30.77h0c-.34.14-.72-.02-.87-.35-1.09-2.5-2.48-4.9-4.05-7.07-.32-.44,0-1.06.54-1.06h0c.21,0,.41.1.54.27,1.64,2.26,3.06,4.75,4.19,7.33.15.34-.01.74-.36.88Z"/>
      <path fill={ORANGE} d="M21.16,29.92h0c-.36.03-.68-.23-.72-.6-.39-3.7-1.35-7.38-2.74-10.65-.19-.44.13-.93.61-.93h0c.27,0,.51.16.61.4.09.21.18.42.26.64,1.31,3.26,2.2,6.84,2.57,10.4.04.37-.24.7-.61.73Z"/>
      <path fill={ORANGE} d="M28.23,18.67c-1.39,3.27-2.35,6.95-2.74,10.65-.04.36-.36.63-.72.6h0c-.37-.03-.65-.36-.61-.73.37-3.56,1.26-7.15,2.57-10.4.09-.21.17-.43.26-.64.1-.25.35-.4.61-.4h0c.48,0,.8.49.61.93Z"/>
      <path fill={ORANGE} d="M10.91,10.83l.96,2.51,2.71.11c.51.02.72.67.31.98l-2.11,1.64.73,2.56c.14.49-.4.88-.82.61l-2.29-1.48-2.29,1.48c-.42.27-.96-.12-.82-.61l.73-2.56-2.11-1.64c-.4-.31-.2-.96.31-.98l2.71-.11.96-2.51c.18-.47.84-.47,1.02,0Z"/>
      <path fill={ORANGE} d="M36.03,10.83l.96,2.51,2.71.11c.51.02.72.67.31.98l-2.11,1.64.73,2.56c.14.49-.4.88-.82.61l-2.29-1.48-2.29,1.48c-.42.27-.96-.12-.82-.61l.73-2.56-2.11-1.64c-.4-.31-.2-.96.31-.98l2.71-.11.96-2.51c.18-.47.84-.47,1.02,0Z"/>
      <path fill={ORANGE} d="M23.47.36l1.64,4.39,4.68.2c.51.02.71.66.32.97l-3.67,2.91,1.26,4.52c.14.49-.41.88-.83.6l-3.91-2.59-3.91,2.59c-.42.28-.96-.11-.83-.6l1.26-4.52-3.67-2.91c-.4-.31-.19-.95.32-.97l4.68-.2,1.64-4.39c.18-.47.85-.47,1.02,0Z"/>
    </svg>
  );
}

function MsgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 60.02 60.02" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <path fill={ORANGE} d="M59.54,24.65l-8.41-5.83V1.11c0-.29-.12-.58-.33-.79-.21-.21-.49-.33-.79-.33H10c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79v17.71L.48,24.65c-.15.1-.27.24-.35.4-.08.16-.13.34-.13.52v31.12c0,.88.35,1.73.98,2.36.63.63,1.47.98,2.36.98h53.35c.88,0,1.73-.35,2.36-.98.63-.62.98-1.47.98-2.36v-31.12c0-.18-.04-.36-.13-.52-.08-.16-.2-.3-.35-.4ZM2.22,27.69l20.06,13.89L2.22,56.69v-29ZM24.21,42.91l3.9,2.7c.56.39,1.22.6,1.9.6.68,0,1.34-.21,1.9-.6l3.9-2.7,19.77,14.89H4.44l19.77-14.89ZM37.74,41.58l20.06-13.89v29l-20.06-15.11ZM56.96,25.57l-5.83,4.03v-8.07l5.83,4.04ZM48.91,2.22v28.92l-18.26,12.64c-.19.13-.41.2-.63.2-.23,0-.45-.07-.63-.2l-18.26-12.64V2.22h37.79ZM8.89,29.6l-5.83-4.03,5.83-4.04v8.07Z"/>
      <path fill={ORANGE} d="M16.67,11.12h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
      <path fill={ORANGE} d="M16.67,15.56h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
      <path fill={ORANGE} d="M16.67,20.01h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
    </svg>
  );
}

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mevite, setMevite] = useState<Mevite | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { getMevite(id).then(setMevite); trackSharePageView(id); }, [id]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://mevite.me";
  const meviteUrl = `${origin}/m/${id}`;
  const whoName = mevite ? mevite.who : "your friend";
  const smsText = `Let's stop saying "we should get together." Let's get together: ${meviteUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(meviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: F }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 20px", background: "#fff" }}>
        <a href="/" style={{ display: "inline-block", lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mevite-wordmark.png" alt="MEVITE" style={{ height: 22, width: "auto", display: "block" }} />
        </a>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 20px 64px", width: "100%" }}>

        {/* Headline */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.6rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 6px", color: "#111" }}>
            It&apos;s ready<span style={{ color: ORANGE }}>.</span><br />Send it.
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
            {whoName} sees everything and can respond.
          </p>
        </div>

        {/* Mevite card — matches mission page "Your View" style */}
        {mevite ? (
          <div style={{ background: "#fff", border: `2px solid ${ORANGE}`, borderRadius: 16, padding: "20px", marginBottom: 16 }}>

            {/* Headline */}
            <p style={{ fontSize: 20, fontWeight: 900, color: "#111", margin: "0 0 16px", lineHeight: 1.2 }}>
              <span style={{ color: ORANGE }}>{mevite.sender || mevite.who}</span> is coming over.
            </p>

            {/* Because */}
            {mevite.why && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <MsgIcon />
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE, margin: 0 }}>Because</p>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, fontStyle: "italic", color: "#111", margin: 0, paddingLeft: 30 }}>&ldquo;{mevite.why}&rdquo;</p>
              </div>
            )}

            {/* Details with custom icons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mevite.when && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <DateIcon />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: ORANGE, margin: "0 0 2px" }}>When</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>{mevite.when}</p>
                  </div>
                </div>
              )}
              {mevite.bringing && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <BringIcon />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: ORANGE, margin: "0 0 2px" }}>Bringing</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>{mevite.bringing}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, height: 160, marginBottom: 16 }} />
        )}

        {/* Share section */}
        <div style={{ background: "#fff", border: `2px solid ${ORANGE}`, borderRadius: 16, padding: "18px", marginBottom: 12 }}>

          {/* Primary SMS */}
          <a href={`sms:?body=${encodeURIComponent(smsText)}`} onClick={trackShareSMS} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: ORANGE, color: "#fff", padding: "15px 20px", borderRadius: 12,
            textDecoration: "none", fontSize: 15, fontWeight: 800, fontFamily: F,
            letterSpacing: "0.02em", marginBottom: 12,
          }}>
            <MsgIcon />
            Text Mevite
          </a>

          <p style={{ textAlign: "center", fontSize: 11, color: "#BBB", margin: "0 0 10px", fontFamily: F }}>Or copy the link</p>

          <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#F5F5F5", borderRadius: 10, padding: "8px 12px" }}>
            <span style={{ flex: 1, fontSize: 11, fontFamily: "monospace", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meviteUrl}</span>
            <button onClick={handleCopy} style={{
              flexShrink: 0, fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 8,
              border: copied ? "none" : "1px solid #111", background: copied ? "#111" : "#fff",
              color: copied ? "#fff" : "#111", cursor: "pointer", fontFamily: F, transition: "all 0.2s",
            }}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* WhatsApp + Email */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <a href={`https://wa.me/?text=${encodeURIComponent(smsText)}`} onClick={trackShareWhatsApp} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#fff", border: "1px solid #E8E8E8", borderRadius: 12, padding: "12px",
            textDecoration: "none", fontSize: 13, fontWeight: 600, color: "#111", fontFamily: F,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <a href={`mailto:?subject=${encodeURIComponent("I'm coming over.")}&body=${encodeURIComponent(`${smsText}\n\nCheck my Mevite to respond.`)}`} onClick={trackShareEmail} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#fff", border: "1px solid #E8E8E8", borderRadius: 12, padding: "12px",
            textDecoration: "none", fontSize: 13, fontWeight: 600, color: "#111", fontFamily: F,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="13" rx="2" fill={ORANGE}/><path d="M2 6l8 6 8-6" stroke="white" strokeWidth="1.5" fill="none"/></svg>
            Email
          </a>
        </div>

        {/* View mission page */}
        <div style={{ textAlign: "center", paddingTop: 4, marginBottom: 8 }}>
          <button onClick={() => router.push(`/m/${id}`)} style={{
            fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: "none",
            cursor: "pointer", fontFamily: F,
          }}>
            View live mission page →
          </button>
          <p style={{ fontSize: 11, color: "#AAA", margin: "4px 0 0" }}>This is what {whoName} sees when they open your link.</p>
        </div>

      </div>

      <MeviteFooter />
    </div>
  );
}
