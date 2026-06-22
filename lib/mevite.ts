import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Mevite, TimelineEvent } from "./types";

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function createMevite(data: Omit<Mevite, "id" | "createdAt" | "timeline" | "receiverResponse" | "status">): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const timeline: TimelineEvent[] = [
    {
      id: "evt-1",
      type: "created",
      label: `${data.who.split(" ")[0]} created the Mevite`,
      timestamp: now,
    },
  ];

  const mevite: Mevite = {
    ...data,
    id,
    createdAt: now,
    receiverResponse: null,
    status: "pending",
    timeline,
  };

  await setDoc(doc(db, "mevites", id), mevite);
  return id;
}

export async function getMevite(id: string): Promise<Mevite | null> {
  const snap = await getDoc(doc(db, "mevites", id));
  if (!snap.exists()) return null;
  return snap.data() as Mevite;
}

export function subscribeMevite(id: string, callback: (m: Mevite | null) => void) {
  return onSnapshot(doc(db, "mevites", id), (snap) => {
    if (!snap.exists()) callback(null);
    else callback(snap.data() as Mevite);
  });
}

export async function respondToMevite(
  id: string,
  response: "obviously" | "adjust" | "terrible"
): Promise<void> {
  const now = new Date().toISOString();
  const snap = await getDoc(doc(db, "mevites", id));
  if (!snap.exists()) return;
  const mevite = snap.data() as Mevite;

  const labels = {
    obviously: "Confirmed — obviously.",
    adjust: "Suggested adjusting the plan.",
    terrible: "Said terrible timing.",
  };

  const newEvent: TimelineEvent = {
    id: `evt-${Date.now()}`,
    type: response === "obviously" ? "confirmed" : response === "terrible" ? "declined" : "suggested",
    label: labels[response],
    timestamp: now,
  };

  const newStatus = response === "obviously" ? "locked" : response === "terrible" ? "declined" : "pending";

  await updateDoc(doc(db, "mevites", id), {
    receiverResponse: response,
    status: newStatus,
    confirmedAt: response === "obviously" ? now : null,
    timeline: [...mevite.timeline, newEvent],
  });
}

export async function suggestChange(
  id: string,
  newDate: string,
  newTime: string,
  note: string
): Promise<void> {
  const now = new Date().toISOString();
  const snap = await getDoc(doc(db, "mevites", id));
  if (!snap.exists()) return;
  const mevite = snap.data() as Mevite;

  const newEvent: TimelineEvent = {
    id: `evt-${Date.now()}`,
    type: "suggested",
    label: `Suggested ${newDate} at ${newTime}`,
    timestamp: now,
  };

  await updateDoc(doc(db, "mevites", id), {
    status: "adjusting",
    receiverResponse: "adjust",
    suggestedChange: {
      newDate,
      newTime,
      note,
      proposedAt: now,
      proposedBy: "receiver",
    },
    timeline: [...mevite.timeline, newEvent],
  });
}

export async function confirmSuggestion(id: string): Promise<void> {
  const now = new Date().toISOString();
  const snap = await getDoc(doc(db, "mevites", id));
  if (!snap.exists()) return;
  const mevite = snap.data() as Mevite;

  const newEvent: TimelineEvent = {
    id: `evt-${Date.now()}`,
    type: "confirmed",
    label: "Confirmed the new plan.",
    timestamp: now,
  };

  await updateDoc(doc(db, "mevites", id), {
    status: "locked",
    receiverResponse: "obviously",
    confirmedAt: now,
    timeline: [...mevite.timeline, newEvent],
  });
}

export async function updateArrivalStatus(id: string, status: string): Promise<void> {
  const now = new Date().toISOString();
  const snap = await getDoc(doc(db, "mevites", id));
  if (!snap.exists()) return;
  const mevite = snap.data() as Mevite;

  const labels: Record<string, string> = {
    thinking: "Thinking About It",
    planning: "Making a Plan",
    packing: "Packing a Bag",
    "on-my-way": "On My Way",
    outside: "Outside Your House",
  };

  const newEvent: TimelineEvent = {
    id: `evt-${Date.now()}`,
    type: "status-update",
    label: `Status updated: ${labels[status] || status}`,
    timestamp: now,
  };

  await updateDoc(doc(db, "mevites", id), {
    arrivalStatus: status,
    timeline: [...mevite.timeline, newEvent],
  });
}
