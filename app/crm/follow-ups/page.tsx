"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  MessageSquare,
  Phone,
  Send,
  XCircle,
} from "lucide-react";
import { useCRM } from "@/lib/crm-store";
import { Lead, LeadStatus } from "@/lib/crm-types";

// ─── Queue definitions ────────────────────────────────────────────────────────

interface QueueDef {
  id: string;
  label: string;
  description: string;
  fromStatus: LeadStatus;
  nextStatus: LeadStatus;
  nextLabel: string;
  emailType: "fu1" | "fu2" | "fu3" | null;
  color: string;
  bg: string;
  text: string;
  urgencyLabel: (days: number) => string;
}

const QUEUES: QueueDef[] = [
  {
    id: "q1",
    label: "Need FU 1",
    description: "These leads got no answer — time to send the first follow-up.",
    fromStatus: "no-answer",
    nextStatus: "fu1",
    nextLabel: "FU 1 Sent",
    emailType: "fu1",
    color: "#f59e0b",
    bg: "bg-amber-50",
    text: "text-amber-700",
    urgencyLabel: (d) => (d >= 3 ? `${d}d — send now!` : `${d}d ago`),
  },
  {
    id: "q2",
    label: "Need FU 2",
    description: "FU 1 was sent but still no reply — time for the second follow-up.",
    fromStatus: "fu1",
    nextStatus: "fu2",
    nextLabel: "FU 2 Sent",
    emailType: "fu2",
    color: "#f97316",
    bg: "bg-orange-50",
    text: "text-orange-700",
    urgencyLabel: (d) => (d >= 5 ? `${d}d — overdue!` : `${d}d ago`),
  },
  {
    id: "q3",
    label: "Need FU 3",
    description: "FU 2 sent with no response — this is the final follow-up.",
    fromStatus: "fu2",
    nextStatus: "fu3",
    nextLabel: "FU 3 Sent",
    emailType: "fu3",
    color: "#ef4444",
    bg: "bg-red-50",
    text: "text-red-700",
    urgencyLabel: (d) => (d >= 7 ? `${d}d — final attempt!` : `${d}d ago`),
  },
  {
    id: "q4",
    label: "After FU 3",
    description: "All three follow-ups sent. Mark as Demo Sent or Dead.",
    fromStatus: "fu3",
    nextStatus: "demo-sent",
    nextLabel: "Demo Sent",
    emailType: null,
    color: "#6366f1",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    urgencyLabel: (d) => `${d}d since last contact`,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function contactMethodLabel(m?: string) {
  const map: Record<string, string> = {
    "phone-call": "📞 Phone",
    facebook: "💬 Facebook",
    email: "✉️ Email",
    "cold-call": "🔊 Cold Call",
  };
  return m ? map[m] ?? m : null;
}

// ─── Send Emails Button ───────────────────────────────────────────────────────

function SendEmailsButton({
  leads,
  emailType,
  onSent,
}: {
  leads: Lead[];
  emailType: "fu1" | "fu2" | "fu3";
  onSent: () => void;
}) {
  const withEmail = leads.filter((l) => l.email);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [result, setResult] = useState<{ sent: number; skipped: number } | null>(null);

  if (withEmail.length === 0) {
    return (
      <span className="text-xs text-gray-400 flex items-center gap-1.5">
        <Mail className="w-3.5 h-3.5" />
        No emails on file
      </span>
    );
  }

  async function sendAll() {
    setStatus("sending");
    try {
      const res = await fetch("/api/crm/send-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: withEmail.map((l) => l.id), type: emailType }),
      });
      if (res.status === 503) {
        setStatus("error");
        setResult(null);
        return;
      }
      const data = await res.json();
      setResult({ sent: data.sent?.length ?? 0, skipped: data.skipped?.length ?? 0 });
      setStatus("done");
      setTimeout(() => { setStatus("idle"); onSent(); }, 3000);
    } catch {
      setStatus("error");
    }
  }

  if (status === "done" && result) {
    return (
      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {result.sent} email{result.sent !== 1 ? "s" : ""} sent!
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="text-xs text-red-500 flex items-center gap-1.5">
        <XCircle className="w-3.5 h-3.5" />
        Gmail not configured — add GMAIL_APP_PASSWORD in Vercel
      </span>
    );
  }

  return (
    <button
      onClick={sendAll}
      disabled={status === "sending"}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors disabled:opacity-60 shadow-sm"
    >
      <Send className="w-3.5 h-3.5" />
      {status === "sending"
        ? "Sending..."
        : `Send ${emailType.toUpperCase()} to ${withEmail.length} lead${withEmail.length !== 1 ? "s" : ""}`}
    </button>
  );
}

// ─── Lead Card ────────────────────────────────────────────────────────────────

function FULeadCard({ lead, queue }: { lead: Lead; queue: QueueDef }) {
  const { moveLead } = useCRM();
  const [acting, setActing] = useState(false);
  const [copied, setCopied] = useState(false);
  const days = daysSince(lead.updatedAt);

  async function advance() {
    setActing(true);
    await moveLead(lead.id, queue.nextStatus);
    setActing(false);
  }

  async function markDead() {
    setActing(true);
    await moveLead(lead.id, "dead");
    setActing(false);
  }

  function copyPhone() {
    if (!lead.phone) return;
    navigator.clipboard.writeText(lead.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const isOverdue = days >= (queue.id === "q1" ? 3 : queue.id === "q2" ? 5 : 7);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all ${isOverdue && queue.id !== "q4" ? "border-red-200" : "border-gray-100"}`}>
      <div className="h-1" style={{ backgroundColor: queue.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <Link href={`/crm/contacts/${lead.id}`} className="text-base font-bold text-gray-900 hover:text-violet-600 transition-colors block leading-tight">
              {lead.businessName}
            </Link>
            <p className="text-sm text-gray-500 mt-0.5">{lead.ownerName}</p>
          </div>
          <div className="shrink-0 text-right">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${isOverdue && queue.id !== "q4" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
              {queue.urgencyLabel(days)}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <a href={`tel:${lead.phone}`} className="text-sm text-gray-700 hover:text-violet-600 transition-colors">{lead.phone}</a>
              <button onClick={copyPhone} className="text-gray-300 hover:text-violet-400 transition-colors">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className="text-xs text-gray-500 truncate">{lead.email}</span>
            </div>
          )}
          {lead.contactMethod && (
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className="text-xs text-gray-500">Via {contactMethodLabel(lead.contactMethod)}</span>
            </div>
          )}
          {lead.dateContacted && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className="text-xs text-gray-500">First contacted {formatDate(lead.dateContacted)}</span>
            </div>
          )}
        </div>

        {lead.notes && (
          <div className="mb-4 px-3 py-2.5 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{lead.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={advance}
            disabled={acting}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: queue.color }}
          >
            <CheckCircle2 className="w-4 h-4" />
            {queue.nextLabel}
          </button>
          {queue.id === "q4" && (
            <button
              onClick={() => moveLead(lead.id, "meeting")}
              disabled={acting}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              Meeting Set
            </button>
          )}
          <button
            onClick={markDead}
            disabled={acting}
            className="px-3 py-2.5 text-gray-400 bg-gray-50 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Mark as Dead"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FollowUpsPage() {
  const { data, loading, refresh } = useCRM();
  const [activeQueue, setActiveQueue] = useState(0);

  const queueLeads = QUEUES.map((q) =>
    data.leads
      .filter((l) => l.status === q.fromStatus)
      .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
  );

  const totalPending = queueLeads.reduce((sum, l) => sum + l.length, 0);
  const active = QUEUES[activeQueue];
  const activeLeads = queueLeads[activeQueue];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-5 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-violet-500" />
              Follow-Up Queue
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {totalPending} lead{totalPending !== 1 ? "s" : ""} need{totalPending === 1 ? "s" : ""} follow-up action
            </p>
          </div>
        </div>

        {/* Queue tabs */}
        <div className="flex gap-2 mt-5">
          {QUEUES.map((q, i) => {
            const count = queueLeads[i].length;
            const isActive = activeQueue === i;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQueue(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                style={isActive ? { backgroundColor: q.color } : {}}
              >
                {q.label}
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${isActive ? "bg-white/20 text-white" : count > 0 ? "bg-white border border-gray-200 text-gray-700" : "bg-transparent text-gray-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {/* Queue description + Send Emails button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border flex-1 ${active.bg} ${active.text} border-current/20`}>
            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{active.description}</p>
          </div>
          {active.emailType && activeLeads.length > 0 && (
            <SendEmailsButton
              leads={activeLeads}
              emailType={active.emailType}
              onSent={refresh}
            />
          )}
        </div>

        {activeLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-base font-semibold text-gray-600 mb-1">All clear!</h3>
            <p className="text-sm text-gray-400">
              No leads in the <strong>{active.label}</strong> queue right now.
            </p>
            {activeQueue < QUEUES.length - 1 && queueLeads[activeQueue + 1].length > 0 && (
              <button onClick={() => setActiveQueue(activeQueue + 1)} className="mt-4 text-sm text-violet-500 hover:underline">
                View {QUEUES[activeQueue + 1].label} queue →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeLeads.map((lead) => (
              <FULeadCard key={lead.id} lead={lead} queue={active} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
