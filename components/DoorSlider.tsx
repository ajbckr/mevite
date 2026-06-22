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

// Sprite has 30 frames at 120px each = 3600px wide
const SPRITE_FRAMES = 30;
const FRAME_SIZE = 120;

// Map slider idx 0-4 to sprite frame index
const FRAME_MAP = [0, 6, 13, 20, 29];

export function DoorSlider({ value, onChange, onConfirm, onClose }: {
  value: ArrivalStatus;
  onChange: (s: ArrivalStatus) => void;
  onConfirm: () => void;
  onClose?: () => void;
}) {
  const idx = Math.max(0, STATES.findIndex(s => s.key === value));
  const current = STATES[idx];
  const spriteFrame = FRAME_MAP[idx];
  const spriteX = -(spriteFrame * FRAME_SIZE);

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

        {/* DOOR SPRITE — centered, 200px display size */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0 8px" }}>
          <div style={{
            width: FRAME_SIZE * 2,
            height: FRAME_SIZE * 2,
            backgroundImage: "url(/door-sprite.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: `${SPRITE_FRAMES * FRAME_SIZE * 2}px ${FRAME_SIZE * 2}px`,
            backgroundPosition: `${spriteX * 2}px 0px`,
            transition: "background-position 0.18s cubic-bezier(0.25,0.46,0.45,0.94)",
            imageRendering: "crisp-edges",
          }} />

          {/* State label */}
          <div style={{ textAlign: "center", marginTop: 12, padding: "0 24px" }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: ORANGE, margin: 0, fontFamily: f }}>{current.label}</p>
            <p style={{ fontSize: 13, color: "#666", margin: "3px 0 0", fontFamily: f }}>{current.sub}</p>
            <p style={{ fontSize: 12, color: "#AAA", margin: "3px 0 0", fontFamily: f, fontStyle: "italic" }}>&ldquo;{current.msg}&rdquo;</p>
          </div>
        </div>

        {/* Slider */}
        <div style={{ padding: "16px 24px 0" }}>
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
