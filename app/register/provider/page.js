"use client";

import { useEffect, useState } from "react";
import { Field, Input } from "@/components/forms/Field";
import {
  Stethoscope,
  User,
  Mail,
  Lock,
  ShieldCheck,
  BadgeCheck,
  FileCheck2,
  Phone as PhoneIcon,
  Globe2,
  MapPin,
  Calendar,
  Briefcase,
  Coins,
  ArrowLeft,
} from "lucide-react";

const E164 = /^\+\d{1,3}\d{6,14}$/; // +2348012345678

const PROVIDER_TYPES = [
  { value: "DOCTOR", label: "Medical Doctor" },
  { value: "NURSE", label: "Nurse" },
  { value: "PHARMACIST", label: "Pharmacist" },
  { value: "LAB_SCIENTIST", label: "Medical Lab Scientist" },
  { value: "DENTIST", label: "Dentist" },
  { value: "OPTOMETRIST", label: "Optometrist" },
  { value: "PHYSIOTHERAPIST", label: "Physiotherapist" },
  { value: "OTHER", label: "Other" },
];

const COUNCILS = [
  { value: "MDCN", label: "Medical & Dental Council" },
  { value: "NMCN", label: "Nursing & Midwifery Council" },
  { value: "PCN", label: "Pharmacists Council" },
  { value: "MLSCN", label: "Med. Lab. Science Council" },
  { value: "RADI", label: "Radiographers Board" },
  { value: "OTHER", label: "Other" },
];

