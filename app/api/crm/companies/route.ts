import { NextResponse } from "next/server";
import { sql, mapCompany } from "@/lib/db";

export async function GET() {
  if (!sql) return NextResponse.json([], { status: 503 });
  const rows = await sql`SELECT * FROM companies ORDER BY created_at DESC`;
  return NextResponse.json(rows.map(mapCompany));
}

export async function POST(req: Request) {
  if (!sql) return NextResponse.json({ error: "no database" }, { status: 503 });
  const b = await req.json();
  const [row] = await sql`
    INSERT INTO companies (name, industry, website, phone, email, address, notes)
    VALUES (${b.name}, ${b.industry ?? null}, ${b.website ?? null},
            ${b.phone ?? null}, ${b.email ?? null}, ${b.address ?? null}, ${b.notes ?? null})
    RETURNING *
  `;
  return NextResponse.json(mapCompany(row));
}
