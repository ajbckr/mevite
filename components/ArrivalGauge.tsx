"use client";
import { ARRIVAL_STATUSES, ArrivalStatus } from "@/lib/types";
import { StatusIcon } from "./StatusIcons";

export function ArrivalGauge({ status }: { status: ArrivalStatus }) {
  const current = ARRIVAL_STATUSES.find((s) => s.key === status);
  const level = current?.gaugeLevel ?? 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8470A" }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#888", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
          Commitment
        </span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0, fontFamily: "Inter, sans-serif" }}>{current?.label}</p>
      <div style={{ display: "flex", gap: 4 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= level ? "#E8470A" : "#E0E0E0", transition: "background 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

export function ThisIsHappeningPicker({
  value, onChange, onConfirm, onClose,
}: {
  value: ArrivalStatus;
  onChange: (s: ArrivalStatus) => void;
  onConfirm: () => void;
  onClose?: () => void;
}) {
  const current = ARRIVAL_STATUSES.find((s) => s.key === value);
  const level = current?.gaugeLevel ?? 1;
  const f = "Inter, system-ui, sans-serif";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ padding: "28px 28px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111", margin: 0, fontFamily: f }}>
              This Is Happening<span style={{ color: "#E8470A" }}>.</span>
            </h2>
            <p style={{ fontSize: 14, color: "#888", margin: "6px 0 0", fontFamily: f }}>Set your mission status. Your friend will see this.</p>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Two-panel body */}
        <div style={{ display: "flex" }}>

          {/* Left: options */}
          <div style={{ flex: 1, padding: "0 28px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
            {ARRIVAL_STATUSES.map((s) => {
              const selected = value === s.key;
              return (
                <button key={s.key} onClick={() => onChange(s.key)} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px", borderRadius: 14,
                  border: selected ? "2px solid #E8470A" : "2px solid #F0F0F0",
                  background: selected ? "rgba(232,71,10,0.06)" : "#fff",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                }}>
                  {/* Icon box */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: selected ? "rgba(232,71,10,0.12)" : "#F5F5F5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <StatusIcon status={s.key} size={26} color={selected ? "#E8470A" : "#AAAAAA"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: 0, fontFamily: f }}>{s.label}</p>
                    <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0", fontFamily: f }}>{s.description}</p>
                  </div>
                  {/* Radio */}
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    border: selected ? "2px solid #E8470A" : "2px solid #DDD",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#E8470A" }} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: live preview */}
          <div style={{ width: 200, flexShrink: 0, background: "#F9F8F7", borderLeft: "1px solid #EBEBEB", padding: "20px 20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#999", textTransform: "uppercase", margin: 0, fontFamily: f }}>Your Friend Will See</p>
            <div style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid #EBEBEB" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#AAA", textTransform: "uppercase", margin: "0 0 10px", fontFamily: f }}>Commitment</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8470A", flexShrink: 0 }} />
                <p style={{ fontSize: 14, fontWeight: 900, color: "#111", margin: 0, fontFamily: f }}>{current?.label}</p>
              </div>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 10px", fontFamily: f }}>{current?.description}</p>
              <div style={{ display: "flex", gap: 3 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= level ? "#E8470A" : "#E0E0E0", transition: "background 0.3s" }} />
                ))}
              </div>
            </div>
            {/* Large icon preview */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(232,71,10,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StatusIcon status={value} size={36} color="#E8470A" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "0 28px 28px" }}>
          <button onClick={onConfirm} style={{
            width: "100%", background: "#E8470A", color: "#fff",
            padding: "16px 24px", borderRadius: 12, fontSize: 15,
            fontWeight: 700, border: "none", cursor: "pointer",
            letterSpacing: "0.04em", fontFamily: f,
          }}>
            LOCK IT IN →
          </button>
        </div>
      </div>
    </div>
  );
}

export function ArrivalStatusPicker({ value, onChange }: { value: ArrivalStatus; onChange: (s: ArrivalStatus) => void }) {
  const f = "Inter, system-ui, sans-serif";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {ARRIVAL_STATUSES.map((s) => {
        const selected = value === s.key;
        return (
          <button key={s.key} onClick={() => onChange(s.key)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderRadius: 12, border: selected ? "2px solid #E8470A" : "2px solid #E8E8E8",
            background: selected ? "rgba(232,71,10,0.05)" : "#fff", cursor: "pointer", textAlign: "left",
          }}>
            <StatusIcon status={s.key} size={24} color={selected ? "#E8470A" : "#AAA"} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0, fontFamily: f }}>{s.label}</p>
              <p style={{ fontSize: 11, color: "#888", margin: "2px 0 0", fontFamily: f }}>{s.description}</p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: selected ? "2px solid #E8470A" : "2px solid #DDD", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selected && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#E8470A" }} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
