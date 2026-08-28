const KEY = "inflate-ai-daily-call-goal";
const DEFAULT_GOAL = 50;

export function getDailyGoal(): number {
  if (typeof window === "undefined") return DEFAULT_GOAL;
  const raw = localStorage.getItem(KEY);
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_GOAL;
}

export function setDailyGoal(n: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, String(Math.max(1, Math.round(n))));
}

export function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
