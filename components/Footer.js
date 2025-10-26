export default function Footer() {
  return (
    <footer className="border-t border-slate-100 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} NIEMR. All rights reserved.</p>
        <p>Built for hospitals, providers & patients.</p>
      </div>
    </footer>
  );
}
