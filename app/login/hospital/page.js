'use client'

import AuthForm from "@/components/AuthForm";

export default function HospitalLoginPage() {
  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16 grid md:grid-cols-2 items-center gap-10">
        <div>
          <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold">NIEMR</div>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Hospital / Facility Sign In</h2>
          <p className="mt-2 text-slate-700">Centralized tools for appointments, orders, results & dispensing.</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Role-based access</li><li>• Orders → Labs/Imaging → Results</li><li>• Pharmacy inventory</li>
          </ul>
        </div>
        <AuthForm role="hospital" />
      </div>
    </div>
  );
}

