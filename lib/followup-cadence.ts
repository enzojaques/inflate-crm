import { LeadStatus } from "./crm-types";

// How many days a lead can sit in each stage before the next follow-up is
// due. Demo previews stay live for 7 days (1 + 2 + 2 + 2), so FU4 lands
// right on the last day. Shared by the Follow-Ups queue page and the
// Pipeline kanban day badges so the two stay in sync.
export const FOLLOWUP_GAP_DAYS: Partial<Record<LeadStatus, number>> = {
  "demo-sent": 1,
  fu1: 2,
  fu2: 2,
  fu3: 2,
};

export function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}
