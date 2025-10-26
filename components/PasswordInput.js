"use client";

import { useState } from "react";

export default function PasswordInput({ label, name, value, onChange, required = false }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="text-sm text-slate-700">{label}{required && " *"}</span>
      <div className="mt-1 flex items-center rounded-xl border border-slate-300 bg-white">
        <input
          className="w-full px-3 py-2 rounded-xl outline-none"
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="px-3 py-2 text-sm text-blue-700"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}
