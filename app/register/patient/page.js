"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ENDPOINT = "api/patients/self-register/";

export default function PatientRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    country: "",
    state: "",
    lga: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const payload = { ...form };
      const res = await fetch(`/api/niemr/${ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        try {
          const j = JSON.parse(t);
          throw new Error(
            j.detail ||
            Object.entries(j).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n") ||
            "Registration failed"
          );
        } catch {
          throw new Error(t || "Registration failed");
        }
      }
      router.push("/login/patient?registered=1");
    } catch (e2) {
      setErr(e2.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Register as Patient</h1>
        <p className="text-slate-600 mt-2">Create your patient portal account.</p>

        <form onSubmit={submit} className="mt-8 grid gap-5">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">First Name *</span>
              <input name="first_name" required value={form.first_name} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Last Name *</span>
              <input name="last_name" required value={form.last_name} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Email *</span>
              <input type="email" name="email" required value={form.email} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Password *</span>
              <input type="password" name="password" required value={form.password} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Date of Birth *</span>
              <input type="date" name="dob" required value={form.dob} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Phone</span>
              <input name="phone" value={form.phone} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Country</span>
              <input name="country" value={form.country} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">State</span>
              <input name="state" value={form.state} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">LGA</span>
              <input name="lga" value={form.lga} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm">Address</span>
              <input name="address" value={form.address} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
          </div>

          {err && <p className="text-sm text-red-600 whitespace-pre-wrap">{err}</p>}

          <button type="submit" disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Creating..." : "Create Patient Account"}
          </button>

          <p className="text-sm text-slate-600">
            Already have an account? <Link href="/login/patient" className="text-blue-700">Login</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
