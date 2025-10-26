"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LabsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr(""); setLoading(true);
      try {
        const res = await fetch("/api/niemr/api/labs/orders/", { cache: "no-store" });
        if (!res.ok) {
          const t = await res.text();
          setErr(t || "Failed to load orders");
          return;
        }
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data?.results || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lab Orders</h1>
        <Link href="/dashboard/hospital/labs/new" className="rounded-xl bg-blue-600 text-white px-4 py-2">
          New Order
        </Link>
      </div>
      {loading && <p className="mt-6">Loading...</p>}
      {err && <p className="mt-4 text-red-600">{err}</p>}

      <div className="mt-6 grid gap-3">
        {orders.map((o) => (
          <div key={o.id || o.uuid || JSON.stringify(o)} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Order #{o.id ?? o.uuid ?? "—"}</p>
                <p className="text-sm text-slate-600">
                  Patient: {o.patient || o.patient_id || "—"} • Priority: {o.priority || "—"}
                </p>
              </div>
              <span className="text-sm px-2 py-1 rounded bg-blue-50 text-blue-700">
                {o.status || "NEW"}
              </span>
            </div>
            <p className="text-sm mt-2 text-slate-600">
              Tests: {(o.tests && o.tests.join(", ")) || o.test_codes?.join(", ") || "—"}
            </p>
          </div>
        ))}
        {!loading && !orders.length && <p className="text-slate-600">No orders yet.</p>}
      </div>
    </main>
  );
}
