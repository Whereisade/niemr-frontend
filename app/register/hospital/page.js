"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const USER_REGISTER = "api/accounts/register/";
const FACILITY_CREATE = "api/facilities/";

export default function HospitalRegisterPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  // Match FacilityCreateSerializer fields in your backend
  const [facility, setFacility] = useState({
    facility_type: "HOSPITAL",       // e.g., HOSPITAL | CLINIC | LAB | ...
    name: "",
    controlled_by: "Private",        // e.g., Private | Govt | Mission
    country: "",
    state: "",
    lga: "",                         // use LGA (not city)
    address: "",
    email: "",
    registration_number: "",
    phone: "",
    nhis_approved: false,
    nhis_number: "",
    total_bed_capacity: "",          // number
    specialties: "",                 // comma-separated input → array on submit
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onAdmin = (e) => setAdmin((a) => ({ ...a, [e.target.name]: e.target.value }));
  const onFacility = (e) => {
    const { name, type, checked, value } = e.target;
    setFacility((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // Step A: Register admin user
      const userRes = await fetch(`/api/niemr/${USER_REGISTER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: admin.email,
          password: admin.password,
          first_name: admin.first_name,
          last_name: admin.last_name,
        }),
      });

      if (!userRes.ok) {
        const t = await userRes.text();
        try {
          const j = JSON.parse(t);
          throw new Error(
            j.detail ||
            Object.entries(j).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n") ||
            "Admin registration failed"
          );
        } catch {
          throw new Error(t || "Admin registration failed");
        }
      }

      // Step B: Login (sets httpOnly cookies)
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: admin.email, password: admin.password }),
      });
      if (!loginRes.ok) {
        const t = await loginRes.text();
        throw new Error(t || "Auto-login failed after admin registration");
      }

      // Step C: Create Facility (authorized by cookie)
      const specialtiesArr = facility.specialties
        ? facility.specialties.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const facPayload = {
        facility_type: facility.facility_type || "HOSPITAL",
        name: facility.name,
        controlled_by: facility.controlled_by || "Private",
        country: facility.country,
        state: facility.state,
        lga: facility.lga,
        address: facility.address,
        email: facility.email,
        registration_number: facility.registration_number,
        phone: facility.phone,
        nhis_approved: !!facility.nhis_approved,
        nhis_number: facility.nhis_number || null,
        total_bed_capacity: facility.total_bed_capacity ? Number(facility.total_bed_capacity) : null,
        specialties: specialtiesArr,
      };

      const facRes = await fetch(`/api/niemr/${FACILITY_CREATE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(facPayload),
      });

      if (!facRes.ok) {
        const t = await facRes.text();
        try {
          const j = JSON.parse(t);
          throw new Error(
            j.detail ||
            Object.entries(j).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n") ||
            "Facility creation failed"
          );
        } catch {
          throw new Error(t || "Facility creation failed");
        }
      }

      router.push("/login/hospital?registered=1");
    } catch (e2) {
      setErr(e2.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold">Register a Hospital / Facility</h1>
        <p className="text-slate-600 mt-2">Step 1: Admin • Step 2: Facility (auto-login in between)</p>

        <form onSubmit={submit} className="mt-8 grid gap-6">
          {/* Admin Section */}
          <div className="rounded-2xl border p-5">
            <h2 className="font-semibold mb-3">Admin User</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm">First Name *</span>
                <input name="first_name" required value={admin.first_name} onChange={onAdmin}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm">Last Name *</span>
                <input name="last_name" required value={admin.last_name} onChange={onAdmin}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm">Email *</span>
                <input type="email" name="email" required value={admin.email} onChange={onAdmin}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm">Password *</span>
                <input type="password" name="password" required value={admin.password} onChange={onAdmin}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
            </div>
          </div>

          {/* Facility Section */}
          <div className="rounded-2xl border p-5">
            <h2 className="font-semibold mb-3">Facility Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm">Facility Type *</span>
                <select name="facility_type" value={facility.facility_type} onChange={onFacility}
                        className="mt-1 w-full rounded-xl border px-3 py-2">
                  <option value="HOSPITAL">HOSPITAL</option>
                  <option value="CLINIC">CLINIC</option>
                  <option value="LAB">LAB</option>
                  <option value="IMAGING_CENTER">IMAGING_CENTER</option>
                  <option value="PHARMACY">PHARMACY</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm">Controlled By *</span>
                <select name="controlled_by" value={facility.controlled_by} onChange={onFacility}
                        className="mt-1 w-full rounded-xl border px-3 py-2">
                  <option>Private</option>
                  <option>Government</option>
                  <option>Mission</option>
                  <option>NGO</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm">Name *</span>
                <input name="name" required value={facility.name} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-sm">Registration Number</span>
                <input name="registration_number" value={facility.registration_number} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-sm">Email</span>
                <input type="email" name="email" value={facility.email} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-sm">Phone</span>
                <input name="phone" value={facility.phone} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-sm">Country *</span>
                <input name="country" required value={facility.country} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-sm">State *</span>
                <input name="state" required value={facility.state} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-sm">LGA *</span>
                <input name="lga" required value={facility.lga} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm">Address *</span>
                <input name="address" required value={facility.address} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="nhis_approved" checked={facility.nhis_approved} onChange={onFacility} />
                <span className="text-sm">NHIS Approved</span>
              </label>

              <label className="block">
                <span className="text-sm">NHIS Number</span>
                <input name="nhis_number" value={facility.nhis_number} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-sm">Total Bed Capacity</span>
                <input type="number" name="total_bed_capacity" value={facility.total_bed_capacity} onChange={onFacility}
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm">Specialties (comma-separated)</span>
                <input name="specialties" value={facility.specialties} onChange={onFacility}
                       placeholder="Cardiology, General Surgery"
                       className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
            </div>
          </div>

          {err && <p className="text-red-600 text-sm">{err}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
                    className="rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 disabled:opacity-60">
              {loading ? "Creating..." : "Create Admin & Facility"}
            </button>
            <Link href="/login/hospital" className="px-4 py-3 border rounded-xl">Back to Login</Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
