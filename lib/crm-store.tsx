"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityLog, Company, CRMData, Lead, LeadStatus } from "./crm-types";

const LS_KEY = "inflate-ai-crm-v2";

function nowIso() {
  return new Date().toISOString();
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function autoContactFields(status: LeadStatus | undefined): Partial<Lead> {
  return status === "contacted" || status === "engaged"
    ? { lastContactedAt: nowIso() }
    : {};
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

// ─── API helpers ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
    if (res.status === 503) return null; // no database configured
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  } catch {
    return null;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CRMContextValue {
  data: CRMData;
  loading: boolean;
  usingDatabase: boolean;
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Omit<Lead, "id" | "createdAt">>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  moveLead: (id: string, status: LeadStatus) => Promise<void>;
  getLead: (id: string) => Lead | undefined;
  addCompany: (company: Omit<Company, "id" | "createdAt" | "updatedAt">) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Omit<Company, "id" | "createdAt">>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompany: (id: string) => Company | undefined;
  refresh: () => Promise<void>;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CRMData>({ leads: [], companies: [], activity: [] });
  const [loading, setLoading] = useState(true);
  const [usingDatabase, setUsingDatabase] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [leads, companies, activity] = await Promise.all([
        apiFetch<Lead[]>("/api/crm/leads"),
        apiFetch<Company[]>("/api/crm/companies"),
        apiFetch<ActivityLog[]>("/api/crm/activity"),
      ]);

      if (leads !== null) {
        const next = {
          leads: leads ?? [],
          companies: companies ?? [],
          activity: activity ?? [],
        };
        setData(next);
        setUsingDatabase(true);
        lsSave(next);
      } else {
        setData(lsLoad());
        setUsingDatabase(false);
      }
    } catch {
      setData(lsLoad());
      setUsingDatabase(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Leads ──────────────────────────────────────────────────────────────────

  const addLead = useCallback(
    async (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> => {
      if (usingDatabase) {
        const newLead = await apiFetch<Lead>("/api/crm/leads", {
          method: "POST",
          body: JSON.stringify(lead),
        });
        if (newLead) {
          await apiFetch("/api/crm/activity", {
            method: "POST",
            body: JSON.stringify({
              leadId: newLead.id,
              type: "lead_created",
              description: `New lead: ${newLead.businessName} (${newLead.ownerName})`,
            }),
          });
          const activity: ActivityLog = {
            id: genId(),
            leadId: newLead.id,
            type: "lead_created",
            description: `New lead: ${newLead.businessName} (${newLead.ownerName})`,
            createdAt: nowIso(),
          };
          setData((prev) => ({
            ...prev,
            leads: [newLead, ...prev.leads],
            activity: [activity, ...prev.activity].slice(0, 200),
          }));
          return newLead;
        }
      }
      // localStorage fallback
      const newLead: Lead = { ...lead, id: genId(), createdAt: nowIso(), updatedAt: nowIso() };
      const activity: ActivityLog = {
        id: genId(),
        leadId: newLead.id,
        type: "lead_created",
        description: `New lead: ${newLead.businessName} (${newLead.ownerName})`,
        createdAt: nowIso(),
      };
      setData((prev) => {
        const next = {
          ...prev,
          leads: [newLead, ...prev.leads],
          activity: [activity, ...prev.activity].slice(0, 200),
        };
        lsSave(next);
        return next;
      });
      return newLead;
    },
    [usingDatabase]
  );

  const updateLead = useCallback(
    async (id: string, updates: Partial<Omit<Lead, "id" | "createdAt">>) => {
      setData((prev) => {
        const current = prev.leads.find((l) => l.id === id);
        if (!current) return prev;
        const merged = {
          ...current,
          ...updates,
          ...autoContactFields(updates.status),
          updatedAt: nowIso(),
        };

        if (usingDatabase) {
          apiFetch(`/api/crm/leads/${id}`, {
            method: "PATCH",
            body: JSON.stringify(merged),
          });
        }

        const next = {
          ...prev,
          leads: prev.leads.map((l) => (l.id === id ? merged : l)),
        };
        if (!usingDatabase) lsSave(next);
        return next;
      });
    },
    [usingDatabase]
  );

  const deleteLead = useCallback(
    async (id: string) => {
      if (usingDatabase) {
        await apiFetch(`/api/crm/leads/${id}`, { method: "DELETE" });
      }
      setData((prev) => {
        const next = { ...prev, leads: prev.leads.filter((l) => l.id !== id) };
        if (!usingDatabase) lsSave(next);
        return next;
      });
    },
    [usingDatabase]
  );

  const moveLead = useCallback(
    async (id: string, status: LeadStatus) => {
      setData((prev) => {
        const current = prev.leads.find((l) => l.id === id);
        if (!current) return prev;
        const merged = {
          ...current,
          status,
          followupSentAt: null,
          ...autoContactFields(status),
          updatedAt: nowIso(),
        };

        if (usingDatabase) {
          apiFetch(`/api/crm/leads/${id}`, {
            method: "PATCH",
            body: JSON.stringify(merged),
          });
          apiFetch("/api/crm/activity", {
            method: "POST",
            body: JSON.stringify({
              leadId: id,
              type: "status_change",
              description: `${current.businessName} → ${status.replace(/-/g, " ")}`,
            }),
          });
        }

        const activity: ActivityLog = {
          id: genId(),
          leadId: id,
          type: "status_change",
          description: `${current.businessName} → ${status.replace(/-/g, " ")}`,
          createdAt: nowIso(),
        };

        const next = {
          ...prev,
          leads: prev.leads.map((l) => (l.id === id ? merged : l)),
          activity: [activity, ...prev.activity].slice(0, 200),
        };
        if (!usingDatabase) lsSave(next);
        return next;
      });
    },
    [usingDatabase]
  );

  const getLead = useCallback(
    (id: string) => data.leads.find((l) => l.id === id),
    [data.leads]
  );

  // ── Companies ──────────────────────────────────────────────────────────────

  const addCompany = useCallback(
    async (company: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> => {
      if (usingDatabase) {
        const newCompany = await apiFetch<Company>("/api/crm/companies", {
          method: "POST",
          body: JSON.stringify(company),
        });
        if (newCompany) {
          setData((prev) => ({
            ...prev,
            companies: [newCompany, ...prev.companies],
          }));
          return newCompany;
        }
      }
      const newCompany: Company = {
        ...company,
        id: genId(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setData((prev) => {
        const next = { ...prev, companies: [newCompany, ...prev.companies] };
        lsSave(next);
        return next;
      });
      return newCompany;
    },
    [usingDatabase]
  );

  const updateCompany = useCallback(
    async (id: string, updates: Partial<Omit<Company, "id" | "createdAt">>) => {
      setData((prev) => {
        const current = prev.companies.find((c) => c.id === id);
        if (!current) return prev;
        const merged = { ...current, ...updates, updatedAt: nowIso() };

        if (usingDatabase) {
          apiFetch(`/api/crm/companies/${id}`, {
            method: "PATCH",
            body: JSON.stringify(merged),
          });
        }

        const next = {
          ...prev,
          companies: prev.companies.map((c) => (c.id === id ? merged : c)),
        };
        if (!usingDatabase) lsSave(next);
        return next;
      });
    },
    [usingDatabase]
  );

  const deleteCompany = useCallback(
    async (id: string) => {
      if (usingDatabase) {
        await apiFetch(`/api/crm/companies/${id}`, { method: "DELETE" });
      }
      setData((prev) => {
        const next = { ...prev, companies: prev.companies.filter((c) => c.id !== id) };
        if (!usingDatabase) lsSave(next);
        return next;
      });
    },
    [usingDatabase]
  );

  const getCompany = useCallback(
    (id: string) => data.companies.find((c) => c.id === id),
    [data.companies]
  );

  if (loading) return null;

  return (
    <CRMContext.Provider
      value={{
        data,
        loading,
        usingDatabase,
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
