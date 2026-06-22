"use client";
import { useState, useEffect } from "react";

const FIELD_STYLE = {
  label: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#888",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: 6,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  placeholder: {
    fontSize: 18,
    fontWeight: 400,
    color: "#CCC",
    fontFamily: "Inter, system-ui, sans-serif",
    lineHeight: "1.2",
  },
  value: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111",
    fontFamily: "Inter, system-ui, sans-serif",
    lineHeight: "1.2",
  },
  underline: {
    borderBottom: "1px solid #E0E0E0",
    paddingBottom: 10,
    display: "block",
  },
};

export { FIELD_STYLE };

export function RotatingPrompt({
  prompts,
  value,
  onChange,
  label,
}: {
  prompts: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
}) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused || value) return;
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setIdx(i => (i + 1) % prompts.length); setAnimating(false); }, 250);
    }, 2200);
    return () => clearInterval(t);
  }, [focused, value, prompts.length]);

  return (
    <div>
      <label style={FIELD_STYLE.label}>{label}</label>
      <div style={{ position: "relative", ...FIELD_STYLE.underline }}>
        {/* Input — invisible text, just captures typing */}
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...FIELD_STYLE.value,
            position: "absolute",
            inset: 0,
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            opacity: value ? 1 : 0,
            caretColor: "#111",
          }}
        />
        {/* Rotating placeholder */}
        {!value && !focused && (
          <span
            className={animating ? "prompt-exit" : "prompt-enter"}
            style={{ ...FIELD_STYLE.placeholder, display: "block", paddingRight: 28, minHeight: 22 }}
          >
            {prompts[idx]}
          </span>
        )}
        {/* Typed value mirror when focused with no overlay */}
        {(value || focused) && (
          <span style={{ ...FIELD_STYLE.value, display: "block", minHeight: 22, opacity: 0, pointerEvents: "none" }}>
            {value || "."}
          </span>
        )}
        {/* Three dots */}
        {!value && !focused && (
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
            <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
              <circle cx="2" cy="2" r="1.5" fill="#CCC"/>
              <circle cx="8" cy="2" r="1.5" fill="#CCC"/>
              <circle cx="14" cy="2" r="1.5" fill="#CCC"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// When field — identical treatment, opens picker instead of typing
export function WhenField({
  value,
  prompts,
  promptIndex,
  isAnimating,
  onClick,
}: {
  value: string;
  prompts: string[];
  promptIndex: number;
  isAnimating: boolean;
  onClick: () => void;
}) {
  return (
    <div>
      <label style={FIELD_STYLE.label}>When?</label>
      <button
        onClick={onClick}
        style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", display: "block" }}
      >
        <span style={{ ...FIELD_STYLE.underline, display: "block" }}>
          {value ? (
            <span style={{ ...FIELD_STYLE.value, minHeight: 22, display: "block" }}>{value}</span>
          ) : (
            <span
              className={isAnimating ? "prompt-exit" : "prompt-enter"}
              style={{ ...FIELD_STYLE.placeholder, minHeight: 22, display: "block" }}
            >
              {prompts[promptIndex]}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
