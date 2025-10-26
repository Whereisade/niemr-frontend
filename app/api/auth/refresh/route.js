import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE, cookieOptionsAccess } from "@/lib/cookie-auth";

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!refresh) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!resp.ok) return NextResponse.json({ error: "Refresh failed" }, { status: 401 });

  const data = await resp.json(); // { access }
  if (!data?.access) return NextResponse.json({ error: "Invalid refresh response" }, { status: 500 });

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(ACCESS_COOKIE, data.access, cookieOptionsAccess);
  return res;
}
