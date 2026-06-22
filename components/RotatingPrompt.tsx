"use client";
import { useState, useEffect } from "react";

const f = "Inter, system-ui, sans-serif";

// Shared field styles — used by both RotatingPrompt and the When field
export const fieldLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: "#888",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 4,
  fontFamily: f,
};

export const fieldPlaceholderStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 400,
  color: "#CCC",
  fontFamily: f,
  paddingBottom: 12,
  borderBottom: "1px solid #E0E0E0",
  display: "block",
  width: "100%",
};

export const fieldValueStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: "#111",
  fontFamily: f,
  paddingBottom: 12,
  borderBottom: "1px solid #E0E0E0",
  display: "block",
  width: "100%",
};

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
    <div>
      <label style={fieldLabelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        {/* Actual input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          style={{
            ...fieldValueStyle,
            background: "transparent",
            border: "none",
            borderBottom: "1px solid #E0E0E0",
            outline: "none",
            padding: "0 32px 12px 0",
            color: value ? "#111" : "transparent",
            caretColor: "#111",
          }}
        />
        {/* Rotating placeholder overlay */}
        {!value && !isFocused && (
          <div
            className={isAnimating ? "prompt-exit" : "prompt-enter"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 32,
              bottom: 12,
              pointerEvents: "none",
              fontSize: 20,
              fontWeight: 400,
              color: "#CCC",
              fontFamily: f,
              display: "flex",
              alignItems: "center",
            }}
          >
            {prompts[promptIndex]}
          </div>
        )}
        {/* Three-dot indicator */}
        {!value && !isFocused && (
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 12, display: "flex", alignItems: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="3" cy="8" r="1.5" fill="#CCC"/>
              <circle cx="8" cy="8" r="1.5" fill="#CCC"/>
              <circle cx="13" cy="8" r="1.5" fill="#CCC"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// When field — same visual treatment as RotatingPrompt but opens date picker
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
      <label style={fieldLabelStyle}>When?</label>
      <button
        onClick={onClick}
        style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", display: "block" }}
      >
        <div style={{ position: "relative", paddingBottom: 12, borderBottom: "1px solid #E0E0E0" }}>
          {/* Value or animated placeholder */}
          {value ? (
            <span style={{ fontSize: 20, fontWeight: 600, color: "#111", fontFamily: f }}>
              {value}
            </span>
          ) : (
            <span
              className={isAnimating ? "prompt-exit" : "prompt-enter"}
              style={{ fontSize: 20, fontWeight: 400, color: "#CCC", fontFamily: f, display: "block" }}
            >
              {prompts[promptIndex]}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
