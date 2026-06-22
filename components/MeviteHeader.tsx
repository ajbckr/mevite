"use client";
import Image from "next/image";

// Full lockup: M icon + MEVITE | Invite Yourself Over.
// Used as a permanent sticky header across all pages
export function MeviteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#F0F0F0]">
      <div className="px-5 py-3 flex items-center">
        {/* Left: M icon + MEVITE wordmark */}
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt="MEVITE"
            width={36}
            height={36}
            style={{ objectFit: "contain", borderRadius: 4 }}
            priority
          />
          <span className="text-[15px] font-black tracking-[0.08em] text-[#111]">
            MEVITE
          </span>
        </div>

        {/* Divider */}
        <div className="mx-4 h-8 w-px bg-[#222]" />

        {/* Right: tagline */}
        <p className="text-[15px] font-black leading-tight text-[#111]">
          Invite Yourself Over<span className="text-[#FF4C00]">.</span>
        </p>
      </div>
    </header>
  );
}

// Compact version for mission/share pages
export function MeviteHeaderCompact() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#F0F0F0]">
      <div className="px-5 py-3 flex items-center gap-2.5">
        <Image
          src="/logo.jpg"
          alt="MEVITE"
          width={28}
          height={28}
          style={{ objectFit: "contain", borderRadius: 4 }}
          priority
        />
        <span className="text-[13px] font-black tracking-[0.08em] text-[#111]">MEVITE</span>
        <div className="mx-2 h-5 w-px bg-[#DDD]" />
        <p className="text-[13px] font-semibold text-[#888]">
          Invite Yourself Over<span className="text-[#FF4C00]">.</span>
        </p>
      </div>
    </header>
  );
}
