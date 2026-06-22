"use client";

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
};

const dividerStyle: React.CSSProperties = {
  width: "1px",
  height: "30px",
  backgroundColor: "#1a1a1a",
  margin: "0 16px",
  flexShrink: 0,
};

const taglineStyle: React.CSSProperties = {
  fontSize: "17px",
  fontWeight: 900,
  color: "#111111",
  fontFamily: "Inter, system-ui, sans-serif",
  lineHeight: 1.15,
};

export function MeviteHeader() {
  return (
    <header style={headerStyle}>
      {/* Real M icon — cropped from actual logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/m-icon.png"
        alt="MEVITE"
        style={{ height: "38px", width: "38px", objectFit: "contain", objectPosition: "center" }}
      />

      {/* MEVITE wordmark */}
      <span style={{
        marginLeft: "10px",
        fontSize: "16px",
        fontWeight: 900,
        letterSpacing: "0.1em",
        color: "#111111",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        MEVITE
      </span>

      {/* Vertical divider */}
      <div style={dividerStyle} />

      {/* Tagline */}
      <span style={taglineStyle}>
        Invite Yourself Over<span style={{ color: "#E8470A" }}>.</span>
      </span>
    </header>
  );
}

export function MeviteHeaderCompact() {
  return (
    <header style={{ ...headerStyle, height: "48px" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/m-icon.png"
        alt="MEVITE"
        style={{ height: "30px", width: "30px", objectFit: "contain" }}
      />
      <span style={{
        marginLeft: "8px", fontSize: "14px", fontWeight: 900,
        letterSpacing: "0.1em", color: "#111111", fontFamily: "Inter, system-ui, sans-serif",
      }}>
        MEVITE
      </span>
      <div style={{ ...dividerStyle, height: "22px", margin: "0 12px" }} />
      <span style={{ ...taglineStyle, fontSize: "14px" }}>
        Invite Yourself Over<span style={{ color: "#E8470A" }}>.</span>
      </span>
    </header>
  );
}
