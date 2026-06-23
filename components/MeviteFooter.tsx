"use client";
const F = "Inter, system-ui, sans-serif";

const LINKS = [
  { label: "About",   href: "/about" },
  { label: "FAQ",     href: "/faq" },
  { label: "Privacy", href: "#" },
  { label: "Terms",   href: "#" },
  { label: "Contact", href: "#" },
];

export function MeviteFooter() {
  return (
    <footer style={{
      borderTop: "1px solid #EBEBEB",
      padding: "48px 24px 52px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      background: "#fff",
    }}>
      <p style={{ fontSize: 13, color: "#888", margin: 0, fontFamily: F, textAlign: "center", letterSpacing: "0.01em" }}>
        Show up.
      </p>

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {LINKS.map(({ label, href }, i) => (
          <span key={label} style={{ display: "flex", alignItems: "center" }}>
            <a href={href} style={{ fontSize: 12, color: "#AAA", textDecoration: "none", fontFamily: F, padding: "0 2px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#555")}
              onMouseLeave={e => (e.currentTarget.style.color = "#AAA")}
            >
              {label}
            </a>
            {i < LINKS.length - 1 && (
              <span style={{ fontSize: 11, color: "#DDD", margin: "0 6px" }}>·</span>
            )}
          </span>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#CCC", margin: 0, fontFamily: F }}>
        © 2026 Mevite
      </p>
    </footer>
  );
}
