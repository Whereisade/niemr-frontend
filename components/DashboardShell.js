"use client";
import { usePathname } from "next/navigation";

const navItems = [
  { key: "overview", label: "Overview", href: "" },
  { key: "appointments", label: "Appointments", href: "appointments" },
  { key: "patients", label: "Patients", href: "patients" },
  { key: "orders", label: "Orders", href: "orders" },
  { key: "labs", label: "Labs", href: "labs" },
  { key: "imaging", label: "Imaging", href: "imaging" },
  { key: "pharmacy", label: "Pharmacy", href: "pharmacy" },
  { key: "billing", label: "Billing", href: "billing" },
  { key: "reports", label: "Reports", href: "reports" },
  { key: "settings", label: "Settings", href: "settings" },
];

export default function DashboardShell({ title, children }) {
  const pathname = usePathname() || "/dashboard";
  const parts = pathname.split("/").filter(Boolean);
  const base = parts.length >= 2 ? `/${parts[0]}/${parts[1]}` : "/dashboard";

  return (
    <div className="min-h-[100dvh] bg-slate-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-semibold text-slate-900">NIEMR</a>

          <nav className="hidden md:flex gap-6 text-sm text-slate-600">
            <a href={`${base}`} className={linkCls(pathname, base)}>Overview</a>
            <a href={`${base}/appointments`} className={linkCls(pathname, `${base}/appointments`)}>Appointments</a>
            <a href={`${base}/patients`} className={linkCls(pathname, `${base}/patients`)}>Patients</a>
            <a href={`${base}/billing`} className={linkCls(pathname, `${base}/billing`)}>Billing</a>
            <a href={`${base}/reports`} className={linkCls(pathname, `${base}/reports`)}>Reports</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-sm text-slate-600 hover:text-blue-700">Switch role</a>
            <form action="/api/auth/logout" method="post">
              <button className="text-sm text-slate-600 hover:text-red-600">Logout</button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
        {children}
      </main>
    </div>
  );
}

function linkCls(pathname, href) {
  const active = pathname === href;
  return `hover:text-blue-700 ${active ? "text-blue-700 font-medium" : "text-slate-600"}`;
}
