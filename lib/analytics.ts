// Mevite Analytics — GA4 event tracking
// All events flow to G-6EFZYTQR30

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}

// ── CREATION FUNNEL ──────────────────────────────────────────────

// User starts filling out the form (first field interaction)
export const trackFormStart = () =>
  track("mevite_form_start");

// User fills a specific field
export const trackFieldFilled = (field: "who" | "when" | "bringing" | "why" | "sender") =>
  track("mevite_field_filled", { field });

// User sets commitment level
export const trackCommitmentSet = (level: string) =>
  track("mevite_commitment_set", { level });

// User submits the form
export const trackMeviteCreated = (params: { has_when: boolean; has_bringing: boolean; has_why: boolean; commitment: string }) =>
  track("mevite_created", params);

// ── SHARE PAGE ───────────────────────────────────────────────────

// Share page loaded (Mevite successfully created)
export const trackSharePageView = (id: string) =>
  track("mevite_share_view", { mevite_id: id });

// User taps SMS share
export const trackShareSMS = () =>
  track("mevite_share_sms");

// User taps WhatsApp share
export const trackShareWhatsApp = () =>
  track("mevite_share_whatsapp");

// User taps Email share
export const trackShareEmail = () =>
  track("mevite_share_email");

// ── MISSION PAGE (RECEIVER) ──────────────────────────────────────

// Receiver opens the Mevite
export const trackMissionView = (id: string) =>
  track("mevite_mission_view", { mevite_id: id });

// Receiver switches between views
export const trackViewToggle = (view: "receiver" | "sender") =>
  track("mevite_view_toggle", { view });

// Receiver responds
export const trackReceiverResponse = (response: "obviously" | "adjust" | "terrible") =>
  track("mevite_receiver_response", { response });

// Receiver taps "Text your response"
export const trackTextResponse = () =>
  track("mevite_text_response");

// Receiver taps "Different day?" → goes to adjust
export const trackAdjustOpen = () =>
  track("mevite_adjust_open");

// Receiver confirms a suggested time change
export const trackSuggestionConfirmed = () =>
  track("mevite_suggestion_confirmed");

// Receiver adds to calendar
export const trackAddToCalendar = (type: "google" | "apple") =>
  track("mevite_add_to_calendar", { type });

// Sender updates commitment level
export const trackCommitmentUpdate = (level: string) =>
  track("mevite_commitment_update", { level });

// ── ADJUST PAGE ──────────────────────────────────────────────────

export const trackSuggestionSent = () =>
  track("mevite_suggestion_sent");

// ── NAVIGATION ───────────────────────────────────────────────────

export const trackFooterLink = (label: string) =>
  track("mevite_footer_link", { label });
