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

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #E8E8E8",
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  height: "56px",
  gap: 0,
};

const dividerStyle: React.CSSProperties = {
  width: "1px",
  height: "28px",
  backgroundColor: "#1a1a1a",
  margin: "0 16px",
  flexShrink: 0,
};

const wordmarkStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 900,
  letterSpacing: "0.1em",
  color: "#111111",
  marginLeft: "10px",
  fontFamily: "Inter, system-ui, sans-serif",
};

const taglineStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 900,
  color: "#111111",
  fontFamily: "Inter, system-ui, sans-serif",
  lineHeight: 1,
};

export function MeviteHeader() {
  return (
    <header style={headerStyle}>
      <MIcon size={38} />
      <span style={wordmarkStyle}>MEVITE</span>
      <div style={dividerStyle} />
      <span style={taglineStyle}>
        Invite Yourself Over<span style={{ color: "#E8470A" }}>.</span>
      </span>
    </header>
  );
}

export function MeviteHeaderCompact() {
  return (
    <header style={{ ...headerStyle, height: "48px" }}>
      <MIcon size={28} />
      <span style={{ ...wordmarkStyle, fontSize: "14px", marginLeft: "8px" }}>MEVITE</span>
      <div style={{ ...dividerStyle, height: "22px", margin: "0 12px" }} />
      <span style={{ ...taglineStyle, fontSize: "14px" }}>
        Invite Yourself Over<span style={{ color: "#E8470A" }}>.</span>
      </span>
    </header>
  );
}
