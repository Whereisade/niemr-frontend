// app/api/niemr/whoami/route.js
import { NextResponse } from "next/server";
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
export async function GET() {
  const url = `${BASE}/api/accounts/`.replace(/([^:]\/)\/+/g, "$1"); // adjust to your user-info endpoint
  const r = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  const ct = r.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await r.json().catch(()=>null) : await r.text().catch(()=>null);
  return NextResponse.json({ upstreamStatus: r.status, url, data }, { status: 200 });
}
