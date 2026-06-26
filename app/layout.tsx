import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-6EFZYTQR30";

export const metadata: Metadata = {
  title: {
    default: "Mevite — Invite Yourself Over. No RSVP Required.",
    template: "%s | Mevite",
  },
  description: "Skip the evite. Stop saying 'we should get together.' Mevite lets you invite yourself over — send a casual hangout invite in seconds. No RSVP, no formality, just showing up.",
  metadataBase: new URL("https://mevite.me"),
  keywords: [
    "invite yourself over",
    "casual hangout app",
    "no rsvp app",
    "informal invitation",
    "anti evite",
    "show up app",
    "hangout invite",
    "skip the rsvp",
    "evite alternative",
    "casual plans app",
    "spontaneous hangout",
    "stop saying we should get together",
  ],
  authors: [{ name: "Mevite", url: "https://mevite.me" }],
  creator: "Mevite",
  publisher: "Mevite",
  alternates: {
    canonical: "https://mevite.me",
  },
  openGraph: {
    title: "Mevite — Invite Yourself Over.",
    description: "Stop saying 'we should get together.' Mevite lets you invite yourself over — no RSVP, no evite, just show up.",
    url: "https://mevite.me",
    siteName: "Mevite",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mevite — Invite Yourself Over." }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mevite — Invite Yourself Over.",
    description: "Stop saying 'we should get together.' No RSVP. No evite. Just show up.",
    images: ["/og-image.jpg"],
    creator: "@mevite",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://mevite.me/#app",
      name: "Mevite",
      url: "https://mevite.me",
      description: "Mevite lets you invite yourself over — send a casual hangout invite in seconds with no RSVP required.",
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Send casual hangout invitations",
        "No RSVP required",
        "Real-time commitment tracking",
        "Share via SMS, WhatsApp, or Email",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://mevite.me/#org",
      name: "Mevite",
      url: "https://mevite.me",
      logo: {
        "@type": "ImageObject",
        url: "https://mevite.me/mevite-wordmark.png",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "me@mevite.me",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://mevite.me/#website",
      url: "https://mevite.me",
      name: "Mevite",
      description: "Stop saying 'we should get together.' Invite yourself over.",
      publisher: { "@id": "https://mevite.me/#org" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://mevite.me/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
        {children}
      </body>
    </html>
  );
}
