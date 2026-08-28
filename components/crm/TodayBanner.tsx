"use client";

import { useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Flame,
  Phone,
  Target,
  Trophy,
} from "lucide-react";
import { TodayStats } from "@/lib/today-stats";

function StatTile({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5 min-w-0">
      <Icon className={`w-4 h-4 shrink-0 ${color}`} />
      <div className="min-w-0">
        <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-[10px] text-gray-400 mt-1 truncate">{label}</p>
      </div>
    </div>
  );
}

export function TodayBanner({ stats, goal, onGoalChange }: { stats: TodayStats; goal: number; onGoalChange: (n: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(String(goal));

  function save() {
    const n = parseInt(input, 10);
    if (Number.isFinite(n) && n > 0) onGoalChange(n);
    setEditing(false);
  }

  const pct = goal > 0 ? Math.min(100, Math.round((stats.calls / goal) * 100)) : 0;

  return (
    <div className="px-8 pt-5 pb-4 bg-white border-b border-gray-100 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today</h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Target className="w-3.5 h-3.5" />
          {editing ? (
            <input
              autoFocus
              type="number"
              min={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => e.key === "Enter" && save()}
              className="w-16 px-1.5 py-0.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            />
          ) : (
            <button
              onClick={() => { setInput(String(goal)); setEditing(true); }}
              className="hover:text-violet-600 underline decoration-dotted underline-offset-2"
            >
              Goal: {goal} calls/day
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-4">
        <StatTile label="Calls" value={stats.calls} icon={Phone} color="text-gray-500" />
        <StatTile label="Answered" value={stats.answered} icon={CheckCircle2} color="text-blue-500" />
        <StatTile label="Interested" value={stats.interested} icon={Flame} color="text-orange-500" />
        <StatTile label="Callbacks" value={stats.callbacks} icon={CalendarClock} color="text-amber-500" />
        <StatTile label="Appointments" value={stats.appointments} icon={CalendarCheck} color="text-violet-500" />
        <StatTile label="Websites Sold" value={stats.websitesSold} icon={Trophy} color="text-emerald-500" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(pct, stats.calls > 0 ? 4 : 0)}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{stats.calls} / {goal} calls</span>
      </div>
    </div>
  );
}
