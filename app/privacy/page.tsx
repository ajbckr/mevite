import { MeviteFooter } from "@/components/MeviteFooter";

const F = "Inter, system-ui, sans-serif";
const ORANGE = "#E8470A";

export default function PrivacyPage() {
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
          Privacy
        </p>
        <h1 style={{ fontSize: "clamp(1.7rem, 5vw, 2.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#111", margin: "0 0 10px" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: "#AAA", margin: "0 0 48px", fontFamily: F }}>
          Last updated: June 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: 0, fontWeight: 600 }}>
            Mevite is built around a simple idea: helping people show up for each other.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            Right now, we collect very little information.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            When you create a Mevite, we may store information such as the details of the Mevite itself, your name (if provided), and basic technical information needed to keep the service running.
          </p>

          <div style={{ borderLeft: "3px solid #EBEBEB", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555", margin: 0 }}>We do not sell your data.</p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555", margin: 0 }}>We do not build advertising profiles.</p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555", margin: 0 }}>We do not share your information with third parties except when necessary to operate the service.</p>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            As Mevite evolves, the information we collect may change. If it does, we&apos;ll update this page and explain what changed.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#555", margin: 0 }}>
            If you have questions, reach out at{" "}
            <a href="mailto:me@mevite.me" style={{ color: ORANGE, textDecoration: "none", fontWeight: 600 }}>me@mevite.me</a>.
          </p>
          <p style={{ fontSize: 15, color: "#AAA", margin: 0, fontStyle: "italic" }}>
            That&apos;s it.
          </p>
        </div>
      </div>

      <MeviteFooter />
    </div>
  );
}
