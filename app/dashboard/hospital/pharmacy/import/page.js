"use client";

import { useState } from "react";
import Link from "next/link";

const UPLOAD_ENDPOINT = "/api/niemr/api/pharmacy/catalog/"; 
// If your backend expects a special import endpoint, e.g. "/api/pharmacy/catalog/import/",
// or a generic attachments endpoint "/api/attachments/upload/", update here.

export default function PharmacyImportPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const upload = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!file) { setErr("Choose a CSV file"); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file); // backend should read `file`
      const res = await fetch(UPLOAD_ENDPOINT, { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text();
        setErr(text || "Upload failed");
        return;
      }
      setMsg("Catalog uploaded/imported successfully");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Pharmacy Catalog – CSV Import</h1>
      <p className="text-slate-600 mt-1">Upload a CSV of drugs (name, strength, form, pack size, price, etc.).</p>

      <form onSubmit={upload} className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-sm">CSV File *</span>
          <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)}
                 className="mt-1 w-full rounded-xl border px-3 py-2" />
        </label>

        {msg && <p className="text-green-700 text-sm">{msg}</p>}
        {err && <p className="text-red-600 text-sm">{err}</p>}

        <div className="flex gap-3">
          <button disabled={loading}
                  className="rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
          <Link href="/dashboard/hospital" className="px-4 py-3 border rounded-xl">Back</Link>
        </div>
      </form>
    </main>
  );
}
