"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function HospitalLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const registered = sp.get("registered");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // you can show a toast if registered === "1"
  }, [registered]);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.detail || data.error || "Login failed.");
        return;
      }
      router.push("/dashboard/hospital");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-bold">Hospital / Facility Login</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <FormInput label="Email" name="email" type="email" required value={form.email} onChange={onChange} />
          <PasswordInput label="Password" name="password" required value={form.password} onChange={onChange} />

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button type="submit" disabled={loading}
            className="rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-sm text-slate-600">
            New facility? <Link href="/register/hospital" className="text-blue-700">Create one</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
