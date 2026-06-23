export type ArrivalStatus =
  | "maybe"
  | "probably"
  | "definitely"
  | "locked-in"
  | "open-the-door";

export type ReceiverResponse = "obviously" | "adjust" | "terrible" | null;
export type MeviteStatus = "pending" | "adjusting" | "locked" | "declined";

export interface SuggestedChange {
  newDate: string;
  newTime: string;
  note: string;
  proposedAt: string;
  proposedBy: "receiver";
}

export interface Mevite {
  id: string;
  who: string;       // the person being visited
  sender: string;    // the person showing up (you)
  when: string;
  bringing: string;
  why: string;
  arrivalStatus: ArrivalStatus;
  senderPhone?: string;
  receiverResponse: ReceiverResponse;
  status: MeviteStatus;
  suggestedChange?: SuggestedChange;
  confirmedAt?: string;
  createdAt: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  type: "created" | "suggested" | "confirmed" | "declined" | "status-update";
  label: string;
  timestamp: string;
}

export const ARRIVAL_STATUSES: {
  key: ArrivalStatus;
  label: string;
  description: string;
  sub: string;
  gaugeLevel: number;
}[] = [
  { key: "maybe",          label: "Maybe",          description: "It's crossed my mind.",          sub: "Thinking about it.",              gaugeLevel: 1 },
  { key: "probably",       label: "Probably",        description: "I'm checking calendars.",        sub: "Looking likely.",                 gaugeLevel: 2 },
  { key: "definitely",     label: "Definitely",      description: "The plan is real now.",          sub: "It's happening.",                 gaugeLevel: 3 },
  { key: "locked-in",      label: "Locked In",       description: "You should expect me.",         sub: "Nothing's getting in the way.",   gaugeLevel: 4 },
  { key: "open-the-door",  label: "Open The Door",   description: "Save me a seat.",               sub: "Assume I'm coming.",              gaugeLevel: 5 },
];

export const WHO_PROMPTS    = ["Your college roommate","Your best friend","Your mom","Your old neighbor","Your cousin","Your work friend","Your person"];
export const SENDER_PROMPTS = ["The Bestie","The Old Friend","The Ride or Die","The College Crew","The Long Lost One","The Sibling","The Neighbor","The Work Wife","The Far Away One"];
export const WHEN_PROMPTS   = ["This Weekend","Next Monday","Tomorrow Night","Friday at 8","Sunday Afternoon"];
export const BRINGING_PROMPTS = ["Pizza","Wine","Beer","Snacks","Nothing, just myself","Flowers"];
export const WHY_PROMPTS    = ["It's been too long.","We haven't talked in six months.","I miss you.","Life's short.","No reason needed.","Because I want to."];
