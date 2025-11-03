import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/cookie-auth";

export async function GET() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE);
  const refresh = jar.get(REFRESH_COOKIE);
  return NextResponse.json({
    hasAccess: !!access?.value,
    accessAttrs: access ? { name: access.name, path: access.path, sameSite: access.sameSite, secure: access.secure } : null,
    hasRefresh: !!refresh?.value,
  });
}
