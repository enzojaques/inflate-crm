"use client";

import { useCallback, useEffect, useState } from "react";
import { getDailyGoal, setDailyGoal, startOfTodayIso } from "@/lib/daily-goal";
import { EMPTY_TODAY_STATS, TodayStats } from "@/lib/today-stats";

// Shared by every page that shows the Today's Numbers banner (Leads,
// Pipeline, ...) so the goal and call count stay consistent no matter
// which page you're on. Each page still gets its own fetch/state — there's
// no cross-tab sync, just a consistent source of truth per page load.
export function useTodayStats() {
  const [stats, setStats] = useState<TodayStats>(EMPTY_TODAY_STATS);
  const [goal, setGoalState] = useState(50);

  useEffect(() => { setGoalState(getDailyGoal()); }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/crm/today-stats?since=${encodeURIComponent(startOfTodayIso())}`);
      if (res.ok) setStats(await res.json());
    } catch { /* ignore — banner just stays at its last known values */ }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const bump = useCallback((key: keyof TodayStats) => {
    setStats((s) => ({ ...s, [key]: s[key] + 1 }));
  }, []);

  const changeGoal = useCallback((n: number) => {
    setDailyGoal(n);
    setGoalState(n);
  }, []);

  return { stats, goal, bump, changeGoal };
}
