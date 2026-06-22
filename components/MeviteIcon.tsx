"use client";
import Image from "next/image";

// Uses the real logo JPG from public folder
export function MeviteIcon({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/logo.jpg"
      alt="MEVITE"
      width={size}
      height={size}
      style={{ borderRadius: 4, objectFit: "contain" }}
      priority
    />
  );
}
