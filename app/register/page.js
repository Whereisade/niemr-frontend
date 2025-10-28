export default function Register() {
  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="h2">Create your NIEMR account</h1>
        <p className="mt-2 muted">
          We’ll build the actual registration flow (role-aware) in the next step.
        </p>

        <div className="card mt-8">
          <div className="card-pad">
            <div className="grid sm:grid-cols-3 gap-4">
              <a href="/register/hospital" className="btn btn-outline text-center">Hospital/Facility</a>
              <a href="/register/provider" className="btn btn-outline text-center">Independent Provider</a>
              <a href="/register/patient" className="btn btn-outline text-center">Patient</a>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a href="/" className="text-blue-700 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
