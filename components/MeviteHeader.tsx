"use client";

function MIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="17" height="74" fill="#1a1a1a"/>
      <polygon points="4,8 21,8 52,54 35,54" fill="#1a1a1a"/>
      <polygon points="65,54 79,8 96,8 79,54" fill="#1a1a1a"/>
      <rect x="79" y="8" width="17" height="74" fill="#1a1a1a"/>
      <polygon points="35,54 52,54 52,82 35,82" fill="#1a1a1a"/>
      <polygon points="52,54 79,54 79,82 52,82" fill="#E8470A"/>
      <circle cx="70" cy="69" r="3" fill="white"/>
      <polygon points="52,54 58,54 58,82 52,82" fill="#c93d09"/>
    </svg>
  );
}

export function MeviteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8E8E8]">
      <div className="px-5 h-14 flex items-center gap-0">
        {/* M icon */}
        <MIcon size={38} />

        {/* MEVITE wordmark */}
        <span className="ml-3 text-[16px] font-black tracking-[0.1em] text-[#111]">
          MEVITE
        </span>

        {/* Vertical divider — matches the lockup */}
        <div className="mx-4 self-stretch py-2">
          <div className="h-full w-px bg-[#1a1a1a]" />
        </div>

        {/* Tagline — bold to match lockup */}
        <span className="text-[16px] font-black text-[#111] leading-none">
          Invite Yourself Over<span className="text-[#E8470A]">.</span>
        </span>
      </div>
    </header>
  );
}

export function MeviteHeaderCompact() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8E8E8]">
      <div className="px-5 h-12 flex items-center">
        <MIcon size={28} />
        <span className="ml-2.5 text-[14px] font-black tracking-[0.1em] text-[#111]">MEVITE</span>
        <div className="mx-3 self-stretch py-2.5">
          <div className="h-full w-px bg-[#1a1a1a]" />
        </div>
        <span className="text-[14px] font-black text-[#111]">
          Invite Yourself Over<span className="text-[#E8470A]">.</span>
        </span>
      </div>
    </header>
  );
}
