import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE, cookieOptionsAccess, cookieOptionsRefresh } from "@/lib/cookie-auth";

export async function POST(req) {
  try {
    const body = await req.json(); // { email, password }
    // Hit your live backend through the proxy
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ error: err || "Login failed" }, { status: resp.status });
    }

    const data = await resp.json(); // expects { access, refresh, user? }
    if (!data?.access || !data?.refresh) {
      return NextResponse.json({ error: "Invalid auth response" }, { status: 500 });
    }

    // Set cookies
    const res = NextResponse.json({ ok: true, user: data.user || null }, { status: 200 });
    res.cookies.set(ACCESS_COOKIE, data.access, cookieOptionsAccess);
    res.cookies.set(REFRESH_COOKIE, data.refresh, cookieOptionsRefresh);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Login error" }, { status: 500 });
  }
}
