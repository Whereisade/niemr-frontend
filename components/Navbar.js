"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  const isActive = (href) =>
    path === href ? "text-blue-700 font-semibold" : "text-slate-700";

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-slate-100">
      <nav className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600" />
          <span className="font-bold text-lg text-slate-900">NIEMR</span>
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          <li><a href="#services" className="text-slate-700 hover:text-blue-700">Services</a></li>
          <li><a href="#why" className="text-slate-700 hover:text-blue-700">Why NIEMR</a></li>
          <li><a href="#contact" className="text-slate-700 hover:text-blue-700">Contact</a></li>
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/login" className={`px-3 py-2 text-sm ${isActive("/login")}`}>Login</Link>
          <Link
            href="/register"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
