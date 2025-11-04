"use client";
import { Building2, Stethoscope, UserRound, LogIn, ArrowLeft } from "lucide-react";

export default function LoginChooser() {
  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Header */}
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
              Choose your login type
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Log in as a <span className="text-blue-700 font-medium">Hospital/Facility</span>,{" "}
              <span className="text-blue-700 font-medium">Independent Provider</span>, or{" "}
              <span className="text-blue-700 font-medium">Patient</span>.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </header>

        {/* Login Type Cards */}
        <section className="mt-10">
          <div className="grid gap-5 sm:grid-cols-3">
            {/* Hospital */}
            <a
              href="/login/hospital"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white 
                         shadow-sm p-6 transition-all hover:-translate-y-1 hover:shadow-md focus:ring-2 focus:ring-blue-600/30"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-50 opacity-60 group-hover:opacity-90 transition" />
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600/10">
                  <Building2 className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-lg">Hospital / Facility</h2>
                  <p className="text-xs text-slate-500">
                    Admins, doctors, nurses, labs, and pharmacy teams.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-blue-700 font-medium">
                <LogIn className="h-4 w-4" />
                Login as Hospital
              </div>
            </a>

            {/* Provider */}
            <a
              href="/login/provider"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white 
                         shadow-sm p-6 transition-all hover:-translate-y-1 hover:shadow-md focus:ring-2 focus:ring-blue-600/30"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-50 opacity-60 group-hover:opacity-90 transition" />
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600/10">
                  <Stethoscope className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-lg">Independent Provider</h2>
                  <p className="text-xs text-slate-500">
                    For solo practitioners, therapists, and allied health professionals.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 font-medium">
                <LogIn className="h-4 w-4" />
                Login as Provider
              </div>
            </a>

            {/* Patient */}
            <a
              href="/login/patient"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white 
                         shadow-sm p-6 transition-all hover:-translate-y-1 hover:shadow-md focus:ring-2 focus:ring-blue-600/30"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-50 opacity-60 group-hover:opacity-90 transition" />
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-600/10">
                  <UserRound className="h-6 w-6 text-violet-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-lg">Patient</h2>
                  <p className="text-xs text-slate-500">
                    Access your personal records or those of your dependents.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-violet-700 font-medium">
                <LogIn className="h-4 w-4" />
                Login as Patient
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
