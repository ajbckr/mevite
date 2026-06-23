"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMevite } from "@/lib/mevite";
import { Mevite } from "@/lib/types";

const ORANGE = "#E8470A";
const F = "Inter, system-ui, sans-serif";

function MeviteHeader() {
  return (
    <div style={{ borderBottom: "1px solid #F0F0F0", padding: "14px 20px", display: "flex", alignItems: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/m-lockup.png" alt="MEVITE" style={{ height: 24, width: "auto", display: "block" }} />
    </div>
  );
}

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mevite, setMevite] = useState<Mevite | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { getMevite(id).then(setMevite); }, [id]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://mevite.vercel.app";
  const meviteUrl = `${origin}/m/${id}`;
  const senderName = mevite ? (mevite.sender || mevite.who).split(" ")[0] : "";
  const smsText = `Hey — I'm coming over. Here's my Mevite: ${meviteUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(meviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F, display: "flex", flexDirection: "column" }}>
      <MeviteHeader />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 20px 64px", flex: 1, width: "100%" }}>

        {/* Hero */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.6rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 8px", color: "#111" }}>
            Your Mevite<br />is ready<span style={{ color: ORANGE }}>.</span>
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
            One link. {senderName ? `${senderName} sees` : "Your friend sees"} everything — and can respond.
          </p>
        </div>

        {/* Preview card */}
        {mevite ? (
          <div style={{ border: "1px solid #EBEBEB", borderRadius: 16, padding: "16px 18px", marginBottom: 20 }}>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: "0 0 14px" }}>
              <span style={{ color: ORANGE }}>{mevite.sender || mevite.who}</span> is coming over.
            </p>

            {/* Why — emotional center */}
            <div style={{ borderLeft: `2px solid ${ORANGE}`, paddingLeft: 12, marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE, margin: "0 0 4px" }}>Because</p>
              <p style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "#111", margin: 0 }}>&ldquo;{mevite.why}&rdquo;</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <rect x="1" y="3" width="16" height="14" rx="2" fill={ORANGE}/>
                  <path d="M5 1v4M13 1v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="4" y="10" width="3" height="2" rx="0.5" fill="white"/>
                  <rect x="8" y="10" width="3" height="2" rx="0.5" fill="white"/>
                </svg>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: ORANGE, margin: "0 0 1px" }}>When</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>{mevite.when}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M3 6h12l-1.5 9H4.5L3 6z" fill={ORANGE}/>
                  <path d="M6 6V4a3 3 0 016 0v2" stroke={ORANGE} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <path d="M1 6h16" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: ORANGE, margin: "0 0 1px" }}>Bringing</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>{mevite.bringing}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ border: "1px solid #EBEBEB", borderRadius: 16, height: 160, background: "#F5F5F5", marginBottom: 20 }} />
        )}

        {/* Send section */}
        <div style={{ border: "1px solid #EBEBEB", borderRadius: 16, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff3ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: ORANGE, margin: "0 0 2px" }}>Share your Mevite</p>
              <p style={{ fontSize: 17, fontWeight: 900, color: "#111", margin: "0 0 1px" }}>Send it. Make it real.</p>
              <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Text it to {senderName || "them"} so the plan is in motion.</p>
            </div>
          </div>

          {/* Primary — SMS */}
          <a href={`sms:?body=${encodeURIComponent(smsText)}`} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: ORANGE, color: "#fff", padding: "14px 20px", borderRadius: 12,
            textDecoration: "none", fontSize: 15, fontWeight: 800, fontFamily: F,
            letterSpacing: "0.02em", marginBottom: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6l-4 3V4z" fill="white"/>
            </svg>
            Text Mevite
          </a>

          <p style={{ textAlign: "center", fontSize: 11, color: "#BBB", margin: "0 0 10px", fontFamily: F }}>Or copy the link</p>

          <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#F5F5F5", borderRadius: 10, padding: "8px 12px" }}>
            <span style={{ flex: 1, fontSize: 11, fontFamily: "monospace", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meviteUrl}</span>
            <button onClick={handleCopy} style={{
              flexShrink: 0, fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 8,
              border: copied ? "none" : `1px solid #111`, background: copied ? "#111" : "#fff",
              color: copied ? "#fff" : "#111", cursor: "pointer", fontFamily: F, transition: "all 0.2s",
            }}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* WhatsApp + Email */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <a href={`https://wa.me/?text=${encodeURIComponent(smsText)}`} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            border: "1px solid #E8E8E8", borderRadius: 12, padding: "12px",
            textDecoration: "none", fontSize: 13, fontWeight: 600, color: "#111", fontFamily: F,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a href={`mailto:?subject=${encodeURIComponent("I'm coming over.")}&body=${encodeURIComponent(`${smsText}\n\nCheck my Mevite to respond.`)}`} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            border: "1px solid #E8E8E8", borderRadius: 12, padding: "12px",
            textDecoration: "none", fontSize: 13, fontWeight: 600, color: "#111", fontFamily: F,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="13" rx="2" fill={ORANGE}/>
              <path d="M2 6l8 6 8-6" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
            Email
          </a>
        </div>

        {/* View mission page */}
        <div style={{ borderTop: "1px solid #F0F0F0", paddingTop: 16, textAlign: "center" }}>
          <button onClick={() => router.push(`/m/${id}`)} style={{
            fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: F,
          }}>
            View live mission page →
          </button>
          <p style={{ fontSize: 11, color: "#AAA", margin: "4px 0 0" }}>This is what {senderName || "your friend"} sees when they open your link.</p>
        </div>
      </div>
    </div>
  );
}
