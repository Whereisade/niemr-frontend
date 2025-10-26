"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ENDPOINT = "api/providers/self-register/";

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    role: "doctor", // doctor | nurse | pharmacist | lab_scientist
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    license_no: "",
    specialty: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm_password) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        role: form.role,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        license_no: form.license_no,
        specialty: form.specialty || null,
        password: form.password,
      };

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

      router.push("/login/provider?registered=1");
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
        <h1 className="text-3xl font-bold">Register as Independent Provider</h1>
        <p className="text-slate-600 mt-2">For doctors, nurses, pharmacists, and lab scientists.</p>

        <form onSubmit={submit} className="mt-8 grid gap-5">
          <label className="block">
            <span className="text-sm">Role *</span>
            <select name="role" value={form.role} onChange={onChange}
                    className="mt-1 w-full rounded-xl border px-3 py-2">
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="lab_scientist">Lab Scientist</option>
            </select>
          </label>

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
              <span className="text-sm">Phone *</span>
              <input name="phone" required value={form.phone} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">License Number *</span>
              <input name="license_no" required value={form.license_no} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Specialty (optional)</span>
              <input name="specialty" value={form.specialty} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Password *</span>
              <input type="password" name="password" required value={form.password} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Confirm Password *</span>
              <input type="password" name="confirm_password" required value={form.confirm_password} onChange={onChange}
                     className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
          </div>

          {err && <p className="text-sm text-red-600 whitespace-pre-wrap">{err}</p>}

          <button type="submit" disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Creating..." : "Create Provider Account"}
          </button>

          <p className="text-sm text-slate-600">
            Already have an account? <Link href="/login/provider" className="text-blue-700">Login</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
