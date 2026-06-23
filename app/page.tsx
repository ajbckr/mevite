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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Door cycles closed → open → closed, 2s per cycle, loops
    const cycleDuration = 4000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) % cycleDuration;
      const t = elapsed / cycleDuration; // 0→1 per cycle

      // Ease in-out sine for a natural swing feel
      // First half: open (2°→85°), second half: close (85°→2°)
      let doorT: number;
      if (t < 0.5) {
        doorT = t * 2; // 0→1 opening
      } else {
        doorT = 1 - (t - 0.5) * 2; // 1→0 closing
      }
      const eased = 0.5 - Math.cos(doorT * Math.PI) / 2; // smooth sine
      setAngle(2 + (85 - 2) * eased);

      // Progress bar fills over 2s total (one cycle = brand moment)
      const totalElapsed = now - start;
      setProgress(Math.min(totalElapsed / 4000, 1));

      requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "0 24px",
    }}>
      {/* Door */}
      <div style={{ transform: "scale(1.15)", marginBottom: 40 }}>
        <AnimatedDoor angle={angle} />
      </div>

      {/* Progress bar */}
      <div style={{
        width: 160,
        height: 3,
        background: "#F0F0F0",
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 20,
      }}>
        <div style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: ORANGE,
          borderRadius: 2,
          transition: "width 0.05s linear",
        }} />
      </div>

      {/* Wordmark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mevite-wordmark.png"
        alt="MEVITE"
        style={{ height: 22, width: "auto", opacity: 1 }}
      />
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
      <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>

      {/* ── HERO LOCKUP ── */}
      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/m-lockup.png" alt="MEVITE" style={{ height: 110, width: "auto", display: "block" }} />
          </div>
          <div style={{ width: 2, background: "#111", alignSelf: "stretch", margin: "0 18px", minHeight: 110 }} />
          <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.05, color: "#111", letterSpacing: "-0.01em", fontFamily: "Inter, system-ui, sans-serif" }}>
            Invite<br />Yourself<br />Over<span style={{ color: "#E8470A" }}>.</span>
          </div>
        </div>
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
    </div>
  );
}
