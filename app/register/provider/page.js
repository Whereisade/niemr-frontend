"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ENDPOINT = "accounts/register/provider/";

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

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

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
      const res = await api.post(ENDPOINT, payload);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.detail || data.error || "Registration failed.");
        return;
      }
      router.push("/login/provider?registered=1");
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
            <span className="text-sm text-slate-700">Role *</span>
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="lab_scientist">Lab Scientist</option>
            </select>
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <FormInput label="First Name" name="first_name" required value={form.first_name} onChange={onChange} />
            <FormInput label="Last Name" name="last_name" required value={form.last_name} onChange={onChange} />
            <FormInput label="Email" name="email" type="email" required value={form.email} onChange={onChange} />
            <FormInput label="Phone" name="phone" required value={form.phone} onChange={onChange} />
            <FormInput label="License Number" name="license_no" required value={form.license_no} onChange={onChange} />
            <FormInput label="Specialty (optional)" name="specialty" value={form.specialty} onChange={onChange} />
            <PasswordInput label="Password" name="password" required value={form.password} onChange={onChange} />
            <PasswordInput label="Confirm Password" name="confirm_password" required value={form.confirm_password} onChange={onChange} />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Provider Account"}
          </button>

          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login/provider" className="text-blue-700">Login</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
