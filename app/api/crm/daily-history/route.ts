import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Same activity categorization as /api/crm/today-stats, but bucketed by
// calendar day so daily performance can be compared over time. tzOffset
// (minutes, from Date.getTimezoneOffset()) shifts created_at into the
// viewer's local day before bucketing, so "today" here lines up with what
// the Leads page shows.
export async function GET(req: Request) {
  if (!sql) return NextResponse.json([]);

  const { searchParams } = new URL(req.url);
  const days = Math.min(90, Math.max(1, parseInt(searchParams.get("days") ?? "14", 10) || 14));
  const tzOffset = parseInt(searchParams.get("tzOffset") ?? "0", 10) || 0;

  const rows = await sql`
    SELECT
      to_char(date_trunc('day', created_at - (${tzOffset}::text || ' minutes')::interval), 'YYYY-MM-DD') AS day,
      count(*) FILTER (WHERE type = 'call_logged')                                        AS calls,
      count(*) FILTER (WHERE type = 'call_answered')                                       AS answered,
      count(*) FILTER (WHERE type = 'marked_interested')                                   AS interested,
      count(*) FILTER (WHERE type = 'callback_logged')                                     AS callbacks,
      count(*) FILTER (WHERE type = 'status_change' AND description LIKE '%→ meeting')     AS appointments,
      count(*) FILTER (WHERE type = 'status_change' AND description LIKE '%→ awaiting payment') AS websites_sold
    FROM activity_log
    WHERE created_at >= now() - (${days}::text || ' days')::interval
    GROUP BY 1
    ORDER BY 1 DESC
  `;

  return NextResponse.json(
    rows.map((r) => ({
      date: r.day as string,
      calls: Number(r.calls),
      answered: Number(r.answered),
      interested: Number(r.interested),
      callbacks: Number(r.callbacks),
      appointments: Number(r.appointments),
      websitesSold: Number(r.websites_sold),
    }))
  );
}
