"use client";
import { trackFooterLink } from "@/lib/analytics";

const F = "Inter, system-ui, sans-serif";

const LINKS = [
  { label: "About",   href: "/about" },
  { label: "FAQ",     href: "/faq" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms",   href: "/terms" },
  { label: "Contact", href: "mailto:me@mevite.me" },
];

export function MeviteFooter() {
  return (
    <>
      <style>{`
        .mevite-footer-link { color: #AAA; text-decoration: none; font-size: 12px; padding: 0 2px; font-family: ${F}; transition: color 0.15s; }
        .mevite-footer-link:hover { color: #555; }
      `}</style>
      <footer style={{
        borderTop: "1px solid #EBEBEB",
        padding: "48px 24px 52px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        background: "#fff",
        fontFamily: F,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer-door.png" alt="" style={{ height: 28, width: "auto", opacity: 0.5 }} />
          <p style={{ fontSize: 13, color: "#888", margin: 0, letterSpacing: "0.01em" }}>
            Show up.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          {LINKS.map(({ label, href }, i) => (
            <span key={label} style={{ display: "flex", alignItems: "center" }}>
              <a href={href} className="mevite-footer-link" onClick={() => trackFooterLink(label)}>{label}</a>
              {i < LINKS.length - 1 && (
                <span style={{ fontSize: 11, color: "#DDD", margin: "0 6px" }}>·</span>
              )}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "#CCC", margin: 0 }}>
          © 2026 Mevite
        </p>
      </footer>
    </>
  );
}
