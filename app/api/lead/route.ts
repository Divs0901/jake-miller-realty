import { NextResponse } from "next/server";

/**
 * Receives a lead from the chat widget and notifies "Jake".
 *
 * Delivery channels, each optional and controlled by env vars:
 *   - Email via Resend      RESEND_API_KEY + LEAD_TO_EMAIL (+ LEAD_FROM_EMAIL)
 *   - Webhook (Zapier/Make) LEAD_WEBHOOK_URL
 * With nothing configured the lead is still logged to the server console.
 */

type Lead = {
  intent: string;
  budget: string;
  name: string;
  phone: string;
  listing: string | null;
  source: string;
  receivedAt: string;
};

type Delivery = "sent" | "skipped" | `failed: ${string}`;

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] ?? c,
  );

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const lead: Lead = {
    intent: str(body.intent, 40) || "Unknown",
    budget: str(body.budget, 40) || "Not given",
    name: str(body.name, 80),
    phone: str(body.phone, 40),
    listing: str(body.listing, 160) || null,
    source: str(body.source, 500),
    receivedAt: new Date().toISOString(),
  };

  if (lead.name.length < 2 || lead.phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { ok: false, error: "Name and a valid phone number are required." },
      { status: 400 },
    );
  }

  const [email, webhook] = await Promise.all([
    settle(sendEmail(lead)),
    settle(sendWebhook(lead)),
  ]);

  console.log("[lead]", JSON.stringify({ ...lead, delivered: { email, webhook } }));

  return NextResponse.json({ ok: true, delivered: { email, webhook } });
}

async function settle(p: Promise<Delivery>): Promise<Delivery> {
  try {
    return await p;
  } catch (err) {
    return `failed: ${err instanceof Error ? err.message : String(err)}`;
  }
}

async function sendEmail(lead: Lead): Promise<Delivery> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!apiKey || !to) return "skipped";

  const from =
    process.env.LEAD_FROM_EMAIL ?? "Jake Miller Realty <onboarding@resend.dev>";
  const tel = lead.phone.replace(/[^\d+]/g, "");
  const subject = `🔥 New lead: ${lead.name} wants to ${lead.intent.toLowerCase()} (${lead.budget})`;

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Intent", lead.intent],
    ["Budget", lead.budget],
    ...(lead.listing ? ([["Asked about", lead.listing]] as [string, string][]) : []),
    ["Source", lead.source || "Chat widget"],
    ["Received", new Date(lead.receivedAt).toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT"],
  ];

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:520px;margin:0 auto;color:#0b1f33">
      <h2 style="margin:0 0 4px">New lead from your website chat</h2>
      <p style="margin:0 0 16px;color:#5b6b7a">Reply within 60 seconds to keep the promise the bot just made.</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 0;border-bottom:1px solid #e8e3d9;color:#5b6b7a;width:120px">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #e8e3d9;font-weight:600">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 0">
        <a href="tel:${esc(tel)}" style="display:inline-block;background:#0b1f33;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600">Call ${esc(lead.name)}</a>
        &nbsp;
        <a href="sms:${esc(tel)}" style="display:inline-block;background:#c9a24a;color:#0b1f33;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600">Text ${esc(lead.name)}</a>
      </p>
    </div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status} ${detail.slice(0, 200)}`);
  }
  return "sent";
}

async function sendWebhook(lead: Lead): Promise<Delivery> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return "skipped";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return "sent";
}
