"use client";
import { useState, useEffect } from "react";

export function RotatingPrompt({
  prompts,
  value,
  onChange,
  placeholder,
  label,
}: {
  prompts: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused || value) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setPromptIndex((i) => (i + 1) % prompts.length);
        setIsAnimating(false);
      }, 250);
    }, 2200);
    return () => clearInterval(interval);
  }, [isFocused, value, prompts.length]);

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          className="mevite-input text-xl"
        />
        {!value && !isFocused && (
          <div
            className={`absolute inset-0 pointer-events-none text-xl font-semibold text-[#CCC] flex items-center pb-3 ${
              isAnimating ? "prompt-exit" : "prompt-enter"
            }`}
          >
            {prompts[promptIndex]}
          </div>
        )}
        {!value && !isFocused && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="1.5" fill="#CCC" />
              <circle cx="13" cy="8" r="1.5" fill="#CCC" />
              <circle cx="3" cy="8" r="1.5" fill="#CCC" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
