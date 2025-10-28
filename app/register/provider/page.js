"use client";
import { useState } from "react";
import { Field, Input } from "@/components/forms/Field";

export default function RegisterProvider() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    license_id: "",
    specialty: "",
  });
  const [err, setErr] = useState("");
  const [sub, setSub] = useState(false);
  function set(k, v){ setForm((s)=>({ ...s, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.full_name || !form.email || !form.password) {
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
        body: JSON.stringify({ role: "provider", ...form }),
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data?.error || "Registration failed");
      window.location.href = "/register/success?role=provider";
    } catch (e) {
      setErr(e.message || "Unable to register");
    } finally {
      setSub(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900">Create Provider Account</h1>
        <p className="mt-2 text-slate-700">For independent practitioners.</p>

        <div className="card mt-8">
          <form className="card-pad" onSubmit={onSubmit}>
            {err && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

            <Field label="Full Name">
              <Input placeholder="Dr. John Smith" value={form.full_name} onChange={(e)=>set("full_name", e.target.value)} />
            </Field>

            <Field label="Email">
              <Input type="email" placeholder="you@provider.com" value={form.email} onChange={(e)=>set("email", e.target.value)} />
            </Field>

            <Field label="Phone (optional)">
              <Input placeholder="+2348..." value={form.phone} onChange={(e)=>set("phone", e.target.value)} />
            </Field>

            <Field label="License ID (optional)">
              <Input placeholder="Medical Council #..." value={form.license_id} onChange={(e)=>set("license_id", e.target.value)} />
            </Field>

            <Field label="Specialty (optional)">
              <Input placeholder="Family Medicine" value={form.specialty} onChange={(e)=>set("specialty", e.target.value)} />
            </Field>

            <Field label="Password">
              <Input type="password" placeholder="••••••••" value={form.password} onChange={(e)=>set("password", e.target.value)} />
            </Field>

            <Field label="Confirm Password">
              <Input type="password" placeholder="••••••••" value={form.confirm_password} onChange={(e)=>set("confirm_password", e.target.value)} />
            </Field>

            <button type="submit" disabled={sub} className="mt-6 w-full btn btn-primary disabled:opacity-60">
              {sub ? "Creating…" : "Create Provider Account"}
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
