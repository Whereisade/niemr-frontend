"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

export default function Dashboard() {
  const [status, setStatus] = useState("Checking…");
  const [probe, setProbe] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatus("Authenticated");
      // Optional: probe a lightweight upstream path (customize to your API)
      const r = await apiFetch("/api/niemr/api/");
      setProbe(`${r.status} ${r.statusText}`);
    })();
    return () => { mounted = false; };
  }, []);

  async function doLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Welcome to NIEMR</h1>
      <p className="mt-2 text-slate-700">{status}</p>
      {probe && <p className="mt-2 text-xs text-slate-500">Upstream probe: {probe}</p>}
      <div className="mt-6">
        <button className="btn btn-outline" onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}
