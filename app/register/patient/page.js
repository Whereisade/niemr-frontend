"use client";
import { useState } from "react";
import { Field, Input } from "@/components/forms/Field";

export default function RegisterPatient() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [err, setErr] = useState("");
  const [sub, setSub] = useState(false);
  function set(k, v){ setForm((s)=>({ ...s, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setErr("Fill in required fields.");
      return;
    }
    if (form.password !== form.password2) {
      setErr("Passwords do not match.");
      return;
    }
    if (!form.dob) {
      setErr("Date of birth is required.");
      return;
    }

    try {
      setSub(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        // Send fields exactly as API expects
        body: JSON.stringify({
          role: "patient",
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone || undefined,
          dob: form.dob,
          gender: form.gender || undefined,
          password: form.password,
          password2: form.password2,
        }),
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data?.error || "Registration failed");
      window.location.href = "/register/success?role=patient";
    } catch (e) {
      setErr(e.message || "Unable to register");
    } finally {
      setSub(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900">Create Patient Account</h1>
        <p className="mt-2 text-slate-700">Access your results, meds, and manage dependents.</p>

        <div className="card mt-8">
          <form className="card-pad" onSubmit={onSubmit}>
            {err && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">First Name</label>
                <Input placeholder="Jane" value={form.first_name} onChange={(e)=>set("first_name", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                <Input placeholder="Doe" value={form.last_name} onChange={(e)=>set("last_name", e.target.value)} />
              </div>
            </div>

            <Field label="Email">
              <Input type="email" placeholder="you@email.com" value={form.email} onChange={(e)=>set("email", e.target.value)} />
            </Field>

            <Field label="Phone (optional)">
              <Input placeholder="+2348..." value={form.phone} onChange={(e)=>set("phone", e.target.value)} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                <Input type="date" value={form.dob} onChange={(e)=>set("dob", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Gender</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
                  value={form.gender}
                  onChange={(e)=>set("gender", e.target.value)}
                >
                  <option value="">Select…</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <Field label="Password">
              <Input type="password" placeholder="••••••••" value={form.password} onChange={(e)=>set("password", e.target.value)} />
            </Field>

            <Field label="Confirm Password">
              <Input type="password" placeholder="••••••••" value={form.password2} onChange={(e)=>set("password2", e.target.value)} />
            </Field>

            <button type="submit" disabled={sub} className="mt-6 w-full btn btn-primary disabled:opacity-60">
              {sub ? "Creating…" : "Create Patient Account"}
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
