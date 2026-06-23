import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!projectId || !apiKey) {
      return NextResponse.json({ error: "missing config" }, { status: 500 });
    }

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${id}?key=${apiKey}`,
      { cache: "no-store" }
    );

    if (!res.ok) return NextResponse.json({ error: "not found" }, { status: 404 });

    const { fields: f } = await res.json();
    if (!f) return NextResponse.json({ error: "no data" }, { status: 404 });

    return NextResponse.json({
      sender:   f.sender?.stringValue   || f.who?.stringValue || "",
      who:      f.who?.stringValue      || "",
      bringing: f.bringing?.stringValue || "",
      why:      f.why?.stringValue      || "",
      when:     f.when?.stringValue     || "",
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
