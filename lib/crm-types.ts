export type LeadStatus =
  | "new"
  | "no-answer"
  | "engaged"
  | "send-demo"
  | "demo-sent"
  | "fu1"
  | "fu2"
  | "fu3"
  | "fu4"
  | "meeting"
  | "no-show"
  | "meeting-had"
  | "awaiting-payment"
  | "closed"
  | "dead";

export type ContactMethod = "phone-call" | "facebook" | "email" | "cold-call";

export type WebsiteStatus = "none" | "bad" | "average" | "good";

export interface WebsiteStatusDef {
  id: WebsiteStatus;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  text: string;
  border: string;
}

export const WEBSITE_STATUSES: WebsiteStatusDef[] = [
  {
    id: "none",
    label: "No Website",
    emoji: "❌",
    color: "#ef4444",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  {
    id: "bad",
    label: "Bad Website",
    emoji: "⚠️",
    color: "#f59e0b",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  {
    id: "average",
    label: "Average Website",
    emoji: "🟡",
    color: "#eab308",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  {
    id: "good",
    label: "Good Website",
    emoji: "🟢",
    color: "#10b981",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
];

export interface LeadStatusDef {
  id: LeadStatus;
  name: string;
  shortName: string;
  color: string;
  bg: string;
  text: string;
  border: string;
}

export const LEAD_STATUSES: LeadStatusDef[] = [
  {
    id: "new",
    name: "New Lead",
    shortName: "New",
    color: "#6366f1",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  {
    id: "no-answer",
    name: "No Answer",
    shortName: "No Answer",
    color: "#64748b",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
  {
    id: "engaged",
    name: "Engaged",
    shortName: "Engaged",
    color: "#14b8a6",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  {
    id: "send-demo",
    name: "Send Demo",
    shortName: "Send Demo",
    color: "#d946ef",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    border: "border-fuchsia-200",
  },
  {
    id: "demo-sent",
    name: "Demo Sent",
    shortName: "Demo",
    color: "#8b5cf6",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  {
    id: "fu1",
    name: "Follow Up 1",
    shortName: "FU1",
    color: "#f59e0b",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  {
    id: "fu2",
    name: "Follow Up 2",
    shortName: "FU2",
    color: "#f97316",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  {
    id: "fu3",
    name: "Follow Up 3",
    shortName: "FU3",
    color: "#ef4444",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  {
    id: "fu4",
    name: "Follow Up 4 (Last Day)",
    shortName: "FU4",
    color: "#db2777",
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  {
    id: "meeting",
    name: "Meeting Scheduled",
    shortName: "Meeting",
    color: "#3b82f6",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  {
    id: "no-show",
    name: "No Show",
    shortName: "No Show",
    color: "#f43f5e",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  {
    id: "meeting-had",
    name: "Meeting Had",
    shortName: "Meeting Had",
    color: "#06b6d4",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  {
    id: "awaiting-payment",
    name: "Awaiting Payment",
    shortName: "Awaiting Pmt",
    color: "#eab308",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  {
    id: "closed",
    name: "Closed",
    shortName: "Closed",
    color: "#10b981",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  {
    id: "dead",
    name: "Dead",
    shortName: "Dead",
    color: "#9ca3af",
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
  },
];

export const CONTACT_METHODS: { id: ContactMethod; name: string }[] = [
  { id: "phone-call", name: "Phone Call" },
  { id: "facebook", name: "Facebook" },
  { id: "email", name: "Email" },
  { id: "cold-call", name: "Cold Call" },
];

export interface Lead {
  id: string;
  businessName: string;
  ownerName: string;
  phone?: string;
  email?: string;
  contactMethod?: ContactMethod;
  dateContacted?: string;
  status: LeadStatus;
  websiteStatus?: WebsiteStatus | null;
  lastContactedAt?: string | null;
  followupSentAt?: string | null;
  notes?: string;
  dealValue?: number;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  leadId?: string;
  type:
    | "status_change"
    | "note_added"
    | "lead_created"
    | "company_created"
    | "email_sent"
    | "call_logged"
    | "call_answered"
    | "marked_interested"
    | "callback_logged";
  description: string;
  createdAt: string;
}

export type CRMData = {
  leads: Lead[];
  companies: Company[];
  activity: ActivityLog[];
};
