// app/api/niemr/[...path]/route.js
export const dynamic = "force-dynamic";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const HEADER_TYPE = (process.env.NIEMR_AUTH_HEADER_TYPE || "Bearer").trim();

export async function GET(req)    { return forward(req); }
export async function POST(req)   { return forward(req); }
export async function PUT(req)    { return forward(req); }
export async function PATCH(req)  { return forward(req); }
export async function DELETE(req) { return forward(req); }
export async function OPTIONS() {
  return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
}

async function forward(req) {
  if (!API_BASE) return json({ error: "API base not configured" }, 500);

  const inUrl = new URL(req.url);
  let proxiedPath = inUrl.pathname.replace(/^\/api\/niemr\//, "").replace(/^\/+/, "");
  // DRF endpoints want trailing slash
  if (!/\.[a-z0-9]+$/i.test(proxiedPath) && !proxiedPath.endsWith("/")) proxiedPath += "/";
  const targetUrl = `${API_BASE}/${proxiedPath}${inUrl.search || ""}`.replace(/([^:]\/)\/+/g, "$1");

  const headers = new Headers();
  const ctIn = req.headers.get("content-type") || "";
  // ✅ Forward whatever Content-Type came from the browser (includes multipart boundary)
  if (ctIn) headers.set("Content-Type", ctIn);
  headers.set("Accept", req.headers.get("accept") || "*/*");

  // Attach Authorization only if cookie exists (never block if missing)
  const cookieHeader = req.headers.get("cookie") || "";
  const token = readCookie(cookieHeader, "niemr_access");
  if (token && token !== "undefined" && token !== "null") {
    headers.set("Authorization", `${HEADER_TYPE} ${token}`);
  }

  const method = req.method || "GET";
  const needsBody = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const body = needsBody ? await req.arrayBuffer() : undefined;

  // Timeout guard
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort("Proxy timeout (25s)"), 25_000);

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "follow",
      signal: ac.signal,
    });
    clearTimeout(to);

    const outHeaders = new Headers({
      "Content-Type": upstream.headers.get("content-type") || "application/json",
      "x-proxy-target": targetUrl,
    });
    const buf = await upstream.arrayBuffer();
    return new Response(buf, { status: upstream.status, headers: outHeaders });
  } catch (err) {
    clearTimeout(to);
    return json(
      { error: "Upstream fetch failed", detail: String(err?.message || err), targetUrl },
      /timeout/i.test(String(err?.message)) ? 504 : 502
    );
  }
}

function readCookie(cookieHeader, name) {
  const m = (`; ${cookieHeader}`).match(new RegExp(`;\\s*${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
