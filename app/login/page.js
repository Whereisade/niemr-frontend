export default function LoginChooser() {
  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="h2">Choose your login type</h1>
        <p className="mt-2 muted">Hospital/Facility, Independent Provider, or Patient.</p>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <a href="/login/hospital" className="card card-pad hover:shadow-md transition">
            <div className="text-blue-700 font-semibold">Hospital</div>
            <p className="mt-2 text-sm text-slate-700">Admins, Doctors, Nurses, Lab, Pharmacy</p>
          </a>
          <a href="/login/provider" className="card card-pad hover:shadow-md transition">
            <div className="text-blue-700 font-semibold">Provider</div>
            <p className="mt-2 text-sm text-slate-700">Independent practitioners</p>
          </a>
          <a href="/login/patient" className="card card-pad hover:shadow-md transition">
            <div className="text-blue-700 font-semibold">Patient</div>
            <p className="mt-2 text-sm text-slate-700">Personal & dependents access</p>
          </a>
        </div>
      </div>
    </div>
  );
}
