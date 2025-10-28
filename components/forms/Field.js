export function Field({ label, children }) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={
        "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-200 " +
        (props.className || "")
      }
    />
  );
}
