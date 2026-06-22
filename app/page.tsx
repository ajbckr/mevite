"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotatingPrompt } from "@/components/RotatingPrompt";
import { ThisIsHappeningPicker } from "@/components/ArrivalGauge";
import { createMevite } from "@/lib/mevite";
import { ArrivalStatus, ARRIVAL_STATUSES, WHO_PROMPTS, BRINGING_PROMPTS, WHY_PROMPTS } from "@/lib/types";

const WHEN_ROTATE = ["This Weekend", "Tomorrow Night", "Friday at 8", "Next Monday", "Sunday Afternoon"];

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

  useEffect(() => {
    const t = setInterval(() => setWhenIdx(i => (i + 1) % WHEN_ROTATE.length), 2500);
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
      const mins = selectedTime.split(":")[1];
      setWhen(`${dayStr} at ${h12}:${mins} ${ampm}`);
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
      const id = await createMevite({
        who, when: when || WHEN_ROTATE[whenIdx],
        bringing, why, arrivalStatus, senderPhone: "",
      });
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
        <div style={{ textAlign: "center" }}>
          <MHero size={64} />
          <p style={{ color: "white", fontSize: 20, fontWeight: 900, marginTop: 20, fontFamily: "Inter, sans-serif" }}>Sending your Mevite…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── HERO LOCKUP — M icon | MEVITE | divider | Invite Yourself Over. ── */}
      <div style={{ padding: "40px 24px 32px" }}>

        {/* Top row: M icon + MEVITE wordmark */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 0, marginBottom: 4 }}>
          <MHero size={100} />
          <span style={{
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: "0.08em",
            color: "#111",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1,
            marginLeft: 8,
            paddingBottom: 6,
          }}>
            MEVITE
          </span>
        </div>

        {/* Divider line — full width */}
        <div style={{ height: 2, background: "#1a1a1a", margin: "10px 0 12px" }} />

        {/* Tagline — large, bold, stacked */}
        <div style={{
          fontSize: 44,
          fontWeight: 900,
          lineHeight: 1.05,
          color: "#111",
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "-0.01em",
        }}>
          Invite<br />
          Yourself<br />
          Over<span style={{ color: "#E8470A" }}>.</span>
        </div>

        <p style={{ color: "#888", fontSize: 14, marginTop: 12, lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>
          Stop saying &ldquo;we should get together.&rdquo; Show up.
        </p>
      </div>

      {/* ── FORM ── */}
      <div style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          <RotatingPrompt label="Who are you showing up for?" prompts={WHO_PROMPTS} value={who} onChange={setWho} placeholder="" />

          {/* When */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#888", textTransform: "uppercase", display: "block", marginBottom: 4 }}>When?</label>
            <button onClick={() => setShowDatePicker(true)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <div style={{
                fontSize: 20,
                paddingBottom: 12,
                borderBottom: "1px solid #E0E0E0",
                color: when ? "#111" : "#CCC",
                fontWeight: when ? 600 : 400,
                fontFamily: "Inter, sans-serif",
              }}>
                {when || WHEN_ROTATE[whenIdx]}
              </div>
            </button>
          </div>

          <RotatingPrompt label="What are you bringing?" prompts={BRINGING_PROMPTS} value={bringing} onChange={setBringing} placeholder="" />
          <RotatingPrompt label="Why?" prompts={WHY_PROMPTS} value={why} onChange={setWhy} placeholder="" />

          {/* This Is Happening */}
          <div style={{ borderTop: "1px solid #F0F0F0", paddingTop: 20 }}>
            <button onClick={() => setShowPicker(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8470A", flexShrink: 0 }} />
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#E8470A", textTransform: "uppercase", margin: 0 }}>This Is Happening…</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: "3px 0 0", fontFamily: "Inter, sans-serif" }}>
                    {currentStatus ? `${currentStatus.icon} ${currentStatus.label}` : "Choose your mission status"}
                  </p>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 3l6 6-6 6" stroke="#E8470A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= (currentStatus?.gaugeLevel ?? 3) ? "#E8470A" : "#E8E8E8", transition: "background 0.3s" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "32px 24px 56px" }}>
        {error && <p style={{ color: "#E8470A", fontSize: 14, textAlign: "center", marginBottom: 12 }}>{error}</p>}
        <button onClick={handleSend} style={{
          width: "100%", background: "#111", color: "#fff",
          padding: "16px 24px", borderRadius: 12, fontSize: 16,
          fontWeight: 700, border: "none", cursor: "pointer",
          letterSpacing: "0.01em", fontFamily: "Inter, sans-serif",
        }}>
          I&apos;M COMING OVER →
        </button>
      </div>

      {/* Date Picker */}
      {showDatePicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "flex-end" }} onClick={() => setShowDatePicker(false)}>
          <div style={{ background: "#fff", width: "100%", borderRadius: "16px 16px 0 0", padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <button onClick={() => setShowDatePicker(false)} style={{ color: "#888", fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Pick a time</span>
              <button onClick={handleDateConfirm} style={{ color: "#E8470A", fontSize: 14, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Done</button>
            </div>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              style={{ width: "100%", border: "1px solid #E8E8E8", borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12 }}
              min={new Date().toISOString().split("T")[0]} />
            <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)}
              style={{ width: "100%", border: "1px solid #E8E8E8", borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 16 }} />
            <button onClick={handleDateConfirm} style={{ width: "100%", background: "#111", color: "#fff", padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer" }}>Set Time</button>
          </div>
        </div>
      )}

      {/* This Is Happening Picker */}
      {showPicker && (
        <ThisIsHappeningPicker
          value={arrivalStatus}
          onChange={setArrivalStatus}
          onConfirm={() => setShowPicker(false)}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// Real M icon — cropped from actual logo file
function MHero({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/m-icon.png"
      alt="MEVITE"
      style={{ width: size, height: size, objectFit: "contain", objectPosition: "center", display: "block" }}
    />
  );
}
