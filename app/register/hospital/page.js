"use client";
import { useState } from "react";
import { Field, Input } from "@/components/forms/Field";

export default function RegisterHospital() {
  const [form, setForm] = useState({
    organization_name: "",
    admin_full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });
  const [err, setErr] = useState("");
  const [sub, setSub] = useState(false);

  function set(k, v){ setForm((s)=>({ ...s, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.email || !form.password || !form.organization_name || !form.admin_full_name) {
      setErr("Fill in required fields.");
      return;
    }
    if (form.password !== form.confirm_password) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      setSub(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ role: "hospital", ...form }),
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data?.error || "Registration failed");
      window.location.href = "/register/success?role=hospital";
    } catch (e) {
      setErr(e.message || "Unable to register");
    } finally {
      setSub(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900">Create Hospital / Facility Account</h1>
        <p className="mt-2 text-slate-700">Register your facility admin to get started.</p>

        <div className="card mt-8">
          <form className="card-pad" onSubmit={onSubmit}>
            {err && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

            <Field label="Organization Name">
              <Input placeholder="City General Hospital" value={form.organization_name} onChange={(e)=>set("organization_name", e.target.value)} />
            </Field>

            <Field label="Admin Full Name">
              <Input placeholder="Dr. Jane Doe" value={form.admin_full_name} onChange={(e)=>set("admin_full_name", e.target.value)} />
            </Field>

            <Field label="Email">
              <Input type="email" placeholder="admin@hospital.org" value={form.email} onChange={(e)=>set("email", e.target.value)} />
            </Field>

            <Field label="Phone (optional)">
              <Input placeholder="+2348000000000" value={form.phone} onChange={(e)=>set("phone", e.target.value)} />
            </Field>

            <Field label="Password">
              <Input type="password" placeholder="••••••••" value={form.password} onChange={(e)=>set("password", e.target.value)} />
            </Field>

            <Field label="Confirm Password">
              <Input type="password" placeholder="••••••••" value={form.confirm_password} onChange={(e)=>set("confirm_password", e.target.value)} />
            </Field>

            <button type="submit" disabled={sub} className="mt-6 w-full btn btn-primary disabled:opacity-60">
              {sub ? "Creating…" : "Create Hospital Account"}
            </button>

            <div className="mt-4 text-sm">
              <a href="/login" className="text-blue-700 hover:underline">Already have an account? Login</a>
            </div>
          </form>
        </div>

        <div className="mt-6">
          <a href="/register" className="text-blue-700 hover:underline">← Back</a>
        </div>
      </div>
    </div>
  );
}
