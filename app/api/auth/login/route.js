import { NextResponse } from "next/server";
import {
  cookieOptionsAccess,
  cookieOptionsRefresh,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "@/lib/cookie-auth";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const LOGIN_PATH = process.env.NIEMR_LOGIN_PATH || "/api/accounts/login/";

function isJSON(res) { return (res.headers.get("content-type") || "").includes("application/json"); }
function tokens(data) {
  if (!data || typeof data !== "object") return {};
  if (data.access || data.refresh) return { access: data.access, refresh: data.refresh };
  if (data.token || data.refresh_token) return { access: data.token, refresh: data.refresh_token };
  if (data.tokens?.access || data.tokens?.refresh) return data.tokens;
  return {};
}

export async function POST(req) {
  try {
    if (!BASE) return NextResponse.json({ error: "API base not configured" }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const payload = { email: body.email, password: body.password, ...(body.role ? { role: body.role } : {}) };

    const upstream = await fetch(`${BASE}${LOGIN_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = isJSON(upstream) ? await upstream.json().catch(() => null) : null;
    if (!upstream.ok) {
      const msg = data?.detail || data?.error || data?.message || "Login failed";
      return NextResponse.json({ error: msg }, { status: upstream.status });
    }

    const { access, refresh } = tokens(data);
    if (!access) return NextResponse.json({ error: "Tokens missing from response" }, { status: 500 });

    const res = NextResponse.json({ ok: true, user: data?.user || data?.profile || null }, { status: 200 });
    res.cookies.set(ACCESS_COOKIE, access, cookieOptionsAccess);
    if (refresh) res.cookies.set(REFRESH_COOKIE, refresh, cookieOptionsRefresh);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Login error" }, { status: 500 });
  }
}
