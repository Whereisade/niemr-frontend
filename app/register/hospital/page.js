"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ENDPOINT = "api/accounts/register/"; // DRF path (POST only)

export default function HospitalRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    facility_name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
    admin_phone: "",
    password: "",
    confirm_password: "",
    accept: false,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();            // ✅ stop browser GET
    setErr("");

    if (form.password !== form.confirm_password) {
      setErr("Passwords do not match.");
      return;
    }
    if (!form.accept) {
      setErr("You must accept the terms.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        facility_name: form.facility_name,
        facility_email: form.email,
        facility_phone: form.phone,
        address: {
          address: form.address,
          country: form.country,
          state: form.state,
          city: form.city,
        },
        admin: {
          first_name: form.admin_first_name,
          last_name: form.admin_last_name,
          email: form.admin_email,
          phone: form.admin_phone,
          password: form.password,
        },
      };

      // ✅ POST via proxy (not a Link, not a form action)
      const res = await fetch(`/api/niemr/${ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // show backend validation
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setErr(
            data.detail ||
            data.error ||
            Object.entries(data).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(", "):v}`).join("\n") ||
            "Registration failed."
          );
        } catch {
          setErr(text || "Registration failed.");
        }
        return;
      }

      router.push("/login/hospital?registered=1");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Register a Hospital / Facility</h1>
        <p className="text-slate-600 mt-2">
          Super Admin will be created for this facility.
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-5">
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput label="Facility Name" name="facility_name" required value={form.facility_name} onChange={onChange} />
            <FormInput label="Facility Email" name="email" type="email" required value={form.email} onChange={onChange} />
            <FormInput label="Facility Phone" name="phone" required value={form.phone} onChange={onChange} />
            <FormInput label="Address" name="address" required value={form.address} onChange={onChange} />
            <FormInput label="Country" name="country" required value={form.country} onChange={onChange} />
            <FormInput label="State" name="state" required value={form.state} onChange={onChange} />
            <FormInput label="City" name="city" required value={form.city} onChange={onChange} />
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="font-semibold mb-3">Super Admin Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput label="First Name" name="admin_first_name" required value={form.admin_first_name} onChange={onChange} />
              <FormInput label="Last Name" name="admin_last_name" required value={form.admin_last_name} onChange={onChange} />
              <FormInput label="Admin Email" name="admin_email" type="email" required value={form.admin_email} onChange={onChange} />
              <FormInput label="Admin Phone" name="admin_phone" required value={form.admin_phone} onChange={onChange} />
              <PasswordInput label="Password" name="password" required value={form.password} onChange={onChange} />
              <PasswordInput label="Confirm Password" name="confirm_password" required value={form.confirm_password} onChange={onChange} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="accept" checked={form.accept} onChange={onChange} />
            I accept the Terms and Privacy Policy.
          </label>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Facility"}
          </button>

          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login/hospital" className="text-blue-700">Login</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
