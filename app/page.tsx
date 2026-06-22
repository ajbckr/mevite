"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RotatingPrompt } from "@/components/RotatingPrompt";
import { ArrivalGauge, ThisIsHappeningPicker } from "@/components/ArrivalGauge";
import { createMevite } from "@/lib/mevite";
import { ArrivalStatus, ARRIVAL_STATUSES, WHO_PROMPTS, BRINGING_PROMPTS, WHY_PROMPTS } from "@/lib/types";

const WHEN_ROTATE = ["This Weekend", "Tomorrow Night", "Friday at 8", "Next Monday", "Sunday Afternoon"];

export default function Home() {
  const router = useRouter();

  // Form state
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

  // Logo shrink state
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Rotate when placeholders
  useEffect(() => {
    const t = setInterval(() => setWhenIdx(i => (i + 1) % WHEN_ROTATE.length), 2500);
    return () => clearInterval(t);
  }, []);

  // Shrink logo on first field interaction OR scroll
  const handleInteract = useCallback(() => {
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) setIsScrolled(true);
      else if (!hasInteracted) setIsScrolled(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasInteracted]);

  const stickyVisible = isScrolled || hasInteracted;

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

  const currentStatus = ARRIVAL_STATUSES.find(s => s.key === arrivalStatus);

  if (sending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111]">
        <div className="text-center space-y-5 animate-fade-in px-8">
          <Image src="/logo.jpg" alt="MEVITE" width={64} height={64} style={{ borderRadius: 8, objectFit: "contain", margin: "0 auto" }} />
          <p className="text-white text-xl font-black">Sending your Mevite…</p>
          <div className="flex gap-2 justify-center">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#FF4C00]"
                style={{ animation: `pulseDot 1.2s ease-in-out ${i*0.2}s infinite` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── STICKY NAV (appears after interaction) ── */}
      <div className={`sticky-nav ${stickyVisible ? "visible" : ""}`}>
        <div className="px-5 py-3 flex items-center gap-3">
          <Image src="/logo.jpg" alt="MEVITE" width={32} height={32}
            style={{ borderRadius: 4, objectFit: "contain" }} priority />
          <span className="text-sm font-black tracking-tight text-[#111]">MEVITE</span>
          <span className="text-[#FF4C00] text-sm font-black">·</span>
          <span className="text-xs text-[#888] font-medium">Invite Yourself Over.</span>
        </div>
      </div>

      {/* ── HERO LOGO ── */}
      <div className={`logo-hero-wrap transition-all duration-500 ${
        stickyVisible
          ? "pt-[60px] pb-4 px-6"   // compact once interacted
          : "pt-12 pb-8 px-6"        // large on load
      }`}>

        {/* Logo mark — shrinks on interact */}
        <div className={`logo-hero transition-all duration-500 ${
          stickyVisible ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}>
          <Image
            src="/logo.jpg"
            alt="MEVITE"
            width={stickyVisible ? 0 : 88}
            height={stickyVisible ? 0 : 88}
            style={{
              borderRadius: 12,
              objectFit: "contain",
              transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
            }}
            priority
          />
        </div>

        {/* Hero headline — stays but shrinks */}
        <div className={`transition-all duration-500 ${stickyVisible ? "mt-2" : "mt-6"}`}>
          <h1 className={`font-black leading-[0.95] tracking-tight text-[#111] transition-all duration-500 ${
            stickyVisible ? "text-[2rem]" : "text-[3.6rem]"
          }`}>
            Invite<br />
            Yourself<br />
            Over<span className="text-[#FF4C00]">.</span>
          </h1>

          <p className={`text-[#888] leading-relaxed transition-all duration-500 ${
            stickyVisible ? "text-xs mt-1 opacity-0 h-0 overflow-hidden" : "text-sm mt-4 opacity-100"
          }`}>
            Stop saying &ldquo;we should get together.&rdquo;<br />Show up.
          </p>
        </div>
      </div>

      {/* ── FORM ── */}
      <div ref={formRef} className="px-6 space-y-7" onFocus={handleInteract} onClick={handleInteract}>

        <RotatingPrompt
          label="Who are you showing up for?"
          prompts={WHO_PROMPTS}
          value={who}
          onChange={v => { setWho(v); handleInteract(); }}
          placeholder=""
        />

        {/* When */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">When?</label>
          <button onClick={() => { setShowDatePicker(true); handleInteract(); }} className="w-full text-left">
            <div className={`text-xl pb-3 border-b border-[#E0E0E0] w-full ${when ? "text-[#111] font-semibold" : "text-[#CCC]"}`}>
              {when || WHEN_ROTATE[whenIdx]}
            </div>
          </button>
        </div>

        <RotatingPrompt
          label="What are you bringing?"
          prompts={BRINGING_PROMPTS}
          value={bringing}
          onChange={v => { setBringing(v); handleInteract(); }}
          placeholder=""
        />

        <RotatingPrompt
          label="Why?"
          prompts={WHY_PROMPTS}
          value={why}
          onChange={v => { setWhy(v); handleInteract(); }}
          placeholder=""
        />

        {/* This Is Happening trigger */}
        <div className="border-t border-[#F0F0F0] pt-5">
          <button onClick={() => { setShowPicker(true); handleInteract(); }}
            className="w-full flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#FF4C00]" />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF4C00]">
                  This Is Happening…
                </p>
                <p className="text-sm font-bold text-[#111] mt-0.5">
                  {currentStatus ? `${currentStatus.icon} ${currentStatus.label}` : "Choose your mission status"}
                </p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
              className="text-[#FF4C00] group-hover:translate-x-0.5 transition-transform">
              <path d="M6 3l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="mt-3 flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= (currentStatus?.gaugeLevel ?? 3) ? "bg-[#FF4C00]" : "bg-[#E8E8E8]"
              }`} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pt-8 pb-14">
        {error && <p className="text-[#FF4C00] text-sm text-center mb-3">{error}</p>}
        <button onClick={handleSend} className="cta-btn">
          I&apos;M COMING OVER →
        </button>
      </div>

      {/* ── DATE PICKER SHEET ── */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={() => setShowDatePicker(false)}>
          <div className="bg-white w-full rounded-t-2xl p-6 space-y-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <button onClick={() => setShowDatePicker(false)} className="text-[#888] text-sm font-medium">Cancel</button>
              <p className="text-sm font-black">Pick a time</p>
              <button onClick={handleDateConfirm} className="text-[#FF4C00] text-sm font-bold">Done</button>
            </div>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="w-full border border-[#E8E8E8] rounded-xl p-3 text-sm"
              min={new Date().toISOString().split("T")[0]} />
            <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)}
              className="w-full border border-[#E8E8E8] rounded-xl p-3 text-sm" />
            <button onClick={handleDateConfirm} className="cta-btn">Set Time</button>
          </div>
        </div>
      )}

      {/* ── THIS IS HAPPENING PICKER ── */}
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
