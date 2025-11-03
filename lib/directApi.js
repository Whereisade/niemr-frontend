// lib/directApi.js
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const PRIMARY = (process.env.NEXT_PUBLIC_AUTH_HEADER_TYPE || "Bearer").trim(); // "Bearer" or "JWT"
const SECONDARY = PRIMARY.toLowerCase() === "bearer" ? "JWT" : "Bearer";

function getAccessToken() {
  try { return localStorage.getItem("niemr_access_dev") || ""; } catch { return ""; }
}

async function fetchWithAuthRetry(url, init = {}, makeBodyAgain) {
  const token = getAccessToken();
  if (!token) throw new Error("No dev access token; login again.");

  // 1st try with PRIMARY
  let res = await fetch(url, {
    mode: "cors",
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `${PRIMARY} ${token}`,
    },
  });

  // If DRF says "credentials not provided" (401/403), retry with the other scheme once
  const ct = res.headers.get("content-type") || "";
  const bodyText = !ct.includes("application/json") ? await res.clone().text().catch(()=> "") : "";
  const looksLikeNoCreds =
    (res.status === 401 || res.status === 403) &&
    (bodyText.includes("Authentication credentials were not provided") ||
     bodyText.includes("credentials were not provided"));

  if (looksLikeNoCreds) {
    // rebuild body if it was a FormData (can't reuse a drained stream)
    const nextInit = { ...init };
    if (typeof makeBodyAgain === "function") nextInit.body = await makeBodyAgain();

    res = await fetch(url, {
      mode: "cors",
      ...nextInit,
      headers: {
        ...(nextInit.headers || {}),
        Authorization: `${SECONDARY} ${token}`,
      },
    });
  }

  return res;
}

export async function directGetSpecialties() {
  const res = await fetchWithAuthRetry(`${BASE}/api/facilities/specialties/`, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json") ? await res.json() : await res.text();
  return { ok: res.ok, status: res.status, body };
}

export async function directCreateFacility(formData) {
  const res = await fetchWithAuthRetry(
    `${BASE}/api/facilities/`,
    {
      method: "POST",
      // no Content-Type for multipart; the browser will set the boundary
      body: formData,
    },
    // generator so we can rebuild the FormData for the retry
    async () => {
      const clone = new FormData();
      for (const [k, v] of formData.entries()) clone.append(k, v);
      return clone;
    }
  );

  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json") ? await res.json() : await res.text();
  return { ok: res.ok, status: res.status, body };
}
