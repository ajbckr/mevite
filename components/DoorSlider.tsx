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

const SNAP_ANGLES = [2, 20, 42, 65, 85];

// All door geometry defined as constants so nothing conflicts
const FX = 30;   // frame left x
const FY = 8;    // frame top y
const FW = 100;  // frame inner width
const FH = 160;  // frame inner height
const FS = 8;    // frame stroke width
// Frame outer bounds: FX-FS/2 to FX+FW+FS/2, FY-FS/2 to FY+FH+FS/2
// Right outer edge of frame: FX + FW + FS/2 = 30 + 100 + 4 = 134
// Rays start from right edge x=134, keep within viewBox width 180
// ViewBox: width=180, height=200

function Door({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  // Panel foreshortens with perspective cos approximation
  const panelW = Math.max(2, FW * Math.cos(rad));
  // Slight top/bottom skew for 3D feel
  const skewPx = panelW * Math.sin(rad) * 0.07;

  const lightOpacity = Math.pow(angle / 85, 1.3) * 0.45;
  const showRays = angle > 65;
  const raysOpacity = Math.min(1, (angle - 65) / 20);

  // Panel polygon points (hinge on left)
  const hx = FX;
  const topY = FY + FS / 2;
  const botY = FY + FH - FS / 2;
  const pts = [
    `${hx},${topY}`,
    `${hx + panelW},${topY + skewPx}`,
    `${hx + panelW},${botY - skewPx}`,
    `${hx},${botY}`,
  ].join(" ");

  // Knob — on door panel, right side
  const knobX = hx + panelW * 0.82;
  const knobY = topY + (botY - topY) * 0.55;
  const showKnob = panelW > 15;

  // Panel inner recess lines (only when wide enough)
  const showRecess = panelW > 35;
  const rx1 = hx + panelW * 0.12;
  const rx2 = hx + panelW * 0.88;
  const ry1a = topY + (botY - topY) * 0.08 + skewPx * 0.12;
  const ry1b = topY + (botY - topY) * 0.46 + skewPx * 0.88;
  const ry2a = topY + (botY - topY) * 0.54 + skewPx * 0.12;
  const ry2b = topY + (botY - topY) * 0.92 + skewPx * 0.88;

  // Rays — all within viewBox (width=180)
  // Origin: right outer edge of frame = FX + FW + FS/2 = 134, mid-height = FY + FH/2 = 88
  const rayOX = FX + FW + FS / 2 + 2; // 136
  const rayOY = FY + FH / 2;           // 88
  // Ray directions spread right — keep x2 <= 175 (leaving 5px margin)
  const rays = [
    { a: -35, len: 22 },
    { a: -18, len: 26 },
    { a:   0, len: 28 },
    { a:  18, len: 26 },
    { a:  35, len: 22 },
  ];

  return (
    <svg
      width="180" height="200"
      viewBox="0 0 180 200"
      fill="none"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Light fill behind open door */}
      {angle > 3 && (
        <rect
          x={FX + panelW} y={FY + FS / 2}
          width={Math.max(0, FW - panelW)} height={FH - FS}
          fill={ORANGE} opacity={lightOpacity}
        />
      )}

      {/* Door panel */}
      <polygon points={pts} fill={ORANGE} />

      {/* Panel inner recess — upper */}
      {showRecess && (
        <polygon
          points={`${rx1},${ry1a} ${rx2},${ry1a + skewPx * 0.76} ${rx2},${ry1b - skewPx * 0.76} ${rx1},${ry1b}`}
          fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5"
        />
      )}
      {/* Panel inner recess — lower */}
      {showRecess && (
        <polygon
          points={`${rx1},${ry2a} ${rx2},${ry2a + skewPx * 0.76} ${rx2},${ry2b - skewPx * 0.76} ${rx1},${ry2b}`}
          fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5"
        />
      )}

      {/* Knob */}
      {showKnob && (
        <circle cx={knobX} cy={knobY} r={4.5}
          fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      )}

      {/* Door frame — drawn on top */}
      <rect
        x={FX} y={FY} width={FW} height={FH} rx="2"
        fill="none" stroke={ORANGE} strokeWidth={FS} strokeLinejoin="miter"
      />

      {/* Hinge marks */}
      <rect x={FX - 2} y={FY + 20} width={7} height={5} rx="1" fill={ORANGE} opacity={0.5} />
      <rect x={FX - 2} y={FY + FH - 25} width={7} height={5} rx="1" fill={ORANGE} opacity={0.5} />

      {/* Floor slab */}
      <rect x={FX - 10} y={FY + FH + FS / 2} width={FW + 20} height={10} rx="3" fill={ORANGE} />

      {/* Rays — fully inside viewBox, fanning right from frame edge */}
      {showRays && rays.map((ray, i) => {
        const a = ray.a * Math.PI / 180;
        const x1 = rayOX + Math.cos(a) * 6;
        const y1 = rayOY + Math.sin(a) * 6;
        const x2 = rayOX + Math.cos(a) * ray.len;
        const y2 = rayOY + Math.sin(a) * ray.len;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round"
            opacity={raysOpacity}
          />
        );
      })}
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
    const snapIdx = Math.min(4, Math.max(0, Math.round(raw)));
    onChange(STATES[snapIdx].key);
  };

  const handleSliderEnd = () => setLiveAngle(SNAP_ANGLES[idx]);

  const handleStateTap = (i: number) => {
    onChange(STATES[i].key);
    setLiveAngle(SNAP_ANGLES[i]);
  };

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

        {/* Door — perfectly centered */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 0 4px" }}>
          <Door angle={liveAngle} />
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: ORANGE, margin: 0, fontFamily: f }}>{current.label}</p>
            <p style={{ fontSize: 13, color: "#666", margin: "3px 0 0", fontFamily: f }}>{current.sub}</p>
            <p style={{ fontSize: 12, color: "#AAA", margin: "3px 0 0", fontFamily: f, fontStyle: "italic" }}>&ldquo;{current.msg}&rdquo;</p>
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
          {/* Labels: pad by half thumb width so first/last center under endpoints */}
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
