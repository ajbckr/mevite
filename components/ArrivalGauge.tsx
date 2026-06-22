"use client";
import { ARRIVAL_STATUSES, ArrivalStatus } from "@/lib/types";

export function ArrivalGauge({ status }: { status: ArrivalStatus }) {
  const current = ARRIVAL_STATUSES.find((s) => s.key === status);
  const level = current?.gaugeLevel ?? 1;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#FF4C00] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#888]">
          Arrival Status
        </span>
      </div>
      <p className="text-sm font-bold text-[#111]">{current?.label}</p>
      <div className="gauge-bar">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`gauge-segment ${i <= level ? "active" : ""}`} />
        ))}
      </div>
    </div>
  );
}

// Full "This Is Happening" picker — two panel layout matching mockup
export function ThisIsHappeningPicker({
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
  const current = ARRIVAL_STATUSES.find((s) => s.key === value);
  const level = current?.gaugeLevel ?? 1;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="px-7 pt-7 pb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-[#111]">
              This Is Happening<span className="text-[#FF4C00]">.</span>
            </h2>
            <p className="text-[#888] text-sm mt-1">Set your mission status. Your friend will see this.</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-[#888] hover:text-[#111] transition-colors ml-4 mt-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Two-panel body */}
        <div className="flex gap-0">

          {/* Left — status options */}
          <div className="flex-1 px-7 pb-7 space-y-2">
            {ARRIVAL_STATUSES.map((s) => {
              const isSelected = value === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => onChange(s.key)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-[#FF4C00] bg-[#FF4C00]/8"
                      : "border-[#F0F0F0] hover:border-[#DDD] bg-white"
                  }`}
                >
                  {/* Icon box */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${
                    isSelected ? "bg-[#FF4C00]/15" : "bg-[#F5F5F5]"
                  }`}>
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${isSelected ? "text-[#111]" : "text-[#333]"}`}>{s.label}</p>
                    <p className="text-xs text-[#888] mt-0.5">{s.description}</p>
                  </div>
                  {/* Radio */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? "border-[#FF4C00]" : "border-[#DDD]"
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FF4C00]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right — live preview */}
          <div className="w-[200px] shrink-0 bg-[#F9F8F7] border-l border-[#EBEBEB] px-5 py-6 flex flex-col gap-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#999]">Your Friend Will See</p>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#AAA]">Arrival Status</p>

              {/* Selected status display */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF4C00]" />
                <p className="text-sm font-black text-[#111]">{current?.label}</p>
              </div>

              {/* Mini description */}
              <p className="text-xs text-[#888]">{current?.description}</p>

              {/* Gauge preview */}
              <div className="flex gap-1 pt-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= level ? "bg-[#FF4C00]" : "bg-[#E0E0E0]"
                  }`} />
                ))}
              </div>
            </div>

            {/* Icon preview large */}
            <div className="mt-auto pt-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FF4C00]/10 flex items-center justify-center text-4xl mx-auto transition-all duration-200">
                {current?.icon}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-7 pb-7">
          <button onClick={onConfirm} className="cta-btn orange">
            LOCK IT IN →
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline picker used on mission page sender view
export function ArrivalStatusPicker({
  value,
  onChange,
}: {
  value: ArrivalStatus;
  onChange: (s: ArrivalStatus) => void;
}) {
  return (
    <div className="space-y-2">
      {ARRIVAL_STATUSES.map((s) => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
            value === s.key
              ? "border-[#FF4C00] bg-[#FF4C00]/5"
              : "border-[#E8E8E8] hover:border-[#ccc]"
          }`}
        >
          <span className="text-xl">{s.icon}</span>
          <div className="flex-1">
            <p className={`text-sm font-semibold ${value === s.key ? "text-[#111]" : "text-[#444]"}`}>
              {s.label}
            </p>
            <p className="text-xs text-[#888] mt-0.5">{s.description}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            value === s.key ? "border-[#FF4C00]" : "border-[#DDD]"
          }`}>
            {value === s.key && <div className="w-2.5 h-2.5 rounded-full bg-[#FF4C00]" />}
          </div>
        </button>
      ))}
    </div>
  );
}
