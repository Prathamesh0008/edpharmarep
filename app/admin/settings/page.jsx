"use client";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-2xl bg-white/85 border border-slate-200 shadow-sm p-5">
        <div className="text-lg font-semibold text-slate-900">Settings</div>
        <div className="text-sm text-slate-600 mt-1">Basic demo settings</div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Site name" />
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Support email" />
        </div>

        <button className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">
          Save
        </button>
      </div>
    </div>
  );
}