export interface TodayStats {
  calls: number;
  answered: number;
  interested: number;
  callbacks: number;
  appointments: number;
  websitesSold: number;
}

export const EMPTY_TODAY_STATS: TodayStats = {
  calls: 0, answered: 0, interested: 0, callbacks: 0, appointments: 0, websitesSold: 0,
};
