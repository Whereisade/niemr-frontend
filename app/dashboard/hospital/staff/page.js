"use client";

import { useState } from "react";
import Link from "next/link";

export default function StaffOnboardingPage() {
  const [form, setForm] = useState({
    role: "doctor",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    license_no: "",
    specialty: "",
    // facility_id: "" // Uncomment if your API needs it explicitly
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const createStaff = async (e) => {
    e.preventDefault();
    setMsg(""); setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/niemr/api/providers/self-register/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.detail || "Failed to create staff");
        return;
      }
      setMsg("Staff created successfully");
      setForm({ role: "doctor", first_name: "", last_name: "", email: "", phone: "", license_no: "", specialty: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Facility Staff Onboarding</h1>
      <p className="text-slate-600 mt-1">Create clinicians into your hospital workspace.</p>

      <form onSubmit={createStaff} className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-sm">Role *</span>
          <select name="role" value={form.role} onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2">
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="lab_scientist">Lab Scientist</option>
          </select>
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">First Name *</span>
            <input name="first_name" className="mt-1 w-full rounded-xl border px-3 py-2"
                   value={form.first_name} onChange={onChange} required />
          </label>
          <label className="block">
            <span className="text-sm">Last Name *</span>
            <input name="last_name" className="mt-1 w-full rounded-xl border px-3 py-2"
                   value={form.last_name} onChange={onChange} required />
          </label>
          <label className="block">
            <span className="text-sm">Email *</span>
            <input type="email" name="email" className="mt-1 w-full rounded-xl border px-3 py-2"
                   value={form.email} onChange={onChange} required />
          </label>
          <label className="block">
            <span className="text-sm">Phone *</span>
            <input name="phone" className="mt-1 w-full rounded-xl border px-3 py-2"
                   value={form.phone} onChange={onChange} required />
          </label>
          <label className="block">
            <span className="text-sm">License Number *</span>
            <input name="license_no" className="mt-1 w-full rounded-xl border px-3 py-2"
                   value={form.license_no} onChange={onChange} required />
          </label>
          <label className="block">
            <span className="text-sm">Specialty (optional)</span>
            <input name="specialty" className="mt-1 w-full rounded-xl border px-3 py-2"
                   value={form.specialty} onChange={onChange} />
          </label>
          {/* <label className="block">
            <span className="text-sm">Facility ID (if required)</span>
            <input name="facility_id" className="mt-1 w-full rounded-xl border px-3 py-2"
                   value={form.facility_id} onChange={onChange} />
          </label> */}
        </div>

        {msg && <p className="text-green-700 text-sm">{msg}</p>}
        {err && <p className="text-red-600 text-sm">{err}</p>}

        <div className="flex gap-3">
          <button disabled={loading}
                  className="rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Saving..." : "Create Staff"}
          </button>
          <Link href="/dashboard/hospital" className="px-4 py-3 border rounded-xl">Back</Link>
        </div>
      </form>
    </main>
  );
}
