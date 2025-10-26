import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function forward(req, { params }, method) {
  const path = (params?.path || []).join("/");
  const url = `${BASE}/${path}`;

  const init = {
    method,
    headers: {
      ...(req.headers.get("content-type")?.includes("application/json")
        ? { "Content-Type": "application/json" }
        : {}),
      Accept: req.headers.get("accept") || "*/*",
      Authorization: req.headers.get("authorization") || "",
    },
    body: ["POST","PUT","PATCH","DELETE"].includes(method) ? await req.arrayBuffer() : undefined,
    cache: "no-store",
    redirect: "follow",
  };

  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const data = await res.arrayBuffer();
  return new NextResponse(data, { status: res.status, headers: { "content-type": contentType } });
}

export const GET = (req, ctx) => forward(req, ctx, "GET");
export const POST = (req, ctx) => forward(req, ctx, "POST");
export const PUT = (req, ctx) => forward(req, ctx, "PUT");
export const PATCH = (req, ctx) => forward(req, ctx, "PATCH");
export const DELETE = (req, ctx) => forward(req, ctx, "DELETE");
