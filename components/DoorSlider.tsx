"use client";
import { useState } from "react";
import { ArrivalStatus, ARRIVAL_STATUSES } from "@/lib/types";

const DOOR_STATES = [
  {
    key: "maybe" as ArrivalStatus,
    label: "Maybe",
    sublabel: "It's a thought.",
    message: "Still just an idea.",
    // Door barely cracked — 5deg open
    doorAngle: 5,
    lightOpacity: 0.05,
    lineCount: 0,
  },
  {
    key: "probably" as ArrivalStatus,
    label: "Probably",
    sublabel: "I'm looking at calendars.",
    message: "It's moving.",
    doorAngle: 20,
    lightOpacity: 0.15,
    lineCount: 0,
  },
  {
    key: "definitely" as ArrivalStatus,
    label: "Definitely",
    sublabel: "Plans are forming.",
    message: "This is real.",
    doorAngle: 50,
    lightOpacity: 0.3,
    lineCount: 0,
  },
  {
    key: "on-my-way" as ArrivalStatus,
    label: "On My Way",
    sublabel: "En route.",
    message: "I'm committed now.",
    doorAngle: 75,
    lightOpacity: 0.5,
    lineCount: 3,
  },
  {
    key: "open-the-door" as ArrivalStatus,
    label: "Open The Door",
    sublabel: "I'm outside.",
    message: "Open up.",
    doorAngle: 95,
    lightOpacity: 0.7,
    lineCount: 5,
  },
];