export default function RegisterProvider() {
  const [specialties, setSpecialties] = useState([]); // [{id, name}]
  const [err, setErr] = useState("");
  const [sub, setSub] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/niemr/api/facilities/specialties/", { cache: "no-store" });
        if (res.ok) setSpecialties(await res.json());
      } catch {}
    })();
  }, []);

  function getSelectedOptions(selectEl) {
    return Array.from(selectEl?.selectedOptions || []).map((o) => o.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const f = new FormData(e.currentTarget);

    // required checks (user + licensing)
    const email = (f.get("email") || "").toString().trim();
    const password = (f.get("password") || "").toString();
    const first_name = (f.get("first_name") || "").toString().trim();
    const last_name = (f.get("last_name") || "").toString().trim();
    const provider_type = (f.get("provider_type") || "").toString();
    const license_council = (f.get("license_council") || "").toString();
    const license_number = (f.get("license_number") || "").toString().trim();

    const phone = (f.get("phone") || "").toString().trim();
    if (!email || !password || !first_name || !last_name || !provider_type || !license_council || !license_number) {
      setErr("Fill all required fields (name, email, password, provider type, council, license number).");
      return;
    }
    if (phone && !E164.test(phone)) {
      setErr("Phone must be E.164, e.g. +2348012345678.");
      return;
    }

    // specialties -> submit names
    const selNames = getSelectedOptions(e.currentTarget.querySelector('select[name="specialties_names"]'));
    f.delete("specialties_names");
    selNames.forEach((name) => f.append("specialties", name));

    // Documents: each pair as documents[i].kind + documents[i].file
    const docRows = [
      { kind: (f.get("doc1_kind") || "").toString(), file: f.get("doc1_file") },
      { kind: (f.get("doc2_kind") || "").toString(), file: f.get("doc2_file") },
      { kind: (f.get("doc3_kind") || "").toString(), file: f.get("doc3_file") },
    ];
    f.delete("doc1_kind"); f.delete("doc1_file");
    f.delete("doc2_kind"); f.delete("doc2_file");
    f.delete("doc3_kind"); f.delete("doc3_file");

    let di = 0;
    for (const row of docRows) {
      if (row && row.file && (row.file instanceof File) && row.file.size > 0) {
        f.append(`documents[${di}].kind`, row.kind || "LICENSE");
        f.append(`documents[${di}].file`, row.file);
        di += 1;
      }
    }

    setSub(true);
    try {
      // IMPORTANT: no headers; keep the browser's multipart boundary
      const res = await fetch("/api/niemr/api/providers/self-register/", {
        method: "POST",
        body: f,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.detail || data?.non_field_errors?.[0] || JSON.stringify(data);
        throw new Error(msg || `Failed (${res.status})`);
      }

      window.location.href = "/register/success?role=provider";
    } catch (e2) {
      setErr(e2.message || "Registration failed");
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
            <Stethoscope className="h-6 w-6 text-blue-700" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Create Provider Account
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">For independent practitioners.</p>
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
          <form className="p-6 md:p-8 space-y-8" onSubmit={onSubmit} encType="multipart/form-data" noValidate>
            {/* User (required) */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Account</h2>
                  <p className="text-xs text-slate-500">Basic details to create your account.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First Name">
                  <div className="relative">
                    <Input name="first_name" placeholder="John" required className="pl-10" />
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>

                <Field label="Last Name">
                  <div className="relative">
                    <Input name="last_name" placeholder="Smith" required className="pl-10" />
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <Field label="Email">
                  <div className="relative">
                    <Input name="email" type="email" placeholder="you@provider.com" required className="pl-10" />
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>

                <Field label="Password">
                  <div className="relative">
                    <Input name="password" type="password" placeholder="••••••••" required className="pl-10" />
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>
            </section>

            {/* Licensing (required) */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <BadgeCheck className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Licensing</h2>
                  <p className="text-xs text-slate-500">Your professional credentials.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Provider Type">
                  <div className="relative">
                    <select
                      name="provider_type"
                      required
                      defaultValue="DOCTOR"
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3 pr-8
                                 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    >
                      {PROVIDER_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>
                          {pt.label}
                        </option>
                      ))}
                    </select>
                    <Briefcase className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>

                <Field label="License Council">
                  <div className="relative">
                    <select
                      name="license_council"
                      required
                      defaultValue="MDCN"
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3 pr-8
                                 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    >
                      {COUNCILS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <ShieldCheck className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <Field label="License Number">
                  <Input name="license_number" placeholder="MDCN/123456" required />
                </Field>
                <Field label="License Expiry (optional)">
                  <div className="relative">
                    <Input name="license_expiry" type="date" className="pr-10" />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>
            </section>

            {/* Optional profile fields */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <Stethoscope className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Profile</h2>
                  <p className="text-xs text-slate-500">Experience and rates (optional).</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Years of Experience (optional)">
                  <Input name="years_experience" type="number" min="0" step="1" />
                </Field>
                <Field label="Consultation Fee (optional)">
                  <div className="relative">
                    <Input name="consultation_fee" type="number" min="0" step="0.01" className="pl-10" />
                    <Coins className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>

              <Field label="Bio (optional)">
                <textarea
                  name="bio"
                  className="mt-1 w-full min-h-[100px] rounded-lg border border-slate-200 bg-white/60 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                />
              </Field>
            </section>

            {/* Contact & address (optional) */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <PhoneIcon className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Contact</h2>
                  <p className="text-xs text-slate-500">How patients can reach you (optional).</p>
                </div>
              </div>

              <Field label="Phone (E.164, optional)">
                <div className="relative">
                  <Input name="phone" placeholder="+2348012345678" className="pl-10" />
                  <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </Field>

              <div className="grid sm:grid-cols-3 gap-5 mt-5">
                <Field label="Country">
                  <div className="relative">
                    <Input name="country" placeholder="Nigeria" className="pl-10" />
                    <Globe2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
                <Field label="State">
                  <Input name="state" placeholder="Lagos" />
                </Field>
                <Field label="LGA">
                  <div className="relative">
                    <Input name="lga" placeholder="Ikeja" className="pl-10" />
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              </div>

              <Field label="Address (optional)">
                <textarea
                  name="address"
                  className="mt-1 w-full min-h-[90px] rounded-lg border border-slate-200 bg-white/60 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                />
              </Field>
            </section>

            {/* Specialties => names[] */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <BadgeCheck className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Specialties</h2>
                  <p className="text-xs text-slate-500">Hold Ctrl/Cmd to select multiple.</p>
                </div>
              </div>

              <div className="relative">
                <select
                  name="specialties_names"
                  multiple
                  className="w-full min-h-32 rounded-lg border border-slate-200 bg-white/60 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                >
                  {specialties.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Documents */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                  <FileCheck2 className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Documents</h2>
                  <p className="text-xs text-slate-500">Upload license/ID/certificates (optional).</p>
                </div>
              </div>

              <div className="grid gap-5">
                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Document 1 - Kind">
                    <select name="doc1_kind" className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3">
                      <option value="LICENSE">LICENSE</option>
                      <option value="ID">ID</option>
                      <option value="CERT">CERT</option>
                    </select>
                  </Field>
                  <Field label="File">
                    <input
                      name="doc1_file"
                      type="file"
                      accept=".pdf,image/*"
                      className="block w-full rounded-lg border border-slate-200 bg-white/60 p-2.5
                                 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white
                                 hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    />
                  </Field>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Document 2 - Kind">
                    <select name="doc2_kind" className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3">
                      <option value="LICENSE">LICENSE</option>
                      <option value="ID">ID</option>
                      <option value="CERT">CERT</option>
                    </select>
                  </Field>
                  <Field label="File">
                    <input
                      name="doc2_file"
                      type="file"
                      accept=".pdf,image/*"
                      className="block w-full rounded-lg border border-slate-200 bg-white/60 p-2.5
                                 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white
                                 hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    />
                  </Field>
                </div>

                {/* Row 3 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Document 3 - Kind">
                    <select name="doc3_kind" className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3">
                      <option value="LICENSE">LICENSE</option>
                      <option value="ID">ID</option>
                      <option value="CERT">CERT</option>
                    </select>
                  </Field>
                  <Field label="File">
                    <input
                      name="doc3_file"
                      type="file"
                      accept=".pdf,image/*"
                      className="block w-full rounded-lg border border-slate-200 bg-white/60 p-2.5
                                 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white
                                 hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    />
                  </Field>
                </div>
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
                {sub ? "Creating…" : "Create Provider Account"}
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
          <a href="/register" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
