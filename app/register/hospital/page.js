"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  UserCog,
  Mail,
  Phone,
  ShieldCheck,
  BedDouble,
  ClipboardList,
  Hash,
  Globe2,
  MapPin,
  FileCheck2,
  Stethoscope,
  Layers,
  ChevronLeft,
} from "lucide-react";

export default function HospitalRegisterPage() {
  const [specialties, setSpecialties] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/niemr/api/facilities/specialties/", { cache: "no-store" });
        if (res.ok) setSpecialties(await res.json());
      } catch {
        /* ignore */
      }
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget); // includes files
      const res = await fetch("/api/niemr/api/facilities/register-admin/", {
        method: "POST",
        body: fd, // keep browser's multipart boundary
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

      setSuccess(`✅ ${data?.facility?.name || "Facility"} registered successfully!`);
      e.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        {/* Header */}
        <header className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/10 grid place-items-center shrink-0">
            <Building2 className="h-6 w-6 text-blue-700" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
              Register Hospital / Facility
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Create an organization space with a Super Admin and facility details.
            </p>
          </div>
          <a
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </a>
        </header>

        {/* Alerts */}
        <div className="mt-6 space-y-3">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          encType="multipart/form-data"
          className="mt-6 space-y-8"
          noValidate
        >
          {/* Super Admin */}
          <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                <UserCog className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">Super Admin</h2>
                <p className="text-xs text-slate-500">
                  Primary administrator for this facility.
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="admin_email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="admin_email"
                    name="admin_email"
                    type="email"
                    required
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 pl-10 pr-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    placeholder="admin@facility.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin_password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="admin_password"
                  name="admin_password"
                  type="password"
                  required
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="admin_first_name" className="block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  id="admin_first_name"
                  name="admin_first_name"
                  required
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  placeholder="Ada"
                />
              </div>

              <div>
                <label htmlFor="admin_last_name" className="block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  id="admin_last_name"
                  name="admin_last_name"
                  required
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  placeholder="Okonkwo"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="admin_phone" className="block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="admin_phone"
                    name="admin_phone"
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 pl-10 pr-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    placeholder="+2348012345678"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Facility */}
          <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                <ClipboardList className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">Facility Details</h2>
                <p className="text-xs text-slate-500">
                  Core information about the healthcare facility.
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Facility Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  placeholder="e.g. Sunrise Specialist Hospital"
                />
              </div>

              <div>
                <label htmlFor="facility_type" className="block text-sm font-medium text-slate-700">
                  Facility Type
                </label>
                <div className="relative mt-1.5">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    id="facility_type"
                    name="facility_type"
                    defaultValue="HOSPITAL"
                    className="w-full h-11 appearance-none rounded-lg border border-slate-200 bg-white/60 pl-10 pr-8
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  >
                    <option value="HOSPITAL">Hospital</option>
                    <option value="CLINIC">Clinic</option>
                    <option value="EYE_CLINIC">Eye Clinic</option>
                    <option value="DENTAL_CLINIC">Dental Clinic</option>
                    <option value="IMAGING_CENTER">Imaging & Diagnostic Center</option>
                    <option value="LABORATORY">Laboratory</option>
                    <option value="SOLO_PRACTICE">Solo Practice</option>
                    <option value="AMBULATORY_CENTER">Ambulatory Center</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="controlled_by" className="block text-sm font-medium text-slate-700">
                  Controlled By
                </label>
                <select
                  id="controlled_by"
                  name="controlled_by"
                  defaultValue="private"
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                >
                  <option value="private">Private</option>
                  <option value="federal">Federal</option>
                  <option value="state">State</option>
                  <option value="church">Church</option>
                  <option value="ngo">NGO</option>
                </select>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-700">
                  Country
                </label>
                <div className="relative mt-1.5">
                  <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    id="country"
                    name="country"
                    required
                    defaultValue="nigeria"
                    className="w-full h-11 appearance-none rounded-lg border border-slate-200 bg-white/60 pl-10 pr-8
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  >
                    <option value="nigeria">Nigeria</option>
                    <option value="ghana">Ghana</option>
                    <option value="kenya">Kenya</option>
                    <option value="south_africa">South Africa</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-slate-700">
                  State / Region
                </label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="state"
                    name="state"
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 pl-10 pr-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    placeholder="e.g. Lagos"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lga" className="block text-sm font-medium text-slate-700">
                  LGA
                </label>
                <input
                  id="lga"
                  name="lga"
                  required
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  placeholder="Street, number, area"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Facility Email
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 pl-10 pr-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    placeholder="contact@facility.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Facility Phone (E.164)
                </label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="phone"
                    name="phone"
                    required
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 pl-10 pr-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                    placeholder="+2348012345678"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="registration_number" className="block text-sm font-medium text-slate-700">
                  Registration Number
                </label>
                <div className="relative mt-1.5">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="registration_number"
                    name="registration_number"
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 pl-10 pr-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="total_bed_capacity" className="block text-sm font-medium text-slate-700">
                  Total Bed Capacity
                </label>
                <div className="relative mt-1.5">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="total_bed_capacity"
                    name="total_bed_capacity"
                    type="number"
                    min="0"
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/60 pl-10 pr-3
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="specialties" className="block text-sm font-medium text-slate-700">
                  Specialties (multi)
                </label>
                <div className="relative mt-1.5">
                  <Stethoscope className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <select
                    id="specialties"
                    name="specialties"
                    multiple
                    className="w-full min-h-32 rounded-lg border border-slate-200 bg-white/60 pl-10 pr-3 py-2
                               focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                  >
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-xs text-slate-500">Hold Ctrl/Cmd to select multiple.</p>
              </div>

              <div>
                <label htmlFor="nhis_approved" className="block text-sm font-medium text-slate-700">
                  NHIS Approved?
                </label>
                <select
                  id="nhis_approved"
                  name="nhis_approved"
                  defaultValue="false"
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div>
                <label htmlFor="nhis_number" className="block text-sm font-medium text-slate-700">
                  NHIS Number
                </label>
                <input
                  id="nhis_number"
                  name="nhis_number"
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 bg-white/60 px-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                />
              </div>

              {/* Uploads */}
              <div className="md:col-span-2">
                <label htmlFor="nhis_certificate" className="block text-sm font-medium text-slate-700">
                  NHIS Certificate (PDF/JPG/PNG)
                </label>
                <input
                  id="nhis_certificate"
                  name="nhis_certificate"
                  type="file"
                  accept=".pdf,image/*"
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white/60 p-2.5
                             file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white
                             hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="md_practice_license" className="block text-sm font-medium text-slate-700">
                  MD Practice License (PDF/JPG/PNG)
                </label>
                <input
                  id="md_practice_license"
                  name="md_practice_license"
                  type="file"
                  accept=".pdf,image/*"
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white/60 p-2.5
                             file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white
                             hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="state_registration_cert" className="block text-sm font-medium text-slate-700">
                  State Registration Certificate (PDF/JPG/PNG)
                </label>
                <input
                  id="state_registration_cert"
                  name="state_registration_cert"
                  type="file"
                  accept=".pdf,image/*"
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white/60 p-2.5
                             file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white
                             hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/40"
                />
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
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-white
                         hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Registering..." : "Register Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
