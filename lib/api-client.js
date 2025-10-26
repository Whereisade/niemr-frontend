export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export const REFRESH_URL = process.env.NEXT_PUBLIC_REFRESH_URL || "api/accounts/token/refresh/";

let accessToken = null;
let refreshToken = null;

export function setTokens({ access, refresh }) {
  accessToken = access;
  refreshToken = refresh;
}

async function doFetch(path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(`/api/niemr/${path}`, { ...init, headers, cache: "no-store" });
  if (res.status !== 401) return res;

  // try refresh
  if (!refreshToken) return res;
  const r = await fetch(`/api/niemr/${REFRESH_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });
  if (!r.ok) return res;
  const data = await r.json();
  if (data.access) {
    accessToken = data.access;
    headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(`/api/niemr/${path}`, { ...init, headers, cache: "no-store" });
  }
  return res;
}

export const api = {
  get: (path) => doFetch(path),
  post: (path, body) =>
    doFetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    doFetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  patch: (path, body) =>
    doFetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  delete: (path) => doFetch(path, { method: "DELETE" }),

  // multipart helpers (do NOT set content-type; browser adds boundary)
  postForm: (path, formData) =>
    doFetch(path, {
      method: "POST",
      body: formData,
    }),
  patchForm: (path, formData) =>
    doFetch(path, {
      method: "PATCH",
      body: formData,
    }),
};
