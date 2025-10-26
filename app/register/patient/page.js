"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ENDPOINT = "api/patients/self-register/"; 

export default function PatientRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    sex: "male", // male | female | other
    address: "",
    password: "",
    confirm_password: "",
    document: null, // optional upload
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document") {
      setForm((f) => ({ ...f, document: files?.[0] || null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
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
      const fd = new FormData();
      fd.append("first_name", form.first_name);
      fd.append("last_name", form.last_name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("dob", form.dob);
      fd.append("sex", form.sex);
      fd.append("address", form.address);
      fd.append("password", form.password);
      if (form.document) fd.append("document", form.document);

      const res = await api.postForm(ENDPOINT, fd);
      if (!res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setErr(data.detail || data.error || "Registration failed.");
        } catch {
          setErr(text || "Registration failed.");
        }
        return;
      }
      router.push("/login/patient?registered=1");
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
            <FormInput label="First Name" name="first_name" required value={form.first_name} onChange={onChange} />
            <FormInput label="Last Name" name="last_name" required value={form.last_name} onChange={onChange} />
            <FormInput label="Email" name="email" type="email" required value={form.email} onChange={onChange} />
            <FormInput label="Phone" name="phone" required value={form.phone} onChange={onChange} />
            <FormInput label="Date of Birth" name="dob" type="date" required value={form.dob} onChange={onChange} />
            <label className="block">
              <span className="text-sm text-slate-700">Sex *</span>
              <select
                name="sex"
                value={form.sex}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </label>
            <FormInput label="Address" name="address" required value={form.address} onChange={onChange} />
            <label className="block">
              <span className="text-sm text-slate-700">Supporting Document (optional)</span>
              <input
                name="document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
              />
            </label>
            <PasswordInput label="Password" name="password" required value={form.password} onChange={onChange} />
            <PasswordInput label="Confirm Password" name="confirm_password" required value={form.confirm_password} onChange={onChange} />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Patient Account"}
          </button>

          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login/patient" className="text-blue-700">Login</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
