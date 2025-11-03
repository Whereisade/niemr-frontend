"use client";

import { useEffect, useState } from "react";

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
      } catch { /* ignore */ }
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget); // includes files

      // IMPORTANT: no manual headers; keep the browser's multipart boundary
      const res = await fetch("/api/niemr/api/facilities/register-admin/", {
        method: "POST",
        body: fd,
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Register Hospital / Facility</h1>

      {error && <div className="p-3 mb-4 rounded bg-red-50 text-red-700">{error}</div>}
      {success && <div className="p-3 mb-4 rounded bg-green-50 text-green-700">{success}</div>}

      {/* encType helps if the form is ever posted without JS; harmless otherwise */}
      <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-8">

        {/* Super Admin */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="md:col-span-2 font-semibold text-lg text-gray-700">Super Admin</h2>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input name="admin_email" type="email" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input name="admin_password" type="password" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input name="admin_first_name" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input name="admin_last_name" required className="w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Phone</label>
            <input name="admin_phone" className="w-full border rounded p-2" placeholder="+2348012345678" />
          </div>
        </section>

        {/* Facility */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="md:col-span-2 font-semibold text-lg text-gray-700">Facility</h2>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Facility Name</label>
            <input name="name" required className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm mb-1">Facility Type</label>
            <select name="facility_type" className="w-full border rounded p-2" defaultValue="HOSPITAL">
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

          <div>
            <label className="block text-sm mb-1">Controlled By</label>
            <select name="controlled_by" className="w-full border rounded p-2" defaultValue="private">
              <option value="private">Private</option>
              <option value="federal">Federal</option>
              <option value="state">State</option>
              <option value="church">Church</option>
              <option value="ngo">NGO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Country</label>
            <select name="country" required className="w-full border rounded p-2" defaultValue="nigeria">
              <option value="nigeria">Nigeria</option>
              <option value="ghana">Ghana</option>
              <option value="kenya">Kenya</option>
              <option value="south_africa">South Africa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">State / Region</label>
            <input name="state" className="w-full border rounded p-2" placeholder="e.g. Lagos" />
          </div>

          <div>
            <label className="block text-sm mb-1">LGA</label>
            <input name="lga" required className="w-full border rounded p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Address</label>
            <textarea name="address" rows="2" className="w-full border rounded p-2"></textarea>
          </div>

          <div>
            <label className="block text-sm mb-1">Facility Email</label>
            <input name="email" type="email" required className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm mb-1">Facility Phone (E.164)</label>
            <input name="phone" required className="w-full border rounded p-2" placeholder="+2348012345678" />
          </div>

          <div>
            <label className="block text-sm mb-1">Registration Number</label>
            <input name="registration_number" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm mb-1">Total Bed Capacity</label>
            <input name="total_bed_capacity" type="number" min="0" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm mb-1">Specialties (multi)</label>
            <select name="specialties" multiple className="w-full border rounded p-2 h-32">
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to multi-select.</p>
          </div>

          <div>
            <label className="block text-sm mb-1">NHIS Approved?</label>
            <select name="nhis_approved" className="w-full border rounded p-2" defaultValue="false">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">NHIS Number</label>
            <input name="nhis_number" className="w-full border rounded p-2" />
          </div>

          {/* Uploads */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">NHIS Certificate (PDF/JPG/PNG)</label>
            <input name="nhis_certificate" type="file" accept=".pdf,image/*" className="w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">MD Practice License (PDF/JPG/PNG)</label>
            <input name="md_practice_license" type="file" accept=".pdf,image/*" className="w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">State Registration Certificate (PDF/JPG/PNG)</label>
            <input name="state_registration_cert" type="file" accept=".pdf,image/*" className="w-full border rounded p-2" />
          </div>
        </section>

        <button
          disabled={submitting}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Registering..." : "Register Facility"}
        </button>
      </form>
    </div>
  );
}
