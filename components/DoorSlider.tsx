"use client";
import { useState } from "react";
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

// Door SVG — tall portrait ratio, clean flat line art
// angle: 0=closed, 85=fully open
// Uses CSS perspective + rotateY for the panel only
function Door({ angle }: { angle: number }) {
  const lightOpacity = Math.pow(angle / 85, 1.4) * 0.55;
  const showRays = angle > 68;
  const raysOpacity = Math.min(1, (angle - 68) / 17);

  return (
    <div style={{ position: "relative", width: 160, height: 220 }}>

      {/* SVG: frame, light fill, floor, rays — all 2D, behind the panel */}
      <svg width="160" height="220" viewBox="0 0 160 220" fill="none"
        style={{ position: "absolute", inset: 0 }}>

        {/* Light fill inside frame — grows as door opens */}
        <rect x="12" y="8" width="106" height="176" fill={ORANGE} opacity={lightOpacity} />

        {/* Door frame — thick line art, portrait ratio */}
        <rect x="8" y="4" width="114" height="184" rx="2"
          fill="none" stroke={ORANGE} strokeWidth="9" strokeLinejoin="miter"/>

        {/* Floor slab */}
        <rect x="0" y="188" width="130" height="12" rx="3" fill={ORANGE}/>

        {/* Hinge marks */}
        <rect x="8" y="30" width="8" height="6" rx="1" fill={ORANGE} opacity={0.5}/>
        <rect x="8" y="155" width="8" height="6" rx="1" fill={ORANGE} opacity={0.5}/>

        {/* Rays when fully open */}
        {showRays && (
          <>
            {[[-28,-28],[-36,0],[-28,28],[0,-36],[0,36]].map(([dx,dy], i) => (
              <line key={i}
                x1={126 + dx * 0.45} y1={96 + dy * 0.45}
                x2={126 + dx} y2={96 + dy}
                stroke={ORANGE} strokeWidth="3" strokeLinecap="round"
                opacity={raysOpacity * 0.9}
              />
            ))}
          </>
        )}
      </svg>

      {/* Door PANEL — CSS 3D rotateY around left hinge */}
      <div style={{
        position: "absolute",
        top: 12,       // inside frame top edge
        left: 13,      // hinge position (inside frame left)
        width: 100,    // panel width when closed
        height: 172,   // panel height
        transformOrigin: "0% 50%",
        transform: `perspective(600px) rotateY(${angle}deg)`,
        transition: "transform 0.12s ease-out",
        background: ORANGE,
        borderRadius: "0 1px 1px 0",
      }}>
        {/* Upper panel recess */}
        <div style={{
          position: "absolute",
          top: "8%", left: "10%", right: "10%", height: "38%",
          border: "2px solid rgba(0,0,0,0.18)",
          borderRadius: 2,
        }}/>
        {/* Lower panel recess */}
        <div style={{
          position: "absolute",
          bottom: "8%", left: "10%", right: "10%", height: "34%",
          border: "2px solid rgba(0,0,0,0.18)",
          borderRadius: 2,
        }}/>
        {/* Knob */}
        <div style={{
          position: "absolute",
          right: "16%", top: "54%",
          width: 10, height: 10,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.85)",
          background: "rgba(255,255,255,0.2)",
          transform: "translateY(-50%)",
        }}/>
      </div>
    </div>
  );
}

export function DoorSlider({ value, onChange, onConfirm, onClose }: {
  value: ArrivalStatus;
  onChange: (s: ArrivalStatus) => void;
  onConfirm: () => void;
  onClose?: () => void;
}) {
  // Continuous angle state for smooth dragging
  const snapAngles = [2, 20, 42, 65, 85];
  const idx = Math.max(0, STATES.findIndex(s => s.key === value));
  const [liveAngle, setLiveAngle] = useState(snapAngles[idx]);
  const current = STATES[idx];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    // Map 0-4 continuously to 2-85 degrees
    const angle = 2 + (raw / 4) * 83;
    setLiveAngle(angle);
    // Snap to nearest state for label/gauge
    const snapIdx = Math.round(raw);
    onChange(STATES[Math.min(4, Math.max(0, snapIdx))].key);
  };

  const handleSliderEnd = () => {
    // Snap angle to the current state's position
    setLiveAngle(snapAngles[idx]);
  };

  const handleStateTap = (i: number) => {
    onChange(STATES[i].key);
    setLiveAngle(snapAngles[i]);
  };

  // Continuous slider value (0-4 float)
  const sliderVal = idx;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 50, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#fff", width: "100%", borderRadius: "20px 20px 0 0", maxHeight: "94vh", overflowY: "auto" }}>

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

        {/* Door — centered */}
        <div style={{ display: "flex", justifyContent: "center", padding: "28px 0 4px" }}>
          <Door angle={liveAngle} />
        </div>

        {/* State label */}
        <div style={{ textAlign: "center", padding: "8px 24px 0" }}>
          <p style={{ fontSize: 20, fontWeight: 900, color: ORANGE, margin: 0, fontFamily: f }}>{current.label}</p>
          <p style={{ fontSize: 13, color: "#666", margin: "3px 0 0", fontFamily: f }}>{current.sub}</p>
          <p style={{ fontSize: 12, color: "#AAA", margin: "3px 0 0", fontFamily: f, fontStyle: "italic" }}>&ldquo;{current.msg}&rdquo;</p>
        </div>

        {/* Slider — continuous 0 to 4 */}
        <div style={{ padding: "20px 24px 0" }}>
          <style>{`
            .door-range{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:3px;outline:none;cursor:pointer;}
            .door-range::-webkit-slider-thumb{-webkit-appearance:none;width:32px;height:32px;border-radius:50%;background:${ORANGE};border:3px solid white;box-shadow:0 2px 14px rgba(232,71,10,0.45);cursor:pointer;transition:transform 0.1s;}
            .door-range::-webkit-slider-thumb:active{transform:scale(1.18);}
            .door-range::-moz-range-thumb{width:32px;height:32px;border-radius:50%;background:${ORANGE};border:3px solid white;cursor:pointer;}
          `}</style>
          <input
            type="range"
            min={0} max={4} step={0.01}
            value={sliderVal}
            onChange={handleSliderChange}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            className="door-range"
            style={{ background: `linear-gradient(to right, ${ORANGE} ${sliderVal * 25}%, #E8E8E8 ${sliderVal * 25}%)` }}
          />

          {/* Tap labels */}
          <div style={{ display: "flex", marginTop: 10 }}>
            {STATES.map((s, i) => (
              <button key={s.key} onClick={() => handleStateTap(i)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "4px 0", textAlign: "center" }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: i === idx ? 800 : 400,
                  color: i === idx ? ORANGE : "#C0C0C0",
                  fontFamily: f,
                  transition: "all 0.2s",
                  display: "block",
                  lineHeight: 1.3,
                }}>
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
          <button onClick={onConfirm} style={{
            width: "100%", background: ORANGE, color: "#fff",
            padding: "17px 24px", borderRadius: 12, fontSize: 16,
            fontWeight: 800, border: "none", cursor: "pointer",
            fontFamily: f, letterSpacing: "0.04em",
          }}>
            LOCK IT IN →
          </button>
        </div>

      </div>
    </div>
  );
}
