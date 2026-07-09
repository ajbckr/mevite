import type { Metadata } from "next";
import { MeviteFooter } from "@/components/MeviteFooter";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

const F = "Inter, system-ui, sans-serif";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: F, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 24px", background: "#fff" }}>
        <a href="/" style={{ display: "inline-block", lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mevite-wordmark.png" alt="MEVITE" style={{ height: 22, width: "auto", display: "block" }} />
        </a>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        maxWidth: 480,
        margin: "0 auto",
        padding: "64px 24px",
      }}>

        <p style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#E8470A",
          margin: "0 0 20px",
        }}>
          404
        </p>

        <h1 style={{
          fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: "#111",
          margin: "0 0 16px",
        }}>
          This page never showed up.
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#555", margin: "0 0 40px" }}>
          No RSVP, no explanation — it just didn&apos;t come. The link&apos;s broken or the page has moved on.
        </p>

        <a href="/" style={{
          display: "inline-block",
          background: "#E8470A",
          color: "#fff",
          padding: "13px 28px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 700,
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}>
          Back to Mevite →
        </a>

      </div>

      <MeviteFooter />
    </div>
  );
}
