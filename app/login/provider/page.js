"use client";

import AuthForm from "@/components/AuthForm";
import {
  Stethoscope,
  FileText,
  Pill,
  ClipboardCheck,
  ShieldCheck,
  Workflow,
  ArrowLeft,
} from "lucide-react";

export default function ProviderLoginPage() {
  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid md:grid-cols-2 items-start gap-10">
        {/* Left: Overview */}
        <section>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
            <Stethoscope className="h-3.5 w-3.5" />
            NIEMR
          </div>

          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Independent Provider Sign In
          </h2>

          <p className="mt-2 text-slate-700">
            Manage consults, e-prescriptions, and secure patient records in one workspace.
          </p>

          <ul className="mt-5 space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-blue-700" />
              <span>Visit notes with versioning and audit trails</span>
            </li>
            <li className="flex items-start gap-3">
              <Pill className="mt-0.5 h-4 w-4 text-violet-700" />
              <span>Quick orders &amp; e-prescriptions (e-Rx)</span>
            </li>
            <li className="flex items-start gap-3">
              <ClipboardCheck className="mt-0.5 h-4 w-4 text-emerald-700" />
              <span>Document upload and patient history review</span>
            </li>
          </ul>

          {/* Feature chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              <Workflow className="h-3.5 w-3.5 text-blue-700" />
              Smart Workflow
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              <Stethoscope className="h-3.5 w-3.5 text-emerald-700" />
              Consults
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              <Pill className="h-3.5 w-3.5 text-violet-700" />
              e-Rx
            </span>
          </div>

          <div className="mt-8">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              All login options
            </a>
          </div>
        </section>

        {/* Right: Auth panel */}
        <section className="md:pl-6">
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 md:p-8">
            <AuthForm role="provider" />

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Your data is encrypted and securely managed under NIEMR’s privacy policy.
            </div>
          </div>

          <div className="mt-6 text-sm">
            <a href="/register/provider" className="text-blue-700 hover:underline">
              New provider? Create your account
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
