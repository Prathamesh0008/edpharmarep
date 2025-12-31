"use client";

import { useEffect, useState } from "react";

const STATUSES = [
  "Order Placed",
  "Rejected",
  "Shipped",
  "Delivered",
];

export default function ActionMenu({ currentStatus, onChange }) {
  const initialStatus =
    STATUSES.includes(currentStatus)
      ? currentStatus
      : "Order Placed";

  const [selected, setSelected] = useState(initialStatus);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (STATUSES.includes(currentStatus)) {
      setSelected(currentStatus);
    }
  }, [currentStatus]);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === selected) return;

    setUpdating(true);
    setSelected(newStatus);

    try {
      await onChange(newStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex justify-center max-w-full overflow-hidden">
      <select
        value={selected}
        onChange={handleChange}
        disabled={updating}
        className="
          w-full
          max-w-[160px]
          text-center
          border
          rounded-full
          px-4
          py-2
          bg-white
          focus:outline-none
        "
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}