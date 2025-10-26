import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Modern, low-bandwidth EMR for{" "}
                <span className="text-blue-700">Hospitals</span>,{" "}
                <span className="text-blue-700">Providers</span> &{" "}
                <span className="text-blue-700">Patients</span>.
              </h1>
              <p className="mt-5 text-slate-600 text-lg">
                Offline-aware, secure, auditable records with role-based access and
                streamlined clinical workflows.
              </p>
              <div className="mt-8 flex gap-3">
                <Link href="/register" className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Link>
                <Link href="/login" className="px-5 py-3 rounded-xl border border-slate-200 hover:border-blue-300">
                  Login
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <FeatureCard title="Hospital Suite" desc="Admins, Doctors, Nurses, Lab & Pharmacy flows." />
                  <FeatureCard title="Independent Providers" desc="Solo practice EMR with referrals." />
                  <FeatureCard title="Patient Portal" desc="Self-registration, documents, reminders." />
                  <FeatureCard title="Reports & PDFs" desc="Export summaries and sections anytime." />
                </div>
              </div>
              <div className="absolute -z-10 -right-6 -top-6 h-24 w-24 rounded-3xl bg-blue-100" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-bold">What we provide</h2>
        <p className="text-slate-600 mt-2 max-w-2xl">
          End-to-end EMR covering encounters, orders, lab results, pharmacy, billing,
          notifications, search, audit trails, and exports.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <FeatureCard title="Clinical Workflows" desc="Doctor, Nurse, Lab, Pharmacy flows with immutable notes." />
          <FeatureCard title="External Labs/Pharmacies" desc="Refer and receive results across the network." />
          <FeatureCard title="Notifications" desc="In-app for clinicians, email for patients; priority badges." />
          <FeatureCard title="Global Search" desc="Find patients, encounters, labs, imaging and more." />
          <FeatureCard title="CSV Uploads" desc="Bulk drug/pricing and procedures for fast onboarding." />
          <FeatureCard title="PDF Exports" desc="Export sections or full record for sharing/printing." />
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl font-bold">Why NIEMR?</h2>
          <ul className="mt-6 grid md:grid-cols-2 gap-4 text-slate-700 list-disc pl-6">
            <li>Low-bandwidth & offline-aware for real-world clinics.</li>
            <li>Strict RBAC with audit trails & timestamps.</li>
            <li>Color-coded abnormal results, reminders & alerts.</li>
            <li>Patient self-registration and document uploads.</li>
          </ul>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Ready to modernize your records?</h3>
            <p className="text-blue-100">Get started in minutes — no heavy setup.</p>
          </div>
          <Link href="/register" className="px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold">
            Create an account
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
