"use client";

// M icon SVG — faithful to the real logo: bold M with orange door in center valley
function MIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left vertical leg */}
      <rect x="4" y="8" width="17" height="74" fill="#1a1a1a"/>
      {/* Left diagonal arm */}
      <polygon points="4,8 21,8 52,54 35,54" fill="#1a1a1a"/>
      {/* Right diagonal arm */}
      <polygon points="65,54 79,8 96,8 79,54" fill="#1a1a1a"/>
      {/* Right vertical leg */}
      <rect x="79" y="8" width="17" height="74" fill="#1a1a1a"/>
      {/* Left half of valley — black (closed door frame) */}
      <polygon points="35,54 52,54 52,82 35,82" fill="#1a1a1a"/>
      {/* Orange door — right half of valley, ajar */}
      <polygon points="52,54 79,54 79,82 52,82" fill="#E8470A"/>
      {/* Door knob */}
      <circle cx="70" cy="69" r="3" fill="white"/>
      {/* Perspective shadow on door left edge */}
      <polygon points="52,54 58,54 58,82 52,82" fill="#c93d09"/>
    </svg>
  );
}

export function MeviteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">
      <div className="px-5 h-14 flex items-center">
        {/* M icon */}
        <MIcon size={34} />

        {/* MEVITE wordmark */}
        <span className="ml-2.5 text-[15px] font-black tracking-[0.1em] text-[#111]">
          MEVITE
        </span>

        {/* Vertical divider */}
        <div className="mx-4 h-7 w-px bg-[#1a1a1a]" />

        {/* Tagline */}
        <span className="text-[15px] font-black text-[#111] leading-tight">
          Invite Yourself Over<span className="text-[#E8470A]">.</span>
        </span>
      </div>
    </header>
  );
}

export function MeviteHeaderCompact() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">
      <div className="px-5 h-12 flex items-center">
        <MIcon size={26} />
        <span className="ml-2 text-[13px] font-black tracking-[0.1em] text-[#111]">MEVITE</span>
        <div className="mx-3 h-5 w-px bg-[#CCC]" />
        <span className="text-[13px] font-semibold text-[#888]">
          Invite Yourself Over<span className="text-[#E8470A]">.</span>
        </span>
      </div>
    </header>
  );
}
