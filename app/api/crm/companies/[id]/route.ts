import { NextResponse } from "next/server";
import { sql, mapCompany } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!sql) return NextResponse.json({ error: "no database" }, { status: 503 });
  const b = await req.json();
  const [row] = await sql`
    UPDATE companies SET
      name       = ${b.name},
      industry   = ${b.industry ?? null},
      website    = ${b.website ?? null},
      phone      = ${b.phone ?? null},
      email      = ${b.email ?? null},
      address    = ${b.address ?? null},
      notes      = ${b.notes ?? null},
      updated_at = NOW()
    WHERE id = ${params.id}
    RETURNING *
  `;
  return NextResponse.json(mapCompany(row));
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!sql) return NextResponse.json({ error: "no database" }, { status: 503 });
  await sql`DELETE FROM companies WHERE id = ${params.id}`;
  return NextResponse.json({ ok: true });
}
