"use client";

import { useEffect, useMemo, useState } from "react";
import { Field, Input } from "@/components/forms/Field";

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
  { value: "PCN",  label: "Pharmacists Council" },
  { value: "MLSCN",label: "Med. Lab. Science Council" },
  { value: "RADI", label: "Radiographers Board" },
  { value: "OTHER",label: "Other" },
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
    const last_name  = (f.get("last_name") || "").toString().trim();
    const provider_type = (f.get("provider_type") || "").toString();
    const license_council = (f.get("license_council") || "").toString();
    const license_number  = (f.get("license_number") || "").toString().trim();

    const phone = (f.get("phone") || "").toString().trim();
    if (!email || !password || !first_name || !last_name || !provider_type || !license_council || !license_number) {
      setErr("Fill all required fields (name, email, password, provider type, council, license number).");
      return;
    }
    if (phone && !E164.test(phone)) {
      setErr("Phone must be E.164, e.g. +2348012345678.");
      return;
    }

    // specialties -> submit names (or IDs)
    // Multi-select is rendered with name="specialties_names"
    const selNames = getSelectedOptions(e.currentTarget.querySelector('select[name="specialties_names"]'));
    f.delete("specialties_names");
    // If your serializer expects NAMES:
    selNames.forEach((name) => f.append("specialties", name));
    // If your serializer expects IDs instead, use a select of ids and:
    // selIds.forEach((id) => f.append("specialties", id));

    // Documents: each pair as documents[i].kind + documents[i].file
    // (Only append if a file is chosen)
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
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900">Create Provider Account</h1>
        <p className="mt-2 text-slate-700">For independent practitioners.</p>

        <div className="card mt-8">
          <form className="card-pad space-y-5" onSubmit={onSubmit} encType="multipart/form-data">
            {err && (
              <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            )}

            {/* User (required) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First Name"><Input name="first_name" placeholder="John" required /></Field>
              <Field label="Last Name"><Input name="last_name" placeholder="Smith" required /></Field>
            </div>
            <Field label="Email"><Input name="email" type="email" placeholder="you@provider.com" required /></Field>
            <Field label="Password"><Input name="password" type="password" placeholder="••••••••" required /></Field>

            {/* Licensing (required) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Provider Type">
                <select
                  name="provider_type"
                  required
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
                  defaultValue="DOCTOR"
                >
                  {PROVIDER_TYPES.map((pt) => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
                </select>
              </Field>
              <Field label="License Council">
                <select
                  name="license_council"
                  required
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
                  defaultValue="MDCN"
                >
                  {COUNCILS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>
            </div>
            <Field label="License Number"><Input name="license_number" placeholder="MDCN/123456" required /></Field>

            {/* Optional profile fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="License Expiry (optional)"><Input name="license_expiry" type="date" /></Field>
              <Field label="Years of Experience (optional)"><Input name="years_experience" type="number" min="0" step="1" /></Field>
            </div>
            <Field label="Consultation Fee (optional)"><Input name="consultation_fee" type="number" min="0" step="0.01" /></Field>
            <Field label="Bio (optional)">
              <textarea name="bio" className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200 min-h-[90px]" />
            </Field>

            {/* Contact & address (optional) */}
            <Field label="Phone (E.164, optional)"><Input name="phone" placeholder="+2348012345678" /></Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Country"><Input name="country" placeholder="Nigeria" /></Field>
              <Field label="State"><Input name="state" placeholder="Lagos" /></Field>
              <Field label="LGA"><Input name="lga" placeholder="Ikeja" /></Field>
            </div>
            <Field label="Address (optional)">
              <textarea name="address" className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200 min-h-[70px]" />
            </Field>

            {/* Specialties => names[] */}
            <Field label="Specialties (hold Ctrl/Cmd to multi-select)">
              <select
                name="specialties_names"
                multiple
                className="mt-1 h-32 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
              >
                {specialties.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </Field>

            {/* Documents (ProviderDocument: kind + file) */}
            <div className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Document 1 - Kind">
                  <select name="doc1_kind" className="mt-1 w-full rounded-xl border px-3 py-2">
                    <option value="LICENSE">LICENSE</option>
                    <option value="ID">ID</option>
                    <option value="CERT">CERT</option>
                  </select>
                </Field>
                <Field label="File">
                  <input name="doc1_file" type="file" accept=".pdf,image/*" className="mt-1 w-full rounded-xl border px-3 py-2" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Document 2 - Kind">
                  <select name="doc2_kind" className="mt-1 w-full rounded-xl border px-3 py-2">
                    <option value="LICENSE">LICENSE</option>
                    <option value="ID">ID</option>
                    <option value="CERT">CERT</option>
                  </select>
                </Field>
                <Field label="File">
                  <input name="doc2_file" type="file" accept=".pdf,image/*" className="mt-1 w-full rounded-xl border px-3 py-2" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Document 3 - Kind">
                  <select name="doc3_kind" className="mt-1 w-full rounded-xl border px-3 py-2">
                    <option value="LICENSE">LICENSE</option>
                    <option value="ID">ID</option>
                    <option value="CERT">CERT</option>
                  </select>
                </Field>
                <Field label="File">
                  <input name="doc3_file" type="file" accept=".pdf,image/*" className="mt-1 w-full rounded-xl border px-3 py-2" />
                </Field>
              </div>
            </div>

            <button type="submit" disabled={sub} className="mt-6 w-full btn btn-primary disabled:opacity-60">
              {sub ? "Creating…" : "Create Provider Account"}
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
