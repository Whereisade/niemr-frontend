import { NextResponse } from "next/server";

export function middleware(req) {
  const hasAccess = req.cookies.get("niemr_access")?.value;
  if (!hasAccess && req.nextUrl.pathname.startsWith("/dashboard")) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
