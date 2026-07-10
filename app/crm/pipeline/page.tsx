"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, CircleDollarSign, Plus, X } from "lucide-react";
import { useCRM } from "@/lib/crm-store";
import {
  CONTACT_METHODS,
  ContactMethod,
  Lead,
  LEAD_STATUSES,
  LeadStatus,
} from "@/lib/crm-types";

function formatCurrency(val?: number) {
  if (!val) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const s = LEAD_STATUSES.find((x) => x.id === status)!;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.shortName}
    </span>
  );
}

function AddLeadModal({
  initialStatus,
  onClose,
}: {
  initialStatus: LeadStatus;
  onClose: () => void;
}) {
  const { addLead } = useCRM();
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    contactMethod: "" as ContactMethod | "",
    dateContacted: new Date().toISOString().slice(0, 10),
    status: initialStatus,
    notes: "",
    dealValue: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName || !form.ownerName) return;
    setSaving(true);
    try {
      await addLead({
        businessName: form.businessName,
        ownerName: form.ownerName,
        phone: form.phone || undefined,
        email: form.email || undefined,
        contactMethod: (form.contactMethod as ContactMethod) || undefined,
        dateContacted: form.dateContacted || undefined,
        status: form.status,
        notes: form.notes || undefined,
        dealValue: form.dealValue ? parseFloat(form.dealValue) : undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900">Add Lead</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Business Name *</label>
            <input required value={form.businessName} onChange={(e) => f("businessName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="Acme Corp" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Owner's Name *</label>
            <input required value={form.ownerName} onChange={(e) => f("ownerName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="John Smith" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => f("phone", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="+1 555 0000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Deal Value</label>
              <input type="number" min="0" value={form.dealValue} onChange={(e) => f("dealValue", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="2500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Via</label>
              <select value={form.contactMethod} onChange={(e) => f("contactMethod", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white">
                <option value="">— select —</option>
                {CONTACT_METHODS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={(e) => f("status", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white">
                {LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea rows={2} value={form.notes} onChange={(e) => f("notes", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg hover:opacity-90 disabled:opacity-50">
              {saving ? "Saving..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function KanbanCard({ lead }: { lead: Lead }) {
  const { moveLead } = useCRM();
  const statusIndex = LEAD_STATUSES.findIndex((s) => s.id === lead.status);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm hover:shadow-md transition-all">
      <Link href={`/crm/contacts/${lead.id}`} className="text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors block leading-snug mb-0.5">
        {lead.businessName}
      </Link>
      <p className="text-xs text-gray-400 mb-2.5">{lead.ownerName}</p>

      {lead.dealValue && (
        <div className="flex items-center gap-1 mb-2.5">
          <CircleDollarSign className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-600">{formatCurrency(lead.dealValue)}</span>
        </div>
      )}

      <div className="flex gap-1 pt-2.5 border-t border-gray-50">
        {statusIndex > 0 && (
          <button
            onClick={() => moveLead(lead.id, LEAD_STATUSES[statusIndex - 1].id)}
            className="flex-1 text-xs text-gray-400 hover:text-gray-600 py-1 rounded hover:bg-gray-50 transition-colors text-center"
          >
            ← Back
          </button>
        )}
        {statusIndex < LEAD_STATUSES.length - 1 && (
          <button
            onClick={() => moveLead(lead.id, LEAD_STATUSES[statusIndex + 1].id)}
            className="flex-1 text-xs font-medium text-violet-500 hover:text-violet-700 py-1 rounded hover:bg-violet-50 transition-colors flex items-center justify-center gap-0.5"
          >
            Advance <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  leads,
  onAdd,
}: {
  status: (typeof LEAD_STATUSES)[number];
  leads: Lead[];
  onAdd: () => void;
}) {
  const total = leads.reduce((s, l) => s + (l.dealValue ?? 0), 0);

  return (
    <div className="flex flex-col min-w-[220px] max-w-[240px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
          <span className="text-xs font-semibold text-gray-700">{status.name}</span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5">{leads.length}</span>
        </div>
        {total > 0 && <span className="text-xs text-gray-400">{formatCurrency(total)}</span>}
      </div>
      <div className="flex flex-col gap-2 min-h-12">
        {leads.map((l) => <KanbanCard key={l.id} lead={l} />)}
      </div>
      <button
        onClick={onAdd}
        className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 hover:text-violet-500 hover:border-violet-300 hover:bg-violet-50/50 transition-all"
      >
        <Plus className="w-3.5 h-3.5" /> Add lead
      </button>
    </div>
  );
}

export default function PipelinePage() {
  const { data, loading } = useCRM();
  const [addingToStatus, setAddingToStatus] = useState<LeadStatus | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-8 pt-8 pb-6 bg-white border-b border-gray-100 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pipeline</h1>
          <p className="text-sm text-gray-400 mt-0.5">{data.leads.length} total leads across all stages</p>
        </div>
        <button
          onClick={() => setAddingToStatus("new")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:opacity-90 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-8 min-w-max">
          {LEAD_STATUSES.map((status) => (
            <KanbanColumn
              key={status.id}
              status={status}
              leads={data.leads.filter((l) => l.status === status.id)}
              onAdd={() => setAddingToStatus(status.id)}
            />
          ))}
        </div>
      </div>

      {addingToStatus && (
        <AddLeadModal
          initialStatus={addingToStatus}
          onClose={() => setAddingToStatus(null)}
        />
      )}
    </div>
  );
}
