export default function RegisterSuccess({ searchParams }) {
  const role = (searchParams?.role || "").toLowerCase();
  const title =
    role === "hospital" ? "Hospital account created" :
    role === "provider" ? "Provider account created" :
    role === "patient"  ? "Patient account created" :
    "Account created";

  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="card">
          <div className="card-pad text-center">
            <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold">NIEMR</div>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{title}</h1>
            <p className="mt-3 text-slate-700">
              If email verification is required, please check your inbox. You can now sign in.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <a className="btn btn-outline" href="/">Home</a>
              <a className="btn btn-primary" href="/login">Go to Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
