"use client";
import { useState } from "react";
import { ArrivalStatus } from "@/lib/types";

const ORANGE = "#E8470A";
const f = "Inter, system-ui, sans-serif";

const STATES = [
  { key: "maybe"          as ArrivalStatus, label: "Maybe",         sub: "It's a thought.",          msg: "Still living entirely in my head.", gauge: 1 },
  { key: "probably"       as ArrivalStatus, label: "Probably",      sub: "Calendars are open.",       msg: "This has moved beyond wishful thinking.", gauge: 2 },
  { key: "definitely"     as ArrivalStatus, label: "Definitely",    sub: "It's happening.",           msg: "The plan is real now.",          gauge: 3 },
  { key: "on-my-way"      as ArrivalStatus, label: "On My Way",     sub: "No turning back.",          msg: "I'm already moving.",            gauge: 4 },
  { key: "open-the-door"  as ArrivalStatus, label: "Open The Door", sub: "I'm outside.",              msg: "Seriously. Open up.",            gauge: 5 },
];

// Friend-will-see sublabels
const FRIEND_SUBS: Record<string, string> = {
  "maybe":          "It's a thought.",
  "probably":       "Calendars are open.",
  "definitely":     "It's happening.",
  "on-my-way":      "No turning back.",
  "open-the-door":  "I'm outside.",
};

const SNAP_ANGLES = [2, 20, 42, 65, 85];

// All geometry in one coordinate space — no CSS/SVG conflicts
// ViewBox: 180 wide x 200 tall
// Frame: starts at x=30, y=10, 100 wide, 158 tall, stroke=8
const FX = 30, FY = 10, FW = 100, FH = 158, FS = 8;
// Inner opening (where panel sits): hinge on left inner edge
const IX = FX + FS / 2;   // 34
const IY = FY + FS / 2;   // 14
const IW = FW - FS;       // 92
const IH = FH - FS;       // 150

