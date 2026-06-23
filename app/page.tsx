"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotatingPrompt, WhenField } from "@/components/RotatingPrompt";
import { DoorSlider } from "@/components/DoorSlider";
import { createMevite } from "@/lib/mevite";
import { ArrivalStatus, ARRIVAL_STATUSES, WHO_PROMPTS, BRINGING_PROMPTS, WHY_PROMPTS, SENDER_PROMPTS } from "@/lib/types";
import { MeviteFooter } from "@/components/MeviteFooter";

const WHEN_ROTATE = ["This Weekend", "Tomorrow Night", "Friday at 8", "Next Monday", "Sunday Afternoon"];
const f: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };

const ORANGE = "#E8470A";

// Reuses the same door geometry as DoorSlider
const FX = 30, FY = 10, FW = 100, FH = 158, FS = 8;
const IX = FX + FS / 2;
const IY = FY + FS / 2;
const IW = FW - FS;
const IH = FH - FS;

function AnimatedDoor({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const panelW = Math.max(1, IW * Math.cos(rad));
  const skew = Math.sin(rad) * 4;
  const lightOpacity = Math.pow(angle / 85, 1.2) * 0.5;
  const floorY = FY + FH + FS / 2;
  const p = {
    tl: { x: IX,          y: IY },
    tr: { x: IX + panelW, y: IY + skew },
    br: { x: IX + panelW, y: IY + IH - skew },
    bl: { x: IX,          y: IY + IH },
  };
  const knobFrac = 0.75;
  const knobX = IX + panelW * knobFrac;
  const knobY = IY + IH * 0.54 + skew * knobFrac;

  return (
    <svg width="180" height="200" viewBox="0 0 180 200" fill="none" style={{ display: "block" }}>
      {angle > 3 && (
        <rect x={IX + panelW} y={IY}
          width={Math.max(0, IW - panelW)} height={IH}
          fill={ORANGE} opacity={lightOpacity} />
      )}
      <polygon
        points={`${p.tl.x},${p.tl.y} ${p.tr.x},${p.tr.y} ${p.br.x},${p.br.y} ${p.bl.x},${p.bl.y}`}
        fill={ORANGE}
      />
      {panelW > 12 && (
        <circle cx={knobX} cy={knobY} r={3.5}
          fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
      )}
      <rect x={FX} y={FY} width={FW} height={FH} rx="2"
        fill="none" stroke={ORANGE} strokeWidth={FS} strokeLinejoin="miter" />
      <rect x={FX - 10} y={floorY} width={FW + 20} height={10} rx="3" fill={ORANGE} />
    </svg>
  );
}

function SendingScreen() {
  const [angle, setAngle] = useState(2);
  const [phase, setPhase] = useState<"swing" | "hold">("swing");

  useEffect(() => {
    // Swing from 2° → 85° over 900ms with easeOut feel
    const start = performance.now();
    const duration = 900;
    const from = 2, to = 85;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setAngle(from + (to - from) * eased);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setPhase("hold");
      }
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      {/* Door */}
      <div style={{
        opacity: 1,
        transform: "scale(1.1)",
      }}>
        <AnimatedDoor angle={angle} />
      </div>

      {/* Logo + copy fade in after door opens */}
      <div style={{
        marginTop: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: phase === "hold" ? 1 : 0,
        transform: phase === "hold" ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/m-lockup.png" alt="MEVITE"
          style={{ height: 64, width: "auto", filter: "invert(1)", opacity: 0.9 }} />
        <p style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#555",
          margin: 0,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Sending your mevite…
        </p>
      </div>
    </div>
  );
}

// ── Sticky shrinking nav ───────────────────────────────────────────
function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "#fff",
      borderBottom: scrolled ? "1px solid #EBEBEB" : "none",
      transition: "all 0.3s ease",
      display: "flex",
      justifyContent: "center",
      padding: scrolled ? "10px 20px" : "28px 20px 16px",
    }}>
      <button
        onClick={() => router.push("/")}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", justifyContent: "center" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mevite-wordmark.png"
          alt="MEVITE"
          style={{
            height: scrolled ? 28 : 52,
            width: "auto",
            display: "block",
            transition: "height 0.3s ease",
          }}
        />
      </button>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [who, setWho] = useState("");
  const [sender, setSender] = useState("");
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
    if (!selectedDate) return;
    const chosen = new Date(`${selectedDate}T${selectedTime}`);
    if (chosen <= new Date()) {
      setError("Please pick a future date and time.");
      setShowDatePicker(false);
      return;
    }
    const d = new Date(selectedDate + "T00:00:00");
    const dayStr = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const [h] = selectedTime.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    setWhen(`${dayStr} at ${h12}:${selectedTime.split(":")[1]} ${ampm}`);
    setError("");
    setShowDatePicker(false);
  };

  const handleSend = async () => {
    if (!who.trim() || !bringing.trim() || !why.trim() || !sender.trim()) {
      setError("Fill in who, what you're bringing, why, and your name.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const id = await createMevite({ who, sender, when: when || WHEN_ROTATE[whenIdx], bringing, why, arrivalStatus, senderPhone: "" });
      router.push(`/share/${id}`);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Try again.");
      setSending(false);
    }
  };

  if (sending) {
    return <SendingScreen />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── STICKY NAV — large on load, shrinks on scroll ── */}
      <StickyNav />

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
        <RotatingPrompt label="Who's showing up? (you)" prompts={SENDER_PROMPTS} value={sender} onChange={setSender} placeholder="" />

        <div style={{ paddingTop: 4 }}>
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

      {showDatePicker && (() => {
        const today = new Date().toISOString().split("T")[0];
        const nowTime = new Date().toTimeString().slice(0, 5);
        const isPast = !selectedDate || new Date(`${selectedDate}T${selectedTime}`) <= new Date();
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "flex-end" }} onClick={() => setShowDatePicker(false)}>
            <div style={{ background: "#fff", width: "100%", borderRadius: "16px 16px 0 0", padding: 24 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <button onClick={() => setShowDatePicker(false)} style={{ color: "#888", fontSize: 14, background: "none", border: "none", cursor: "pointer", ...f }}>Cancel</button>
                <span style={{ fontSize: 14, fontWeight: 700, ...f }}>Pick a time</span>
                <button onClick={handleDateConfirm} disabled={isPast} style={{ color: isPast ? "#CCC" : "#E8470A", fontSize: 14, fontWeight: 700, background: "none", border: "none", cursor: isPast ? "not-allowed" : "pointer", ...f }}>Done</button>
              </div>
              {isPast && selectedDate && (
                <p style={{ fontSize: 12, color: "#E8470A", textAlign: "center", margin: "0 0 12px", ...f }}>Pick a future date and time.</p>
              )}
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: "100%", border: "1px solid #E8E8E8", borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} min={today} />
              <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ width: "100%", border: "1px solid #E8E8E8", borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} min={selectedDate === today ? nowTime : undefined} />
              <button onClick={handleDateConfirm} disabled={isPast} style={{ width: "100%", background: isPast ? "#CCC" : "#111", color: "#fff", padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, border: "none", cursor: isPast ? "not-allowed" : "pointer", ...f }}>Set Time</button>
            </div>
          </div>
        );
      })()}

      {showPicker && (
        <DoorSlider value={arrivalStatus} onChange={setArrivalStatus} onConfirm={() => setShowPicker(false)} onClose={() => setShowPicker(false)} />
      )}

      {/* ── FOOTER ── */}
      <MeviteFooter />
    </div>
  );
}
