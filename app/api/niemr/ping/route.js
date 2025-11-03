import { NextResponse } from "next/server";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

export async function GET() {
  if (!BASE) return NextResponse.json({ ok: false, error: "BASE not set" }, { status: 500 });

  // hit something cheap that always exists: API root
  const url = `${BASE}/api/`.replace(/([^:]\/)\/+/g, "$1");
  try {
    const r = await fetch(url, { cache: "no-store" });
    const ct = r.headers.get("content-type") || "";
    const body = ct.includes("application/json") ? await r.json().catch(()=>null) : await r.text().catch(()=>null);
    return NextResponse.json({ ok: true, status: r.status, url, bodyType: ct, body: body ?? null });
  } catch (e) {
    return NextResponse.json({ ok: false, url, error: String(e) }, { status: 502 });
  }
}
