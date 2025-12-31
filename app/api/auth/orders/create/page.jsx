"use client";

import { useEffect, useState } from "react";
import DataTable from "@/app/components/admin/DataTable";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  /* ================= NORMALIZE ================= */
  function normalizeStatus(status) {
    if (!status) return "Order Placed";

    const s = status.toLowerCase();
    if (s.includes("order")) return "Order Placed";
    if (s.includes("pending")) return "Pending Review";
    if (s.includes("approved")) return "Approved";
    if (s.includes("rejected")) return "Rejected";
    return "Order Placed";
  }

  /* ================= LOAD ================= */
  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) =>
        setOrders(
          data.map((o) => ({
            ...o,
            status: normalizeStatus(o.status),
          }))
        )
      );
  }, []);

  /* ================= UPDATE ================= */
  const handleStatusChange = (id, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status } : o
      )
    );
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const columns = [
    { key: "id", label: "ORDER ID" },
    { key: "patient", label: "PATIENT" },
    { key: "product", label: "PRODUCT" },
    { key: "status", label: "STATUS" },
    { key: "amount", label: "AMOUNT" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = (key, row) => {
    /* ===== STATUS DROPDOWN ===== */
    if (key === "status") {
      return (
        <select
          value={row.status}
          onChange={(e) =>
            handleStatusChange(row.id, e.target.value)
          }
          className="
            relative z-30                 /* ✅ REQUIRED */
            rounded-xl border border-slate-200
            px-3 py-1.5 text-sm bg-white
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-slate-200
          "
        >
          <option value="Order Placed">Order Placed</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      );
    }

    /* ===== DELETE ===== */
    if (key === "actions") {
      return (
        <button
          onClick={() => handleDelete(row.id)}
          className="
            px-3 py-1.5 rounded-xl
            border border-rose-200
            text-rose-600 text-sm
            hover:bg-rose-50
          "
        >
          Delete
        </button>
      );
    }

    return row[key];
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">Orders</h1>

      <DataTable
        columns={columns}
        rows={orders}
        renderCell={renderCell}
        mobileCardTitle={(row) => `Order #${row.id}`}
        mobileCardLines={(row) => [
          { label: "Patient", value: row.patient },
          { label: "Product", value: row.product },
          {
            label: "Status",
            value: (
              <select
                value={row.status}
                onChange={(e) =>
                  handleStatusChange(row.id, e.target.value)
                }
                className="
                  w-full rounded-xl border border-slate-200
                  px-3 py-1.5 text-sm bg-white
                "
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            ),
          },
        ]}
      />
    </div>
  );
}