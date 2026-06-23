"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { subscribeMevite, respondToMevite, updateArrivalStatus, confirmSuggestion } from "@/lib/mevite";
import { Mevite, ARRIVAL_STATUSES, ArrivalStatus } from "@/lib/types";

const ORANGE = "#E8470A";

// Arrival status display config — door states with icons
const STATUS_DISPLAY: Record<string, { label: string; icon: string; sub: string }> = {
  "maybe":         { label: "Maybe",         icon: "💭", sub: "It's a thought." },
  "probably":      { label: "Probably",       icon: "📅", sub: "Calendars are open." },
  "definitely":    { label: "Definitely",     icon: "🎒", sub: "It's happening." },
  "on-my-way":     { label: "On My Way",      icon: "🚗", sub: "No turning back." },
  "open-the-door": { label: "Open The Door",  icon: "🚪", sub: "I'm outside." },
};

export default function MissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mevite, setMevite] = useState<Mevite | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [view, setView] = useState<"receiver" | "sender">("receiver");

  useEffect(() => {
    const unsub = subscribeMevite(id, (m) => {
      setMevite(m);
      setLoading(false);
    });
    return unsub;
  }, [id]);

  const handleResponse = async (response: "obviously" | "adjust" | "terrible") => {
    if (response === "adjust") {
      router.push(`/m/${id}/adjust`);
      return;
    }
    setResponding(true);
    await respondToMevite(id, response);
    setResponding(false);
  };

  const handleConfirmSuggestion = async () => {
    setResponding(true);
    await confirmSuggestion(id);
    setResponding(false);
  };

  const handleStatusUpdate = async (status: ArrivalStatus) => {
    await updateArrivalStatus(id, status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#E8470A]"
              style={{ animation: `pulseDot 1.2s ease-in-out ${i*0.2}s infinite` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!mevite) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black">Mevite not found.</h2>
          <p className="text-[#888] text-sm">This link may be expired or invalid.</p>
        </div>
      </div>
    );
  }

  const isLocked   = mevite.status === "locked";
  const isAdjusting = mevite.status === "adjusting";
  const isDeclined  = mevite.status === "declined";
  const hasSuggestion = !!mevite.suggestedChange;
  const senderName   = (mevite.sender || mevite.who).split(" ")[0];
  const statusColor  = isLocked ? "#22c55e" : isDeclined ? "#888" : ORANGE;
  const arrivalInfo  = STATUS_DISPLAY[mevite.arrivalStatus] ?? STATUS_DISPLAY["definitely"];

  const whenDisplay = isLocked && hasSuggestion
    ? `${mevite.suggestedChange!.newDate}${mevite.suggestedChange!.newTime ? ` at ${mevite.suggestedChange!.newTime}` : ""}`
    : mevite.when;

  return (
    <div className="min-h-screen bg-white">
      {/* Top accent bar */}
      <div className="w-full h-1" style={{ background: statusColor }} />

      <div className="max-w-md mx-auto px-6 pt-8 pb-16 space-y-8">

        {/* View toggle — "Your view" / senderName */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-[#F5F5F5] rounded-full p-1">
            <button onClick={() => setView("receiver")}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${view === "receiver" ? "bg-white text-[#111] shadow-sm" : "text-[#888]"}`}>
              Your view
            </button>
            <button onClick={() => setView("sender")}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${view === "sender" ? "bg-white text-[#111] shadow-sm" : "text-[#888]"}`}>
              {senderName}&apos;s view
            </button>
          </div>
        </div>

        {/* Hero headline */}
        <div className="animate-slide-up space-y-4">
          <h1 className="text-[2.8rem] font-black leading-[1.0] tracking-tight">
            {senderName}<br />
            is coming<br />
            over<span style={{ color: ORANGE }}>.</span>
          </h1>

          {/* Status pill */}
          <div>
            {isLocked && (
              <span className="status-pill bg-[#dcfce7] text-[#16a34a]">✓ Locked In</span>
            )}
            {isAdjusting && (
              <span className="status-pill bg-[#fff3ed] text-[#E8470A]">↔ Adjusting Plans</span>
            )}
            {isDeclined && (
              <span className="status-pill bg-[#F5F5F5] text-[#888]">Terrible Timing</span>
            )}
            {mevite.status === "pending" && (
              <span className="status-pill bg-[#fff3ed] text-[#E8470A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8470A] inline-block animate-pulse mr-1" />
                This Is Happening
              </span>
            )}
          </div>
        </div>

        {/* ── ARRIVAL STATUS — live, prominent ── */}
        <div style={{
          background: "#0f0f0f",
          borderRadius: 16,
          padding: "20px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <span style={{ fontSize: 36, lineHeight: 1 }}>{arrivalInfo.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE, margin: "0 0 2px", fontFamily: "Inter, system-ui, sans-serif" }}>
              Right now
            </p>
            <p style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 1px", fontFamily: "Inter, system-ui, sans-serif", lineHeight: 1.1 }}>
              {arrivalInfo.label}
            </p>
            <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "Inter, system-ui, sans-serif" }}>
              {arrivalInfo.sub}
            </p>
          </div>
          {/* Gauge dots */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[5,4,3,2,1].map(i => {
              const level = ARRIVAL_STATUSES.find(s => s.key === mevite.arrivalStatus)?.gaugeLevel ?? 3;
              return (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: i <= level ? ORANGE : "#333",
                  transition: "background 0.3s",
                }} />
              );
            })}
          </div>
        </div>

        {/* ── THE MESSAGE — emotional center ── */}
        <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: 16 }}>
          <p style={{
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.3,
            color: "#111",
            margin: "0 0 4px",
            fontFamily: "Inter, system-ui, sans-serif",
            fontStyle: "italic",
          }}>
            &ldquo;{mevite.why}&rdquo;
          </p>
          <p style={{ fontSize: 12, color: "#AAA", margin: 0, fontFamily: "Inter, system-ui, sans-serif" }}>
            — {senderName}
          </p>
        </div>

        {/* ── LOGISTICS — lighter weight ── */}
        <div className="space-y-2">
          {hasSuggestion && isAdjusting ? (
            <>
              <LogRow icon="cal" label="When" value={mevite.when} muted />
              <div className="rounded-xl border border-[#E8470A]/30 bg-[#fff3ed] p-3 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#E8470A]">Proposed change</p>
                <LogRow icon="cal" label="New time" value={`${mevite.suggestedChange!.newDate}${mevite.suggestedChange!.newTime ? ` at ${mevite.suggestedChange!.newTime}` : ""}`} />
                {mevite.suggestedChange!.note && (
                  <p className="text-xs text-[#888] italic pl-6">&ldquo;{mevite.suggestedChange!.note}&rdquo;</p>
                )}
              </div>
            </>
          ) : (
            <LogRow icon="cal" label="When" value={whenDisplay} />
          )}
          <LogRow icon="bag" label="Bringing" value={mevite.bringing} />
        </div>

        {/* ── RECEIVER RESPONSE BUTTONS ── */}
        {view === "receiver" && !isLocked && !isDeclined && (
          <div className="space-y-3">
            {hasSuggestion && isAdjusting ? (
              <>
                <button onClick={handleConfirmSuggestion} disabled={responding} className="response-btn obviously">
                  Works for me ✓
                </button>
                <button onClick={() => router.push(`/m/${id}/adjust`)} className="response-btn adjust">
                  Different day?
                </button>
                <button onClick={() => handleResponse("terrible")} disabled={responding} className="response-btn terrible">
                  Terrible timing.
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleResponse("obviously")} disabled={responding} className="response-btn obviously">
                  Obviously.
                </button>
                <button onClick={() => handleResponse("adjust")} disabled={responding} className="response-btn adjust">
                  Different day?
                </button>
                <button onClick={() => handleResponse("terrible")} disabled={responding} className="response-btn terrible">
                  Terrible timing.
                </button>
              </>
            )}
          </div>
        )}

        {/* LOCKED STATE */}
        {isLocked && (
          <div className="mevite-card border-[#bbf7d0] bg-[#f0fdf4] text-center space-y-2 py-6">
            <p className="text-3xl">🎉</p>
            <p className="text-xl font-black text-[#16a34a]">It&apos;s on.</p>
            <p className="text-sm text-[#555]">
              {mevite.confirmedAt
                ? `Confirmed ${new Date(mevite.confirmedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
                : "Plan confirmed."}
            </p>
          </div>
        )}

        {/* DECLINED STATE */}
        {isDeclined && (
          <div className="mevite-card bg-[#F5F5F5] text-center space-y-2 py-6">
            <p className="text-3xl">😬</p>
            <p className="text-xl font-black text-[#888]">Terrible timing.</p>
            <p className="text-sm text-[#888]">Maybe next time.</p>
          </div>
        )}

        {/* SENDER VIEW — update arrival status */}
        {view === "sender" && (
          <div className="space-y-4">
            <div className="mevite-card space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#888]">Update where you&apos;re at</p>
              <div className="space-y-2">
                {ARRIVAL_STATUSES.map(s => {
                  const info = STATUS_DISPLAY[s.key];
                  return (
                    <button key={s.key} onClick={() => handleStatusUpdate(s.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                        mevite.arrivalStatus === s.key ? "border-[#E8470A] bg-[#E8470A]/5" : "border-[#E8E8E8] hover:border-[#CCC]"
                      }`}>
                      <span style={{ fontSize: 20 }}>{info.icon}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${mevite.arrivalStatus === s.key ? "text-[#111]" : "text-[#444]"}`}>{info.label}</p>
                        <p className="text-xs text-[#888] mt-0.5">{info.sub}</p>
                      </div>
                      {mevite.arrivalStatus === s.key && (
                        <div className="w-4 h-4 rounded-full bg-[#E8470A] flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Share link */}
            <div className="mevite-card space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#888]">Share your Mevite</p>
              <div className="bg-[#F5F5F5] rounded-lg px-3 py-2 font-mono text-xs text-[#555] break-all">
                {typeof window !== "undefined" ? window.location.href : ""}
              </div>
              <button onClick={() => {
                navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
              }} className="cta-btn text-sm">Copy Link</button>
            </div>
          </div>
        )}

        {/* Add to Calendar (when locked) */}
        {isLocked && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#888]">Add to Calendar</p>
            <div className="flex gap-3">
              <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${senderName} is coming over`)}&details=${encodeURIComponent(`Bringing: ${mevite.bringing}\n${mevite.why}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border border-[#E8E8E8] rounded-xl py-3 text-sm font-semibold text-[#111] hover:bg-[#F5F5F5] transition-colors">
                G Google
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#E8E8E8] rounded-xl py-3 text-sm font-semibold text-[#111] hover:bg-[#F5F5F5] transition-colors">
                🍎 Apple
              </button>
            </div>
          </div>
        )}

        {/* Live Timeline */}
        {mevite.timeline && mevite.timeline.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#888]">Timeline</p>
            <div className="space-y-3">
              {mevite.timeline.map((evt, i) => (
                <div key={evt.id} className="flex gap-3 items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${i === mevite.timeline.length - 1 ? "bg-[#E8470A]" : "bg-[#DDD]"}`} />
                  <div>
                    <p className="text-sm text-[#111] font-medium">{evt.label}</p>
                    <p className="text-xs text-[#AAA]">
                      {new Date(evt.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer link */}
        <div className="pt-4 border-t border-[#E8E8E8] text-center">
          <button onClick={() => router.push("/")} className="text-xs text-[#888] hover:text-[#E8470A] transition-colors font-medium">
            Make your own Mevite →
          </button>
        </div>
      </div>
    </div>
  );
}

// Lightweight logistics row — no card weight
const LOG_ICONS: Record<string, React.ReactNode> = {
  cal: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:2}}>
      <rect x="1" y="2" width="14" height="13" rx="2" stroke="#E8470A" strokeWidth="1.5" fill="none"/>
      <path d="M5 1v2M11 1v2M1 6h14" stroke="#E8470A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  bag: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:2}}>
      <path d="M3 3h10l-1 8H4L3 3z" stroke="#E8470A" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M1 3h14" stroke="#E8470A" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 3V2a2 2 0 014 0v1" stroke="#E8470A" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
};

function LogRow({ icon, label, value, muted = false }: { icon: string; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex gap-3 items-start">
      {LOG_ICONS[icon]}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#AAA] mb-0.5">{label}</p>
        <p className={`text-sm font-semibold leading-snug ${muted ? "text-[#CCC] line-through" : "text-[#111]"}`}>{value}</p>
      </div>
    </div>
  );
}
