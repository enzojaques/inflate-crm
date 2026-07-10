"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ChevronRight, Globe, Plus, Search, X } from "lucide-react";
import { useCRM } from "@/lib/crm-store";
import { Company } from "@/lib/crm-types";

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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface NewCompanyForm {
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const emptyForm: NewCompanyForm = {
  name: "",
  industry: "",
  website: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

const INDUSTRIES = [
  "Technology", "E-commerce", "Healthcare", "Finance", "Real Estate",
  "Education", "Marketing & Advertising", "Retail", "Manufacturing",
  "Professional Services", "Hospitality", "Roofing", "Construction", "Other",
];

function AddCompanyModal({ onClose }: { onClose: () => void }) {
  const { addCompany } = useCRM();
  const [form, setForm] = useState<NewCompanyForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      await addCompany({
        name: form.name,
        industry: form.industry || undefined,
        website: form.website || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
        notes: form.notes || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const f = (k: keyof NewCompanyForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Add New Company</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Company Name *</label>
            <input required value={form.name} onChange={(e) => f("name", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Industry</label>
              <select value={form.industry} onChange={(e) => f("industry", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white">
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Website</label>
              <input value={form.website} onChange={(e) => f("website", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="https://example.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => f("phone", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => f("email", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="hello@company.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Address</label>
            <input value={form.address} onChange={(e) => f("address", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" placeholder="123 Main St, Dallas, TX" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => f("notes", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg hover:opacity-90 disabled:opacity-50">
              {saving ? "Saving..." : "Add Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/crm/companies/${company.id}`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-100 transition-all group p-5"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${companyColor(company.id)} flex items-center justify-center shrink-0`}>
          <span className="text-white text-sm font-bold">{getInitials(company.name)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors truncate">{company.name}</h3>
          {company.industry && <p className="text-xs text-gray-400 mt-0.5">{company.industry}</p>}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-violet-400 transition-colors shrink-0 mt-0.5" />
      </div>
      {company.website && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
          <Globe className="w-3 h-3 text-gray-300" />
          <span className="text-xs text-gray-400 truncate">{company.website.replace(/^https?:\/\//, "")}</span>
        </div>
      )}
      <p className="text-xs text-gray-300 mt-2">Added {formatDate(company.createdAt)}</p>
    </Link>
  );
}

export default function CompaniesPage() {
  const { data, loading } = useCRM();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = data.companies.filter(
    (c) => !search || `${c.name} ${c.industry ?? ""} ${c.website ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-8 pt-8 pb-6 bg-white border-b border-gray-100 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Companies</h1>
          <p className="text-sm text-gray-400 mt-0.5">{data.companies.length} total compan{data.companies.length !== 1 ? "ies" : "y"}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:opacity-90 shadow-sm">
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>
      <div className="px-8 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
        </div>
      </div>
      <div className="flex-1 overflow-auto px-8 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-600 mb-1">
              {data.companies.length === 0 ? "No companies yet" : "No results found"}
            </h3>
            <p className="text-sm text-gray-400">
              {data.companies.length === 0 ? "Add your first company to get started" : "Try adjusting your search"}
            </p>
            {data.companies.length === 0 && (
              <button onClick={() => setShowAdd(true)} className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:opacity-90">
                <Plus className="w-4 h-4" /> Add Company
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((company) => <CompanyCard key={company.id} company={company} />)}
          </div>
        )}
      </div>
      {showAdd && <AddCompanyModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
