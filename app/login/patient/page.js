"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ENDPOINT = "/api/auth/login";

export default function PatientLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.detail || data.error || "Login failed.");
        return;
      }
      router.push("/dashboard/patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-bold">Patient Login</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <FormInput label="Email" name="email" type="email" required value={form.email} onChange={onChange} />
          <PasswordInput label="Password" name="password" required value={form.password} onChange={onChange} />

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button type="submit" disabled={loading}
            className="rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-sm text-slate-600">
            New here? <Link href="/register/patient" className="text-blue-700">Create account</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
