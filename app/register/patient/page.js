"use client";

import { useState } from "react";
import { Field, Input } from "@/components/forms/Field";
import {
  User,
  Mail,
  Phone as PhoneIcon,
  Calendar,
  Droplet,
  Dna,
  Ruler,
  Weight,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Home,
  Globe2,
  MapPin,
} from "lucide-react";

const E164 = /^\+\d{1,3}\d{6,14}$/; // +2348012345678

const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "OTHER"];
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
    const weight_kg = form.weight_kg !== "" ? Number(form.weight_kg) : undefined;
    const height_cm = form.height_cm !== "" ? Number(form.height_cm) : undefined;

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
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Header */}
        <header className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/10 grid place-items-center shrink-0">
            <User className="h-6 w-6 text-blue-700" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Create Patient Account
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Access results, medications, and manage dependents.
            </p>
          </div>
          <a
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
        </header>

        {/* Error */}
        <div className="mt-6">
          {err ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        {/* Form */}
        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <form className="p-6 md:p-8 space-y-8" onSubmit={onSubmit} noValidate>
            {/* Names */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Basic Info</h2>
                  <p className="text-xs text-slate-500">Your name and contact details.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First Name">
                  <div className="relative">
                    <Input
                      placeholder="Jane"
                      value={form.first_name}
                      onChange={(e) => set("first_name", e.target.value)}
                      className="pl-10"
                    />
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
                <Field label="Last Name">
                  <div className="relative">
                    <Input
                      placeholder="Doe"
                      value={form.last_name}
                      onChange={(e) => set("last_name", e.target.value)}
                      className="pl-10"
                    />
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <Field label="Email">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className="pl-10"
                    />
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>

                <Field label="Phone (optional, E.164)">
                  <div className="relative">
                    <Input
                      placeholder="+2348012345678"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className="pl-10"
                    />
                    <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>
            </section>

            {/* Demographics */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <Calendar className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Demographics</h2>
                  <p className="text-xs text-slate-500">Date of birth and location.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Date of Birth">
                  <div className="relative">
                    <Input
                      type="date"
                      value={form.dob}
                      onChange={(e) => set("dob", e.target.value)}
                      className="pr-10"
                    />
                    {/* <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
                  </div>
                </Field>

                {/* Gender placeholder (kept commented like yours) */}
                {/* <Field label="Gender">
                  ...
                </Field> */}
              </div>

              <div className="grid sm:grid-cols-3 gap-5 mt-5">
                <Field label="Country">
                  <div className="relative">
                    <Input
                      placeholder="Nigeria"
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                      className="pl-10"
                    />
                    <Globe2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
                <Field label="State">
                  <Input
                    placeholder="Lagos"
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                  />
                </Field>
                <Field label="LGA">
                  <div className="relative">
                    <Input
                      placeholder="Ikeja"
                      value={form.lga}
                      onChange={(e) => set("lga", e.target.value)}
                      className="pl-10"
                    />
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>

              <Field label="Address">
                <div className="relative">
                  <textarea
                    className="mt-1 w-full min-h-[80px] rounded-lg border border-slate-200 bg-white/60 px-3 py-2
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40 pl-10"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                  />
                  <Home className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </Field>
            </section>

            {/* Clinical (optional) */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <Droplet className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Clinical (optional)</h2>
                  <p className="text-xs text-slate-500">Blood group, genotype, height & weight.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Blood Group">
                  <select
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    value={form.blood_group}
                    onChange={(e) => set("blood_group", e.target.value)}
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg || "Select…"}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Genotype">
                  <select
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    value={form.genotype}
                    onChange={(e) => set("genotype", e.target.value)}
                  >
                    {GENOTYPES.map((g) => (
                      <option key={g} value={g}>
                        {g || "Select…"}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {form.blood_group === "OTHER" && (
                <Field label="Blood Group (other)">
                  <Input
                    maxLength={3}
                    value={form.blood_group_other}
                    onChange={(e) => set("blood_group_other", e.target.value)}
                  />
                </Field>
              )}
              {form.genotype === "OTHER" && (
                <Field label="Genotype (other)">
                  <Input
                    maxLength={2}
                    value={form.genotype_other}
                    onChange={(e) => set("genotype_other", e.target.value)}
                  />
                </Field>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Weight (kg)">
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.weight_kg}
                      onChange={(e) => set("weight_kg", e.target.value)}
                      className="pl-10"
                    />
                    <Weight className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
                <Field label="Height (cm)">
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.height_cm}
                      onChange={(e) => set("height_cm", e.target.value)}
                      className="pl-10"
                    />
                    <Ruler className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>
            </section>

            {/* Passwords */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <Lock className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Security</h2>
                  <p className="text-xs text-slate-500">Set your account password.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Password">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                </Field>
                <Field label="Confirm Password">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password2}
                    onChange={(e) => set("password2", e.target.value)}
                  />
                </Field>
              </div>
            </section>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                We use industry-standard security practices to protect your data.
              </div>

              <button
                type="submit"
                disabled={sub}
                className="btn btn-primary h-11 px-5 disabled:opacity-60"
              >
                {sub ? "Creating…" : "Create Patient Account"}
              </button>
            </div>

            <div className="text-sm">
              <a href="/login" className="text-blue-700 hover:underline">
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>

        {/* Back (mobile) */}
        <div className="mt-6 sm:hidden">
          <a
            href="/register"
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
