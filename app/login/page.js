import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

export default function LoginChooser() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-slate-600 mt-2">Select your portal to continue.</p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Link href="/login/hospital"><FeatureCard title="Hospital / Facility" desc="Admins, Doctors, Nurses, Lab, Pharmacy." /></Link>
          <Link href="/login/provider"><FeatureCard title="Independent Provider" desc="Solo practice portal." /></Link>
          <Link href="/login/patient"><FeatureCard title="Patient" desc="Access your personal or dependent records." /></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
