import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sql, mapLead } from "@/lib/db";

const TEMPLATES = {
  fu1: {
    subject: (biz: string) => `Free website for ${biz} — quick question`,
    body: (owner: string, biz: string) => `Hey ${owner},

My name is Enzo from RemodelerSites.com — I tried giving you a call earlier but couldn't get through.

I wanted to reach out because we're running a promo right now where we build completely free websites for remodeling contractors. No charge to build it — the only cost is $60/mo for hosting to keep it live, and there's a full 30-day refund policy, so there's zero risk.

Would you be opposed to us putting together a quick preview for ${biz}?

Just reply with your city and I'll get my team on it right away.

Best,
Enzo
remodelersites.com`,
  },
  fu2: {
    subject: (biz: string) => `Re: Free website for ${biz}`,
    body: (owner: string, biz: string) => `Hey ${owner},

Following up on my last message about the free website. I know things get busy — just wanted to make sure this didn't slip through the cracks.

We're still running the promo and I'd love to get a quick preview built for ${biz}. Takes my team less than a day and it's completely free to see — no commitment at all.

Worth a look?

Best,
Enzo
remodelersites.com`,
  },
  fu3: {
    subject: (biz: string) => `Last one from me — ${biz}`,
    body: (owner: string, biz: string) => `Hey ${owner},

I'll keep this short — last follow-up from me.

We're building free website previews for remodeling contractors and I didn't want to close your file without giving you one last shot.

If the timing isn't right, no worries at all. If you ever want a free preview built for ${biz}, just reply anytime and we'll get it done.

Best,
Enzo
remodelersites.com`,
  },
};

const STATUS_AFTER: Record<string, string> = {
  fu1: "fu1",
  fu2: "fu2",
  fu3: "fu3",
};

export async function POST(req: Request) {
  const { leadIds, type } = await req.json() as { leadIds: string[]; type: "fu1" | "fu2" | "fu3" };

  if (!leadIds?.length || !type) {
    return NextResponse.json({ error: "Missing leadIds or type" }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json({ error: "Gmail not configured" }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const template = TEMPLATES[type];
  const sent: string[] = [];
  const failed: { id: string; reason: string }[] = [];
  const skipped: string[] = [];

  for (const id of leadIds) {
    try {
      // fetch lead from DB if available, otherwise skip
      let lead;
      if (sql) {
        const rows = await sql`SELECT * FROM leads WHERE id = ${id}`;
        if (!rows[0]) { skipped.push(id); continue; }
        lead = mapLead(rows[0]);
      } else {
        skipped.push(id);
        continue;
      }

      if (!lead.email) { skipped.push(id); continue; }

      await transporter.sendMail({
        from: `Alex from RemodelerSites <${user}>`,
        to: lead.email,
        subject: template.subject(lead.businessName),
        text: template.body(lead.ownerName, lead.businessName),
      });

      // advance status
      const newStatus = STATUS_AFTER[type];
      await sql`UPDATE leads SET status = ${newStatus}, updated_at = NOW() WHERE id = ${id}`;
      await sql`
        INSERT INTO activity_log (lead_id, type, description)
        VALUES (${id}, 'email_sent', ${`${type.toUpperCase()} email sent to ${lead.email}`})
      `;

      sent.push(id);
    } catch (err) {
      failed.push({ id, reason: String(err) });
    }
  }

  return NextResponse.json({ sent, failed, skipped });
}
