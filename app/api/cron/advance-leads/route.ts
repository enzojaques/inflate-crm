import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!sql) return NextResponse.json({ error: "no database" }, { status: 503 });

  const results = { fu1ToFu2: 0, fu2ToFu3: 0, fu3ToFu4: 0 };

  // Note: there is no auto-advance into demo-sent or out of engaged here —
  // sending a demo is a deliberate manual action, not something a cron job
  // can do on a timer. Quiet "engaged" leads just sit until a human moves
  // them to demo-sent (kanban Move menu), which is what kicks off the FU1-4
  // cadence tracked in the Follow-Ups queue and on the Pipeline board.

  // Rule 1: fu1, marked sent 2+ days ago -> fu2
  {
    const rows = await sql`
      UPDATE leads SET status = 'fu2', followup_sent_at = NULL, updated_at = now()
      WHERE status = 'fu1' AND followup_sent_at IS NOT NULL AND followup_sent_at <= now() - interval '2 days'
      RETURNING id, business_name
    `;
    for (const r of rows) {
      await sql`
        INSERT INTO activity_log (lead_id, type, description)
        VALUES (${r.id}, 'status_change', ${`${r.business_name} → fu2 (auto: FU1 timer elapsed)`})
      `;
    }
    results.fu1ToFu2 = rows.length;
  }

  // Rule 2: fu2, marked sent 2+ days ago -> fu3
  {
    const rows = await sql`
      UPDATE leads SET status = 'fu3', followup_sent_at = NULL, updated_at = now()
      WHERE status = 'fu2' AND followup_sent_at IS NOT NULL AND followup_sent_at <= now() - interval '2 days'
      RETURNING id, business_name
    `;
    for (const r of rows) {
      await sql`
        INSERT INTO activity_log (lead_id, type, description)
        VALUES (${r.id}, 'status_change', ${`${r.business_name} → fu3 (auto: FU2 timer elapsed)`})
      `;
    }
    results.fu2ToFu3 = rows.length;
  }

  // Rule 3: fu3, marked sent 2+ days ago -> fu4 (last-day alert)
  {
    const rows = await sql`
      UPDATE leads SET status = 'fu4', followup_sent_at = NULL, updated_at = now()
      WHERE status = 'fu3' AND followup_sent_at IS NOT NULL AND followup_sent_at <= now() - interval '2 days'
      RETURNING id, business_name
    `;
    for (const r of rows) {
      await sql`
        INSERT INTO activity_log (lead_id, type, description)
        VALUES (${r.id}, 'status_change', ${`${r.business_name} → fu4 (auto: FU3 timer elapsed)`})
      `;
    }
    results.fu3ToFu4 = rows.length;
  }

  return NextResponse.json(results);
}
