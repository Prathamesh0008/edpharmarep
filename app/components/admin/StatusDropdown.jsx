"use client";

export default function StatusDropdown({ value }) {
  return (
    <select
      defaultValue={value}
      className="border rounded-full px-3 py-1 text-sm"
    >
      <option>Pending Doctor Review</option>
      <option>Approved</option>
      <option>Shipped</option>
      <option>Cancelled</option>
    </select>
  );
}