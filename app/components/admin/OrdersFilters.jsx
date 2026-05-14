"use client";

const STATUSES = [
  "All",
  "Pending",
  "Processing",
  "Approved",
  "Rejected",
  "Shipped",
  "Delivered",
];

export default function OrdersFilters({ active, setActive }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {STATUSES.map((status) => (
        <button
          key={status}
          onClick={() => setActive(status)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition
            ${
              active === status
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
