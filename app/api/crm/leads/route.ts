import { NextResponse } from "next/server";
import { sql, mapLead } from "@/lib/db";

export async function GET() {
  if (!sql) return NextResponse.json([], { status: 503 });
  const rows = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
  return NextResponse.json(rows.map(mapLead));
}

export async function POST(req: Request) {
  if (!sql) return NextResponse.json({ error: "no database" }, { status: 503 });
  const b = await req.json();
  const [row] = await sql`
    INSERT INTO leads
      (business_name, owner_name, phone, email, contact_method, date_contacted,
       status, notes, deal_value, source)
    VALUES
      (${b.businessName}, ${b.ownerName}, ${b.phone ?? null}, ${b.email ?? null},
       ${b.contactMethod ?? null}, ${b.dateContacted ?? null},
       ${b.status ?? "new"}, ${b.notes ?? null}, ${b.dealValue ?? null}, ${b.source ?? null})
    RETURNING *
  `;
  return NextResponse.json(mapLead(row));
}
