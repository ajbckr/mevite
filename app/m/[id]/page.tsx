"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { subscribeMevite, respondToMevite, updateArrivalStatus, confirmSuggestion } from "@/lib/mevite";
import { Mevite, ARRIVAL_STATUSES, ArrivalStatus } from "@/lib/types";
import { MeviteHeaderCompact } from "@/components/MeviteHeader";
import { ArrivalGauge } from "@/components/ArrivalGauge";

export default function MissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mevite, setMevite] = useState<Mevite | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
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
    setShowStatusPicker(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#FF4C00]"
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

  const isLocked = mevite.status === "locked";
  const isAdjusting = mevite.status === "adjusting";
  const isDeclined = mevite.status === "declined";
  const hasSuggestion = !!mevite.suggestedChange;
  const firstName = mevite.who.split(" ")[0];

  // Status color
  const statusColor = isLocked ? "#22c55e" : isDeclined ? "#888" : "#FF4C00";

  return (
    <div className="min-h-screen bg-white">
      {/* Top status bar */}
      <div className="w-full h-1" style={{ background: statusColor }} />

      <div className="max-w-md mx-auto px-6 pt-8 pb-16 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between">
          
          <div className="flex gap-1 bg-[#F5F5F5] rounded-full p-1">
            <button onClick={() => setView("receiver")}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${view === "receiver" ? "bg-white text-[#111] shadow-sm" : "text-[#888]"}`}>
              Their view
            </button>
            <button onClick={() => setView("sender")}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${view === "sender" ? "bg-white text-[#111] shadow-sm" : "text-[#888]"}`}>
              My view
            </button>
          </div>
        </div>

        {/* Hero headline */}
        <div className="animate-slide-up">
          <h1 className="text-[2.8rem] font-black leading-[1.0] tracking-tight">
            {firstName}<br />
            is coming<br />
            over<span className="text-[#FF4C00]">.</span>
          </h1>

          {/* Status pill */}
          <div className="mt-4">
            {isLocked && (
              <span className="status-pill bg-[#dcfce7] text-[#16a34a]">
                ✓ Locked In
              </span>
            )}
            {isAdjusting && (
              <span className="status-pill bg-[#fff3ed] text-[#FF4C00]">
                ↔ Adjusting Plans
              </span>
            )}
            {isDeclined && (
              <span className="status-pill bg-[#F5F5F5] text-[#888]">
                Terrible Timing
              </span>
            )}
            {mevite.status === "pending" && (
              <span className="status-pill bg-[#fff3ed] text-[#FF4C00]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C00] inline-block animate-pulse mr-1" />
                Incoming
              </span>
            )}
          </div>
        </div>

        {/* Plan details card */}
        <div className="mevite-card space-y-3">
          {hasSuggestion && isAdjusting ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Original Plan</p>
              <PlanRow icon="📅" value={mevite.when} muted />
              <div className="border-t border-[#E8E8E8] pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF4C00]">Proposed Change</p>
                  <span className="bg-[#FF4C00] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                </div>
                <PlanRow icon="📅" value={`${mevite.suggestedChange!.newDate}${mevite.suggestedChange!.newTime ? ` at ${mevite.suggestedChange!.newTime}` : ""}`} />
                {mevite.suggestedChange!.note && (
                  <p className="text-xs text-[#888] mt-1.5 italic pl-6">&ldquo;{mevite.suggestedChange!.note}&rdquo;</p>
                )}
              </div>
            </>
          ) : (
            <PlanRow icon="📅" value={isLocked && hasSuggestion
              ? `${mevite.suggestedChange!.newDate}${mevite.suggestedChange!.newTime ? ` at ${mevite.suggestedChange!.newTime}` : ""}`
              : mevite.when} />
          )}
          <PlanRow icon="🛍" value={mevite.bringing} />
          <PlanRow icon="💬" value={mevite.why} />
          <div className="pt-2 border-t border-[#E8E8E8]">
            <ArrivalGauge status={mevite.arrivalStatus} />
          </div>
        </div>

        {/* RECEIVER RESPONSE BUTTONS */}
        {view === "receiver" && !isLocked && !isDeclined && (
          <div className="space-y-3">
            {hasSuggestion && isAdjusting ? (
              <>
                <p className="text-xs text-[#888] text-center font-medium">Does this new plan work for you?</p>
                <button onClick={handleConfirmSuggestion} disabled={responding} className="response-btn obviously">
                  Works for me ✓
                </button>
                <button onClick={() => router.push(`/m/${id}/adjust`)} className="response-btn adjust">
                  Suggest a different time
                </button>
                <button onClick={() => handleResponse("terrible")} disabled={responding} className="response-btn terrible">
                  No, can&apos;t do that
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-[#888] text-center font-medium">
                  {firstName} wants to come over. What do you say?
                </p>
                <button onClick={() => handleResponse("obviously")} disabled={responding} className="response-btn obviously">
                  Obviously.
                </button>
                <button onClick={() => handleResponse("adjust")} disabled={responding} className="response-btn adjust">
                  Let&apos;s adjust the plan.
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
              <p className="text-xs font-bold uppercase tracking-wider text-[#888]">Update your arrival status</p>
              <p className="text-xs text-[#888]">Everyone on the mission page sees the latest.</p>
              <div className="space-y-2">
                {ARRIVAL_STATUSES.map(s => (
                  <button key={s.key} onClick={() => handleStatusUpdate(s.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                      mevite.arrivalStatus === s.key ? "border-[#FF4C00] bg-[#FF4C00]/5" : "border-[#E8E8E8] hover:border-[#CCC]"
                    }`}>
                    <div>
                      <p className={`text-sm font-semibold ${mevite.arrivalStatus === s.key ? "text-[#111]" : "text-[#444]"}`}>{s.label}</p>
                      <p className="text-xs text-[#888] mt-0.5">{s.description}</p>
                    </div>
                    {mevite.arrivalStatus === s.key && (
                      <div className="w-4 h-4 rounded-full bg-[#FF4C00] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Share link again */}
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
              <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${firstName} is coming over`)}&details=${encodeURIComponent(`Bringing: ${mevite.bringing}\n${mevite.why}`)}`}
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
            <p className="text-xs font-bold uppercase tracking-wider text-[#888]">Live Timeline</p>
            <div className="space-y-3">
              {mevite.timeline.map((evt, i) => (
                <div key={evt.id} className="flex gap-3 items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${i === mevite.timeline.length - 1 ? "bg-[#FF4C00]" : "bg-[#DDD]"}`} />
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

        {/* Mevite your own link */}
        <div className="pt-4 border-t border-[#E8E8E8] text-center">
          <button onClick={() => router.push("/")} className="text-xs text-[#888] hover:text-[#FF4C00] transition-colors font-medium">
            Make your own Mevite →
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanRow({ icon, value, muted = false }: { icon: string; value: string; muted?: boolean }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-base shrink-0">{icon}</span>
      <span className={`text-sm font-semibold leading-snug ${muted ? "text-[#BBB] line-through" : "text-[#111]"}`}>{value}</span>
    </div>
  );
}
