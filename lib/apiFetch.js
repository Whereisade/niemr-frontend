export async function apiFetch(input, init = {}) {
  const opts = {
    credentials: "include",
    cache: "no-store",
    ...init,
  };

  let res = await fetch(input, opts);

  // If unauthorized, try refresh once, then retry the original call
  if (res.status === 401) {
    try {
      const r = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
      if (r.ok) {
        res = await fetch(input, opts);
      }
    } catch (_) {
      // ignore; fall through and return the 401
    }
  }
  return res;
}
