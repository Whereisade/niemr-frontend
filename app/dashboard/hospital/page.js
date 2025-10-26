export default function HospitalDashboard() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <a href="/dashboard/hospital/staff" className="rounded-2xl border p-5 hover:shadow">
          <p className="font-semibold">Staff Onboarding</p>
          <p className="text-sm text-slate-600">Create clinicians for your facility.</p>
        </a>
        <a href="/dashboard/hospital/pharmacy/import" className="rounded-2xl border p-5 hover:shadow">
          <p className="font-semibold">Pharmacy CSV Import</p>
          <p className="text-sm text-slate-600">Upload your drug catalog.</p>
        </a>
        <a href="/dashboard/hospital/labs" className="rounded-2xl border p-5 hover:shadow">
          <p className="font-semibold">Lab Orders</p>
          <p className="text-sm text-slate-600">Create and view lab orders.</p>
        </a>
      </div>
    </main>
  );
}
