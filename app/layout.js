import "./globals.css";

export const metadata = {
  title: "NIEMR – Modern EMR",
  description: "Low-bandwidth, offline-aware EMR for hospitals, providers, and patients.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
