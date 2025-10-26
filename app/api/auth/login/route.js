import { NextResponse } from "next/server";
import {
  cookieOptionsAccess,
  cookieOptionsRefresh,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "@/lib/cookie-auth";

function extractTokensFrom(data) {
  if (!data || typeof data !== "object") return {};

  // most common: { access, refresh }
  if (data.access && data.refresh) return { access: data.access, refresh: data.refresh };

  // sometimes nested: { tokens: { access, refresh }, user: {...} }
  if (data.tokens && data.tokens.access && data.tokens.refresh) {
    return { access: data.tokens.access, refresh: data.tokens.refresh };
  }

  // sometimes different keys
  const access =
    data.access_token ||
    data.token ||
    (data.jwt && data.jwt.access) ||
    (data.data && (data.data.access || data.data.access_token)) ||
    null;

  const refresh =
    data.refresh_token ||
    (data.jwt && data.jwt.refresh) ||
    (data.data && (data.data.refresh || data.data.refresh_token)) ||
    null;

  return { access, refresh };
}

export async function POST(req) {
  try {
    const body = await req.json(); // { email, password } or { username, password }

    // Allow both "email" and "username" — map if needed
    const payload =
      body.email && !body.username
        ? { email: body.email, password: body.password }
        : { username: body.username ?? body.email, password: body.password };

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const raw = await resp.text();
    let data = null;
    try { data = raw ? JSON.parse(raw) : {}; } catch { /* keep text in raw */ }

    if (!resp.ok) {
      // surface backend error clearly
      const message =
        (data && (data.detail || data.error)) ||
        raw ||
        "Login failed";
      return NextResponse.json({ error: message }, { status: resp.status });
    }

    const { access, refresh } = extractTokensFrom(data);
    if (!access || !refresh) {
      // Help debug by echoing the shape we got back (without secrets)
      const shape = data && typeof data === "object" ? Object.keys(data) : typeof data;
      return NextResponse.json(
        { error: `Invalid auth response (keys: ${Array.isArray(shape) ? shape.join(",") : shape})` },
        { status: 500 }
      );
    }

    const res = NextResponse.json(
      { ok: true, user: data.user || data.profile || null },
      { status: 200 }
    );
    res.cookies.set(ACCESS_COOKIE, access, cookieOptionsAccess);
    res.cookies.set(REFRESH_COOKIE, refresh, cookieOptionsRefresh);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Login error" }, { status: 500 });
  }
}
