export type ArrivalStatus =
  | "maybe"
  | "probably"
  | "definitely"
  | "on-my-way"
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
  gaugeLevel: number;
  icon: string; // kept for fallback
}[] = [
  { key: "maybe",         label: "Maybe",         description: "It's a thought.",          gaugeLevel: 1, icon: "💡" },
  { key: "probably",      label: "Probably",       description: "I'm looking at calendars.", gaugeLevel: 2, icon: "📅" },
  { key: "definitely",    label: "Definitely",     description: "Plans are forming.",        gaugeLevel: 3, icon: "🎒" },
  { key: "on-my-way",     label: "On My Way",      description: "En route.",                 gaugeLevel: 4, icon: "🚗" },
  { key: "open-the-door", label: "Open The Door",  description: "I'm outside.",              gaugeLevel: 5, icon: "🚪" },
];

export const WHO_PROMPTS    = ["Your college roommate","Your best friend","Your mom","Your old neighbor","Your cousin","Your work friend","Your person"];
export const SENDER_PROMPTS = ["Alex","Sam","Jordan","Taylor","Chris","Morgan","Your name"];
export const WHEN_PROMPTS   = ["This Weekend","Next Monday","Tomorrow Night","Friday at 8","Sunday Afternoon"];
export const BRINGING_PROMPTS = ["Pizza","Wine","Beer","Snacks","Nothing, just myself","Flowers"];
export const WHY_PROMPTS    = ["It's been too long.","We haven't talked in six months.","I miss you.","Life's short.","No reason needed.","Because I want to."];
