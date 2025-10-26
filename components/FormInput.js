"use client";

export default function FormInput({
  label, name, type = "text", value, onChange, required = false, placeholder = "",
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-700">{label}{required && " *"}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-400"
      />
    </label>
  );
}
