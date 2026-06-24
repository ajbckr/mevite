import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEVITE — Invite Yourself Over.",
  description: "Stop saying 'we should get together.' Show up.",
  metadataBase: new URL("https://mevite.me"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "MEVITE — Invite Yourself Over.",
    description: "Stop saying 'we should get together.' Show up.",
    url: "https://mevite.me",
    siteName: "Mevite",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MEVITE — Invite Yourself Over." }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MEVITE — Invite Yourself Over.",
    description: "Stop saying 'we should get together.' Show up.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
