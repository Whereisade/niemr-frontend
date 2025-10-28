// app/api/niemr/[...path]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/cookie-auth";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

async function forward(req, _ctx, method) {
  if (!BASE) return NextResponse.json({ error: "API base not configured" }, { status: 500 });

  const inUrl = new URL(req.url);
  // strip our proxy prefix
  let proxiedPath = inUrl.pathname.replace(/^\/api\/niemr\//, "").replace(/^\/+/, "");
  // DRF: prefer a trailing slash on resources (tweak if your API doesn’t)
  if (!proxiedPath.endsWith("/")) proxiedPath += "/";

  const search = inUrl.search || "";
  const targetUrl = `${BASE}/${proxiedPath}${search}`.replace(/([^:]\/)\/+/g, "$1");

  const ct = req.headers.get("content-type") || "";

  // 🔧 IMPORTANT: cookies() is now a Promise — await it
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;

  const init = {
    method,
    headers: {
      Accept: req.headers.get("accept") || "*/*",
      ...(ct ? { "Content-Type": ct } : {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    body: ["POST", "PUT", "PATCH", "DELETE"].includes(method)
      ? await req.arrayBuffer()
      : undefined,
    cache: "no-store",
    redirect: "follow",
  };

  let upstream;
  try {
    upstream = await fetch(targetUrl, init);
  } catch (e) {
    return NextResponse.json({ error: "Upstream network error", detail: String(e) }, { status: 502 });
  }

  const resCT = upstream.headers.get("content-type") || "application/octet-stream";
  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, { status: upstream.status, headers: { "content-type": resCT } });
}

export const GET    = (req, ctx) => forward(req, ctx, "GET");
export const POST   = (req, ctx) => forward(req, ctx, "POST");
export const PUT    = (req, ctx) => forward(req, ctx, "PUT");
export const PATCH  = (req, ctx) => forward(req, ctx, "PATCH");
export const DELETE = (req, ctx) => forward(req, ctx, "DELETE");
export async function OPTIONS() { return NextResponse.json({}, { status: 200 }); }
