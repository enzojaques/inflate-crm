import { neon } from "@neondatabase/serverless";
import { Lead, Company, ActivityLog } from "./crm-types";

export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

// ─── Mappers (snake_case DB rows → camelCase TS types) ───────────────────────

export function mapLead(r: Record<string, unknown>): Lead {
  return {
    id: r.id as string,
    businessName: r.business_name as string,
    ownerName: r.owner_name as string,
    phone: (r.phone as string | null) ?? undefined,
    email: (r.email as string | null) ?? undefined,
    contactMethod: (r.contact_method as Lead["contactMethod"]) ?? undefined,
    dateContacted: (r.date_contacted as string | null) ?? undefined,
    status: r.status as Lead["status"],
    lastContactedAt: (r.last_contacted_at as string | null) ?? undefined,
    followupSentAt: (r.followup_sent_at as string | null) ?? undefined,
    notes: (r.notes as string | null) ?? undefined,
    dealValue: (r.deal_value as number | null) ?? undefined,
    source: (r.source as string | null) ?? undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function mapCompany(r: Record<string, unknown>): Company {
  return {
    id: r.id as string,
    name: r.name as string,
    industry: (r.industry as string | null) ?? undefined,
    website: (r.website as string | null) ?? undefined,
    phone: (r.phone as string | null) ?? undefined,
    email: (r.email as string | null) ?? undefined,
    address: (r.address as string | null) ?? undefined,
    notes: (r.notes as string | null) ?? undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function mapActivity(r: Record<string, unknown>): ActivityLog {
  return {
    id: r.id as string,
    leadId: (r.lead_id as string | null) ?? undefined,
    type: r.type as ActivityLog["type"],
    description: r.description as string,
    createdAt: r.created_at as string,
  };
}
