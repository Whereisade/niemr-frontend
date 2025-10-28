import { Building2, UserCircle, Users, FileText, TestTube, Pill, Bell, Shield, Wifi, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Next-Gen Healthcare Platform
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight">
            Fast, secure EMR for Hospitals, Providers & Patients
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Mobile-first and offline-aware so care never stops. Consults, labs, imaging, pharmacy,
            billing and notifications unified and auditable.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all">
              Login
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Three login paths: Hospital/Facility • Independent Provider • Patient
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-slate-900">Platform Features</h3>
          </div>
          <ul className="space-y-4 text-slate-700">
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Role-based access (Admin, Doctor, Nurse, Lab, Pharmacy)</span>
            </li>
            <li className="flex items-start gap-3">
              <UserCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Patient self-registration & dependents</span>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Orders → Labs/Imaging → Results with flags</span>
            </li>
            <li className="flex items-start gap-3">
              <Pill className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Pharmacy inventory, dispensing & CSV uploads</span>
            </li>
            <li className="flex items-start gap-3">
              <Wifi className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Offline-first with auto sync</span>
            </li>
            <li className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Notifications & reminders</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900">What you can do on NIEMR</h2>
          <p className="mt-3 text-lg text-slate-600">Complete healthcare management in one platform</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              title: "Hospital Console", 
              desc: "Manage users, wards, schedules, appointments & reports.",
              icon: Building2,
              color: "blue"
            },
            { 
              title: "Provider Workspace", 
              desc: "Solo practice: notes, orders, e-Rx and documents.",
              icon: UserCircle,
              color: "indigo"
            },
            { 
              title: "Patient Portal", 
              desc: "Register, manage dependents, view results & book visits.",
              icon: Users,
              color: "purple"
            },
            { 
              title: "Labs & Imaging", 
              desc: "Order, capture results, auto-flag abnormal findings.",
              icon: TestTube,
              color: "cyan"
            },
            { 
              title: "Pharmacy", 
              desc: "Stock, dispensing, CSV imports & price catalogs.",
              icon: Pill,
              color: "green"
            },
            { 
              title: "Notifications", 
              desc: "Real-time alerts for results, meds & critical events.",
              icon: Bell,
              color: "orange"
            },
          ].map((s) => {
            const Icon = s.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              indigo: "bg-indigo-100 text-indigo-600",
              purple: "bg-purple-100 text-purple-600",
              cyan: "bg-cyan-100 text-cyan-600",
              green: "bg-green-100 text-green-600",
              orange: "bg-orange-100 text-orange-600"
            };
            
            return (
              <div key={s.title} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[s.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}