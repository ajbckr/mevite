"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMevite } from "@/lib/mevite";
import { Mevite } from "@/lib/types";

import { ArrivalGauge } from "@/components/ArrivalGauge";

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mevite, setMevite] = useState<Mevite | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { getMevite(id).then(setMevite); }, [id]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://mevite.vercel.app";
  const meviteUrl = `${origin}/m/${id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(meviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const smsText = `Hey — I'm coming over. Here's my Mevite: ${meviteUrl}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div style={{padding:"16px 20px 12px",borderBottom:"1px solid #F0F0F0"}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/m-logo.png" alt="M" style={{height:28,width:"auto",display:"block"}} />
      </div>

      <div className="px-6 flex-1 space-y-6 pb-12">
        {/* Hero */}
        <div className="animate-slide-up">
          <h1 className="text-4xl font-black leading-tight">
            Your Mevite<br />is ready<span className="text-[#FF4C00]">.</span>
          </h1>
          <p className="text-[#888] text-sm mt-2">
            One link. Your friend sees everything — and can respond.
          </p>
        </div>

        {/* Preview card */}
        {mevite ? (
          <div className="mevite-card space-y-3 animate-fade-in">
            <p className="text-base font-black text-[#111]">
              <span className="text-[#FF4C00]">{mevite.sender || mevite.who}</span> is coming over.
            </p>
            <div className="space-y-2 text-sm text-[#555]">
              <div className="flex gap-2 items-start">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:2}}>
                  <rect x="1" y="2" width="14" height="13" rx="2" stroke="#E8470A" strokeWidth="1.5" fill="none"/>
                  <path d="M5 1v2M11 1v2M1 6h14" stroke="#E8470A" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="font-medium">{mevite.when}</span>
              </div>
              <div className="flex gap-2 items-start">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:2}}>
                  <path d="M3 3h10l-1 8H4L3 3z" stroke="#E8470A" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                  <path d="M1 3h14" stroke="#E8470A" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 3V2a2 2 0 014 0v1" stroke="#E8470A" strokeWidth="1.5" fill="none"/>
                </svg>
                <span className="font-medium">{mevite.bringing}</span>
              </div>
              <div className="flex gap-2 items-start">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:2}}>
                  <path d="M2 2a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 3V2z" stroke="#E8470A" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium">{mevite.why}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E8E8E8]">
              <ArrivalGauge status={mevite.arrivalStatus} />
            </div>
          </div>
        ) : (
          <div className="mevite-card animate-pulse h-36 bg-[#F5F5F5]" />
        )}

        {/* Live link */}
        <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between gap-3">
          <p className="text-xs text-[#555] font-mono truncate">{meviteUrl}</p>
          <button onClick={handleCopy}
            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
              copied ? "bg-[#111] text-white border-[#111]" : "text-[#FF4C00] border-[#FF4C00]"
            }`}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Share actions */}
        <div className="space-y-3">
          {/* Primary — SMS */}
          <a href={`sms:?body=${encodeURIComponent(smsText)}`} className="cta-btn block text-center no-underline">
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6l-4 3V4z" fill="currentColor" />
              </svg>
              Send via Text Message
            </span>
          </a>

          {/* WhatsApp */}
          <a href={`https://wa.me/?text=${encodeURIComponent(smsText)}`} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 border border-[#E8E8E8] rounded-xl py-3.5 text-sm font-semibold text-[#111] hover:bg-[#F5F5F5] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send via WhatsApp
          </a>

          {/* Email */}
          <a href={`mailto:?subject=${encodeURIComponent("I'm coming over.")}&body=${encodeURIComponent(`${smsText}\n\nCheck my Mevite to respond.`)}`}
            className="w-full flex items-center justify-center gap-2 border border-[#E8E8E8] rounded-xl py-3.5 text-sm font-semibold text-[#111] hover:bg-[#F5F5F5] transition-colors">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M2 4h16v12H2V4z" stroke="#111" strokeWidth="1.5" fill="none"/>
              <path d="M2 4l8 8 8-8" stroke="#111" strokeWidth="1.5" fill="none"/>
            </svg>
            Send via Email
          </a>
        </div>

        {/* View mission page */}
        <div className="pt-2 border-t border-[#E8E8E8]">
          <button onClick={() => router.push(`/m/${id}`)}
            className="w-full text-center text-sm font-semibold text-[#FF4C00] py-3">
            View live mission page →
          </button>
          <p className="text-center text-xs text-[#AAA] mt-1">
            This is what your friend sees when they open your link.
          </p>
        </div>
      </div>
    </div>
  );
}
