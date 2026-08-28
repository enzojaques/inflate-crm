"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Trophy,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCRM } from "@/lib/crm-store";
import { LEAD_STATUSES } from "@/lib/crm-types";
import { getDailyGoal } from "@/lib/daily-goal";

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toLocaleString()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatusBar({
  status,
  count,
  total,
  value,
}: {
  status: (typeof LEAD_STATUSES)[number];
  count: number;
  total: number;
  value: number;
}) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-4">
      <div className="w-28 shrink-0">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text} truncate max-w-full`}>
          {status.name}
        </span>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
          <div
            className="h-full rounded-lg transition-all duration-700"
            style={{
              width: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
              backgroundColor: status.color,
            }}
          />
        </div>
        <span className="w-12 text-right text-sm font-bold text-gray-800 shrink-0">
          {count}
        </span>
        <span className="w-20 text-right text-sm font-semibold text-emerald-600 shrink-0">
          {value > 0 ? formatCurrency(value) : ""}
        </span>
      </div>
    </div>
  );
}

function MonthBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max === 0 ? 0 : (count / max) * 100;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-medium text-gray-700">{count > 0 ? count : ""}</span>
      <div className="w-9 bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: 72 }}>
        <div
          className="w-full bg-gradient-to-t from-violet-600 to-blue-500 rounded-t-lg transition-all duration-700"
          style={{ height: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
        />
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

// ─── Daily Performance History ─────────────────────────────────────────────────

interface DailyStat {
  date: string; // YYYY-MM-DD
  calls: number;
  answered: number;
  interested: number;
  callbacks: number;
  appointments: number;
  websitesSold: number;
}

function formatDayLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function DayBar({ stat, max, goal }: { stat: DailyStat; max: number; goal: number }) {
  const pct = max === 0 ? 0 : (stat.calls / max) * 100;
  const metGoal = stat.calls >= goal && goal > 0;
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
      <span className={`text-xs font-semibold ${metGoal ? "text-emerald-600" : "text-gray-600"}`}>
        {stat.calls > 0 ? stat.calls : ""}
      </span>
      <div className="w-full max-w-[26px] bg-gray-100 rounded-t-lg overflow-hidden relative" style={{ height: 96 }}>
        <div
          className={`w-full rounded-t-lg transition-all duration-500 absolute bottom-0 ${
            metGoal ? "bg-gradient-to-t from-emerald-600 to-emerald-400" : "bg-gradient-to-t from-gray-400 to-gray-300"
          }`}
          style={{ height: `${Math.max(pct, stat.calls > 0 ? 6 : 0)}%` }}
        />
      </div>
      <span className="text-[10px] text-gray-400 whitespace-nowrap">
        {new Date(`${stat.date}T00:00:00`).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
      </span>
    </div>
  );
}

function DailyHistory() {
  const [range, setRange] = useState(14);
  const [history, setHistory] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(50);

  useEffect(() => { setGoal(getDailyGoal()); }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const tzOffset = new Date().getTimezoneOffset();
    fetch(`/api/crm/daily-history?days=${range}&tzOffset=${tzOffset}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: DailyStat[]) => { if (!cancelled) setHistory(rows); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [range]);

  const chronological = [...history].reverse();
  const maxCalls = Math.max(...history.map((h) => h.calls), 1);
  const daysWithCalls = history.filter((h) => h.calls > 0);
  const bestDay = daysWithCalls.length ? daysWithCalls.reduce((a, b) => (b.calls > a.calls ? b : a)) : null;
  const worstDay = daysWithCalls.length > 1
    ? daysWithCalls.filter((d) => d.date !== bestDay?.date).reduce((a, b) => (b.calls < a.calls ? b : a))
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Daily Performance</h2>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 bg-white"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Calls per day vs. your {goal}-call goal — green bars hit it, gray ones didn&apos;t.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          No activity logged yet — numbers show up here once you start using the Call/Answered/Interested buttons on the Leads page.
        </p>
      ) : (
        <>
          {(bestDay || worstDay) && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {bestDay && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <Trophy className="w-3 h-3" /> Best: {formatDayLabel(bestDay.date)} — {bestDay.calls} calls
                </span>
              )}
              {worstDay && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                  Slowest: {formatDayLabel(worstDay.date)} — {worstDay.calls} calls
                </span>
              )}
            </div>
          )}

          <div className="flex items-end justify-between gap-1 mb-6 overflow-x-auto">
            {chronological.map((h) => (
              <DayBar key={h.date} stat={h} max={maxCalls} goal={goal} />
            ))}
          </div>

          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Day</th>
                  <th className="text-right px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Calls</th>
                  <th className="text-right px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Answered</th>
                  <th className="text-right px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Interested</th>
                  <th className="text-right px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Callbacks</th>
                  <th className="text-right px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Appts</th>
                  <th className="text-right px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((h) => (
                  <tr key={h.date} className={bestDay?.date === h.date ? "bg-emerald-50/50" : ""}>
                    <td className="px-2 py-2 text-xs text-gray-700 whitespace-nowrap flex items-center gap-1.5">
                      {bestDay?.date === h.date && <Trophy className="w-3 h-3 text-emerald-500 shrink-0" />}
                      {formatDayLabel(h.date)}
                    </td>
                    <td className="px-2 py-2 text-xs text-right font-semibold">
                      <span className={h.calls >= goal && goal > 0 ? "text-emerald-600" : "text-gray-700"}>{h.calls}</span>
                      {h.calls >= goal && goal > 0 && <CheckCircle2 className="w-3 h-3 text-emerald-500 inline ml-1 -mt-0.5" />}
                    </td>
                    <td className="px-2 py-2 text-xs text-right text-gray-600">{h.answered}</td>
                    <td className="px-2 py-2 text-xs text-right text-gray-600">{h.interested}</td>
                    <td className="px-2 py-2 text-xs text-right text-gray-600">{h.callbacks}</td>
                    <td className="px-2 py-2 text-xs text-right text-gray-600">{h.appointments}</td>
                    <td className="px-2 py-2 text-xs text-right text-gray-600">{h.websitesSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, loading } = useCRM();

  const stats = useMemo(() => {
    const leads = data.leads;
    const total = leads.length;
    const closed = leads.filter((l) => l.status === "closed").length;
    const dead = leads.filter((l) => l.status === "dead").length;
    const inProgress = total - closed - dead;
    const winRate = total === 0 ? 0 : Math.round((closed / total) * 100);

    const pipelineValue = leads.reduce((s, l) => s + (l.dealValue ?? 0), 0);
    const closedValue = leads
      .filter((l) => l.status === "closed")
      .reduce((s, l) => s + (l.dealValue ?? 0), 0);

    // Follow-up queue sizes
    const fuPending =
      leads.filter((l) => ["no-answer", "engaged", "fu1", "fu2", "fu3"].includes(l.status)).length;

    // Per-status counts + values
    const statusData: Record<string, { count: number; value: number }> = {};
    LEAD_STATUSES.forEach((s) => { statusData[s.id] = { count: 0, value: 0 }; });
    leads.forEach((l) => {
      statusData[l.status].count++;
      statusData[l.status].value += l.dealValue ?? 0;
    });

    // Monthly (last 6m)
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        label: d.toLocaleDateString("en-US", { month: "short" }),
        count: leads.filter((l) => {
          const c = new Date(l.createdAt);
          return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
        }).length,
      };
    });

    // Contact method breakdown
    const methodMap: Record<string, number> = {};
    leads.forEach((l) => {
      const m = l.contactMethod ?? "Unknown";
      methodMap[m] = (methodMap[m] ?? 0) + 1;
    });

    // Top deals
    const topDeals = [...leads]
      .filter((l) => l.dealValue)
      .sort((a, b) => (b.dealValue ?? 0) - (a.dealValue ?? 0))
      .slice(0, 5);

    // Recent activity
    const recentActivity = [...data.activity].slice(0, 8);

    return {
      total, closed, dead, inProgress, winRate,
      pipelineValue, closedValue, fuPending,
      statusData, months, methodMap, topDeals, recentActivity,
    };
  }, [data]);

  const maxMonth = Math.max(...stats.months.map((m) => m.count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-6 bg-white border-b border-gray-100 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Full overview of your leads and pipeline</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <Clock className="w-3.5 h-3.5" /> All time
        </div>
      </div>

      <div className="flex-1 px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Leads"
            value={stats.total.toString()}
            sub={`${stats.inProgress} active`}
            icon={Users}
            accent="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <MetricCard
            label="Pipeline Value"
            value={stats.pipelineValue > 0 ? formatCurrency(stats.pipelineValue) : "$0"}
            sub={stats.closedValue > 0 ? `${formatCurrency(stats.closedValue)} closed` : "No closed deals yet"}
            icon={CircleDollarSign}
            accent="bg-gradient-to-br from-emerald-500 to-teal-500"
          />
          <MetricCard
            label="Win Rate"
            value={`${stats.winRate}%`}
            sub={`${stats.closed} closed · ${stats.dead} dead`}
            icon={Trophy}
            accent="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <MetricCard
            label="Follow-Up Queue"
            value={stats.fuPending.toString()}
            sub="leads need follow-up"
            icon={Bell}
            accent="bg-gradient-to-br from-blue-500 to-sky-500"
          />
        </div>

        <DailyHistory />

        <div className="grid grid-cols-3 gap-6">
          {/* Status breakdown */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-800">Leads by Status</h2>
            </div>
            {stats.total === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <p className="text-gray-400 text-sm">No leads added yet</p>
                <Link href="/crm" className="mt-2 text-xs text-violet-500 hover:underline">Add your first lead →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {LEAD_STATUSES.map((s) => (
                  <StatusBar
                    key={s.id}
                    status={s}
                    count={stats.statusData[s.id].count}
                    total={stats.total}
                    value={stats.statusData[s.id].value}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Monthly */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-800">New Leads</h2>
            </div>
            <div className="flex items-end justify-between gap-1">
              {stats.months.map((m) => (
                <MonthBar key={m.label} label={m.label} count={m.count} max={maxMonth} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">Last 6 months</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Contact methods */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-5">How Leads Are Contacted</h2>
            {Object.keys(stats.methodMap).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No data yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.methodMap)
                  .sort((a, b) => b[1] - a[1])
                  .map(([method, count]) => {
                    const icons: Record<string, string> = {
                      "phone-call": "📞",
                      facebook: "💬",
                      email: "✉️",
                      "cold-call": "🔊",
                      Unknown: "❓",
                    };
                    const names: Record<string, string> = {
                      "phone-call": "Phone Call",
                      facebook: "Facebook",
                      email: "Email",
                      "cold-call": "Cold Call",
                      Unknown: "Unknown",
                    };
                    const pct = Math.round((count / stats.total) * 100);
                    return (
                      <div key={method} className="flex items-center gap-3">
                        <span className="text-sm w-5 shrink-0">{icons[method] ?? "?"}</span>
                        <span className="text-xs text-gray-600 w-20 shrink-0">{names[method] ?? method}</span>
                        <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded transition-all"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-6 text-right shrink-0">{count}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Top deals */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-5">Top Deals by Value</h2>
            {stats.topDeals.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No deal values set</p>
            ) : (
              <div className="space-y-3">
                {stats.topDeals.map((l, i) => (
                  <Link
                    key={l.id}
                    href={`/crm/contacts/${l.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="w-5 text-xs font-bold text-gray-300">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-violet-600 transition-colors">
                        {l.businessName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{l.ownerName}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 shrink-0">
                      {formatCurrency(l.dealValue!)}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-violet-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-5">Recent Activity</h2>
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                      {log.type === "status_change" ? (
                        <ArrowUpRight className="w-2.5 h-2.5 text-violet-600" />
                      ) : (
                        <Users className="w-2.5 h-2.5 text-violet-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-snug capitalize">{log.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(log.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary banner */}
        <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-6 text-white">
          <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Business Summary</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-white/70 mt-0.5">Total Leads</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.fuPending}</p>
              <p className="text-sm text-white/70 mt-0.5">Pending Follow-Ups</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.closed}</p>
              <p className="text-sm text-white/70 mt-0.5">Deals Closed</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {stats.pipelineValue > 0 ? formatCurrency(stats.pipelineValue) : "$0"}
              </p>
              <p className="text-sm text-white/70 mt-0.5">Total Pipeline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
