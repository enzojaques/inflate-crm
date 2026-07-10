import { NextResponse } from "next/server";
import { sql, mapLead } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!sql) return NextResponse.json({ error: "no database" }, { status: 503 });
  const b = await req.json();
  const [row] = await sql`
    UPDATE leads SET
      business_name   = ${b.businessName},
      owner_name      = ${b.ownerName},
      phone           = ${b.phone ?? null},
      email           = ${b.email ?? null},
      contact_method  = ${b.contactMethod ?? null},
      date_contacted  = ${b.dateContacted ?? null},
      status          = ${b.status},
      notes           = ${b.notes ?? null},
      deal_value      = ${b.dealValue ?? null},
      source          = ${b.source ?? null},
      updated_at      = NOW()
    WHERE id = ${params.id}
    RETURNING *
  `;
  return NextResponse.json(mapLead(row));
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!sql) return NextResponse.json({ error: "no database" }, { status: 503 });
  await sql`DELETE FROM leads WHERE id = ${params.id}`;
  return NextResponse.json({ ok: true });
}
