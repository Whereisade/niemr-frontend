import "./globals.css";

export const metadata = {
  title: "NIEMR — Electronic Medical Records",
  description: "Fast, secure EMR for Hospitals, Providers & Patients.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-extrabold text-blue-700 tracking-tight">
              NIEMR
            </a>
            <div className="flex items-center gap-3">
              <a href="/login" className="btn btn-outline">Login</a>
              <a href="/register" className="btn btn-primary">Get Started</a>
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
