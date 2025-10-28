import AuthForm from "@/components/AuthForm";
export default function ProviderLoginPage() {
  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16 grid md:grid-cols-2 items-center gap-10">
        <div>
          <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold">NIEMR</div>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Independent Provider Sign In</h2>
          <p className="mt-2 text-slate-700">Consults, e-Rx, orders and secure patient records.</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Visit notes with audit trail</li><li>• Quick orders & e-Rx</li><li>• Documents & history</li>
          </ul>
        </div>
        <AuthForm role="provider" />
      </div>
    </div>
  );
}
