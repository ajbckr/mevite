import type { Metadata } from "next";

async function getMeviteData(id: string) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!projectId || !apiKey) return null;
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const { fields: f } = await res.json();
    if (!f) return null;
    return {
      sender: f.sender?.stringValue || f.who?.stringValue || "Someone",
      why:    f.why?.stringValue    || "It's been too long.",
    };
  } catch { return null; }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const m = await getMeviteData(id);
  const sender = m?.sender || "Someone";
  const why    = m?.why    || "It's been too long.";
  const title  = `${sender} is coming over.`;
  const desc   = `"${why}" — Open your Mevite to respond.`;
  const ogImage = `https://mevite.me/api/og?id=${id}`;

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter:    { card: "summary_large_image", title, description: desc, images: [ogImage] },
  };
}

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
