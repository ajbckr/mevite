"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { subscribeMevite, respondToMevite, updateArrivalStatus, confirmSuggestion } from "@/lib/mevite";
import { Mevite, ARRIVAL_STATUSES, ArrivalStatus } from "@/lib/types";
import { StatusIcon } from "@/components/StatusIcons";
import { MeviteFooter } from "@/components/MeviteFooter";
import { trackMissionView, trackViewToggle, trackReceiverResponse, trackTextResponse, trackAdjustOpen, trackSuggestionConfirmed, trackAddToCalendar, trackCommitmentUpdate } from "@/lib/analytics";

const ORANGE = "#E8470A";
const F = "Inter, system-ui, sans-serif";

const COMMITMENT: Record<string, { label: string; detail: string }> = {
  "maybe":         { label: "Maybe",          detail: "It's crossed my mind." },
  "probably":      { label: "Probably",        detail: "I'm checking calendars." },
  "definitely":    { label: "Definitely",      detail: "The plan is real now." },
  "locked-in":     { label: "Locked In",       detail: "You should expect me." },
  "open-the-door": { label: "Open The Door",   detail: "There is no scenario where I don't show up." },
};

// ── Shared Components ──────────────────────────────────────────────

function Header() {
  const router = useRouter();
  return (
    <div style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 24px", display: "flex", alignItems: "center", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
      <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mevite-wordmark.png" alt="MEVITE" style={{ height: 22, width: "auto", display: "block" }} />
      </button>
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, padding: "20px 20px", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children, color = "#AAA" }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color, margin: "0 0 10px", fontFamily: F }}>
      {children}
    </p>
  );
}

function CalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 60.88 60.36" fill="none" style={{ flexShrink: 0 }}>
      <path fill="#E8470A" d="M54.66,5.8h-5.9V1.61c0-.89-.72-1.61-1.61-1.61s-1.61.72-1.61,1.61v4.19H15.35V1.61c0-.89-.72-1.61-1.61-1.61s-1.61.72-1.61,1.61v4.19h-5.9c-3.43,0-6.22,2.79-6.22,6.22v8.54h60.88v-8.54c0-3.43-2.79-6.22-6.22-6.22ZM13.74,16.86c-2.33,0-4.22-1.89-4.22-4.22,0-1.53.82-2.87,2.04-3.61.18-.11.38-.21.58-.29v3.9c0,.89.72,1.61,1.61,1.61s1.61-.72,1.61-1.61v-3.9c.2.08.39.18.58.29,1.22.74,2.04,2.08,2.04,3.61,0,2.33-1.89,4.22-4.22,4.22ZM47.14,16.86c-2.33,0-4.22-1.89-4.22-4.22,0-1.53.82-2.87,2.04-3.61.18-.11.38-.21.58-.29v3.9c0,.89.72,1.61,1.61,1.61s1.61-.72,1.61-1.61v-3.9c.2.08.39.18.58.29,1.22.74,2.04,2.08,2.04,3.61,0,2.33-1.89,4.22-4.22,4.22Z"/>
<path fill="#E8470A" d="M0,54.14c0,3.43,2.79,6.22,6.22,6.22h48.43c3.43,0,6.22-2.79,6.22-6.22v-30.28H0v30.28ZM57.7,54.13v.19h0c0-.06,0-.13,0-.19ZM19.12,38.68c.69-.56,1.71-.46,2.27.23l6.04,7.41,12.12-16.51c.53-.72,1.54-.87,2.25-.35.72.53.87,1.54.35,2.25l-13.35,18.19c-.3.4-.76.65-1.26.66-.01,0-.03,0-.04,0-.48,0-.94-.22-1.25-.59l-7.35-9.03c-.56-.69-.46-1.71.23-2.27Z"/>
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 45.92 61.57" fill="none" style={{ flexShrink: 0 }}>
      <polygon fill="#E8470A" points="0 37.11 4.02 31.25 21.78 36.3 17.76 42.16 0 37.11"/>
