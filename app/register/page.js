import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

export default function RegisterChooser() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-3xl font-bold">Create your NIEMR account</h1>
        <p className="text-slate-600 mt-2">Pick the option that fits you.</p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Link href="/register/hospital"><FeatureCard title="Hospital / Facility" desc="Super Admin registers the facility." /></Link>
          <Link href="/register/provider"><FeatureCard title="Independent Provider" desc="Doctor/Nurse/Pharmacist/Lab Scientist." /></Link>
          <Link href="/register/patient"><FeatureCard title="Patient" desc="Self-register and manage uploads & reminders." /></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
