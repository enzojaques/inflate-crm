"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Phone, PhoneIncoming, Search } from "lucide-react";
import { useCRM } from "@/lib/crm-store";
import { LEAD_STATUSES, LeadStatus } from "@/lib/crm-types";
import { digitsOnly, phoneMatches } from "@/lib/phone";

function StatusBadge({ status }: { status: LeadStatus }) {
  const s = LEAD_STATUSES.find((x) => x.id === status)!;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.name}
    </span>
  );
}

export default function CallerLookupPage() {
  const { data, loading } = useCRM();
  const [query, setQuery] = useState("");

  const queryDigits = digitsOnly(query);
  const results = useMemo(() => {
    if (queryDigits.length < 4) return [];
    return data.leads.filter((l) => phoneMatches(l.phone, query));
  }, [data.leads, query, queryDigits.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-5 bg-white border-b border-gray-100 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <PhoneIncoming className="w-6 h-6 text-violet-500" />
          Caller Lookup
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Type the number that called you to find out who it is — works with any formatting.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              autoFocus
              type="tel"
              inputMode="tel"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type or paste the phone number..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            />
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : queryDigits.length < 4 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                <Phone className="w-8 h-8 mb-3 text-gray-200" />
                <p className="text-sm">Enter at least 4 digits to search</p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-600 mb-1">No lead found</h3>
                <p className="text-sm text-gray-400">This number isn&apos;t on any lead in the CRM.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 font-medium">
                  {results.length} match{results.length !== 1 ? "es" : ""}
                </p>
                {results.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/crm/contacts/${lead.id}`}
                    className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all p-5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <p className="text-base font-bold text-gray-900 truncate">{lead.businessName}</p>
                        <StatusBadge status={lead.status} />
                      </div>
                      <p className="text-sm text-gray-500">{lead.ownerName}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{lead.phone}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
