"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Copy,
  Mail,
  Phone,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import { useCRM } from "@/lib/crm-store";
import {
  CONTACT_METHODS,
  ContactMethod,
  Lead,
  LEAD_STATUSES,
  LeadStatus,
} from "@/lib/crm-types";

type FilterMode = LeadStatus | "all" | "email-only";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const s = LEAD_STATUSES.find((x) => x.id === status)!;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.shortName}
    </span>
  );
}

function ContactMethodBadge({ method }: { method?: ContactMethod }) {
  if (!method) return <span className="text-gray-300 text-xs">—</span>;
  const icons: Record<ContactMethod, string> = { "phone-call": "📞", facebook: "💬", email: "✉️", "cold-call": "🔊" };
  const names: Record<ContactMethod, string> = { "phone-call": "Phone", facebook: "Facebook", email: "Email", "cold-call": "Cold Call" };
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
      <span>{icons[method]}</span>{names[method]}
    </span>
  );
}

// ─── Add Lead Modal ───────────────────────────────────────────────────────────

interface LeadForm {
  businessName: string; ownerName: string; phone: string; email: string;
  contactMethod: ContactMethod | ""; dateContacted: string;
  status: LeadStatus; notes: string; dealValue: string; source: string;
}

const emptyForm: LeadForm = {
  businessName: "", ownerName: "", phone: "", email: "", contactMethod: "",
  dateContacted: new Date().toISOString().slice(0, 10),
  status: "new", notes: "", dealValue: "", source: "",
};

