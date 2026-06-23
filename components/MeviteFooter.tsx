const F = "Inter, system-ui, sans-serif";
const LINKS = ["About", "FAQ", "Privacy", "Terms", "Contact"];

export function MeviteFooter({ dark = false }: { dark?: boolean }) {
  const muted   = dark ? "#555" : "#999";
  const links   = dark ? "#666" : "#AAA";
  const divider = dark ? "#333" : "#E8E8E8";
  const copy    = dark ? "#444" : "#CCC";
  const dot     = dark ? "#444" : "#DDD";
  const hover   = dark ? "#AAA" : "#555";

  return (
    <footer style={{
      borderTop: `1px solid ${divider}`,
      padding: "28px 0 36px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    }}>
      <p style={{
        fontSize: 12,
        color: muted,
        margin: 0,
        fontFamily: F,
        textAlign: "center",
        lineHeight: 1.6,
        letterSpacing: "0.01em",
      }}>
        A small project about showing up.
      </p>

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {LINKS.map((link, i) => (
          <span key={link} style={{ display: "flex", alignItems: "center" }}>
            <a href="#" style={{ fontSize: 12, color: links, textDecoration: "none", fontFamily: F, padding: "0 2px" }}
              onMouseEnter={e => (e.currentTarget.style.color = hover)}
              onMouseLeave={e => (e.currentTarget.style.color = links)}
            >
              {link}
            </a>
            {i < LINKS.length - 1 && (
              <span style={{ fontSize: 11, color: dot, margin: "0 5px" }}>·</span>
            )}
          </span>
        ))}
      </div>

      <p style={{ fontSize: 11, color: copy, margin: 0, fontFamily: F }}>
        © 2026 Mevite
      </p>
    </footer>
  );
}
