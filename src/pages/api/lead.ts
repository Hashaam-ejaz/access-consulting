import type { APIRoute } from "astro";

export const prerender = false;
const REQUIRED_FIELDS = ["name", "email", "phone"];

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), { status: 400 });
  }

  // basic server-side validation (mirror your client checks)
  for (const field of REQUIRED_FIELDS) {
    if (!String(body[field] ?? "").trim()) {
      return new Response(JSON.stringify({ ok: false, error: `Missing ${field}` }), { status: 400 });
    }
  }
  const email = String(body.email ?? "");
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), { status: 400 });
  }

  const webhookUrl = import.meta.env.SHEET_WEBHOOK_URL;
  const secret = import.meta.env.SHEET_WEBHOOK_SECRET;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, secret }),
      redirect: "follow", // Apps Script often 302s once before returning JSON
    });

    if (!res.ok) throw new Error(`Sheet webhook failed: ${res.status}`);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Lead submission failed:", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500 });
  }
};