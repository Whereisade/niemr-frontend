import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieOptionsAccess, ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/cookie-auth";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const REFRESH_PATH = process.env.NIEMR_REFRESH_PATH || "/api/accounts/token/refresh/";

export async function POST() {
  try {
    if (!BASE) return NextResponse.json({ error: "API base not configured" }, { status: 500 });

    const jar = cookies();
    const refresh = jar.get(REFRESH_COOKIE)?.value;
    if (!refresh) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

    const upstream = await fetch(`${BASE}${REFRESH_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return NextResponse.json({ error: data?.detail || "Refresh failed" }, { status: upstream.status });

    const access = data?.access || data?.token || data?.access_token;
    if (!access) return NextResponse.json({ error: "No access token returned" }, { status: 500 });

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set(ACCESS_COOKIE, access, cookieOptionsAccess);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Refresh error" }, { status: 500 });
  }
}
