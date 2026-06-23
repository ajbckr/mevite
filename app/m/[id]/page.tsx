"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { subscribeMevite, respondToMevite, updateArrivalStatus, confirmSuggestion } from "@/lib/mevite";
import { Mevite, ARRIVAL_STATUSES, ArrivalStatus } from "@/lib/types";

const ORANGE = "#E8470A";
const F = "Inter, system-ui, sans-serif";

const STATUS_DISPLAY: Record<string, { label: string; sub: string; detail: string }> = {
  "maybe":         { label: "Maybe",          sub: "Thinking about it.",            detail: "It's crossed my mind." },
  "probably":      { label: "Probably",        sub: "Looking likely.",               detail: "I'm checking calendars." },
  "definitely":    { label: "Definitely",      sub: "It's happening.",               detail: "The plan is real now." },
  "locked-in":     { label: "Locked In",       sub: "Nothing's getting in the way.", detail: "You should expect me." },
  "open-the-door": { label: "Open The Door",   sub: "Assume I'm coming.",            detail: "There is no scenario where I don't show up." },
};

// Flat single-color orange SVG icons
const CalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="3" width="16" height="14" rx="2" fill={ORANGE}/>
    <rect x="1" y="3" width="16" height="4" rx="2" fill={ORANGE}/>
    <path d="M5 1v4M13 1v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="4" y="10" width="3" height="2" rx="0.5" fill="white"/>
    <rect x="8" y="10" width="3" height="2" rx="0.5" fill="white"/>
    <rect x="4" y="13" width="3" height="2" rx="0.5" fill="white"/>
    <rect x="8" y="13" width="3" height="2" rx="0.5" fill="white"/>
  </svg>
);

const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 6h12l-1.5 9H4.5L3 6z" fill={ORANGE}/>
    <path d="M6 6V4a3 3 0 016 0v2" stroke={ORANGE} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M1 6h16" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Google Calendar official button style
