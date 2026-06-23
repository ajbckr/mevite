import { MeviteFooter } from "@/components/MeviteFooter";

const F = "Inter, system-ui, sans-serif";
const ORANGE = "#E8470A";

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F }}>
      <div style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 24px" }}>
        <a href="/" style={{ display: "inline-block", lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mevite-wordmark.png" alt="MEVITE" style={{ height: 22, width: "auto", display: "block" }} />
        </a>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "56px 24px 80px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 14px" }}>
          Terms
        </p>
        <h1 style={{ fontSize: "clamp(1.7rem, 5vw, 2.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#111", margin: "0 0 10px" }}>
          Terms of Use
        </h1>
        <p style={{ fontSize: 13, color: "#AAA", margin: "0 0 48px", fontFamily: F }}>
          Last updated: June 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: 0, fontWeight: 600 }}>
            Mevite is a simple tool for creating and sharing plans with people you care about.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            Please use it responsibly.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            Don&apos;t use Mevite to harass, spam, impersonate other people, or engage in illegal activity.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            The service is provided as-is. While we do our best to keep things running smoothly, we can&apos;t guarantee uninterrupted availability or perfect reliability.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            We may update, modify, or discontinue features at any time.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            By using Mevite, you agree to use the service in good faith and accept these terms.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            Questions? Reach out at{" "}
            <a href="mailto:me@mevite.me" style={{ color: ORANGE, textDecoration: "none", fontWeight: 600 }}>me@mevite.me</a>.
          </p>
        </div>
      </div>

      <MeviteFooter />
    </div>
  );
}