function DoorSVG({ angle, active, size = 120 }: { angle: number; active: boolean; size?: number }) {
  const ORANGE = "#E8470A";
  const BLACK = "#1a1a1a";
  const frameW = size * 0.62;
  const frameH = size * 0.78;
  const frameX = (size - frameW) / 2;
  const frameY = size * 0.12;
  const floorY = frameY + frameH;

  // Door panel in perspective — rotates around left hinge
  // angle 0 = closed (full width), angle 90 = fully open (zero width)
  const rad = (angle * Math.PI) / 180;
  const doorW = frameW * 0.88;
  const panelW = doorW * Math.cos(rad);
  const hx = frameX + frameW * 0.06; // hinge x
  const hy = frameY; // hinge y (top)

  // Door panel corners in perspective
  const p1 = { x: hx, y: hy };
  const p2 = { x: hx + panelW, y: hy + panelW * 0.08 };
  const p3 = { x: hx + panelW, y: floorY - panelW * 0.05 };
  const p4 = { x: hx, y: floorY };

  // Knob position
  const knobX = hx + panelW * 0.82;
  const knobY = hy + (floorY - hy) * 0.55;

  // Light cone from open door
  const lightOpacity = DOOR_STATES.find(d => d.doorAngle === angle)?.lightOpacity ?? 0.1;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Light spill on floor */}
      {angle > 10 && (
        <ellipse
          cx={hx + panelW * 0.4}
          cy={floorY + 4}
          rx={panelW * 0.6}
          ry={8}
          fill={ORANGE}
          opacity={lightOpacity * 0.6}
        />
      )}

      {/* Door frame — outer */}
      <rect x={frameX} y={frameY} width={frameW} height={frameH}
        fill="none" stroke={BLACK} strokeWidth={size * 0.04} />

      {/* Floor base */}
      <rect x={frameX - size * 0.06} y={floorY} width={frameW + size * 0.12} height={size * 0.045}
        fill={BLACK} rx={2} />

      {/* Light behind door */}
      {angle > 5 && (
        <polygon
          points={`${hx},${hy} ${hx + panelW},${hy + panelW * 0.08} ${hx + panelW},${floorY - panelW * 0.05} ${hx},${floorY}`}
          fill={ORANGE}
          opacity={lightOpacity}
        />
      )}

      {/* Door panel */}
      <polygon
        points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
        fill={active ? ORANGE : "#E85010"}
        opacity={active ? 1 : 0.85}
      />

      {/* Door panel inner detail lines */}
      {panelW > 8 && (
        <>
          <line x1={hx + panelW * 0.15} y1={hy + (floorY - hy) * 0.12}
            x2={hx + panelW * 0.15} y2={hy + (floorY - hy) * 0.88}
            stroke="rgba(0,0,0,0.15)" strokeWidth={1.5} />
          <line x1={hx + panelW * 0.85} y1={hy + (floorY - hy) * 0.12}
            x2={hx + panelW * 0.85} y2={hy + (floorY - hy) * 0.88}
            stroke="rgba(0,0,0,0.15)" strokeWidth={1.5} />
          <line x1={hx + panelW * 0.15} y1={hy + (floorY - hy) * 0.5}
            x2={hx + panelW * 0.85} y2={hy + (floorY - hy) * 0.52}
            stroke="rgba(0,0,0,0.15)" strokeWidth={1.5} />
        </>
      )}

      {/* Knob */}
      {panelW > 12 && (
        <circle cx={knobX} cy={knobY} r={size * 0.025} fill="white" opacity={0.9} />
      )}

      {/* Excitement lines for "open" state */}
      {angle > 70 && (
        <>
          {[0, 1, 2, 3, 4].slice(0, angle > 90 ? 5 : 3).map((i) => {
            const lineAngle = (-30 + i * 20) * (Math.PI / 180);
            const lx = frameX + frameW * 0.7;
            const ly = frameY + frameH * 0.25;
            return (
              <line key={i}
                x1={lx + Math.cos(lineAngle) * 8}
                y1={ly + Math.sin(lineAngle) * 8}
                x2={lx + Math.cos(lineAngle) * 18}
                y2={ly + Math.sin(lineAngle) * 18}
                stroke={ORANGE} strokeWidth={2} strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}
        </>
      )}
    </svg>
  );
}

export function DoorSlider({
  value,
  onChange,
  onConfirm,
  onClose,
}: {
  value: ArrivalStatus;
  onChange: (s: ArrivalStatus) => void;
  onConfirm: () => void;
  onClose?: () => void;
}) {
  const currentIdx = DOOR_STATES.findIndex(d => d.key === value);
  const idx = currentIdx === -1 ? 2 : currentIdx;
  const current = DOOR_STATES[idx];
  const ORANGE = "#E8470A";
  const f = "Inter, system-ui, sans-serif";

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIdx = parseInt(e.target.value);
    onChange(DOOR_STATES[newIdx].key);
  };

  const handleDoorTap = (i: number) => {
    onChange(DOOR_STATES[i].key);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      zIndex: 50, display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        background: "#fff", width: "100%", borderRadius: "20px 20px 0 0",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
      }}>

        {/* Header */}
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: ORANGE, textTransform: "uppercase", margin: 0, fontFamily: f }}>
              This Is Happening.
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#111", margin: "6px 0 4px", fontFamily: f }}>
              How far are you<br />willing to take this?
            </h2>
            <p style={{ fontSize: 13, color: "#888", margin: 0, fontFamily: f }}>Slide the door to show how real this is.</p>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 4, flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* 5 door states — horizontal row */}
        <div style={{ padding: "28px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 4 }}>
          {DOOR_STATES.map((state, i) => (
            <button
              key={state.key}
              onClick={() => handleDoorTap(i)}
              style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                padding: 0, display: "flex", flexDirection: "column", alignItems: "center",
                opacity: i === idx ? 1 : 0.45,
                transform: i === idx ? "scale(1.08)" : "scale(1)",
                transition: "all 0.25s ease",
              }}
            >
              <DoorSVG angle={state.doorAngle} active={i === idx} size={58} />
            </button>
          ))}
        </div>

        {/* Slider */}
        <div style={{ padding: "20px 20px 0" }}>
          <style>{`
            .door-slider {
              -webkit-appearance: none;
              appearance: none;
              width: 100%;
              height: 4px;
              border-radius: 2px;
              background: linear-gradient(to right, #E8470A ${(idx / 4) * 100}%, #E0E0E0 ${(idx / 4) * 100}%);
              outline: none;
              cursor: pointer;
            }
            .door-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background: #E8470A;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(232,71,10,0.4);
              cursor: pointer;
              transition: transform 0.15s;
            }
            .door-slider::-webkit-slider-thumb:active {
              transform: scale(1.2);
            }
            .door-slider::-moz-range-thumb {
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background: #E8470A;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(232,71,10,0.4);
              cursor: pointer;
            }
          `}</style>
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={idx}
            onChange={handleSlider}
            className="door-slider"
          />

          {/* Labels below slider */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            {DOOR_STATES.map((state, i) => (
              <div key={state.key} style={{ flex: 1, textAlign: "center" }}>
                <p style={{
                  fontSize: 11, fontWeight: i === idx ? 800 : 500,
                  color: i === idx ? ORANGE : "#AAA",
                  margin: 0, fontFamily: f,
                  transition: "all 0.2s",
                }}>
                  {state.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Current state detail */}
        <div style={{
          margin: "20px 20px 0",
          padding: "16px 20px",
          background: "#FFF5F2",
          borderRadius: 14,
          border: `1.5px solid ${ORANGE}22`,
          display: "flex", alignItems: "center", gap: 16,
          transition: "all 0.3s",
        }}>
          <DoorSVG angle={current.doorAngle} active={true} size={72} />
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, color: ORANGE, margin: 0, fontFamily: f }}>{current.label}</p>
            <p style={{ fontSize: 14, color: "#555", margin: "3px 0 0", fontFamily: f }}>{current.sublabel}</p>
            <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0", fontFamily: f, fontStyle: "italic" }}>&ldquo;{current.message}&rdquo;</p>
          </div>
        </div>

        {/* Your friend will see */}
        <div style={{ padding: "16px 20px 0" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#AAA", textTransform: "uppercase", margin: "0 0 10px", fontFamily: f }}>
            Your friend will see
          </p>
          <div style={{
            background: "#F9F8F7", borderRadius: 12, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 900, color: "#111", margin: 0, fontFamily: f }}>{current.label}</p>
              <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0", fontFamily: f }}>{current.sublabel}</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{
                    width: 20, height: 4, borderRadius: 2,
                    background: i <= idx ? ORANGE : "#E0E0E0",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "20px 20px 36px" }}>
          <button onClick={onConfirm} style={{
            width: "100%", background: ORANGE, color: "#fff",
            padding: "16px 24px", borderRadius: 12, fontSize: 16,
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
