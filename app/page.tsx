"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotatingPrompt, WhenField } from "@/components/RotatingPrompt";
import { ThisIsHappeningPicker } from "@/components/ArrivalGauge";
import { createMevite } from "@/lib/mevite";
import { ArrivalStatus, ARRIVAL_STATUSES, WHO_PROMPTS, BRINGING_PROMPTS, WHY_PROMPTS } from "@/lib/types";
import { StatusIcon } from "@/components/StatusIcons";

const WHEN_ROTATE = ["This Weekend", "Tomorrow Night", "Friday at 8", "Next Monday", "Sunday Afternoon"];
const f: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };

export default function Home() {
  const router = useRouter();
  const [who, setWho] = useState("");
  const [bringing, setBringing] = useState("");
  const [why, setWhy] = useState("");
  const [when, setWhen] = useState("");
  const [arrivalStatus, setArrivalStatus] = useState<ArrivalStatus>("definitely");
  const [showPicker, setShowPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("20:00");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [whenIdx, setWhenIdx] = useState(0);
  const [whenAnimating, setWhenAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setWhenAnimating(true);
      setTimeout(() => {
        setWhenIdx(i => (i + 1) % WHEN_ROTATE.length);
        setWhenAnimating(false);
      }, 250);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const currentStatus = ARRIVAL_STATUSES.find(s => s.key === arrivalStatus);

  const handleDateConfirm = () => {
    if (selectedDate) {
      const d = new Date(selectedDate + "T00:00:00");
      const dayStr = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      const [h] = selectedTime.split(":");
      const hour = parseInt(h);
      const ampm = hour >= 12 ? "PM" : "AM";
      const h12 = hour % 12 || 12;
      setWhen(`${dayStr} at ${h12}:${selectedTime.split(":")[1]} ${ampm}`);
    }
    setShowDatePicker(false);
  };

  const handleSend = async () => {
    if (!who.trim() || !bringing.trim() || !why.trim()) {
      setError("Fill in who, what you're bringing, and why.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const id = await createMevite({ who, when: when || WHEN_ROTATE[whenIdx], bringing, why, arrivalStatus, senderPhone: "" });
      router.push(`/share/${id}`);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Try again.");
      setSending(false);
    }
  };

  if (sending) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/lockup.png" alt="MEVITE" style={{ width: 200, opacity: 0.9 }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── HERO LOCKUP: [M stacked over MEVITE] | vertical divider | Invite Yourself Over. ── */}
      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>

          {/* Left: M mark + MEVITE below — use the exact stacked PNG */}
          <div style={{ flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/m-lockup.png"
              alt="MEVITE"
              style={{ height: 110, width: "auto", display: "block" }}
            />
          </div>

          {/* Vertical divider */}
          <div style={{ width: 2, background: "#111", alignSelf: "stretch", margin: "0 18px", minHeight: 110 }} />

          {/* Right: Invite Yourself Over. */}
          <div style={{
            fontSize: 34, fontWeight: 900, lineHeight: 1.05,
            color: "#111", letterSpacing: "-0.01em",
            fontFamily: "Inter, system-ui, sans-serif",
          }}>
            Invite<br />Yourself<br />Over<span style={{ color: "#E8470A" }}>.</span>
          </div>
        </div>

        <p style={{ color: "#888", fontSize: 13, marginTop: 14, lineHeight: 1.5, fontFamily: "Inter, system-ui, sans-serif" }}>
          Stop saying &ldquo;we should get together.&rdquo; Show up.
        </p>
      </div>

      {/* ── FORM ── */}
      <div style={{ padding: "28px 24px 0", display: "flex", flexDirection: "column", gap: 28 }}>

        <RotatingPrompt label="Who are you showing up for?" prompts={WHO_PROMPTS} value={who} onChange={setWho} placeholder="" />

        <WhenField
          value={when}
          prompts={WHEN_ROTATE}
          promptIndex={whenIdx}
          isAnimating={whenAnimating}
          onClick={() => setShowDatePicker(true)}
        />

        <RotatingPrompt label="What are you bringing?" prompts={BRINGING_PROMPTS} value={bringing} onChange={setBringing} placeholder="" />
        <RotatingPrompt label="Why?" prompts={WHY_PROMPTS} value={why} onChange={setWhy} placeholder="" />

        <div style={{ borderTop: "1px solid #F0F0F0", paddingTop: 20 }}>
          <button onClick={() => setShowPicker(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8470A", flexShrink: 0 }} />
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#E8470A", textTransform: "uppercase", margin: 0, ...f }}>This Is Happening…</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: "3px 0 0", ...f }}>
                  {currentStatus ? currentStatus.label : "Choose your mission status"}
                </p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6 3l6 6-6 6" stroke="#E8470A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= (currentStatus?.gaugeLevel ?? 3) ? "#E8470A" : "#E8E8E8" }} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "32px 24px 56px" }}>
        {error && <p style={{ color: "#E8470A", fontSize: 14, textAlign: "center", marginBottom: 12, ...f }}>{error}</p>}
        <button onClick={handleSend} style={{ width: "100%", background: "#111", color: "#fff", padding: "16px 24px", borderRadius: 12, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", ...f }}>
          CREATE MY MEVITE →
        </button>
      </div>

      {showDatePicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "flex-end" }} onClick={() => setShowDatePicker(false)}>
          <div style={{ background: "#fff", width: "100%", borderRadius: "16px 16px 0 0", padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <button onClick={() => setShowDatePicker(false)} style={{ color: "#888", fontSize: 14, background: "none", border: "none", cursor: "pointer", ...f }}>Cancel</button>
              <span style={{ fontSize: 14, fontWeight: 700, ...f }}>Pick a time</span>
              <button onClick={handleDateConfirm} style={{ color: "#E8470A", fontSize: 14, fontWeight: 700, background: "none", border: "none", cursor: "pointer", ...f }}>Done</button>
            </div>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: "100%", border: "1px solid #E8E8E8", borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} min={new Date().toISOString().split("T")[0]} />
            <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ width: "100%", border: "1px solid #E8E8E8", borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} />
            <button onClick={handleDateConfirm} style={{ width: "100%", background: "#111", color: "#fff", padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", ...f }}>Set Time</button>
          </div>
        </div>
      )}

      {showPicker && (
        <ThisIsHappeningPicker value={arrivalStatus} onChange={setArrivalStatus} onConfirm={() => setShowPicker(false)} onClose={() => setShowPicker(false)} />
      )}
    </div>
  );
}
