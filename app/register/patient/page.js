"use client";

import { useState } from "react";
import { Field, Input } from "@/components/forms/Field";

const E164 = /^\+\d{1,3}\d{6,14}$/; // +2348012345678

const BLOOD_GROUPS = [
  "", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "OTHER"
];
const GENOTYPES = ["", "AA", "AS", "SS", "SC", "OTHER"];

export default function RegisterPatient() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
    dob: "",
    phone: "",
    // address-ish
    country: "",
    state: "",
    lga: "",
    address: "",
    // optional clinical
    blood_group: "",
    blood_group_other: "",
    genotype: "",
    genotype_other: "",
    weight_kg: "",
    height_cm: "",
  });

  const [err, setErr] = useState("");
  const [sub, setSub] = useState(false);
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  function buildPayload() {
    // Required
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.dob) {
      throw new Error("Please fill first name, last name, email, password and date of birth.");
    }
    if (form.password !== form.password2) throw new Error("Passwords do not match.");

    // Optional validations
    if (form.phone && !E164.test(form.phone)) {
      throw new Error("Phone must be E.164 format (e.g. +2348012345678).");
    }

    // Numeric optionals (send only if user entered something)
    const weight_kg =
      form.weight_kg !== "" ? Number(form.weight_kg) : undefined;
    const height_cm =
      form.height_cm !== "" ? Number(form.height_cm) : undefined;

    // Only include fields that have values
    const payload = {
      email: form.email,
      password: form.password,
      first_name: form.first_name,
      last_name: form.last_name,
      dob: form.dob,

      ...(form.phone ? { phone: form.phone } : {}),
      ...(form.country ? { country: form.country } : {}),
      ...(form.state ? { state: form.state } : {}),
      ...(form.lga ? { lga: form.lga } : {}),
      ...(form.address ? { address: form.address } : {}),

      ...(form.blood_group ? { blood_group: form.blood_group } : {}),
      ...(form.blood_group === "OTHER" && form.blood_group_other
        ? { blood_group_other: form.blood_group_other }
        : {}),

      ...(form.genotype ? { genotype: form.genotype } : {}),
      ...(form.genotype === "OTHER" && form.genotype_other
        ? { genotype_other: form.genotype_other }
        : {}),

      ...(weight_kg !== undefined && !Number.isNaN(weight_kg) ? { weight_kg } : {}),
      ...(height_cm !== undefined && !Number.isNaN(height_cm) ? { height_cm } : {}),
    };

    return payload;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const payload = buildPayload();
      setSub(true);

      const res = await fetch("/api/niemr/api/patients/self-register/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.detail ||
          data?.non_field_errors?.[0] ||
          (typeof data === "string" ? data : JSON.stringify(data)) ||
          `Failed (${res.status})`;
        throw new Error(msg);
      }

      window.location.href = "/register/success?role=patient";
    } catch (e2) {
      setErr(e2.message || "Unable to register");
    } finally {
      setSub(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900">Create Patient Account</h1>
        <p className="mt-2 text-slate-700">Access results, meds, and manage dependents.</p>

        <div className="card mt-8">
          <form className="card-pad space-y-5" onSubmit={onSubmit}>
            {err && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            )}

            {/* Names */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First Name">
                <Input placeholder="Jane" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
              </Field>
              <Field label="Last Name">
                <Input placeholder="Doe" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
              </Field>
            </div>

            {/* Contact */}
            <Field label="Email">
              <Input type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Phone (optional, E.164)">
              <Input placeholder="+2348012345678" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>

            {/* Demographics */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Date of Birth">
                <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
              </Field>

              {/* NOTE: gender is not required by the public serializer; include only if backend supports it */}
              {/* If your serializer supports gender, uncomment and include it in payload */}
              {/* <Field label="Gender">
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                >
                  <option value="">Select…</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </Field> */}
            </div>

            {/* Address */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Country"><Input placeholder="Nigeria" value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
              <Field label="State"><Input placeholder="Lagos" value={form.state} onChange={(e) => set("state", e.target.value)} /></Field>
              <Field label="LGA"><Input placeholder="Ikeja" value={form.lga} onChange={(e) => set("lga", e.target.value)} /></Field>
            </div>
            <Field label="Address">
              <textarea className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200 min-h-[70px]"
                value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>

            {/* Clinical optional */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Blood Group">
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
                  value={form.blood_group}
                  onChange={(e) => set("blood_group", e.target.value)}
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg || "Select…"}</option>
                  ))}
                </select>
              </Field>
              <Field label="Genotype">
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
                  value={form.genotype}
                  onChange={(e) => set("genotype", e.target.value)}
                >
                  {GENOTYPES.map((g) => (
                    <option key={g} value={g}>{g || "Select…"}</option>
                  ))}
                </select>
              </Field>
            </div>

            {form.blood_group === "OTHER" && (
              <Field label="Blood Group (other)">
                <Input maxLength={3} value={form.blood_group_other} onChange={(e) => set("blood_group_other", e.target.value)} />
              </Field>
            )}
            {form.genotype === "OTHER" && (
              <Field label="Genotype (other)">
                <Input maxLength={2} value={form.genotype_other} onChange={(e) => set("genotype_other", e.target.value)} />
              </Field>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Weight (kg)">
                <Input type="number" min="0" step="0.01" value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} />
              </Field>
              <Field label="Height (cm)">
                <Input type="number" min="0" step="0.01" value={form.height_cm} onChange={(e) => set("height_cm", e.target.value)} />
              </Field>
            </div>

            {/* Passwords */}
            <Field label="Password">
              <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => set("password", e.target.value)} />
            </Field>
            <Field label="Confirm Password">
              <Input type="password" placeholder="••••••••" value={form.password2} onChange={(e) => set("password2", e.target.value)} />
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
