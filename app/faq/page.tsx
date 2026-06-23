import { MeviteFooter } from "@/components/MeviteFooter";

const F = "Inter, system-ui, sans-serif";
const ORANGE = "#E8470A";

const FAQS = [
  {
    q: "What is a Mevite?",
    a: [`A Mevite is what happens when you stop saying "we should get together" and actually make a plan.`],
  },
  {
    q: "Is this an invitation?",
    a: ["Not exactly.", "An invitation asks someone to come to you.", "A Mevite tells someone you're coming to them."],
  },
  {
    q: "Do I need an account?",
    a: ["No.", "The fewer barriers between you and your friends, the better."],
  },
  {
    q: "Do recipients need an account?",
    a: ["No.", "Open the link. Respond. Done."],
  },
  {
    q: "What if they say no?",
    a: ["That's okay.", "The goal isn't perfection. The goal is making the effort."],
  },
  {
    q: "What if we've fallen out of touch?",
    a: ["That's exactly why Mevite exists.", "Most friendships don't end because of a big fight. They fade because life gets busy. A Mevite is a simple way to restart the conversation."],
  },
  {
    q: "Why not just send a text?",
    a: ["You can.", "But sometimes a text gets lost in the noise. A Mevite turns good intentions into a plan and gives the moment a little more weight."],
  },
  {
    q: `What does "This Is Happening" mean?`,
    a: ["It's your level of commitment.", "Not where you are. Not a tracker.", "Just a simple way to say how serious you are about showing up."],
  },
  {
    q: "Why doesn't Mevite have RSVPs, voting, or scheduling polls?",
    a: ["Because there are already plenty of products that do that.", "Mevite isn't about coordinating calendars.", "It's about making the first move."],
  },
  {
    q: "Who is Mevite for?",
    a: ["Old friends.\nNew friends.\nNeighbors.\nSiblings.\nCollege roommates.\nThe people you keep meaning to see."],
  },
  {
    q: "Is this serious or a joke?",
    a: ["Yes.", "That's kind of the point."],
  },
  {
    q: "What if I don't know what to say?",
    a: ["That's why we're here.", "Sometimes the hardest part of reconnecting is finding the words. A Mevite helps start the conversation."],
  },
  {
    q: "What's the goal of this project?",
    a: ["To help more people show up for the people they care about."],
  },
];

export default function FAQPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 24px" }}>
        <a href="/" style={{ display: "inline-block", lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mevite-wordmark.png" alt="MEVITE" style={{ height: 22, width: "auto", display: "block" }} />
        </a>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "56px 24px 80px" }}>

        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: ORANGE, margin: "0 0 14px",
        }}>
          FAQ
        </p>

        <h1 style={{
          fontSize: "clamp(1.7rem, 5vw, 2.2rem)",
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: "-0.02em", color: "#111",
          margin: "0 0 52px",
        }}>
          Frequently Asked<br />Questions
        </h1>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{
              borderTop: "1px solid #EBEBEB",
              padding: "28px 0",
            }}>
              <p style={{
                fontSize: 15, fontWeight: 800, color: "#111",
                margin: "0 0 10px", lineHeight: 1.3,
              }}>
                {q}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {a.map((para, j) => (
                  <p key={j} style={{
                    fontSize: 15, lineHeight: 1.7, color: "#555",
                    margin: 0, whiteSpace: "pre-line",
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #EBEBEB" }} />
        </div>

        <div style={{ marginTop: 56, textAlign: "center" }}>
          <a href="/" style={{
            display: "inline-block", background: ORANGE, color: "#fff",
            padding: "13px 24px", borderRadius: 10,
            fontSize: 14, fontWeight: 700, textDecoration: "none",
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
