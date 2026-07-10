"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleDollarSign,
  Edit3,
  Mail,
  Phone,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useCRM } from "@/lib/crm-store";
import {
  CONTACT_METHODS,
  ContactMethod,
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

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateInput(iso?: string) {
  if (!iso) return "";
  return iso.includes("T") ? iso.slice(0, 10) : iso;
}

function StageBadge({ status }: { status: LeadStatus }) {
  const s = LEAD_STATUSES.find((x) => x.id === status)!;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${s.bg} ${s.text}`}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
      {s.name}
    </span>
  );
}

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
];

function avatarGradient(id: string) {
  const n = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

interface EditForm {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod | "";
  dateContacted: string;
  status: LeadStatus;
  notes: string;
  dealValue: string;
  source: string;
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getLead, updateLead, deleteLead } = useCRM();

  const lead = getLead(id);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    contactMethod: "",
    dateContacted: "",
    status: "new",
    notes: "",
    dealValue: "",
    source: "",
  });

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32">
        <p className="text-gray-400 mb-4">Lead not found</p>
        <Link href="/crm" className="text-sm text-violet-500 hover:underline">
          Back to Leads
        </Link>
      </div>
    );
  }


  function startEdit() {
    setEditForm({
      businessName: lead!.businessName,
      ownerName: lead!.ownerName,
      phone: lead!.phone ?? "",
      email: lead!.email ?? "",
      contactMethod: lead!.contactMethod ?? "",
      dateContacted: formatDateInput(lead!.dateContacted),
      status: lead!.status,
      notes: lead!.notes ?? "",
      dealValue: lead!.dealValue?.toString() ?? "",
      source: lead!.source ?? "",
    });
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    try {
      await updateLead(id, {
        businessName: editForm.businessName,
        ownerName: editForm.ownerName,
        phone: editForm.phone || undefined,
        email: editForm.email || undefined,
        contactMethod: (editForm.contactMethod as ContactMethod) || undefined,
        dateContacted: editForm.dateContacted || undefined,
        status: editForm.status,
        notes: editForm.notes || undefined,
        dealValue: editForm.dealValue ? parseFloat(editForm.dealValue) : undefined,
        source: editForm.source || undefined,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await deleteLead(id);
    router.push("/crm");
  }

  async function moveToStatus(status: LeadStatus) {
    await updateLead(id, { status });
  }

  const ef = (k: keyof EditForm, v: string) =>
    setEditForm((p) => ({ ...p, [k]: v }));

  const contactMethodName =
    CONTACT_METHODS.find((m) => m.id === lead.contactMethod)?.name ?? null;

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Back */}
      <Link href="/crm" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-20 bg-gradient-to-r from-violet-600 to-blue-600" />
        <div className="px-8 pb-6">
          <div className="flex items-end justify-between -mt-9 mb-5">
            <div
              className={`w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${avatarGradient(lead.id)} flex items-center justify-center border-4 border-white shadow-md`}
            >
              <span className="text-white text-xl font-bold">{getInitials(lead.businessName)}</span>
            </div>
            <div className="flex items-center gap-2 pb-1">
              {!editing ? (
                <>
                  <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button onClick={saveEdit} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50">
                    <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Business Name</label>
                  <input value={editForm.businessName} onChange={(e) => ef("businessName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Owner&apos;s Name</label>
                  <input value={editForm.ownerName} onChange={(e) => ef("ownerName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <input value={editForm.phone} onChange={(e) => ef("phone", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input type="email" value={editForm.email} onChange={(e) => ef("email", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">How Contacted</label>
                  <select value={editForm.contactMethod} onChange={(e) => ef("contactMethod", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white">
                    <option value="">— select —</option>
                    {CONTACT_METHODS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date Contacted</label>
                  <input type="date" value={editForm.dateContacted} onChange={(e) => ef("dateContacted", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <select value={editForm.status} onChange={(e) => ef("status", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white">
                    {LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Deal Value ($)</label>
                  <input type="number" min="0" value={editForm.dealValue} onChange={(e) => ef("dealValue", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                <textarea rows={4} value={editForm.notes} onChange={(e) => ef("notes", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{lead.businessName}</h1>
              <p className="text-gray-500 mt-0.5">{lead.ownerName}</p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <StageBadge status={lead.status} />
                {lead.dealValue && (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                    <CircleDollarSign className="w-4 h-4" />
                    {formatCurrency(lead.dealValue)}
                  </span>
                )}
                {contactMethodName && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    via {contactMethodName}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {!editing && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left 2/3 */}
          <div className="col-span-2 space-y-6">
            {/* Contact info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Contact Info</h2>
              <div className="space-y-3">
                {lead.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-300 shrink-0" />
                    <a href={`tel:${lead.phone}`} className="text-sm text-violet-600 hover:underline">{lead.phone}</a>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-300 shrink-0" />
                    <a href={`mailto:${lead.email}`} className="text-sm text-violet-600 hover:underline">{lead.email}</a>
                  </div>
                )}
                {!lead.phone && !lead.email && (
                  <p className="text-sm text-gray-400">No contact info added yet</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Notes</h2>
              {lead.notes ? (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <p className="text-sm text-gray-400">No notes yet</p>
                  <button onClick={startEdit} className="mt-2 text-xs text-violet-500 hover:underline">+ Add note</button>
                </div>
              )}
            </div>
          </div>

          {/* Right 1/3 */}
          <div className="space-y-6">
            {/* Status pipeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Status</h2>
              <div className="space-y-1">
                {LEAD_STATUSES.map((s) => {
                  const isActive = lead.status === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => moveToStatus(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? `${s.bg} ${s.text} font-semibold`
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isActive ? "text-white" : "border-2 border-gray-200"
                        }`}
                        style={isActive ? { backgroundColor: s.color } : {}}
                      >
                        {isActive && <Check className="w-3 h-3" />}
                      </span>
                      <span className="flex-1 text-left text-xs">{s.name}</span>
                      {!isActive && <ChevronRight className="w-3 h-3 text-gray-200" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Details</h2>
              <div className="space-y-3 text-sm">
                {lead.dateContacted && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Date Contacted</p>
                    <p className="text-gray-700">{formatDate(lead.dateContacted)}</p>
                  </div>
                )}
                {lead.source && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Source</p>
                    <p className="text-gray-700">{lead.source}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Added</p>
                  <p className="text-gray-700">{formatDate(lead.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Last Updated</p>
                  <p className="text-gray-700">{formatDate(lead.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Lead</h3>
            <p className="text-sm text-gray-500 mb-6">
              Delete <strong>{lead.businessName}</strong> ({lead.ownerName})? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
