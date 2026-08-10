import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;
const REQUIRED_FIELDS = ["name", "email", "phone"];

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!String(body[field] ?? "").trim()) {
      return new Response(JSON.stringify({ ok: false, error: `Missing ${field}` }), { status: 400 });
    }
  }
  const email = String(body.email ?? "");
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), { status: 400 });
  }

  const webhookUrl = (env as any).SHEET_WEBHOOK_URL;
  const secret = (env as any).SHEET_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) {
    console.error("Missing SHEET_WEBHOOK_URL or SHEET_WEBHOOK_SECRET at runtime");
    return new Response(JSON.stringify({ ok: false, error: "Server misconfigured" }), { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, secret }),
      redirect: "follow",
    });

    if (!res.ok) throw new Error(`Sheet webhook failed: ${res.status}`);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Lead submission failed:", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500 });
  }
};