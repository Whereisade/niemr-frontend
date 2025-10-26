export default function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm hover:shadow-md transition">
      <div className="mb-4 h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
        {icon || <span className="text-blue-700 font-bold">★</span>}
      </div>
      <h3 className="text-slate-900 font-semibold">{title}</h3>
      <p className="text-slate-600 mt-2 text-sm">{desc}</p>
    </div>
  );
}
