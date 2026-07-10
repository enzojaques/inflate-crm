import { createClient } from "@supabase/supabase-js";
import { Lead, Company, ActivityLog } from "./crm-types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = url && key ? createClient(url, key) : null;
export const hasSupabase = !!supabase;

// ─── Row types (snake_case from Postgres) ────────────────────────────────────

interface LeadRow {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string | null;
  email: string | null;
  contact_method: string | null;
  date_contacted: string | null;
  status: string;
  notes: string | null;
  deal_value: number | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

interface CompanyRow {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ActivityRow {
  id: string;
  lead_id: string | null;
  type: string;
  description: string;
  created_at: string;
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

export function rowToLead(r: LeadRow): Lead {
  return {
    id: r.id,
    businessName: r.business_name,
    ownerName: r.owner_name,
    phone: r.phone ?? undefined,
    email: r.email ?? undefined,
    contactMethod: (r.contact_method as Lead["contactMethod"]) ?? undefined,
    dateContacted: r.date_contacted ?? undefined,
    status: r.status as Lead["status"],
    notes: r.notes ?? undefined,
    dealValue: r.deal_value ?? undefined,
    source: r.source ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function leadToRow(l: Omit<Lead, "id" | "createdAt" | "updatedAt">) {
  return {
    business_name: l.businessName,
    owner_name: l.ownerName,
    phone: l.phone ?? null,
    email: l.email ?? null,
    contact_method: l.contactMethod ?? null,
    date_contacted: l.dateContacted ?? null,
    status: l.status,
    notes: l.notes ?? null,
    deal_value: l.dealValue ?? null,
    source: l.source ?? null,
  };
}

export function rowToCompany(r: CompanyRow): Company {
  return {
    id: r.id,
    name: r.name,
    industry: r.industry ?? undefined,
    website: r.website ?? undefined,
    phone: r.phone ?? undefined,
    email: r.email ?? undefined,
    address: r.address ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function companyToRow(c: Omit<Company, "id" | "createdAt" | "updatedAt">) {
  return {
    name: c.name,
    industry: c.industry ?? null,
    website: c.website ?? null,
    phone: c.phone ?? null,
    email: c.email ?? null,
    address: c.address ?? null,
    notes: c.notes ?? null,
  };
}

export function rowToActivity(r: ActivityRow): ActivityLog {
  return {
    id: r.id,
    leadId: r.lead_id ?? undefined,
    type: r.type as ActivityLog["type"],
    description: r.description,
    createdAt: r.created_at,
  };
}

// ─── DB operations ───────────────────────────────────────────────────────────

export const db = {
  async getLeads(): Promise<Lead[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as LeadRow[]).map(rowToLead);
  },

  async insertLead(lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("leads")
      .insert(leadToRow(lead))
      .select()
      .single();
    if (error) throw error;
    return rowToLead(data as LeadRow);
  },

  async updateLead(
    id: string,
    updates: Partial<Omit<Lead, "id" | "createdAt">>
  ): Promise<void> {
    if (!supabase) throw new Error("Supabase not configured");
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.businessName !== undefined) row.business_name = updates.businessName;
    if (updates.ownerName !== undefined) row.owner_name = updates.ownerName;
    if (updates.phone !== undefined) row.phone = updates.phone ?? null;
    if (updates.email !== undefined) row.email = updates.email ?? null;
    if (updates.contactMethod !== undefined) row.contact_method = updates.contactMethod ?? null;
    if (updates.dateContacted !== undefined) row.date_contacted = updates.dateContacted ?? null;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.notes !== undefined) row.notes = updates.notes ?? null;
    if (updates.dealValue !== undefined) row.deal_value = updates.dealValue ?? null;
    if (updates.source !== undefined) row.source = updates.source ?? null;
    const { error } = await supabase.from("leads").update(row).eq("id", id);
    if (error) throw error;
  },

  async deleteLead(id: string): Promise<void> {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw error;
  },

  async getCompanies(): Promise<Company[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as CompanyRow[]).map(rowToCompany);
  },

  async insertCompany(company: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("companies")
      .insert(companyToRow(company))
      .select()
      .single();
    if (error) throw error;
    return rowToCompany(data as CompanyRow);
  },

  async updateCompany(
    id: string,
    updates: Partial<Omit<Company, "id" | "createdAt">>
  ): Promise<void> {
    if (!supabase) throw new Error("Supabase not configured");
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.industry !== undefined) row.industry = updates.industry ?? null;
    if (updates.website !== undefined) row.website = updates.website ?? null;
    if (updates.phone !== undefined) row.phone = updates.phone ?? null;
    if (updates.email !== undefined) row.email = updates.email ?? null;
    if (updates.address !== undefined) row.address = updates.address ?? null;
    if (updates.notes !== undefined) row.notes = updates.notes ?? null;
    const { error } = await supabase.from("companies").update(row).eq("id", id);
    if (error) throw error;
  },

  async deleteCompany(id: string): Promise<void> {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) throw error;
  },

  async getActivity(): Promise<ActivityLog[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data as ActivityRow[]).map(rowToActivity);
  },

  async insertActivity(
    log: Omit<ActivityLog, "id" | "createdAt">
  ): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.from("activity_log").insert({
      lead_id: log.leadId ?? null,
      type: log.type,
      description: log.description,
    });
    if (error) console.error("Activity log error:", error);
  },
};
