import type { Metadata } from "next";

async function getMeviteData(id: string) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.fields;
    if (!f) return null;
    return {
      sender: f.sender?.stringValue || f.who?.stringValue || "Someone",
      why:    f.why?.stringValue || "It's been too long.",
      when:   f.when?.stringValue || "",
    };
  } catch {
    return null;
  }
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

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [`/m/${id}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [`/m/${id}/opengraph-image`],
    },
  };
}

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
