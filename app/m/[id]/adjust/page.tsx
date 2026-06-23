"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { suggestChange } from "@/lib/mevite";
import { MeviteFooter } from "@/components/MeviteFooter";

const ORANGE = "#E8470A";
const F = "Inter, system-ui, sans-serif";

export default function AdjustPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!newDate && !newTime && !note) return;
    setSending(true);
    await suggestChange(id, newDate, newTime, note);
    setSending(false);
    setSent(true);
  };

  const canSubmit = !!(newDate || newTime || note);
  const today = new Date().toISOString().split("T")[0];

  if (sent) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center", gap: 24, fontFamily: F }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 14l7 7L23 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.05, margin: "0 0 8px" }}>
            Suggestion<br />sent<span style={{ color: ORANGE }}>.</span>
          </h2>
          <p style={{ fontSize: 14, color: "#888", margin: 0, maxWidth: 220 }}>
            They&apos;ll see it on the mission page and can respond.
          </p>
        </div>
        <button onClick={() => router.push(`/m/${id}`)} className="cta-btn" style={{ maxWidth: 280, width: "100%" }}>
          VIEW MISSION →
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: F }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 24px", background: "#fff" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#888", fontSize: 14, fontFamily: F }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px 64px" }}>

        <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 2.4rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 6px" }}>
          Let&apos;s adjust<br />the plan<span style={{ color: ORANGE }}>.</span>
        </h1>
        <p style={{ fontSize: 14, color: "#888", margin: "0 0 32px" }}>What works better?</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>

          {/* New Date */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0F0F0" }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#AAA", display: "block", marginBottom: 8, fontFamily: F }}>
              New Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              min={today}
              style={{ width: "100%", border: "none", outline: "none", fontSize: 16, fontWeight: 600, color: "#111", background: "transparent", fontFamily: F }}
            />
          </div>

          {/* New Time */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0F0F0" }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#AAA", display: "block", marginBottom: 8, fontFamily: F }}>
              New Time
            </label>
            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              style={{ width: "100%", border: "none", outline: "none", fontSize: 16, fontWeight: 600, color: "#111", background: "transparent", fontFamily: F }}
            />
          </div>

          {/* Note */}
          <div style={{ padding: "16px 20px" }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#AAA", display: "block", marginBottom: 8, fontFamily: F }}>
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="How about Saturday instead?"
              style={{ width: "100%", border: "none", outline: "none", fontSize: 15, fontWeight: 500, color: "#111", background: "transparent", fontFamily: F }}
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !canSubmit}
          style={{
            width: "100%", background: canSubmit ? ORANGE : "#DDD", color: "#fff",
            padding: "16px 24px", borderRadius: 12, fontSize: 16, fontWeight: 800,
            border: "none", cursor: canSubmit ? "pointer" : "not-allowed",
            fontFamily: F, letterSpacing: "0.02em", marginBottom: 12,
            transition: "background 0.2s",
          }}
        >
          {sending ? "Sending…" : "SEND SUGGESTION →"}
        </button>

        <p style={{ fontSize: 12, color: "#AAA", textAlign: "center", margin: "0 0 8px" }}>
          They&apos;ll see this suggestion on the mission page.
        </p>
      </div>

      <MeviteFooter />
    </div>
  );
}
