import "./globals.css";
import { Building2, UserCircle, Users, FileText, TestTube, Pill, Bell, Shield, Wifi, Clock, CheckCircle2, ArrowRight, Sparkles, Activity, Menu } from 'lucide-react';

export const metadata = {
  title: "NIEMR — Electronic Medical Records",
  description: "Fast, secure EMR for Hospitals, Providers & Patients.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NIEMR
            </span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
            <a href="#services" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Services</a>
            <a href="#about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <a href="/login" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
              Login
            </a>
            <a href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </header>

        <main className="min-h-[calc(100dvh-68px)]">{children}</main>

        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600">
            © {new Date().getFullYear()} NIEMR. Built for low-connectivity healthcare.
          </div>
        </footer>
      </body>
    </html>
  );
}
