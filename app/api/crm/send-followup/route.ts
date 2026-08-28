import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sql, mapLead } from "@/lib/db";

const TEMPLATES = {
  intro: {
    subject: (biz: string) => `Free website for ${biz} — quick question`,
    body: (owner: string, biz: string) => `Hey ${owner},

My name is Enzo from RemodelerSites.com. I'm reaching out because we're running a promo right now where we build completely free websites for remodeling contractors — and all we ask in exchange is that you consider leaving us a Google review when it's done.

No charge for us building it. The only thing you'd be paying for is your hosting fee to keep it live, which is only $60/mo. And even for that, there's no risk — if you're not happy within the first 30 days we have a full refund policy.

Our team can put together a really quick preview for ${biz} — would you be opposed to us sending that over?

Just reply with your city and I'll get my team on it right away.

Best,
Enzo
remodelersites.com`,
  },
  fu1: {
    subject: (biz: string) => `Your free website preview for ${biz}`,
    body: (owner: string, biz: string) => `Hey ${owner},

Sent over your free website preview for ${biz} — did you get a chance to check it out?

Let me know what you think, happy to tweak anything you want changed.

Best,
Enzo
remodelersites.com`,
  },
  fu2: {
    subject: (biz: string) => `Re: Your free website preview for ${biz}`,
    body: (owner: string, biz: string) => `Hey ${owner},

Following up on the preview I sent for ${biz} — just want to make sure it didn't get buried.

Take a look when you get a sec, I'd love to hear what you think.

Best,
Enzo
remodelersites.com`,
  },
  fu3: {
    subject: (biz: string) => `Still there? — ${biz}`,
    body: (owner: string, biz: string) => `Hey ${owner},

Haven't heard back on the free preview I built for ${biz}. No pressure at all — just don't want to let it go stale on you.

Let me know if you want to move forward, or if now just isn't the right time.

Best,
Enzo
remodelersites.com`,
  },
  fu4: {
    subject: (biz: string) => `Last day — ${biz}'s preview comes down today`,
    body: (owner: string, biz: string) => `Hey ${owner},

Quick heads up — the free preview we built for ${biz} is set to come down today since it's been about a week.

If you'd like to keep it live and move forward, just reply and I'll get it locked in for you. Otherwise no worries at all — thanks for taking a look!

Best,
Enzo
remodelersites.com`,
  },
};

const STATUS_AFTER: Record<string, string> = {
  intro: "no-answer",
  fu1: "fu1",
  fu2: "fu2",
  fu3: "fu3",
  fu4: "fu4",
};

export async function POST(req: Request) {
  const { leadIds, type } = await req.json() as { leadIds: string[]; type: "intro" | "fu1" | "fu2" | "fu3" | "fu4" };

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
