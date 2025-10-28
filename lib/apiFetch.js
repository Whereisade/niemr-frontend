export async function apiFetch(input, init = {}) {
  const res = await fetch(input, { ...init, credentials: "include" });
  if (res.status !== 401) return res;

  // try refresh once
  const r = await fetch("/api/auth/refresh", { method: "POST" });
  if (!r.ok) return res; // still 401 – caller handles redirect

  // retry original
  return fetch(input, { ...init, credentials: "include" });
}
