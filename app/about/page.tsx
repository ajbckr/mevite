import { MeviteFooter } from "@/components/MeviteFooter";

const F = "Inter, system-ui, sans-serif";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 24px" }}>
        <a href="/" style={{ display: "inline-block", lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mevite-wordmark.png" alt="MEVITE" style={{ height: 22, width: "auto", display: "block" }} />
        </a>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Eyebrow */}
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#E8470A",
          margin: "0 0 20px",
        }}>
          About Mevite
        </p>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          color: "#111",
          margin: "0 0 8px",
        }}>
          Stop saying &ldquo;we should<br />get together.&rdquo;
        </h1>
        <p style={{
          fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          color: "#E8470A",
          margin: "0 0 48px",
        }}>
          Show up.
        </p>

        {/* Divider */}
        <div style={{ width: 32, height: 2, background: "#E8470A", marginBottom: 40 }} />

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p style={{
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.4,
            color: "#111",
            margin: 0,
          }}>
            Friends should stay friends.
          </p>

          <p style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "#555",
            margin: 0,
          }}>
            Life is noisy. Intentions fade. Time gets away from us.
          </p>

          <p style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "#555",
            margin: 0,
          }}>
            Mevite exists for the moments when you want to reach out but don&apos;t know where to start. It&apos;s a small commitment, a little courage, and a simple way to tell someone they still matter.
          </p>

          <p style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "#555",
            margin: 0,
          }}>
            No polls. No RSVPs. No endless planning. Just one person deciding a friendship is worth showing up for.
          </p>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 56 }}>
          <a href="/" style={{
            display: "inline-block",
            background: "#E8470A",
            color: "#fff",
            padding: "13px 24px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}>
            Make a Mevite →
          </a>
        </div>

      </div>

      <MeviteFooter />
    </div>
  );
}
