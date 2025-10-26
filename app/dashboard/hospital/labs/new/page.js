"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewLabOrderPage() {
  const router = useRouter();
  const [catalog, setCatalog] = useState([]);
  const [form, setForm] = useState({
    patient: "", // patient id or identifier
    tests: [],
    priority: "ROUTINE", // ROUTINE | URGENT | STAT
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/niemr/api/labs/catalog/", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCatalog(Array.isArray(data) ? data : data?.results || []);
      }
    })();
  }, []);

  const toggleTest = (code) =>
    setForm((f) => ({
      ...f,
      tests: f.tests.includes(code) ? f.tests.filter((c) => c !== code) : [...f.tests, code],
    }));

  const createOrder = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const payload = { patient: form.patient, tests: form.tests, priority: form.priority, note: form.note || undefined };
      const res = await fetch("/api/niemr/api/labs/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        setErr(t || "Failed to create order");
        return;
      }
      router.push("/dashboard/hospital/labs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Lab Order</h1>
        <Link href="/dashboard/hospital/labs" className="px-4 py-2 border rounded-xl">Back</Link>
      </div>

      <form onSubmit={createOrder} className="mt-6 grid gap-5">
        <label className="block">
          <span className="text-sm">Patient ID *</span>
          <input className="mt-1 w-full rounded-xl border px-3 py-2"
                 value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required />
        </label>

        <label className="block">
          <span className="text-sm">Priority *</span>
          <select className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="ROUTINE">Routine</option>
            <option value="URGENT">Urgent</option>
            <option value="STAT">STAT</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm">Note (optional)</span>
          <textarea className="mt-1 w-full rounded-xl border px-3 py-2"
                    rows={3}
                    value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </label>

        <div>
          <p className="text-sm font-semibold">Select Tests</p>
          <div className="mt-2 grid md:grid-cols-3 gap-3">
            {catalog.map((t) => {
              const code = t.code || t.test_code || t.slug || t.id;
              const name = t.name || t.title || code;
              const checked = form.tests.includes(code);
              return (
                <label key={code} className="flex items-center gap-2 rounded-xl border px-3 py-2">
                  <input type="checkbox" checked={!!checked} onChange={() => toggleTest(code)} />
                  <span className="text-sm">{name} <span className="text-slate-500">({code})</span></span>
                </label>
              );
            })}
          </div>
        </div>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button disabled={loading}
                className="rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Creating..." : "Create Order"}
        </button>
      </form>
    </main>
  );
}
