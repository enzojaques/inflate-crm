import { NextResponse } from "next/server";
import { sql, mapActivity } from "@/lib/db";

export async function GET() {
  if (!sql) return NextResponse.json([], { status: 503 });
  const rows = await sql`
    SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 100
  `;
  return NextResponse.json(rows.map(mapActivity));
}

export async function POST(req: Request) {
  if (!sql) return NextResponse.json({ ok: true }, { status: 503 });
  const b = await req.json();
  await sql`
    INSERT INTO activity_log (lead_id, type, description)
    VALUES (${b.leadId ?? null}, ${b.type}, ${b.description})
  `;
  return NextResponse.json({ ok: true });
}
