import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEVITE — Invite Yourself Over.",
  description: "Stop saying 'we should get together.' Show up.",
  openGraph: {
    title: "MEVITE",
    description: "Stop saying 'we should get together.' Show up.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
