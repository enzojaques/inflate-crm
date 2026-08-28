import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Counts today's activity server-side (not from the client's capped 200-row
// feed) so the numbers stay accurate no matter how much other activity
// happened today. Appointments/Websites Sold piggyback on the status_change
// rows moveLead already writes ("X → meeting" / "X → awaiting payment").
export async function GET(req: Request) {
  const emptyStats = {
    calls: 0, answered: 0, interested: 0, callbacks: 0, appointments: 0, websitesSold: 0,
  };
  if (!sql) return NextResponse.json(emptyStats);

  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");
  if (!since) return NextResponse.json({ error: "missing since" }, { status: 400 });

  const [row] = await sql`
    SELECT
      count(*) FILTER (WHERE type = 'call_logged')                                        AS calls,
      count(*) FILTER (WHERE type = 'call_answered')                                       AS answered,
      count(*) FILTER (WHERE type = 'marked_interested')                                   AS interested,
      count(*) FILTER (WHERE type = 'callback_logged')                                     AS callbacks,
      count(*) FILTER (WHERE type = 'status_change' AND description LIKE '%→ meeting')     AS appointments,
      count(*) FILTER (WHERE type = 'status_change' AND description LIKE '%→ awaiting payment') AS websites_sold
    FROM activity_log
    WHERE created_at >= ${since}
  `;

  return NextResponse.json({
    calls: Number(row.calls),
    answered: Number(row.answered),
    interested: Number(row.interested),
    callbacks: Number(row.callbacks),
    appointments: Number(row.appointments),
    websitesSold: Number(row.websites_sold),
  });
}
