// app/api/auth/register/route.js
import { NextResponse } from "next/server";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

// From your API guide
const REG_MAP = {
  hospital: "/api/accounts/register/",
  provider: "/api/providers/self-register/",
  patient:  "/api/patients/self-register/",
};

// Helpers
async function readSafeJSON(res) {
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await res.json();
    return null;
  } catch { return null; }
}
async function readSafeText(res) {
  try { return await res.text(); } catch { return null; }
}
function flattenErrors(data) {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(", ");
  if (data.detail) return data.detail;
  const parts = [];
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) parts.push(`${k}: ${v.join("; ")}`);
    else if (typeof v === "string") parts.push(`${k}: ${v}`);
    else if (v && typeof v === "object") {
      const inner = flattenErrors(v);
      if (inner) parts.push(`${k}: ${inner}`);
    }
  }
  return parts.length ? parts.join(" | ") : null;
}

export async function POST(req) {
  try {
    if (!BASE) {
      return NextResponse.json({ error: "API base not configured" }, { status: 500 });
    }

    // Read client payload safely
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Role -> correct upstream path
    const role = String(body.role || "patient").toLowerCase();
    const upstreamPath = REG_MAP[role] || REG_MAP.patient;
    const url = `${BASE}${upstreamPath}`;

    // Don’t send role to upstream unless required
    const { role: _drop, ...payload } = body;

    // Network call with robust error handling
    let upstream;
    try {
      upstream = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    } catch (e) {
      return NextResponse.json(
        { error: "Upstream network error", detail: String(e), url },
        { status: 502 }
      );
    }

    const dataJSON = await readSafeJSON(upstream);
    if (!upstream.ok) {
      // Try JSON first; if absent, fall back to text body
      const text = dataJSON ? null : await readSafeText(upstream);
      const msg = flattenErrors(dataJSON) || text || "Registration failed";
      return NextResponse.json(
        { error: msg, status: upstream.status, url, raw: dataJSON || text },
        { status: upstream.status }
      );
    }

    // Accept 200/201/204 etc.
    return NextResponse.json({ ok: true, url, raw: dataJSON }, { status: 200 });
  } catch (e) {
    // Last-ditch safety — never crash
    return NextResponse.json(
      { error: "Registration route error", detail: String(e) },
      { status: 500 }
    );
  }
}
