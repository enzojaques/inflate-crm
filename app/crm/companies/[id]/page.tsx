"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useCRM } from "@/lib/crm-store";

const COMPANY_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-sky-500 to-indigo-500",
];

function companyColor(id: string) {
  const n = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return COMPANY_COLORS[n % COMPANY_COLORS.length];
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const INDUSTRIES = [
  "Technology", "E-commerce", "Healthcare", "Finance", "Real Estate",
  "Education", "Marketing & Advertising", "Retail", "Manufacturing",
  "Professional Services", "Hospitality", "Roofing", "Construction", "Other",
];

interface EditForm {
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCompany, updateCompany, deleteCompany } = useCRM();

  const company = getCompany(id);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32">
        <p className="text-gray-400 mb-4">Company not found</p>
        <Link href="/crm/companies" className="text-sm text-violet-500 hover:underline">
          Back to Companies
        </Link>
      </div>
    );
  }

  function startEdit() {
    setEditForm({
      name: company!.name,
      industry: company!.industry ?? "",
      website: company!.website ?? "",
      phone: company!.phone ?? "",
      email: company!.email ?? "",
      address: company!.address ?? "",
      notes: company!.notes ?? "",
    });
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    try {
      await updateCompany(id, {
        name: editForm.name,
        industry: editForm.industry || undefined,
        website: editForm.website || undefined,
        phone: editForm.phone || undefined,
        email: editForm.email || undefined,
        address: editForm.address || undefined,
        notes: editForm.notes || undefined,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await deleteCompany(id);
    router.push("/crm/companies");
  }

  const ef = (k: keyof EditForm, v: string) => setEditForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <Link href="/crm/companies" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-20 bg-gradient-to-r from-violet-600 to-blue-600" />
        <div className="px-8 pb-6">
          <div className="flex items-end justify-between -mt-9 mb-5">
            <div className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${companyColor(company.id)} flex items-center justify-center border-4 border-white shadow-md`}>
              <span className="text-white text-xl font-bold">{getInitials(company.name)}</span>
            </div>
            <div className="flex items-center gap-2 pb-1">
              {!editing ? (
                <>
                  <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button onClick={saveEdit} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50">
                    <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label>
                <input value={editForm.name} onChange={(e) => ef("name", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Industry</label>
                  <select value={editForm.industry} onChange={(e) => ef("industry", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white">
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
                  <input value={editForm.website} onChange={(e) => ef("website", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
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
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                <input value={editForm.address} onChange={(e) => ef("address", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                <textarea rows={3} value={editForm.notes} onChange={(e) => ef("notes", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              {company.industry && <p className="text-gray-500 mt-0.5">{company.industry}</p>}
            </>
          )}
        </div>
      </div>

      {!editing && (
        <div className="grid grid-cols-2 gap-6">
          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Company Info</h2>
            <div className="space-y-3">
              {company.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-600 hover:underline break-all">
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {company.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-300 shrink-0" />
                  <a href={`mailto:${company.email}`} className="text-sm text-violet-600 hover:underline">{company.email}</a>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-300 shrink-0" />
                  <a href={`tel:${company.phone}`} className="text-sm text-gray-700">{company.phone}</a>
                </div>
              )}
              {company.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700">{company.address}</span>
                </div>
              )}
              {!company.website && !company.email && !company.phone && !company.address && (
                <p className="text-sm text-gray-400">No contact info yet</p>
              )}
            </div>
          </div>

          {/* Details + notes */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Added</p>
                  <p className="text-gray-700">{formatDate(company.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Last Updated</p>
                  <p className="text-gray-700">{formatDate(company.updatedAt)}</p>
                </div>
              </div>
            </div>
            {company.notes && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-800 mb-3">Notes</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{company.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Company</h3>
            <p className="text-sm text-gray-500 mb-6">Delete <strong>{company.name}</strong>? This cannot be undone.</p>
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
