import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/cookie-auth";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function forward(req, { params }, method) {
  const path = (params?.path || []).join("/");
  const url = `${BASE}/${path}`;

  const jar = cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;

  const contentType = req.headers.get("content-type") || "";
  const init = {
    method,
    headers: {
      ...(contentType.includes("application/json") ? { "Content-Type": "application/json" } : {}),
      Accept: req.headers.get("accept") || "*/*",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    body: ["POST", "PUT", "PATCH", "DELETE"].includes(method) ? await req.arrayBuffer() : undefined,
    cache: "no-store",
    redirect: "follow",
  };

  const res = await fetch(url, init);
  const resCT = res.headers.get("content-type") || "application/octet-stream";
  const data = await res.arrayBuffer();

  // If 401 and refresh cookie exists, you can optionally trigger a soft refresh flow here (advanced).
  return new NextResponse(data, { status: res.status, headers: { "content-type": resCT } });
}

export const GET = (req, ctx) => forward(req, ctx, "GET");
export const POST = (req, ctx) => forward(req, ctx, "POST");
export const PUT = (req, ctx) => forward(req, ctx, "PUT");
export const PATCH = (req, ctx) => forward(req, ctx, "PATCH");
export const DELETE = (req, ctx) => forward(req, ctx, "DELETE");