<path fill="#E8470A" d="M22.25,61.57l-17.82-5.1v-16.6l13.41,3.81c.32.09.66-.03.84-.31l3.56-5.2v23.4Z"/>
<path fill="#E8470A" d="M39.87,30.32l-16.91,4.8-16.9-4.8,8.06-2.29c.52.96,1,1.93,1.44,2.93.33.76,1.09,1.22,1.88,1.22.26,0,.52-.05.77-.15.25-.11.48-.26.67-.45.19-.19.34-.42.44-.67.06-.16.11-.32.13-.49.37.53.99.87,1.67.87.06,0,.12,0,.17,0h0c.55-.05,1.04-.31,1.39-.73.12-.14.22-.3.29-.47.07.17.17.33.29.47.35.42.85.68,1.39.73h.01c.05,0,.11,0,.16,0,.67,0,1.29-.34,1.66-.86.02.16.07.33.13.48.21.51.6.91,1.11,1.12.25.1.51.15.77.15.79,0,1.54-.46,1.88-1.22.43-.99.91-1.97,1.44-2.93l8.06,2.29Z"/>
<path fill="#E8470A" d="M41.49,56.47l-17.8,5.1v-23.37l3.55,5.18c.19.27.53.4.84.31l13.41-3.81v16.6Z"/>
<polygon fill="#E8470A" points="28.16 42.16 24.14 36.29 41.9 31.25 45.92 37.11 28.16 42.16"/>
<path fill="#E8470A" d="M33.16,23.35c-1.57,2.17-2.95,4.57-4.05,7.07-.15.33-.53.49-.87.35h0c-.34-.14-.51-.54-.36-.88,1.12-2.57,2.54-5.06,4.18-7.32.13-.17.33-.28.54-.28h0c.55,0,.86.62.54,1.06Z"/>
<path fill="#E8470A" d="M17.67,30.77h0c-.34.14-.72-.02-.87-.35-1.09-2.5-2.48-4.9-4.05-7.07-.32-.44,0-1.06.54-1.06h0c.21,0,.41.1.54.27,1.64,2.26,3.06,4.75,4.19,7.33.15.34-.01.74-.36.88Z"/>
<path fill="#E8470A" d="M21.16,29.92h0c-.36.03-.68-.23-.72-.6-.39-3.7-1.35-7.38-2.74-10.65-.19-.44.13-.93.61-.93h0c.27,0,.51.16.61.4.09.21.18.42.26.64,1.31,3.26,2.2,6.84,2.57,10.4.04.37-.24.7-.61.73Z"/>
<path fill="#E8470A" d="M28.23,18.67c-1.39,3.27-2.35,6.95-2.74,10.65-.04.36-.36.63-.72.6h0c-.37-.03-.65-.36-.61-.73.37-3.56,1.26-7.15,2.57-10.4.09-.21.17-.43.26-.64.1-.25.35-.4.61-.4h0c.48,0,.8.49.61.93Z"/>
<path fill="#E8470A" d="M10.91,10.83l.96,2.51,2.71.11c.51.02.72.67.31.98l-2.11,1.64.73,2.56c.14.49-.4.88-.82.61l-2.29-1.48-2.29,1.48c-.42.27-.96-.12-.82-.61l.73-2.56-2.11-1.64c-.4-.31-.2-.96.31-.98l2.71-.11.96-2.51c.18-.47.84-.47,1.02,0Z"/>
<path fill="#E8470A" d="M36.03,10.83l.96,2.51,2.71.11c.51.02.72.67.31.98l-2.11,1.64.73,2.56c.14.49-.4.88-.82.61l-2.29-1.48-2.29,1.48c-.42.27-.96-.12-.82-.61l.73-2.56-2.11-1.64c-.4-.31-.2-.96.31-.98l2.71-.11.96-2.51c.18-.47.84-.47,1.02,0Z"/>
<path fill="#E8470A" d="M23.47.36l1.64,4.39,4.68.2c.51.02.71.66.32.97l-3.67,2.91,1.26,4.52c.14.49-.41.88-.83.6l-3.91-2.59-3.91,2.59c-.42.28-.96-.11-.83-.6l1.26-4.52-3.67-2.91c-.4-.31-.19-.95.32-.97l4.68-.2,1.64-4.39c.18-.47.85-.47,1.02,0Z"/>
    </svg>
  );
}

