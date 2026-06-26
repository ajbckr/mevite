"use client";
import { useState, useRef } from "react";
import { ArrivalStatus } from "@/lib/types";

const ORANGE = "#E8470A";
const f = "Inter, system-ui, sans-serif";

const STATES = [
  { key: "maybe"         as ArrivalStatus, label: "Maybe",         sub: "Thinking about it.",            msg: "It's crossed my mind.",                    gauge: 1 },
  { key: "probably"      as ArrivalStatus, label: "Probably",      sub: "Looking likely.",               msg: "I'm checking calendars.",                  gauge: 2 },
  { key: "definitely"    as ArrivalStatus, label: "Definitely",    sub: "It's happening.",               msg: "The plan is real now.",                    gauge: 3 },
  { key: "locked-in"     as ArrivalStatus, label: "Locked In",     sub: "Nothing's getting in the way.", msg: "You should expect me.",                    gauge: 4 },
  { key: "open-the-door" as ArrivalStatus, label: "Open The Door", sub: "Assume I'm coming.",            msg: "There is no scenario where I don't show up.", gauge: 5 },
];

const FRIEND_SUBS: Record<string, string> = {
  "maybe":          "It's crossed my mind.",
  "probably":       "I'm checking calendars.",
  "definitely":     "The plan is real now.",
  "locked-in":      "Nothing's getting in the way.",
  "open-the-door":  "Save me a seat.",
};

const SNAP_ANGLES = [2, 20, 42, 65, 85];

// ViewBox: 180 wide x 200 tall
// Frame centered: x=20, width=120 → center at x=80 (true center of 180 is 90, offset right slightly for visual balance with hinge)
const FX = 25, FY = 10, FW = 110, FH = 158, FS = 8;
const IX = FX + FS / 2;
const IY = FY + FS / 2;
const IW = FW - FS;
const IH = FH - FS;

function Door({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const panelW = Math.max(1, IW * Math.cos(rad));
  const skew = Math.sin(rad) * 4;
  const lightOpacity = Math.pow(angle / 85, 1.2) * 0.4;
  const showKnob = panelW > 12;
  const showRecess = panelW > 28;

  const p = {
    tl: { x: IX,           y: IY },
    tr: { x: IX + panelW,  y: IY + skew },
    br: { x: IX + panelW,  y: IY + IH - skew },
    bl: { x: IX,           y: IY + IH },
  };
  const panelPts = `${p.tl.x},${p.tl.y} ${p.tr.x},${p.tr.y} ${p.br.x},${p.br.y} ${p.bl.x},${p.bl.y}`;

  const recessPadH = panelW * 0.12;
  const recessPadV = IH * 0.08;
  const recessMid = IY + IH * 0.52;

  const ur = {
    tl: { x: IX + recessPadH,          y: IY + recessPadV + skew * (recessPadH / IW) },
    tr: { x: IX + panelW - recessPadH, y: IY + recessPadV + skew * ((panelW - recessPadH) / IW) },
    br: { x: IX + panelW - recessPadH, y: recessMid - 4 + skew * ((panelW - recessPadH) / IW) },
    bl: { x: IX + recessPadH,          y: recessMid - 4 + skew * (recessPadH / IW) },
  };
  const lr = {
    tl: { x: IX + recessPadH,          y: recessMid + 4 + skew * (recessPadH / IW) },
    tr: { x: IX + panelW - recessPadH, y: recessMid + 4 + skew * ((panelW - recessPadH) / IW) },
    br: { x: IX + panelW - recessPadH, y: IY + IH - recessPadV + skew * ((panelW - recessPadH) / IW) },
    bl: { x: IX + recessPadH,          y: IY + IH - recessPadV + skew * (recessPadH / IW) },
  };

  const knobFrac = 0.75;
  const knobX = IX + panelW * knobFrac;
  const knobY = IY + IH * 0.54 + skew * knobFrac;
  const floorY = FY + FH + FS / 2;

  return (
    <svg width="180" height="200" viewBox="0 0 180 200" fill="none" style={{ display: "block" }}>
      {angle > 3 && (
        <rect
          x={IX + panelW} y={IY}
          width={Math.max(0, IW - panelW)} height={IH}
          fill={ORANGE} opacity={lightOpacity}
        />
      )}
      <polygon points={panelPts} fill={ORANGE} />
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
      {showKnob && (
        <circle cx={knobX} cy={knobY} r={3.5}
          fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
      )}
      <rect x={FX} y={FY} width={FW} height={FH} rx="2"
        fill="none" stroke={ORANGE} strokeWidth={FS} strokeLinejoin="miter" />
      <rect x={FX - 2} y={IY + 16} width={6} height={5} rx="1" fill={ORANGE} opacity={0.55} />
      <rect x={FX - 2} y={IY + IH - 21} width={6} height={5} rx="1" fill={ORANGE} opacity={0.55} />
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
  const snapIdx = Math.max(0, STATES.findIndex(s => s.key === value));

  // rawPos: continuous 0-4 float, drives door angle smoothly
  const [rawPos, setRawPos] = useState<number>(snapIdx);
  // displayIdx: which label/state is "active" — updates continuously as you drag
  const displayIdx = Math.min(4, Math.max(0, Math.round(rawPos)));
  const current = STATES[displayIdx];

  // Door angle interpolated continuously from rawPos
  const liveAngle = (() => {
    const lo = Math.floor(rawPos);
    const hi = Math.ceil(rawPos);
    const t = rawPos - lo;
    const a1 = SNAP_ANGLES[Math.min(lo, 4)];
    const a2 = SNAP_ANGLES[Math.min(hi, 4)];
    // Ease in-out between snap points
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return a1 + (a2 - a1) * eased;
  })();

  // Animate snapping to nearest state on release
  const rafRef = useRef<number | null>(null);

  const snapTo = (targetIdx: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const from = rawPos;
    const to = targetIdx;
    const duration = 280;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setRawPos(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setRawPos(to);
        onChange(STATES[targetIdx].key);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const raw = parseFloat(e.target.value);
    setRawPos(raw);
    // Fire onChange with snapped value while dragging so parent stays in sync
    onChange(STATES[Math.min(4, Math.max(0, Math.round(raw)))].key);
  };

  const handleSliderEnd = () => {
    const nearest = Math.round(rawPos);
    snapTo(nearest);
  };

  const handleStateTap = (i: number) => snapTo(i);

  const fillPct = (rawPos / 4) * 100;

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

        {/* Door + label */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 4px" }}>
          <Door angle={liveAngle} />
          <div style={{ textAlign: "center", marginTop: 16, minHeight: 56 }}>
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
            type="range" min={0} max={4} step={0.01}
            value={rawPos}
            onChange={handleSliderChange}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            className="door-range"
            style={{ background: `linear-gradient(to right, ${ORANGE} ${fillPct}%, #E8E8E8 ${fillPct}%)` }}
          />
          {/* Labels: padded by half thumb width so endpoints center under thumb at min/max */}
          <div style={{ display: "flex", marginTop: 8, paddingLeft: 14, paddingRight: 14 }}>
            {STATES.map((s, i) => (
              <button key={s.key} onClick={() => handleStateTap(i)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "4px 0", textAlign: "center" }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: i === displayIdx ? 800 : 400,
                  color: i === displayIdx ? ORANGE : "#C0C0C0",
                  fontFamily: f,
                  transition: "all 0.2s",
                  display: "block",
                }}>
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
