"use client";
import { useState } from "react";
import { Field, Input } from "@/components/forms/Field";

const e164 = /^\+\d{1,3}\d{6,14}$/; // e.g. +2348012345678

export default function RegisterProvider() {
  const [form, setForm] = useState({
    // user fields (your API typically needs these for account creation)
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",

    // ProviderProfile core (model-backed)
    license_number: "",                 // REQUIRED
    license_council: "",                // optional (default MDCN server-side)
    provider_type: "",                  // optional (default DOCTOR server-side)
    license_expiry: "",                 // optional (yyyy-mm-dd)

    years_experience: "",               // optional (number)
    bio: "",                            // optional

    // Contact & address (optional)
    phone: "",
    country: "",
    state: "",
    lga: "",
    address: "",

    // Business (optional)
    consultation_fee: "",               // optional (decimal)

    // Specialties (optional): comma-separated IDs -> [1,2,3]
    specialties: "",
  });

  const [err, setErr] = useState("");
  const [sub, setSub] = useState(false);
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  function buildPayload() {
    // Required checks
    if (!form.email || !form.password || !form.password2 || !form.first_name || !form.last_name) {
      throw new Error("Please fill first name, last name, email, password and confirm password.");
    }
    if (form.password !== form.password2) {
      throw new Error("Passwords do not match.");
    }
    if (!form.license_number) {
      throw new Error("License number is required.");
    }
    if (form.phone && !e164.test(form.phone)) {
      throw new Error("Phone must be E.164 (e.g. +2348012345678).");
    }

    // Map specialties "1,2,3" -> [1,2,3]
    let specialties = undefined;
    if (form.specialties.trim()) {
      specialties = form.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s))
        .filter((n) => !Number.isNaN(n));
      if (!specialties.length) specialties = undefined;
    }

    // numeric coercions
    const years_experience =
      form.years_experience !== "" ? Math.max(0, parseInt(form.years_experience, 10) || 0) : undefined;
    const consultation_fee =
      form.consultation_fee !== "" ? Number(form.consultation_fee) : undefined;

    // Only send fields the API may use; omit empty values
    const payload = {
      role: "provider",

      // user profile
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
      password2: form.password2,

      // ProviderProfile core
      license_number: form.license_number,
      ...(form.license_council ? { license_council: form.license_council } : {}),
      ...(form.provider_type ? { provider_type: form.provider_type } : {}),
      ...(form.license_expiry ? { license_expiry: form.license_expiry } : {}),

      ...(years_experience !== undefined ? { years_experience } : {}),
      ...(form.bio ? { bio: form.bio } : {}),

      // contact/address
      ...(form.phone ? { phone: form.phone } : {}),
      ...(form.country ? { country: form.country } : {}),
      ...(form.state ? { state: form.state } : {}),
      ...(form.lga ? { lga: form.lga } : {}),
      ...(form.address ? { address: form.address } : {}),

      // business
      ...(consultation_fee !== undefined ? { consultation_fee } : {}),

      // many-to-many
      ...(specialties ? { specialties } : {}),
    };

    return payload;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const payload = buildPayload();
      setSub(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Registration failed");
      window.location.href = "/register/success?role=provider";
    } catch (e) {
      setErr(e.message || "Unable to register");
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
          <form className="card-pad" onSubmit={onSubmit}>
            {err && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            )}

            {/* Basic user info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">First Name</label>
                <Input placeholder="John" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                <Input placeholder="Smith" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
              </div>
            </div>

            <Field label="Email">
              <Input type="email" placeholder="you@provider.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>

            {/* Identity & licensing */}
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">License Number (required)</label>
                <Input placeholder="MDCN/123456" value={form.license_number} onChange={(e) => set("license_number", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">License Council (optional)</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
                  value={form.license_council}
                  onChange={(e) => set("license_council", e.target.value)}
                >
                  <option value="">Default (MDCN)</option>
                  <option value="MDCN">MDCN (Medical & Dental)</option>
                  <option value="NMCN">NMCN (Nursing & Midwifery)</option>
                  <option value="PCN">PCN (Pharmacists Council)</option>
                  <option value="MLSCN">MLSCN (Med. Lab. Science)</option>
                  <option value="RAD">RAD (Radiographers)</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Provider Type (optional)</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
                  value={form.provider_type}
                  onChange={(e) => set("provider_type", e.target.value)}
                >
                  <option value="">Default (Doctor)</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="DENTIST">Dentist</option>
                  <option value="LAB_SCIENTIST">Lab Scientist</option>
                  <option value="RADIOGRAPHER">Radiographer</option>
                  {/* add others if your enums include them */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">License Expiry (optional)</label>
                <Input type="date" value={form.license_expiry} onChange={(e) => set("license_expiry", e.target.value)} />
              </div>
            </div>

            {/* Experience / bio */}
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Years of Experience (optional)</label>
                <Input type="number" min="0" step="1" placeholder="0" value={form.years_experience} onChange={(e) => set("years_experience", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Consultation Fee (optional)</label>
                <Input type="number" min="0" step="0.01" placeholder="0.00" value={form.consultation_fee} onChange={(e) => set("consultation_fee", e.target.value)} />
              </div>
            </div>

            <Field label="Bio (optional)">
              <textarea
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200 min-h-[90px]"
                placeholder="Short professional summary…"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
              />
            </Field>

            {/* Contact & address */}
            <Field label="Phone (optional, E.164)">
              <Input placeholder="+2348012345678" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>

            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Country</label>
                <Input placeholder="Nigeria" value={form.country} onChange={(e) => set("country", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">State</label>
                <Input placeholder="Lagos" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">LGA</label>
                <Input placeholder="Ikeja" value={form.lga} onChange={(e) => set("lga", e.target.value)} />
              </div>
            </div>

            <Field label="Address (optional)">
              <textarea
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200 min-h-[70px]"
                placeholder="Street, area, nearest landmark…"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>

            {/* Specialties */}
            <Field label="Specialty IDs (optional, comma separated)">
              <Input
                placeholder="e.g. 1,2,7"
                value={form.specialties}
                onChange={(e) => set("specialties", e.target.value)}
              />
            </Field>

            {/* Passwords */}
            <Field label="Password">
              <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => set("password", e.target.value)} />
            </Field>
            <Field label="Confirm Password">
              <Input type="password" placeholder="••••••••" value={form.password2} onChange={(e) => set("password2", e.target.value)} />
            </Field>

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
