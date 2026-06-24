import type { Metadata } from "next";
import { MeviteFooter } from "@/components/MeviteFooter";

export const metadata: Metadata = {
  title: "About Mevite — Why We Built an Anti-RSVP App",
  description: "Evites are too formal. RSVPs kill spontaneity. Mevite is the casual hangout app that lets you invite yourself over — no planning paralysis, no group chats that go nowhere. Just show up.",
  alternates: { canonical: "https://mevite.me/about" },
};

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
          <p style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, color: "#111", margin: 0 }}>
            Friends should stay friends.
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            Life is noisy. Intentions fade. Time gets away from us. And somewhere along the way, we started treating hanging out like it requires a project manager.
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            Evites. RSVPs. Doodle polls. Group chats that go nowhere. We&apos;ve added so much friction to something that used to be simple: <em>showing up.</em>
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            Mevite is the anti-evite. Instead of sending a formal invitation and waiting for RSVPs, you invite yourself. You declare that you&apos;re coming over. You make it real.
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            No polls. No planning paralysis. No &ldquo;let&apos;s find a time that works for everyone.&rdquo; Just one person deciding a friendship is worth showing up for — and doing something about it.
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            The best hangs are spontaneous. The best friends are the ones who just appear. Mevite is how you become that person.
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
