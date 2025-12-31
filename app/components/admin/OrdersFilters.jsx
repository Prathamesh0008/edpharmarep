"use client";

const STATUSES = [
  "All",
  "Order Placed",
  "Pending Review",
  "Approved",
  "Rejected",
  "Shipped",
];

export default function OrdersFilters({ active, setActive }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {STATUSES.map((status) => (
        <button
          key={status} // ✅ UNIQUE KEY
          onClick={() => setActive(status)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border
            ${
              active === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}