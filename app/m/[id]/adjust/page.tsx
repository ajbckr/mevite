"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { suggestChange } from "@/lib/mevite";
import { MeviteIcon } from "@/components/MeviteIcon";

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

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 14l7 7L23 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-black">Suggestion<br />sent<span className="text-[#FF4C00]">.</span></h2>
          <p className="text-[#888] text-sm mt-2 max-w-[220px] mx-auto">
            They&apos;ll see it on the mission page and can respond.
          </p>
        </div>
        <button
          onClick={() => router.push(`/m/${id}`)}
          className="cta-btn max-w-xs w-full"
        >
          VIEW MISSION →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 pt-12 pb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-[#888]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <MeviteIcon size={28} />
      </header>

      <div className="px-6 space-y-8">
        <div>
          <h1 className="text-3xl font-black leading-tight">
            Let&apos;s adjust<br />the plan<span className="text-[#FF4C00]">.</span>
          </h1>
          <p className="text-[#888] text-sm mt-2">What works better?</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">
              New Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mevite-input text-base"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">
              New Time
            </label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="mevite-input text-base"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">
              Add a note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How about Saturday instead? Or next week?"
              className="mevite-input text-base"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 pb-12">
          <button
            onClick={handleSend}
            disabled={sending || (!newDate && !newTime && !note)}
            className="cta-btn orange"
            style={{ opacity: (!newDate && !newTime && !note) ? 0.4 : 1 }}
          >
            {sending ? "Sending…" : "SEND SUGGESTION →"}
          </button>
          <p className="text-xs text-[#888] text-center">
            They&apos;ll see this suggestion on the mission page.
          </p>
          <button
            onClick={() => router.back()}
            className="w-full text-center text-sm text-[#888] py-2"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
