// app/api/auth/dev-token/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/cookie-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_ON =
  process.env.NEXT_PUBLIC_DIRECT_HOSPITAL === "true" &&
  process.env.NODE_ENV !== "production";

function pickAccess(jar) {
  const names = [ACCESS_COOKIE, "niemr_access", "access", "access_token"].filter(Boolean);
  for (const n of names) {
    const v = n ? jar.get(n)?.value : null;
    if (v) return v;
  }
  return null;
}

export async function GET() {
  if (!DIRECT_ON) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  const jar = await cookies();
  const access = pickAccess(jar);
  if (!access) {
    const seen = (jar.getAll?.() || []).map(c => c.name);
    return NextResponse.json(
      { error: "No access cookie", seenCookieNames: seen },
      { status: 401, headers: { "cache-control": "no-store" } }
    );
  }
  return NextResponse.json({ access }, { status: 200, headers: { "cache-control": "no-store" } });
}
