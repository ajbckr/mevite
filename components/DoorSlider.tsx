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

// Animated door SVG — single door swinging open
// angle: 0 = closed, 90 = fully open
// Uses CSS 3D perspective transform on the door panel
function AnimatedDoor({ angle }: { angle: number }) {
  // Panel foreshortening: cos(angle)
  const rad = (angle * Math.PI) / 180;
  const panelWidth = Math.max(3, Math.round(Math.cos(rad) * 88));
  const skew = Math.round(Math.sin(rad) * 6); // slight vertical skew for depth
  const lightW = 88 - panelWidth;
  const lightOpacity = Math.min(0.6, (angle / 90) * 0.65);
  const showKnob = panelWidth > 14;
  const showLines = angle > 72;
  const lineOpacity = Math.max(0, (angle - 72) / 18);

  // SVG viewBox: 140 wide, 180 tall
  const W = 140, H = 180;
  const FX = 14, FY = 10, FW = 112, FH = 148; // frame outer
  const SW = 9; // stroke width for frame (line art)
  const IX = FX + SW / 2 + 1; // inner left
  const IY = FY + SW / 2 + 1; // inner top
  const IW = FW - SW - 2;     // inner width
  const IH = FH - SW - 2;     // inner height

  // Hinge on left inner edge
  const HX = IX;
  const floorY = IY + IH;

  // Panel points (parallelogram)
  const p = [
    [HX,              IY],
    [HX + panelWidth, IY + skew],
    [HX + panelWidth, floorY - skew],
    [HX,              floorY],
  ];
  const pts = p.map(([x,y]) => `${x},${y}`).join(" ");

  // Knob
  const knobX = HX + panelWidth * 0.80;
  const knobY = IY + IH * 0.54;

  // Light area behind open door
  const lightX = HX + panelWidth;
  const lightH = IH;

  // Excitement lines (emanate from right side of frame when wide open)
  const lineOriginX = FX + FW + 4;
  const lineOriginY = FY + FH / 2;
  const lineAngles = [-40, -20, 0, 20, 40];

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" style={{ overflow: "visible", transition: "all 0.05s" }}>

      {/* Light spill behind open door */}
      {angle > 2 && (
        <rect x={lightX} y={IY} width={lightW} height={lightH}
          fill={ORANGE} opacity={lightOpacity} />
      )}

      {/* Door panel */}
      <polygon points={pts} fill={ORANGE} opacity={0.92} />

      {/* Panel inner recess detail — only when wide enough */}
      {panelWidth > 30 && (
        <polygon
          points={[
            [HX + panelWidth * 0.14, IY + IH * 0.10 + skew * 0.14],
            [HX + panelWidth * 0.86, IY + IH * 0.10 + skew * 0.86],
            [HX + panelWidth * 0.86, floorY - IH * 0.10 - skew * 0.86],
            [HX + panelWidth * 0.14, floorY - IH * 0.10 - skew * 0.14],
          ].map(([x,y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={1.5}
        />
      )}

      {/* Knob — line art circle */}
      {showKnob && (
        <circle cx={knobX} cy={knobY} r={5}
          fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={2} />
      )}

      {/* Frame — drawn ON TOP, line art */}
      <rect x={FX} y={FY} width={FW} height={FH}
        fill="none" stroke={ORANGE} strokeWidth={SW} strokeLinejoin="round" />

      {/* Base slab */}
      <rect x={FX - 8} y={FY + FH} width={FW + 16} height={10} rx={3} fill={ORANGE} />

      {/* Excitement lines — fully open */}
      {showLines && lineAngles.map((a, i) => {
        const rad2 = (a * Math.PI) / 180;
        const x1 = lineOriginX + Math.cos(rad2) * 6;
        const y1 = lineOriginY + Math.sin(rad2) * 6;
        const x2 = lineOriginX + Math.cos(rad2) * 20;
        const y2 = lineOriginY + Math.sin(rad2) * 20;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={ORANGE} strokeWidth={2.5} strokeLinecap="round"
            opacity={lineOpacity} />
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
  const current = STATES[idx];

  // Map idx 0-4 → door angle 4-90deg
  const doorAngles = [4, 22, 45, 68, 90];
  const doorAngle = doorAngles[idx];

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(STATES[parseInt(e.target.value)].key);
  };

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
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 4, flexShrink: 0, marginTop: 2 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Single animating door — centered */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 8px" }}>
          <div style={{ transition: "all 0.18s ease-out" }}>
            <AnimatedDoor angle={doorAngle} />
          </div>

          {/* Active state label below door */}
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: ORANGE, margin: 0, fontFamily: f, transition: "all 0.2s" }}>
              {current.label}
            </p>
            <p style={{ fontSize: 13, color: "#666", margin: "3px 0 0", fontFamily: f }}>{current.sub}</p>
            <p style={{ fontSize: 12, color: "#AAA", margin: "3px 0 0", fontFamily: f, fontStyle: "italic" }}>&ldquo;{current.msg}&rdquo;</p>
          </div>
        </div>

        {/* Slider */}
        <div style={{ padding: "16px 24px 0" }}>
          <style>{`
            .door-range { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; outline:none; cursor:pointer; }
            .door-range::-webkit-slider-thumb { -webkit-appearance:none; width:30px; height:30px; border-radius:50%; background:${ORANGE}; border:3px solid white; box-shadow:0 2px 12px rgba(232,71,10,0.4); cursor:pointer; transition:transform 0.12s; }
            .door-range::-webkit-slider-thumb:active { transform:scale(1.18); }
            .door-range::-moz-range-thumb { width:30px; height:30px; border-radius:50%; background:${ORANGE}; border:3px solid white; cursor:pointer; }
          `}</style>
          <input
            type="range" min={0} max={4} step={1} value={idx}
            onChange={handleSlider}
            className="door-range"
            style={{ background: `linear-gradient(to right, ${ORANGE} ${idx * 25}%, #E0E0E0 ${idx * 25}%)` }}
          />

          {/* Labels under slider */}
          <div style={{ display: "flex", marginTop: 8 }}>
            {STATES.map((s, i) => (
              <button key={s.key} onClick={() => onChange(s.key)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "4px 0", textAlign: "center" }}>
                <span style={{ fontSize: 10, fontWeight: i === idx ? 800 : 400, color: i === idx ? ORANGE : "#BBB", fontFamily: f, transition: "all 0.2s", display: "block", lineHeight: 1.3 }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Your friend will see */}
        <div style={{ padding: "16px 24px 0" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#AAA", textTransform: "uppercase", margin: "0 0 8px", fontFamily: f }}>Your friend will see</p>
          <div style={{ background: "#F5F5F5", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
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
