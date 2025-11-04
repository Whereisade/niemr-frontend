"use client";
import { Hospital, Stethoscope, UserPlus, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Header */}
        <header className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/10 grid place-items-center shrink-0">
            <Sparkles className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Create your NIEMR account
            </h1>
            {/* <p className="mt-1.5 text-sm text-slate-600">
              We’ll build the actual registration flow (role-aware) in the next step.
            </p> */}
          </div>
          <a
            href="/"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </header>

        {/* Role options */}
        <section className="mt-8">
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Hospital / Facility */}
                <a
                  href="/register/hospital"
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all
                             hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  aria-label="Register a Hospital or Facility"
                >
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-50 opacity-60 group-hover:opacity-80" />
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
                      <Hospital className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-medium">Hospital / Facility</div>
                      <p className="text-xs text-slate-500">
                        Set up an organization space for teams and locations.
                      </p>
                    </div>
                  </div>
                </a>

                {/* Independent Provider */}
                <a
                  href="/register/provider"
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all
                             hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  aria-label="Register as an Independent Provider"
                >
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-50 opacity-60 group-hover:opacity-80" />
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600/10">
                      <Stethoscope className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="font-medium">Independent Provider</div>
                      <p className="text-xs text-slate-500">
                        Solo clinicians, therapists, and allied health.
                      </p>
                    </div>
                  </div>
                </a>

                {/* Patient */}
                <a
                  href="/register/patient"
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all
                             hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  aria-label="Register as a Patient"
                >
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-50 opacity-60 group-hover:opacity-80" />
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600/10">
                      <UserPlus className="h-5 w-5 text-violet-700" />
                    </div>
                    <div>
                      <div className="font-medium">Patient</div>
                      <p className="text-xs text-slate-500">
                        Manage your profile, records, and appointments.
                      </p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Trust bar */}
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Your data is protected. NIEMR follows industry-standard security practices.
              </div>
            </div>
          </div>
        </section>

        {/* Back (mobile) */}
        <div className="mt-6 sm:hidden">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