function GoogleCalendarBtn({ href, onClick }: { href: string; onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick} target="_blank" rel="noopener noreferrer" style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      border: "1px solid #DADCE0", borderRadius: 10, padding: "11px 12px",
      textDecoration: "none", background: "#fff",
    }}>
      <svg width="16" height="16" viewBox="0 0 18 18">
        <path d="M17.64 9.2a10.3 10.3 0 00-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 009 18z" fill="#34A853"/>
        <path d="M3.98 10.72A5.4 5.4 0 013.7 9c0-.6.1-1.18.28-1.72V4.94H.96A9 9 0 000 9c0 1.45.35 2.82.96 4.06l3.02-2.34z" fill="#FBBC05"/>
        <path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 00.96 4.94L3.98 7.28C4.66 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#3C4043", fontFamily: F }}>Google Calendar</span>
    </a>
  );
}

function AppleCalendarBtn({ icsHref, onClick }: { icsHref: string; onClick?: () => void }) {
  return (
    <a href={icsHref} onClick={onClick} download="mevite.ics" style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      border: "1px solid #DADCE0", borderRadius: 10, padding: "11px 12px",
      textDecoration: "none", background: "#fff",
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12.7 8.5c0-1.75 1.43-2.6 1.5-2.64-.82-1.2-2.1-1.36-2.55-1.38-1.08-.1-2.12.63-2.67.63-.55 0-1.4-.62-2.3-.6-1.18.02-2.27.69-2.88 1.74-1.23 2.12-.31 5.26.88 6.98.59.85 1.29 1.8 2.2 1.76.89-.04 1.22-.56 2.29-.56 1.07 0 1.37.56 2.3.54.95-.02 1.54-.86 2.12-1.71.68-.97.96-1.93.97-1.98-.02 0-1.86-.71-1.86-2.78z" fill="#555"/>
        <path d="M10.96 3.18c.49-.6.82-1.42.73-2.24-.7.03-1.57.47-2.08 1.06-.45.52-.85 1.36-.74 2.15.78.06 1.59-.4 2.09-.97z" fill="#555"/>
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#3C4043", fontFamily: F }}>Apple Calendar</span>
    </a>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export default function MissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mevite, setMevite] = useState<Mevite | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [lastResponse, setLastResponse] = useState<"obviously" | "adjust" | "terrible" | null>(null);
  const [view, setView] = useState<"receiver" | "sender">("receiver");

  useEffect(() => {
    trackMissionView(id);
    const unsub = subscribeMevite(id, (m) => { setMevite(m); setLoading(false); });
    return unsub;
  }, [id]);

  const handleResponse = async (r: "obviously" | "adjust" | "terrible") => {
    if (r === "adjust") { trackAdjustOpen(); router.push(`/m/${id}/adjust`); return; }
    trackReceiverResponse(r);
    setResponding(true);
    await respondToMevite(id, r);
    setLastResponse(r);
    setResponding(false);
  };

  const handleConfirmSuggestion = async () => {
    trackSuggestionConfirmed();
    setResponding(true);
    await confirmSuggestion(id);
    setResponding(false);
  };

  const handleStatusUpdate = async (s: ArrivalStatus) => { trackCommitmentUpdate(s); updateArrivalStatus(id, s); };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: ORANGE, animation: `pulseDot 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
      </div>
    </div>
  );

  if (!mevite) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, fontFamily: F, margin: "0 0 8px" }}>Mevite not found.</h2>
        <p style={{ color: "#888", fontSize: 14, fontFamily: F, margin: 0 }}>This link may be expired or invalid.</p>
      </div>
    </div>
  );

  const isLocked      = mevite.status === "locked";
  const isAdjusting   = mevite.status === "adjusting";
  const isDeclined    = mevite.status === "declined";
  const isPending     = mevite.status === "pending";
  const hasSuggestion = !!mevite.suggestedChange;
  const senderName    = mevite.sender || mevite.who;
  const commitment    = COMMITMENT[mevite.arrivalStatus] ?? COMMITMENT["definitely"];
  const gaugeLevel    = ARRIVAL_STATUSES.find(s => s.key === mevite.arrivalStatus)?.gaugeLevel ?? 3;
  const statusColor   = isLocked ? "#16a34a" : isDeclined ? "#999" : ORANGE;

  const whenDisplay = isLocked && hasSuggestion
    ? `${mevite.suggestedChange!.newDate}${mevite.suggestedChange!.newTime ? ` at ${mevite.suggestedChange!.newTime}` : ""}`
    : mevite.when;

  // Parse mevite.when into a proper Date for calendar events
  const whenDate = mevite.when ? (() => {
    try {
      const d = new Date(mevite.when.replace(" at ", " "));
      return isNaN(d.getTime()) ? null : d;
    } catch { return null; }
  })() : null;

  const toCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const calStart = whenDate ? toCalDate(whenDate) : toCalDate(new Date());
  const calEnd   = whenDate ? toCalDate(new Date(whenDate.getTime() + 2 * 60 * 60 * 1000)) : toCalDate(new Date(Date.now() + 2 * 60 * 60 * 1000));

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${senderName} is coming over`)}&dates=${calStart}/${calEnd}&details=${encodeURIComponent(`"${mevite.why}"\n\nBringing: ${mevite.bringing}\n\nMevite: https://mevite.me/m/${id}`)}`

  const icsContent = [
    "BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT",
    `SUMMARY:${senderName} is coming over`,
    `DESCRIPTION:"${mevite.why}"\\nBringing: ${mevite.bringing}`,
    `DTSTART:${calStart}`,
    `DTEND:${calEnd}`,
    "END:VEVENT","END:VCALENDAR",
  ].join("\n");
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: F }}>
      {/* Thin status line */}
      <div style={{ height: 3, background: statusColor, width: "100%" }} />

      <Header />

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* ── VIEW TOGGLE ── */}
        <div style={{ display: "flex", gap: 4, background: "#EBEBEB", borderRadius: 100, padding: 3, width: "fit-content", marginBottom: 24 }}>
          {(["receiver","sender"] as const).map(v => (
            <button key={v} onClick={() => { setView(v); trackViewToggle(v); }} style={{
              fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 100,
              border: "none", cursor: "pointer", fontFamily: F, transition: "all 0.15s",
              background: view === v ? "#fff" : "transparent",
              color: view === v ? "#111" : "#888",
              boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>
              {v === "receiver" ? "Your view" : `${senderName}'s view`}
            </button>
          ))}
        </div>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: "clamp(2.2rem, 9vw, 2.8rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.025em", margin: "0 0 10px", color: "#111" }}>
            <span style={{ color: ORANGE }}>{senderName}</span><br />is coming<br />over<span style={{ color: ORANGE }}>.</span>
          </h1>

          {/* Status badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700,
            background: isLocked ? "#dcfce7" : isDeclined ? "#F3F3F3" : "#FFF0EB",
            color: isLocked ? "#16a34a" : isDeclined ? "#888" : ORANGE,
          }}>
            {isPending && <span style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE, display: "inline-block", animation: "pulseDot 1.5s infinite" }} />}
            {isLocked ? "✓ Locked In" : isAdjusting ? "↔ Adjusting" : isDeclined ? "Terrible Timing" : "This Is Happening"}
          </div>
        </div>

        {/* ── THE WHY — emotional center ── */}
        <Card style={{ marginBottom: 12, border: `2px solid ${ORANGE}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <svg width="16" height="16" viewBox="0 0 60.02 60.02" fill="none" style={{ flexShrink: 0 }}>
              <path fill={ORANGE} d="M59.54,24.65l-8.41-5.83V1.11c0-.29-.12-.58-.33-.79-.21-.21-.49-.33-.79-.33H10c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79v17.71L.48,24.65c-.15.1-.27.24-.35.4-.08.16-.13.34-.13.52v31.12c0,.88.35,1.73.98,2.36.63.63,1.47.98,2.36.98h53.35c.88,0,1.73-.35,2.36-.98.63-.62.98-1.47.98-2.36v-31.12c0-.18-.04-.36-.13-.52-.08-.16-.2-.3-.35-.4ZM2.22,27.69l20.06,13.89L2.22,56.69v-29ZM24.21,42.91l3.9,2.7c.56.39,1.22.6,1.9.6.68,0,1.34-.21,1.9-.6l3.9-2.7,19.77,14.89H4.44l19.77-14.89ZM37.74,41.58l20.06-13.89v29l-20.06-15.11ZM56.96,25.57l-5.83,4.03v-8.07l5.83,4.04ZM48.91,2.22v28.92l-18.26,12.64c-.19.13-.41.2-.63.2-.23,0-.45-.07-.63-.2l-18.26-12.64V2.22h37.79ZM8.89,29.6l-5.83-4.03,5.83-4.04v8.07Z"/>
              <path fill={ORANGE} d="M16.67,11.12h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
              <path fill={ORANGE} d="M16.67,15.56h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
              <path fill={ORANGE} d="M16.67,20.01h26.68c.29,0,.58-.12.79-.33.21-.21.33-.49.33-.79s-.12-.58-.33-.79c-.21-.21-.49-.33-.79-.33h-26.68c-.29,0-.58.12-.79.33-.21.21-.33.49-.33.79s.12.58.33.79c.21.21.49.33.79.33Z"/>
            </svg>
            <SectionLabel color={ORANGE}>Because</SectionLabel>
          </div>
          <p style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.35, color: "#111", margin: "0 0 8px", fontStyle: "italic", paddingLeft: 22 }}>
            &ldquo;{mevite.why}&rdquo;
          </p>
          <p style={{ fontSize: 12, color: "#AAA", margin: 0, paddingLeft: 22 }}>— {senderName}</p>
        </Card>

        {/* ── LOGISTICS ── */}
        <Card style={{ marginBottom: 12, border: `2px solid ${ORANGE}` }}>
          {hasSuggestion && isAdjusting ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <DetailRow icon={<CalIcon />} label="Original plan" value={mevite.when} muted />
              <div style={{ background: "#FFF0EB", borderRadius: 10, padding: "12px 14px" }}>
                <SectionLabel color={ORANGE}>Proposed change</SectionLabel>
                <DetailRow icon={<CalIcon />} label="New time" value={`${mevite.suggestedChange!.newDate}${mevite.suggestedChange!.newTime ? ` at ${mevite.suggestedChange!.newTime}` : ""}`} />
                {mevite.suggestedChange!.note && (
                  <p style={{ fontSize: 12, color: "#888", margin: "8px 0 0", fontStyle: "italic" }}>&ldquo;{mevite.suggestedChange!.note}&rdquo;</p>
                )}
              </div>
              <DetailRow icon={<BagIcon />} label="Bringing" value={mevite.bringing} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <DetailRow icon={<CalIcon />} label="When" value={whenDisplay} />
              <div style={{ height: 1, background: "#F0F0F0" }} />
              <DetailRow icon={<BagIcon />} label="Bringing" value={mevite.bringing} />
            </div>
          )}
        </Card>

        {/* ── COMMITMENT ── */}
        <Card style={{ marginBottom: 20, background: "#fff", border: `2px solid ${ORANGE}` }}>
          <SectionLabel color={ORANGE}>Commitment</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <StatusIcon status={mevite.arrivalStatus} size={42} color={ORANGE} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: "0 0 2px", lineHeight: 1.1 }}>{commitment.label}</p>
              <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{commitment.detail}</p>
            </div>
            {/* Gauge */}
            <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 18, height: 4, borderRadius: 2, background: i <= gaugeLevel ? ORANGE : "#EEE", transition: "background 0.3s" }} />
              ))}
            </div>
          </div>
        </Card>

        {/* ── RESPONSE BUTTONS — receiver, pending ── */}
        {view === "receiver" && !isLocked && !isDeclined && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#888", textAlign: "center", margin: "4px 0 2px", fontFamily: F, letterSpacing: "0.02em" }}>
              What do you say?
            </p>
            {hasSuggestion && isAdjusting ? (
              <>
                <Btn variant="obviously" onClick={handleConfirmSuggestion} disabled={responding}>Works for me ✓</Btn>
                <Btn variant="adjust" onClick={() => router.push(`/m/${id}/adjust`)}>Different day?</Btn>
                <Btn variant="terrible" onClick={() => handleResponse("terrible")} disabled={responding}>Terrible timing.</Btn>
              </>
            ) : (
              <>
                <Btn variant="obviously" onClick={() => handleResponse("obviously")} disabled={responding}>Obviously.</Btn>
                <Btn variant="adjust" onClick={() => handleResponse("adjust")} disabled={responding}>Different day?</Btn>
                <Btn variant="terrible" onClick={() => handleResponse("terrible")} disabled={responding}>Terrible timing.</Btn>
              </>
            )}
          </div>
        )}

        {/* ── TEXT RESPONSE — receiver view only, after they pick ── */}
        {view === "receiver" && lastResponse && (() => {
          const meviteLink = typeof window !== "undefined" ? window.location.href : `https://mevite.me/m/${id}`;
          const copy = {
            obviously: `You had me at "coming over."\n${meviteLink}`,
            adjust:    `The plan is good.\nThe timing isn't.\n${meviteLink}`,
            terrible:  `The plan is good.\nThe timing isn't.\n${meviteLink}`,
          }[lastResponse];
          return (
            <div style={{ marginBottom: 20 }}>
              <a href={`sms:?body=${encodeURIComponent(copy)}`} onClick={trackTextResponse} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                background: ORANGE, border: "none", color: "#fff",
                padding: "16px 20px", borderRadius: 12, textDecoration: "none",
                fontSize: 15, fontWeight: 800, fontFamily: F,
              }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6l-4 3V4z" fill="white"/>
                </svg>
                Text your response
              </a>
            </div>
          );
        })()}
        {isLocked && (
          <Card style={{ marginBottom: 12, textAlign: "center", background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: "#16a34a", margin: "0 0 4px" }}>It&apos;s on.</p>
            <p style={{ fontSize: 13, color: "#555", margin: 0 }}>
              {mevite.confirmedAt
                ? `Confirmed on ${new Date(mevite.confirmedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
                : "Plan confirmed."}
            </p>
          </Card>
        )}

        {/* ── DECLINED ── */}
        {isDeclined && (
          <Card style={{ marginBottom: 12, textAlign: "center", background: "#F7F7F7", border: "none" }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: "#888", margin: "0 0 4px" }}>Terrible timing.</p>
            <p style={{ fontSize: 13, color: "#AAA", margin: 0 }}>Maybe next time.</p>
          </Card>
        )}

        {/* ── ADD TO CALENDAR — locked only ── */}
        {isLocked && (
          <Card style={{ marginBottom: 12 }}>
            <SectionLabel>Add to Calendar</SectionLabel>
            <div style={{ display: "flex", gap: 8 }}>
              <GoogleCalendarBtn href={gcalUrl} onClick={() => trackAddToCalendar("google")} />
              <AppleCalendarBtn icsHref={icsHref} onClick={() => trackAddToCalendar("apple")} />
            </div>
          </Card>
        )}

        {/* ── SENDER VIEW ── */}
        {view === "sender" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <Card>
              <SectionLabel>Update your commitment</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {ARRIVAL_STATUSES.map(s => {
                  const sel = mevite.arrivalStatus === s.key;
                  return (
                    <button key={s.key} onClick={() => handleStatusUpdate(s.key)} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                      borderRadius: 10, border: `1.5px solid ${sel ? ORANGE : "#E8E8E8"}`,
                      background: sel ? "#FFF0EB" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}>
                      <StatusIcon status={s.key} size={28} color={sel ? ORANGE : "#CCC"} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0, fontFamily: F }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: "#888", margin: "1px 0 0", fontFamily: F }}>{s.description}</p>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? ORANGE : "#DDD"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <SectionLabel>Share your Mevite</SectionLabel>
              <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#F5F5F5", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
                <span style={{ flex: 1, fontSize: 11, fontFamily: "monospace", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {typeof window !== "undefined" ? window.location.href : ""}
                </span>
                <button onClick={() => navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "")}
                  style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 6, border: "1px solid #DDD", background: "#fff", color: "#111", cursor: "pointer", fontFamily: F }}>
                  Copy
                </button>
              </div>
              <a href={`sms:?body=${encodeURIComponent(`Hey — I'm coming over. Here's my Mevite: ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: ORANGE, color: "#fff", padding: "12px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 700, fontFamily: F }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6l-4 3V4z" fill="white"/></svg>
                Text Mevite
              </a>
            </Card>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {mevite.timeline && mevite.timeline.length > 0 && (
          <Card style={{ marginBottom: 20 }}>
            <SectionLabel color={ORANGE}>This Started Happening</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {mevite.timeline.map((evt, i) => (
                <div key={evt.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: i < mevite.timeline.length - 1 ? 14 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === mevite.timeline.length - 1 ? ORANGE : "#DDD" }} />
                    {i < mevite.timeline.length - 1 && <div style={{ width: 1, flex: 1, background: "#EBEBEB", marginTop: 4, minHeight: 20 }} />}
                  </div>
                  <div style={{ paddingBottom: i < mevite.timeline.length - 1 ? 0 : 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: "0 0 1px", fontFamily: F }}>{evt.label}</p>
                    <p style={{ fontSize: 11, color: "#AAA", margin: 0, fontFamily: F }}>
                      {new Date(evt.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── FOOTER ── */}
        <MeviteFooter />

      </div>
    </div>
  );
}

// ── Response Button ────────────────────────────────────────────────

const BTN_STYLES = {
  obviously: { background: ORANGE,   color: "#fff", border: `2px solid ${ORANGE}` },
  adjust:    { background: "#1a2744", color: "#fff", border: "2px solid #1a2744"   },
  terrible:  { background: "#111",   color: "#fff", border: "2px solid #111"       },
} as const;

function Btn({ variant, onClick, disabled = false, children }: {
  variant: keyof typeof BTN_STYLES;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const s = BTN_STYLES[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "16px 20px", borderRadius: 12,
      fontSize: 16, fontWeight: 800, fontFamily: F, cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: "0.01em", transition: "opacity 0.15s",
      opacity: disabled ? 0.6 : 1,
      ...s,
    }}>
      {children}
    </button>
  );
}

// ── Detail Row ─────────────────────────────────────────────────────

function DetailRow({ icon, label, value, muted = false }: { icon: React.ReactNode; label: string; value: string; muted?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#BBB", margin: "0 0 2px", fontFamily: F }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: muted ? "#CCC" : "#111", margin: 0, textDecoration: muted ? "line-through" : "none", fontFamily: F, lineHeight: 1.3 }}>{value}</p>
      </div>
    </div>
  );
}