function AddLeadModal({ onClose }: { onClose: () => void }) {
  const { addLead } = useCRM();
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const f = (k: keyof LeadForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName || !form.ownerName) return;
    setSaving(true);
    try {
      await addLead({
        businessName: form.businessName, ownerName: form.ownerName,
        phone: form.phone || undefined, email: form.email || undefined,
        contactMethod: (form.contactMethod as ContactMethod) || undefined,
        dateContacted: form.dateContacted || undefined, status: form.status,
        notes: form.notes || undefined,
        dealValue: form.dealValue ? parseFloat(form.dealValue) : undefined,
        source: form.source || undefined,
      });
      onClose();
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">Add New Lead</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Business Name *</label>
              <input required value={form.businessName} onChange={(e) => f("businessName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="Acme Roofing Co." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Owner&apos;s Name *</label>
              <input required value={form.ownerName} onChange={(e) => f("ownerName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="John Smith" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
              <input value={form.phone} onChange={(e) => f("phone", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => f("email", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="john@acme.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">How Contacted</label>
              <select value={form.contactMethod} onChange={(e) => f("contactMethod", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white">
                <option value="">— Select method —</option>
                {CONTACT_METHODS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Date Contacted</label>
              <input type="date" value={form.dateContacted} onChange={(e) => f("dateContacted", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => f("status", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white">
                {LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Deal Value ($)</label>
              <input type="number" min="0" value={form.dealValue} onChange={(e) => f("dealValue", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="2500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => f("notes", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none" placeholder="Any notes about this lead..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Saving..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Quick status menu ────────────────────────────────────────────────────────

function QuickStatusMenu({ leadId, current, onClose }: { leadId: string; current: LeadStatus; onClose: () => void }) {
  const { moveLead } = useCRM();
  return (
    <div className="absolute right-0 top-7 z-30 bg-white rounded-xl border border-gray-100 shadow-xl py-1 w-44">
      {LEAD_STATUSES.map((s) => (
        <button key={s.id} onClick={async () => { if (s.id !== current) await moveLead(leadId, s.id); onClose(); }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-gray-50 transition-colors text-left ${s.id === current ? "font-semibold" : ""}`}>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
          {s.name}
          {s.id === current && <span className="ml-auto text-gray-300">✓</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Send Intro Email button (email-only leads) ───────────────────────────────

function SendIntroButton({ lead, onSent }: { lead: Lead; onSent: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function send() {
    setStatus("sending");
    try {
      const res = await fetch("/api/crm/send-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: [lead.id], type: "intro" }),
      });
      if (res.status === 503) { setStatus("error"); return; }
      setStatus("done");
      setTimeout(() => { setStatus("idle"); onSent(); }, 2000);
    } catch { setStatus("error"); }
  }

  if (status === "done") return <span className="text-xs text-emerald-600 font-medium">✓ Sent!</span>;
  if (status === "error") return <span className="text-xs text-red-500">Gmail not set up</span>;

  return (
    <button onClick={send} disabled={status === "sending"}
      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors disabled:opacity-50 whitespace-nowrap">
      <Send className="w-3 h-3" />
      {status === "sending" ? "Sending..." : "Send Intro"}
    </button>
  );
}

// ─── Lead Row ─────────────────────────────────────────────────────────────────

function LeadRow({ lead, emailOnly, onRefresh }: { lead: Lead; emailOnly: boolean; onRefresh: () => void }) {
  const { moveLead } = useCRM();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyPhone() {
    if (!lead.phone) return;
    navigator.clipboard.writeText(lead.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <tr className="hover:bg-gray-50/70 transition-colors group">
      {/* Business / Owner */}
      <td className="px-4 py-3.5">
        <Link href={`/crm/contacts/${lead.id}`} className="text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors block">
          {lead.businessName}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">{lead.ownerName}</p>
      </td>

      {/* Phone — Call button */}
      <td className="px-4 py-3.5">
        {lead.phone ? (
          <div className="flex items-center gap-1.5">
            <a href={`tel:${lead.phone}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
              <Phone className="w-3 h-3" /> Call
            </a>
            <button onClick={copyPhone} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-violet-400" title="Copy number">
              <Copy className="w-3 h-3" />
            </button>
            {copied && <span className="text-xs text-emerald-500">Copied!</span>}
          </div>
        ) : (
          <span className="text-gray-300 text-sm">—</span>
        )}
      </td>

      {/* Email indicator */}
      <td className="px-4 py-3.5">
        {lead.email ? (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="text-xs text-gray-500 truncate max-w-[140px]" title={lead.email}>{lead.email}</span>
          </div>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* Via */}
      <td className="px-4 py-3.5">
        <ContactMethodBadge method={lead.contactMethod} />
      </td>

      {/* Date */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-gray-600">{formatDate(lead.dateContacted)}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <div className="relative flex items-center gap-1.5">
          <button onClick={() => setShowMenu((v) => !v)} className="cursor-pointer hover:opacity-80 transition-opacity">
            <StatusBadge status={lead.status} />
          </button>
          {lead.status !== "dead" && (
            <button onClick={() => moveLead(lead.id, "dead")} title="Mark as Dead"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-300 hover:text-red-400 font-medium px-1.5 py-0.5 rounded hover:bg-red-50">
              ✕ Dead
            </button>
          )}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
              <QuickStatusMenu leadId={lead.id} current={lead.status} onClose={() => setShowMenu(false)} />
            </>
          )}
        </div>
      </td>

      {/* Send Intro (email-only mode) or Notes */}
      <td className="px-4 py-3.5 max-w-[200px]">
        {emailOnly ? (
          <SendIntroButton lead={lead} onSent={onRefresh} />
        ) : lead.notes ? (
          <p className="text-xs text-gray-500 truncate" title={lead.notes}>{lead.notes}</p>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* Added */}
      <td className="px-4 py-3.5">
        <span className="text-xs text-gray-400">{formatDate(lead.createdAt)}</span>
      </td>

      {/* View */}
      <td className="px-4 py-3.5">
        <Link href={`/crm/contacts/${lead.id}`} className="flex items-center justify-end gap-1 text-xs text-gray-200 hover:text-violet-500 transition-colors">
          View <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const { data, loading, usingDatabase, refresh } = useCRM();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterMode>("all");
  const [showAdd, setShowAdd] = useState(false);

  const emailOnlyLeads = data.leads.filter((l) => l.email && !l.phone);

  const filtered = data.leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      l.businessName.toLowerCase().includes(q) ||
      l.ownerName.toLowerCase().includes(q) ||
      (l.phone ?? "").includes(q) ||
      (l.email ?? "").toLowerCase().includes(q) ||
      (l.notes ?? "").toLowerCase().includes(q);
    if (filterStatus === "email-only") return matchSearch && !!l.email && !l.phone;
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = LEAD_STATUSES.map((s) => ({
    ...s,
    count: data.leads.filter((l) => l.status === s.id).length,
  }));

  const isEmailOnly = filterStatus === "email-only";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-5 bg-white border-b border-gray-100 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leads</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-400">{data.leads.length} total leads</p>
            {!usingDatabase && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Local storage only
              </span>
            )}
          </div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 px-8 py-3 bg-white border-b border-gray-100 overflow-x-auto shrink-0">
        <button onClick={() => setFilterStatus("all")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
          All ({data.leads.length})
        </button>
        {/* Email Only tab */}
        {emailOnlyLeads.length > 0 && (
          <button onClick={() => setFilterStatus("email-only")}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === "email-only" ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-100"}`}>
            <Mail className="w-3 h-3" /> Email Only ({emailOnlyLeads.length})
          </button>
        )}
        {counts.filter((c) => c.count > 0).map((s) => (
          <button key={s.id} onClick={() => setFilterStatus(s.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === s.id ? `${s.bg} ${s.text} border ${s.border}` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            {s.shortName} ({s.count})
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 px-8 py-3 bg-white border-b border-gray-100 shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business, owner, phone, email..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
        </div>
        {(search || filterStatus !== "all") && (
          <button onClick={() => { setSearch(""); setFilterStatus("all"); }} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
        {isEmailOnly && (
          <span className="text-xs text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full font-medium ml-auto">
            ✉️ Email-only leads — click Send Intro to reach out
          </span>
        )}
        {!isEmailOnly && <span className="text-xs text-gray-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-600 mb-1">
              {data.leads.length === 0 ? "No leads yet" : "No results"}
            </h3>
            <p className="text-sm text-gray-400">
              {data.leads.length === 0 ? "Add your first lead to get started" : "Try adjusting your search or filter"}
            </p>
            {data.leads.length === 0 && (
              <button onClick={() => setShowAdd(true)} className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:opacity-90">
                <Plus className="w-4 h-4" /> Add First Lead
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Business / Owner</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Via</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{isEmailOnly ? "Action" : "Notes"}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Added</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} emailOnly={isEmailOnly} onRefresh={refresh} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