function Door({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  // True perspective foreshortening
  const panelW = Math.max(1, IW * Math.cos(rad));
  // Skew: top-right corner shifts right, bottom-right shifts left — creates 3D feel
  // Keep skew small and proportional so recesses don't distort
  const skew = Math.sin(rad) * 4; // max 4px skew at 90deg

  const lightOpacity = Math.pow(angle / 85, 1.2) * 0.4;
  const showKnob = panelW > 12;

  // Panel corners — parallelogram, hinge fixed on left
  const p = {
    tl: { x: IX,           y: IY },
    tr: { x: IX + panelW,  y: IY + skew },
    br: { x: IX + panelW,  y: IY + IH - skew },
    bl: { x: IX,           y: IY + IH },
  };
  const panelPts = `${p.tl.x},${p.tl.y} ${p.tr.x},${p.tr.y} ${p.br.x},${p.br.y} ${p.bl.x},${p.bl.y}`;

  // Recess rectangles — computed in panel-local terms, scaled by panelW
  // Only show when panel is wide enough to look right
  const showRecess = panelW > 28;
  const recessPadH = panelW * 0.12;  // horizontal padding inside panel
  const recessPadV = IH * 0.08;      // vertical padding
  const recessMid = IY + IH * 0.52;  // divider between upper/lower recess

  // Upper recess corners
  const ur = {
    tl: { x: IX + recessPadH,          y: IY + recessPadV + skew * (recessPadH / IW) },
    tr: { x: IX + panelW - recessPadH, y: IY + recessPadV + skew * ((panelW - recessPadH) / IW) },
    br: { x: IX + panelW - recessPadH, y: recessMid - 4 + skew * ((panelW - recessPadH) / IW) },
    bl: { x: IX + recessPadH,          y: recessMid - 4 + skew * (recessPadH / IW) },
  };
  // Lower recess corners
  const lr = {
    tl: { x: IX + recessPadH,          y: recessMid + 4 + skew * (recessPadH / IW) },
    tr: { x: IX + panelW - recessPadH, y: recessMid + 4 + skew * ((panelW - recessPadH) / IW) },
    br: { x: IX + panelW - recessPadH, y: IY + IH - recessPadV + skew * ((panelW - recessPadH) / IW) },
    bl: { x: IX + recessPadH,          y: IY + IH - recessPadV + skew * (recessPadH / IW) },
  };

  // Knob — on the panel, right-ish side, vertically centered
  // x at 75% of panel width, y at 54% of panel height
  const knobFrac = 0.75;
  const knobX = IX + panelW * knobFrac;
  const knobY = IY + IH * 0.54 + skew * knobFrac;

  // Floor slab bottom y
  const floorY = FY + FH + FS / 2;

  return (
    <svg width="180" height="200" viewBox="0 0 180 200" fill="none" style={{ display: "block" }}>

      {/* Light behind open door */}
      {angle > 3 && (
        <rect
          x={IX + panelW} y={IY}
          width={Math.max(0, IW - panelW)} height={IH}
          fill={ORANGE} opacity={lightOpacity}
        />
      )}

      {/* Door panel */}
      <polygon points={panelPts} fill={ORANGE} />

      {/* Panel recesses — properly perspective-mapped */}
      {showRecess && (
        <>
          <polygon
            points={`${ur.tl.x},${ur.tl.y} ${ur.tr.x},${ur.tr.y} ${ur.br.x},${ur.br.y} ${ur.bl.x},${ur.bl.y}`}
            fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"
          />
          <polygon
            points={`${lr.tl.x},${lr.tl.y} ${lr.tr.x},${lr.tr.y} ${lr.br.x},${lr.br.y} ${lr.bl.x},${lr.bl.y}`}
            fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"
          />
        </>
      )}

      {/* Knob — circle, perspective-aware position */}
      {showKnob && (
        <circle cx={knobX} cy={knobY} r={3.5}
          fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
      )}

      {/* Frame — drawn on top so it cleanly covers panel edges */}
      <rect x={FX} y={FY} width={FW} height={FH} rx="2"
        fill="none" stroke={ORANGE} strokeWidth={FS} strokeLinejoin="miter" />

      {/* Hinge markers */}
      <rect x={FX - 2} y={IY + 16} width={6} height={5} rx="1" fill={ORANGE} opacity={0.55} />
      <rect x={FX - 2} y={IY + IH - 21} width={6} height={5} rx="1" fill={ORANGE} opacity={0.55} />

      {/* Floor slab */}
      <rect x={FX - 10} y={floorY} width={FW + 20} height={10} rx="3" fill={ORANGE} />
    </svg>
  );
}

export function DoorSlider({ value, onChange, onConfirm, onClose }: {
  value: ArrivalStatus;
  onChange: (s: ArrivalStatus) => void;
  onConfirm: () => void;
  onClose?: () => void;
}) {
  const idx = Math.max(0, STATES.findIndex(s => s.key === value));
  const [liveAngle, setLiveAngle] = useState(SNAP_ANGLES[idx]);
  const current = STATES[idx];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    const angle = 2 + (raw / 4) * 83;
    setLiveAngle(angle);
    onChange(STATES[Math.min(4, Math.max(0, Math.round(raw)))].key);
  };

  const handleSliderEnd = () => setLiveAngle(SNAP_ANGLES[idx]);
  const handleStateTap = (i: number) => { onChange(STATES[i].key); setLiveAngle(SNAP_ANGLES[i]); };

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
              How real is this?
            </h2>
            <p style={{ fontSize: 13, color: "#888", margin: 0, fontFamily: f }}>Slide the door to show your level of commitment.</p>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 4, flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Door + label — centered column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 4px" }}>
          <Door angle={liveAngle} />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: ORANGE, textTransform: "uppercase", margin: "0 0 4px", fontFamily: f }}>
              {current.label}
            </p>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#111", margin: "0 0 4px", fontFamily: f }}>{current.sub}</p>
            <p style={{ fontSize: 13, color: "#AAA", margin: 0, fontFamily: f, fontStyle: "italic" }}>{current.msg}</p>
          </div>
        </div>

        {/* Slider */}
        <div style={{ padding: "20px 24px 0" }}>
          <style>{`
            .door-range{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:3px;outline:none;cursor:pointer;}
            .door-range::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:${ORANGE};border:3px solid white;box-shadow:0 2px 12px rgba(232,71,10,0.4);cursor:pointer;transition:transform 0.1s;}
            .door-range::-webkit-slider-thumb:active{transform:scale(1.15);}
            .door-range::-moz-range-thumb{width:28px;height:28px;border-radius:50%;background:${ORANGE};border:3px solid white;cursor:pointer;}
          `}</style>
          <input
            type="range" min={0} max={4} step={0.01} value={idx}
            onChange={handleSliderChange}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            className="door-range"
            style={{ background: `linear-gradient(to right, ${ORANGE} ${idx * 25}%, #E8E8E8 ${idx * 25}%)` }}
          />
          {/* Pad by half thumb (14px) so labels center under endpoints */}
          <div style={{ display: "flex", marginTop: 8, paddingLeft: 14, paddingRight: 14 }}>
            {STATES.map((s, i) => (
              <button key={s.key} onClick={() => handleStateTap(i)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "4px 0", textAlign: "center" }}>
                <span style={{ fontSize: 10, fontWeight: i === idx ? 800 : 400, color: i === idx ? ORANGE : "#C0C0C0", fontFamily: f, transition: "all 0.2s", display: "block" }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Your friend will see */}
        <div style={{ padding: "16px 24px 0" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#AAA", textTransform: "uppercase", margin: "0 0 8px", fontFamily: f }}>
            Your Friend Will See
          </p>
          <div style={{ background: "#F5F5F5", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: 0, fontFamily: f }}>{current.label}</p>
            <p style={{ fontSize: 13, color: "#888", margin: 0, fontFamily: f }}>{FRIEND_SUBS[current.key]}</p>
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
