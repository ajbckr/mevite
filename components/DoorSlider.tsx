"use client";
import { ArrivalStatus } from "@/lib/types";

const ORANGE = "#E8470A";
const f = "Inter, system-ui, sans-serif";

const STATES = [
  { key: "maybe"          as ArrivalStatus, label: "Maybe",         sub: "It's a thought.",           msg: "Still just an idea.",   gauge: 1 },
  { key: "probably"       as ArrivalStatus, label: "Probably",      sub: "I'm looking at calendars.", msg: "It's moving.",          gauge: 2 },
  { key: "definitely"     as ArrivalStatus, label: "Definitely",    sub: "Plans are forming.",        msg: "This is real.",         gauge: 3 },
  { key: "on-my-way"      as ArrivalStatus, label: "On My Way",     sub: "En route.",                 msg: "I'm committed now.",    gauge: 4 },
  { key: "open-the-door"  as ArrivalStatus, label: "Open The Door", sub: "I'm outside.",              msg: "Open up.",              gauge: 5 },
];

// Door angles per state — 0=closed, 85=wide open
const ANGLES = [2, 20, 42, 65, 85];

export function DoorSlider({ value, onChange, onConfirm, onClose }: {
  value: ArrivalStatus;
  onChange: (s: ArrivalStatus) => void;
  onConfirm: () => void;
  onClose?: () => void;
}) {
  const idx = Math.max(0, STATES.findIndex(s => s.key === value));
  const current = STATES[idx];
  const angle = ANGLES[idx];
  const lightOpacity = (angle / 85) * 0.7;
  const showRays = angle > 60;
  const raysOpacity = Math.max(0, (angle - 60) / 25);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 50, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#fff", width: "100%", borderRadius: "20px 20px 0 0", maxHeight: "92vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: ORANGE, textTransform: "uppercase", margin: "0 0 6px", fontFamily: f }}>
              This Is Happening.
            </p>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#111", margin: "0 0 4px", fontFamily: f, lineHeight: 1.1 }}>
              How far are you<br />willing to take this?
            </h2>
            <p style={{ fontSize: 13, color: "#888", margin: 0, fontFamily: f }}>Slide the door. Show how real this is.</p>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 4, flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* DOOR — CSS 3D perspective */}
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0 8px" }}>
          <div style={{ position: "relative", width: 160, height: 200 }}>

            {/* Floor shadow / light spill */}
            <div style={{
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120 + angle * 0.8,
              height: 14,
              borderRadius: "50%",
              background: ORANGE,
              opacity: lightOpacity * 0.35,
              filter: "blur(6px)",
              transition: "all 0.18s ease-out",
            }} />

            {/* Door frame — drawn as SVG so it stays 2D and always visible */}
            <svg
              width="160" height="200"
              viewBox="0 0 160 200"
              fill="none"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {/* Light inside frame */}
              <rect x="14" y="10" width="106" height="162" fill={ORANGE} opacity={lightOpacity * 0.6} />

              {/* Frame — outer border, line art */}
              <rect x="8" y="6" width="118" height="172" rx="2"
                fill="none" stroke={ORANGE} strokeWidth="8" strokeLinejoin="round"/>

              {/* Floor slab */}
              <rect x="0" y="178" width="134" height="11" rx="3" fill={ORANGE}/>

              {/* Ray lines when fully open */}
              {showRays && [[-35,0],[-20,-14],[0,-18],[20,-14],[35,0],[20,14],[0,18],[-20,14]].map(([dx,dy],i) => (
                <line key={i}
                  x1={128 + dx * 0.4} y1={90 + dy * 0.4}
                  x2={128 + dx} y2={90 + dy}
                  stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round"
                  opacity={raysOpacity}
                />
              ))}
            </svg>

            {/* Door PANEL — CSS 3D rotateY around left hinge */}
            <div style={{
              position: "absolute",
              top: 14,
              left: 14,
              width: 104,
              height: 160,
              transformOrigin: "left center",
              transform: `perspective(400px) rotateY(${angle}deg)`,
              transition: "transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              background: ORANGE,
              borderRadius: 1,
            }}>
              {/* Panel inner detail — two rectangles */}
              <div style={{
                position: "absolute",
                top: "10%", left: "10%",
                right: "10%", bottom: "10%",
                border: "1.5px solid rgba(0,0,0,0.2)",
                borderRadius: 1,
              }} />
              <div style={{
                position: "absolute",
                top: "12%", left: "12%",
                right: "12%", height: "38%",
                border: "1.5px solid rgba(0,0,0,0.15)",
                borderRadius: 1,
              }} />
              <div style={{
                position: "absolute",
                bottom: "10%", left: "12%",
                right: "12%", height: "34%",
                border: "1.5px solid rgba(0,0,0,0.15)",
                borderRadius: 1,
              }} />
              {/* Knob */}
              <div style={{
                position: "absolute",
                right: "14%",
                top: "52%",
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.8)",
                background: "rgba(255,255,255,0.15)",
              }} />
            </div>
          </div>
        </div>

        {/* State label */}
        <div style={{ textAlign: "center", padding: "0 24px 4px" }}>
          <p style={{ fontSize: 20, fontWeight: 900, color: ORANGE, margin: 0, fontFamily: f, transition: "all 0.2s" }}>
            {current.label}
          </p>
          <p style={{ fontSize: 13, color: "#666", margin: "3px 0 0", fontFamily: f }}>{current.sub}</p>
          <p style={{ fontSize: 12, color: "#AAA", margin: "3px 0 0", fontFamily: f, fontStyle: "italic" }}>&ldquo;{current.msg}&rdquo;</p>
        </div>

        {/* Slider */}
        <div style={{ padding: "20px 24px 0" }}>
          <style>{`
            .door-range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;}
            .door-range::-webkit-slider-thumb{-webkit-appearance:none;width:30px;height:30px;border-radius:50%;background:${ORANGE};border:3px solid white;box-shadow:0 2px 12px rgba(232,71,10,0.4);cursor:pointer;transition:transform 0.1s;}
            .door-range::-webkit-slider-thumb:active{transform:scale(1.2);}
            .door-range::-moz-range-thumb{width:30px;height:30px;border-radius:50%;background:${ORANGE};border:3px solid white;cursor:pointer;}
          `}</style>
          <input
            type="range" min={0} max={4} step={1} value={idx}
            onChange={e => onChange(STATES[parseInt(e.target.value)].key)}
            className="door-range"
            style={{ background: `linear-gradient(to right, ${ORANGE} ${idx * 25}%, #E0E0E0 ${idx * 25}%)` }}
          />
          <div style={{ display: "flex", marginTop: 10 }}>
            {STATES.map((s, i) => (
              <button key={s.key} onClick={() => onChange(s.key)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                <span style={{ fontSize: 10, fontWeight: i === idx ? 800 : 400, color: i === idx ? ORANGE : "#BBB", fontFamily: f, transition: "all 0.2s", display: "block" }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Your friend will see */}
        <div style={{ padding: "16px 24px 0" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#AAA", textTransform: "uppercase", margin: "0 0 8px", fontFamily: f }}>Your friend will see</p>
          <div style={{ background: "#F5F5F5", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: 0, fontFamily: f }}>{current.label}</p>
            <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: f }}>— {current.sub}</p>
            <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 18, height: 4, borderRadius: 2, background: i <= current.gauge ? ORANGE : "#E0E0E0", transition: "background 0.3s" }} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "20px 24px 40px" }}>
          <button onClick={onConfirm} style={{ width: "100%", background: ORANGE, color: "#fff", padding: "17px 24px", borderRadius: 12, fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: f, letterSpacing: "0.04em" }}>
            LOCK IT IN →
          </button>
        </div>

      </div>
    </div>
  );
}
