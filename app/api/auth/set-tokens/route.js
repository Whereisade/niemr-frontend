
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE, cookieOptionsAccess, cookieOptionsRefresh } from "@/lib/cookie-auth";

export async function POST(req) {
  const { access, refresh } = await req.json().catch(() => ({}));
  if (!access || !refresh) {
    return new Response(JSON.stringify({ error: "Missing tokens" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const jar = cookies();
  jar.set(ACCESS_COOKIE, access, cookieOptionsAccess);
  jar.set(REFRESH_COOKIE, refresh, cookieOptionsRefresh);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