const GoogleCalendarBtn = ({ href }: { href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={{
    display: "flex", alignItems: "center", gap: 10,
    border: "1px solid #dadce0", borderRadius: 8,
    padding: "10px 16px", background: "#fff",
    textDecoration: "none", flex: 1,
    fontFamily: "Google Sans, Inter, sans-serif",
  }}>
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2a10.3 10.3 0 00-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 009 18z" fill="#34A853"/>
      <path d="M3.98 10.72A5.4 5.4 0 013.7 9c0-.6.1-1.18.28-1.72V4.94H.96A9 9 0 000 9c0 1.45.35 2.82.96 4.06l3.02-2.34z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 00.96 4.94L3.98 7.28C4.66 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
    <span style={{ fontSize: 13, fontWeight: 600, color: "#3c4043" }}>Google Calendar</span>
  </a>
);

// Apple Calendar — uses .ics data URI
const AppleCalendarBtn = ({ icsHref }: { icsHref: string }) => (
  <a href={icsHref} download="mevite.ics" style={{
    display: "flex", alignItems: "center", gap: 10,
    border: "1px solid #dadce0", borderRadius: 8,
    padding: "10px 16px", background: "#fff",
    textDecoration: "none", flex: 1,
    fontFamily: "Inter, sans-serif",
  }}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M14.25 9.56c-.02-1.97 1.61-2.92 1.68-2.97-0.92-1.34-2.34-1.52-2.85-1.54-1.21-.12-2.37.71-2.98.71-.62 0-1.57-.7-2.58-.68-1.32.02-2.54.77-3.22 1.95-1.38 2.38-.35 5.9.99 7.83.66.95 1.44 2.01 2.46 1.97 1-.04 1.37-.63 2.57-.63 1.2 0 1.54.63 2.58.61 1.06-.02 1.73-.96 2.38-1.92.76-1.09 1.07-2.16 1.09-2.21-.02-.01-2.08-.8-2.12-3.12z" fill="#555"/>
      <path d="M12.29 3.56c.55-.67.92-1.59.82-2.51-.79.03-1.76.53-2.33 1.19-.5.58-.95 1.52-.83 2.41.88.07 1.78-.45 2.34-1.09z" fill="#555"/>
    </svg>
    <span style={{ fontSize: 13, fontWeight: 600, color: "#3c4043" }}>Apple Calendar</span>
  </a>
);

function MeviteHeader() {
  return (
    <div style={{
      borderBottom: "1px solid #F0F0F0",
      padding: "14px 20px",
      display: "flex",
      alignItems: "center",
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/m-lockup.png" alt="MEVITE" style={{ height: 24, width: "auto", display: "block" }} />
    </div>
  );
}

export default function MissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mevite, setMevite] = useState<Mevite | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [view, setView] = useState<"receiver" | "sender">("receiver");

  useEffect(() => {
    const unsub = subscribeMevite(id, (m) => { setMevite(m); setLoading(false); });
    return unsub;
  }, [id]);

  const handleResponse = async (response: "obviously" | "adjust" | "terrible") => {
    if (response === "adjust") { router.push(`/m/${id}/adjust`); return; }
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

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: ORANGE, animation: `pulseDot 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
      </div>
    </div>
  );

  if (!mevite) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: F }}>Mevite not found.</h2>
        <p style={{ color: "#888", fontSize: 14, fontFamily: F }}>This link may be expired or invalid.</p>
      </div>
    </div>
  );

  const isLocked     = mevite.status === "locked";
  const isAdjusting  = mevite.status === "adjusting";
  const isDeclined   = mevite.status === "declined";
  const hasSuggestion = !!mevite.suggestedChange;
  const senderName   = (mevite.sender || mevite.who).split(" ")[0];
  const arrivalInfo  = STATUS_DISPLAY[mevite.arrivalStatus] ?? STATUS_DISPLAY["definitely"];
  const gaugeLevel   = ARRIVAL_STATUSES.find(s => s.key === mevite.arrivalStatus)?.gaugeLevel ?? 3;
  const statusColor  = isLocked ? "#22c55e" : isDeclined ? "#888" : ORANGE;

  const whenDisplay = isLocked && hasSuggestion
    ? `${mevite.suggestedChange!.newDate}${mevite.suggestedChange!.newTime ? ` at ${mevite.suggestedChange!.newTime}` : ""}`
    : mevite.when;

  // Google Calendar URL
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${senderName} is coming over`)}&details=${encodeURIComponent(`Bringing: ${mevite.bringing}\n\n"${mevite.why}"\n\nMevite: https://mevite.vercel.app/m/${id}`)}`;

  // Apple .ics
  const icsContent = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
    `SUMMARY:${senderName} is coming over`,
    `DESCRIPTION:Bringing: ${mevite.bringing}\\n"${mevite.why}"`,
    "DTSTART:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
    "END:VEVENT", "END:VCALENDAR"
  ].join("\n");
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F }}>
      {/* Status accent bar */}
      <div style={{ width: "100%", height: 3, background: statusColor }} />

      <MeviteHeader />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 64px" }}>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 4, background: "#F5F5F5", borderRadius: 100, padding: 4, width: "fit-content", marginBottom: 28 }}>
          {(["receiver", "sender"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 100,
              border: "none", cursor: "pointer", fontFamily: F, transition: "all 0.15s",
              background: view === v ? "#fff" : "transparent",
              color: view === v ? "#111" : "#888",
              boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}>
              {v === "receiver" ? "Your view" : `${senderName}'s view`}
            </button>
          ))}
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "clamp(2.4rem, 10vw, 3rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.02em", margin: "0 0 12px", color: "#111" }}>
            {senderName}<br />is coming<br />over<span style={{ color: ORANGE }}>.</span>
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: "0 0 14px", fontStyle: "italic" }}>
            Stop saying &ldquo;we should get together.&rdquo;
          </p>

          {/* Status pill */}
          {isLocked && <span className="status-pill bg-[#dcfce7] text-[#16a34a]">✓ Locked In</span>}
          {isAdjusting && <span className="status-pill" style={{ background: "#fff3ed", color: ORANGE }}>↔ Adjusting Plans</span>}
          {isDeclined && <span className="status-pill" style={{ background: "#F5F5F5", color: "#888" }}>Terrible Timing</span>}
          {mevite.status === "pending" && (
            <span className="status-pill" style={{ background: "#fff3ed", color: ORANGE }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE, display: "inline-block", marginRight: 5, animation: "pulseDot 1.5s infinite" }} />
              This Is Happening
            </span>
          )}
        </div>

        {/* Commitment block */}
        <div style={{ background: "#0f0f0f", borderRadius: 16, padding: "18px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE, margin: "0 0 10px" }}>
            This Is Happening
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 3px", lineHeight: 1.1 }}>{arrivalInfo.label}</p>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>{arrivalInfo.detail}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
              {[5,4,3,2,1].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= gaugeLevel ? ORANGE : "#333", transition: "background 0.3s" }} />
              ))}
            </div>
          </div>
        </div>

        {/* THE WHY — emotional center */}
        <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: 16, marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE, margin: "0 0 6px" }}>Because</p>
          <p style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3, color: "#111", margin: "0 0 6px", fontStyle: "italic" }}>
            &ldquo;{mevite.why}&rdquo;
          </p>
          <p style={{ fontSize: 12, color: "#AAA", margin: 0 }}>— {senderName}</p>
        </div>

        {/* Logistics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {hasSuggestion && isAdjusting ? (
            <>
              <LogRow icon="cal" label="When" value={mevite.when} muted />
              <div style={{ borderRadius: 12, border: `1px solid ${ORANGE}33`, background: "#fff3ed", padding: "12px 14px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE, margin: "0 0 8px" }}>Proposed change</p>
                <LogRow icon="cal" label="New time" value={`${mevite.suggestedChange!.newDate}${mevite.suggestedChange!.newTime ? ` at ${mevite.suggestedChange!.newTime}` : ""}`} />
                {mevite.suggestedChange!.note && <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", fontStyle: "italic" }}>&ldquo;{mevite.suggestedChange!.note}&rdquo;</p>}
              </div>
            </>
          ) : (
            <LogRow icon="cal" label="When" value={whenDisplay} />
          )}
          <LogRow icon="bag" label="Bringing" value={mevite.bringing} />
        </div>

        {/* RESPONSE BUTTONS — receiver */}
        {view === "receiver" && !isLocked && !isDeclined && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {hasSuggestion && isAdjusting ? (
              <>
                <button onClick={handleConfirmSuggestion} disabled={responding} className="response-btn obviously">Works for me ✓</button>
                <button onClick={() => router.push(`/m/${id}/adjust`)} className="response-btn adjust">Different day?</button>
                <button onClick={() => handleResponse("terrible")} disabled={responding} className="response-btn terrible">Terrible timing.</button>
              </>
            ) : (
              <>
                <button onClick={() => handleResponse("obviously")} disabled={responding} className="response-btn obviously">Obviously.</button>
                <button onClick={() => handleResponse("adjust")} disabled={responding} className="response-btn adjust">Different day?</button>
                <button onClick={() => handleResponse("terrible")} disabled={responding} className="response-btn terrible">Terrible timing.</button>
              </>
            )}
          </div>
        )}

        {/* LOCKED */}
        {isLocked && (
          <div style={{ borderRadius: 16, border: "1px solid #bbf7d0", background: "#f0fdf4", padding: "24px 20px", textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 26, fontWeight: 900, color: "#16a34a", margin: "0 0 4px" }}>It&apos;s on.</p>
            <p style={{ fontSize: 13, color: "#555", margin: 0 }}>
              {mevite.confirmedAt
                ? `Confirmed on ${new Date(mevite.confirmedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
                : "Plan confirmed."}
            </p>
          </div>
        )}

        {/* DECLINED */}
        {isDeclined && (
          <div style={{ borderRadius: 16, background: "#F5F5F5", padding: "24px 20px", textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 26, fontWeight: 900, color: "#888", margin: "0 0 4px" }}>Terrible timing.</p>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Maybe next time.</p>
          </div>
        )}

        {/* SENDER VIEW */}
        {view === "sender" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
            <div style={{ borderRadius: 16, border: "1px solid #E8E8E8", padding: "16px 18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAA", margin: "0 0 12px" }}>Update your commitment</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ARRIVAL_STATUSES.map(s => {
                  const sel = mevite.arrivalStatus === s.key;
                  return (
                    <button key={s.key} onClick={() => handleStatusUpdate(s.key)} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      borderRadius: 12, border: `2px solid ${sel ? ORANGE : "#E8E8E8"}`,
                      background: sel ? `${ORANGE}0D` : "#fff", cursor: "pointer", textAlign: "left",
                      transition: "all 0.15s",
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0, fontFamily: F }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: "#888", margin: "2px 0 0", fontFamily: F }}>{s.description}</p>
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${sel ? ORANGE : "#DDD"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Share link */}
            <div style={{ borderRadius: 16, border: "1px solid #E8E8E8", padding: "16px 18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAA", margin: "0 0 10px" }}>Share your Mevite</p>
              <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "8px 12px", fontFamily: "monospace", fontSize: 12, color: "#555", marginBottom: 10, wordBreak: "break-all" }}>
                {typeof window !== "undefined" ? window.location.href : ""}
              </div>
              <button onClick={() => navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "")}
                className="cta-btn" style={{ fontSize: 13 }}>Copy Link</button>
            </div>
          </div>
        )}

        {/* ADD TO CALENDAR — when locked */}
        {isLocked && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAA", margin: "0 0 10px" }}>Add to Calendar</p>
            <div style={{ display: "flex", gap: 10 }}>
              <GoogleCalendarBtn href={gcalUrl} />
              <AppleCalendarBtn icsHref={icsHref} />
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {mevite.timeline && mevite.timeline.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE, margin: "0 0 12px" }}>This Started Happening</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mevite.timeline.map((evt, i) => (
                <div key={evt.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: i === mevite.timeline.length - 1 ? ORANGE : "#DDD" }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: 0, fontFamily: F }}>{evt.label}</p>
                    <p style={{ fontSize: 11, color: "#AAA", margin: "2px 0 0", fontFamily: F }}>
                      {new Date(evt.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div style={{ borderTop: "1px solid #F0F0F0", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/m-lockup.png" alt="MEVITE" style={{ height: 18, width: "auto", opacity: 0.5 }} />
            <span style={{ fontSize: 11, color: "#AAA", fontStyle: "italic" }}>Stop saying &ldquo;we should get together.&rdquo;</span>
          </div>
          <button onClick={() => router.push("/")} style={{ fontSize: 12, fontWeight: 700, color: ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: F, whiteSpace: "nowrap" }}>
            Who&apos;s coming over next? →
          </button>
        </div>
      </div>
    </div>
  );
}

const LOG_ICONS: Record<string, React.ReactNode> = {
  cal: <CalIcon />,
  bag: <BagIcon />,
};

function LogRow({ icon, label, value, muted = false }: { icon: string; label: string; value: string; muted?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ marginTop: 2, flexShrink: 0 }}>{LOG_ICONS[icon]}</div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAA", margin: "0 0 2px", fontFamily: "Inter, system-ui, sans-serif" }}>{label}</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: muted ? "#CCC" : "#111", margin: 0, textDecoration: muted ? "line-through" : "none", fontFamily: "Inter, system-ui, sans-serif" }}>{value}</p>
      </div>
    </div>
  );
}
