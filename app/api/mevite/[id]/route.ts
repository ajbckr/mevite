"use server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!projectId || !apiKey) {
      return NextResponse.json({ error: "missing config" }, { status: 500 });
    }

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mevites/${params.id}?key=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });

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
