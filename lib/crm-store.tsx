"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityLog, Company, CRMData, Lead, LeadStatus } from "./crm-types";
import { db, hasSupabase } from "./supabase";

const LS_KEY = "inflate-ai-crm-v2";

function nowIso() {
  return new Date().toISOString();
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── localStorage helpers ────────────────────────────────────────────────────

function lsLoad(): CRMData {
  if (typeof window === "undefined")
    return { leads: [], companies: [], activity: [] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : { leads: [], companies: [], activity: [] };
  } catch {
    return { leads: [], companies: [], activity: [] };
  }
}

function lsSave(data: CRMData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CRMContextValue {
  data: CRMData;
  loading: boolean;
  usingSupabase: boolean;
  // Leads
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<Lead>;
  updateLead: (
    id: string,
    updates: Partial<Omit<Lead, "id" | "createdAt">>
  ) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  moveLead: (id: string, status: LeadStatus) => Promise<void>;
  getLead: (id: string) => Lead | undefined;
  // Companies
  addCompany: (
    company: Omit<Company, "id" | "createdAt" | "updatedAt">
  ) => Promise<Company>;
  updateCompany: (
    id: string,
    updates: Partial<Omit<Company, "id" | "createdAt">>
  ) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompany: (id: string) => Company | undefined;
  // Refresh from DB
  refresh: () => Promise<void>;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CRMData>({ leads: [], companies: [], activity: [] });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (hasSupabase) {
        const [leads, companies, activity] = await Promise.all([
          db.getLeads(),
          db.getCompanies(),
          db.getActivity(),
        ]);
        const next = { leads, companies, activity };
        setData(next);
        lsSave(next);
      } else {
        setData(lsLoad());
      }
    } catch (e) {
      console.error("CRM load error:", e);
      setData(lsLoad());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Leads ──────────────────────────────────────────────────────────────────

  const addLead = useCallback(
    async (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> => {
      let newLead: Lead;
      if (hasSupabase) {
        newLead = await db.insertLead(lead);
        await db.insertActivity({
          leadId: newLead.id,
          type: "lead_created",
          description: `New lead added: ${newLead.businessName} (${newLead.ownerName})`,
        });
      } else {
        newLead = {
          ...lead,
          id: genId(),
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
      }
      setData((prev) => {
        const activity: ActivityLog = {
          id: genId(),
          leadId: newLead.id,
          type: "lead_created",
          description: `New lead added: ${newLead.businessName} (${newLead.ownerName})`,
          createdAt: nowIso(),
        };
        const next = {
          ...prev,
          leads: [newLead, ...prev.leads],
          activity: [activity, ...prev.activity].slice(0, 200),
        };
        if (!hasSupabase) lsSave(next);
        return next;
      });
      return newLead;
    },
    []
  );

  const updateLead = useCallback(
    async (id: string, updates: Partial<Omit<Lead, "id" | "createdAt">>) => {
      if (hasSupabase) {
        await db.updateLead(id, updates);
      }
      setData((prev) => {
        const next = {
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: nowIso() } : l
          ),
        };
        if (!hasSupabase) lsSave(next);
        return next;
      });
    },
    []
  );

  const deleteLead = useCallback(async (id: string) => {
    if (hasSupabase) {
      await db.deleteLead(id);
    }
    setData((prev) => {
      const next = { ...prev, leads: prev.leads.filter((l) => l.id !== id) };
      if (!hasSupabase) lsSave(next);
      return next;
    });
  }, []);

  const moveLead = useCallback(async (id: string, status: LeadStatus) => {
    if (hasSupabase) {
      await db.updateLead(id, { status });
      const lead = data.leads.find((l) => l.id === id);
      if (lead) {
        await db.insertActivity({
          leadId: id,
          type: "status_change",
          description: `${lead.businessName} moved to ${status.replace(/-/g, " ")}`,
        });
      }
    }
    setData((prev) => {
      const lead = prev.leads.find((l) => l.id === id);
      const activity: ActivityLog = {
        id: genId(),
        leadId: id,
        type: "status_change",
        description: `${lead?.businessName ?? "Lead"} moved to ${status.replace(/-/g, " ")}`,
        createdAt: nowIso(),
      };
      const next = {
        ...prev,
        leads: prev.leads.map((l) =>
          l.id === id ? { ...l, status, updatedAt: nowIso() } : l
        ),
        activity: [activity, ...prev.activity].slice(0, 200),
      };
      if (!hasSupabase) lsSave(next);
      return next;
    });
  }, [data.leads]);

  const getLead = useCallback(
    (id: string) => data.leads.find((l) => l.id === id),
    [data.leads]
  );

  // ── Companies ──────────────────────────────────────────────────────────────

  const addCompany = useCallback(
    async (company: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> => {
      let newCompany: Company;
      if (hasSupabase) {
        newCompany = await db.insertCompany(company);
        await db.insertActivity({
          type: "company_created",
          description: `New company added: ${newCompany.name}`,
        });
      } else {
        newCompany = {
          ...company,
          id: genId(),
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
      }
      setData((prev) => {
        const activity: ActivityLog = {
          id: genId(),
          type: "company_created",
          description: `New company added: ${newCompany.name}`,
          createdAt: nowIso(),
        };
        const next = {
          ...prev,
          companies: [newCompany, ...prev.companies],
          activity: [activity, ...prev.activity].slice(0, 200),
        };
        if (!hasSupabase) lsSave(next);
        return next;
      });
      return newCompany;
    },
    []
  );

  const updateCompany = useCallback(
    async (id: string, updates: Partial<Omit<Company, "id" | "createdAt">>) => {
      if (hasSupabase) {
        await db.updateCompany(id, updates);
      }
      setData((prev) => {
        const next = {
          ...prev,
          companies: prev.companies.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: nowIso() } : c
          ),
        };
        if (!hasSupabase) lsSave(next);
        return next;
      });
    },
    []
  );

  const deleteCompany = useCallback(async (id: string) => {
    if (hasSupabase) {
      await db.deleteCompany(id);
    }
    setData((prev) => {
      const next = {
        ...prev,
        companies: prev.companies.filter((c) => c.id !== id),
      };
      if (!hasSupabase) lsSave(next);
      return next;
    });
  }, []);

  const getCompany = useCallback(
    (id: string) => data.companies.find((c) => c.id === id),
    [data.companies]
  );

  return (
    <CRMContext.Provider
      value={{
        data,
        loading,
        usingSupabase: hasSupabase,
        addLead,
        updateLead,
        deleteLead,
        moveLead,
        getLead,
        addCompany,
        updateCompany,
        deleteCompany,
        getCompany,
        refresh: loadData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used inside CRMProvider");
  return ctx;
}
