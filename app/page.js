export default function Home() {
  return (
    <div className="bg-niemr">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="h1">Fast, secure EMR for Hospitals, Providers & Patients</h1>
          <p className="mt-4 text-lg muted">
            Mobile-first and offline-aware so care never stops. Consults, labs, imaging, pharmacy,
            billing and notifications—unified and auditable.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="/register" className="btn btn-primary">Get Started</a>
            <a href="/login" className="btn btn-outline">Login</a>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Three login paths: Hospital/Facility • Independent Provider • Patient
          </p>
        </div>

        <div className="card">
          <div className="card-pad">
            <ul className="space-y-3 text-slate-700">
              <li>• Role-based access (Admin, Doctor, Nurse, Lab, Pharmacy)</li>
              <li>• Patient self-registration & dependents</li>
              <li>• Orders → Labs/Imaging → Results with flags</li>
              <li>• Pharmacy inventory, dispensing & CSV uploads</li>
              <li>• Offline-first with auto sync</li>
              <li>• Notifications & reminders</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <h2 className="h2">What you can do on NIEMR</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Hospital Console", desc: "Manage users, wards, schedules, appointments & reports." },
            { title: "Provider Workspace", desc: "Solo practice: notes, orders, e-Rx and documents." },
            { title: "Patient Portal", desc: "Register, manage dependents, view results & book visits." },
            { title: "Labs & Imaging", desc: "Order, capture results, auto-flag abnormal findings." },
            { title: "Pharmacy", desc: "Stock, dispensing, CSV imports & price catalogs." },
            { title: "Notifications", desc: "Real-time alerts for results, meds & critical events." },
          ].map((s) => (
            <div key={s.title} className="card">
              <div className="card-pad">
                <div className="text-blue-700 font-semibold">{s.title}</div>
                <p className="mt-2 text-sm text-slate-700">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
