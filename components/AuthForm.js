"use client";
import { useState } from "react";

export default function AuthForm({ role = "hospital" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const roleLabel =
    role === "hospital" ? "Hospital / Facility" :
    role === "provider" ? "Independent Provider" : "Patient";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError("Email and password are required.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email.");

    try {
      setSubmitting(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ role, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Login failed");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err?.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border shadow-sm bg-white">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
          <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold">NIEMR Login</div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{roleLabel}</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to continue.</p>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200"
            placeholder="you@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="mt-1 relative">
              <input
                type={show ? "text" : "password"}
                className="w-full rounded-xl border px-3 py-2 pr-12 outline-none focus:ring-2 ring-blue-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700 hover:underline"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="mt-6 w-full btn btn-primary disabled:opacity-60">
            {submitting ? "Signing in…" : "Sign In"}
          </button>

          <div className="mt-4 text-xs text-slate-500">
            By continuing you agree to our Terms and Privacy Policy.
          </div>
        </form>
      </div>

      <div className="mt-6 text-center text-sm">
        <a href="/login" className="text-blue-700 hover:underline">Switch role</a>
        <span className="mx-2 text-slate-400">•</span>
        <a href="/register" className="text-blue-700 hover:underline">Create account</a>
      </div>
    </div>
  );
}
