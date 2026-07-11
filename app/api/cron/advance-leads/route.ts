import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!sql) return NextResponse.json({ error: "no database" }, { status: 503 });

  const results = { contactedToFu1: 0, engagedToFu1: 0, fu1ToFu2: 0, fu2ToFu3: 0 };

  // Rule 1: contacted, no reply for 3 days -> fu1
  {
    const rows = await sql`
      UPDATE leads SET status = 'fu1', updated_at = now()
      WHERE status = 'contacted' AND last_contacted_at <= now() - interval '3 days'
      RETURNING id, business_name
    `;
    for (const r of rows) {
      await sql`
        INSERT INTO activity_log (lead_id, type, description)
        VALUES (${r.id}, 'status_change', ${`${r.business_name} → fu1 (auto: no reply 3d after contacted)`})
      `;
    }
    results.contactedToFu1 = rows.length;
  }

  // Rule 2: engaged, went quiet for 2 days -> fu1, with a note prepended
  // (needs each row's own notes/last_contacted_at, so select then update per row)
  {
    const rows = await sql`
      SELECT id, business_name, notes, last_contacted_at FROM leads
      WHERE status = 'engaged' AND last_contacted_at <= now() - interval '2 days'
    `;
    for (const r of rows) {
      const dateStr = new Date(r.last_contacted_at as string).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const prefix = `[Previously engaged on ${dateStr}, went quiet — follow up should reference prior conversation, not a cold touch]\n\n`;
      const newNotes = prefix + ((r.notes as string | null) ?? "");
      await sql`
        UPDATE leads SET status = 'fu1', notes = ${newNotes}, updated_at = now()
        WHERE id = ${r.id}
      `;
      await sql`
        INSERT INTO activity_log (lead_id, type, description)
        VALUES (${r.id}, 'status_change', ${`${r.business_name} → fu1 (auto: engaged lead went quiet 2d)`})
      `;
    }
    results.engagedToFu1 = rows.length;
  }

  // Rule 3: fu1, marked sent 3+ days ago -> fu2
  {
    const rows = await sql`
      UPDATE leads SET status = 'fu2', followup_sent_at = NULL, updated_at = now()
      WHERE status = 'fu1' AND followup_sent_at IS NOT NULL AND followup_sent_at <= now() - interval '3 days'
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

  // Rule 4: fu2, marked sent 3+ days ago -> fu3
  {
    const rows = await sql`
      UPDATE leads SET status = 'fu3', followup_sent_at = NULL, updated_at = now()
      WHERE status = 'fu2' AND followup_sent_at IS NOT NULL AND followup_sent_at <= now() - interval '3 days'
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

  return NextResponse.json(results);
}
