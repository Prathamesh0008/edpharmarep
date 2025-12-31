"use client";

import { useEffect, useState } from "react";
import ActionMenu from "./ActionMenu";

export default function OrdersTable({ orders = [], refresh }) {
  const [localOrders, setLocalOrders] = useState([]);
  const [rowState, setRowState] = useState({});

  // Sync incoming orders
  useEffect(() => {
    setLocalOrders(orders);

    const map = {};
    orders.forEach((o) => {
      if (o?._id) {
        map[o._id] = { locked: false };
      }
    });
    setRowState(map);
  }, [orders]);

  // Update status handler
  const updateStatus = async (orderId, status) => {
    setRowState((prev) => ({
      ...prev,
      [orderId]: { locked: true },
    }));

    setLocalOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, status } : o
      )
    );

    try {
      await fetch("/api/admin/orders/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      window.location.reload();
    } catch (e) {
      console.error("STATUS UPDATE ERROR:", e);
    } finally {
      setRowState((prev) => ({
        ...prev,
        [orderId]: { locked: false },
      }));
    }
  };

  return (
    <div className="bg-white rounded-2xl border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="p-3 text-center">Order ID</th>
            <th className="p-3 text-center">Customer Name</th>
            <th className="p-3 text-center">Email</th>
            <th className="p-3 text-center">Address</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Amount</th>
            <th className="p-3 text-center">Date & Time</th>
            <th className="p-3 text-center">Transaction ID</th>
            <th className="p-3 text-center">Mode Of Payment</th>
            <th className="p-3 text-center w-[180px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {localOrders.map((order, index) => {
            const rowKey = order._id || order.orderId || index;

            return (
              <tr key={rowKey} className="border-b align-middle">
                <td className="p-3 font-medium text-center">
                  {order.orderId || "—"}
                </td>

                <td className="p-3 text-center">
                  {order.address?.fullName || "Guest"}
                </td>

                <td className="p-3 text-slate-500 text-center">
                  {order.userEmail || "—"}
                </td>

                <td className="p-3 text-slate-500 text-center max-w-xs mx-auto">
                  {order.address
                    ? `${order.address.address}, ${order.address.city}`
                    : "—"}
                </td>

                <td className="p-3 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs">
                    {order.status}
                  </span>
                </td>

                <td className="p-3 font-semibold text-center">
                  €{order.totals?.totalPrice ?? 0}
                </td>

                <td className="p-3 text-center">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "—"}
                </td>

                <td className="p-3 text-center text-slate-500">
                  {order.transactionId || "—"}
                </td>

                {/* ✅ MODE OF PAYMENT (ONLY ADDITION) */}
                <td className="p-3 text-center">
                  {order.paymentMethod || "—"}
                </td>

                <td className="p-3 text-center">
                  <div className="flex justify-center">
                    <ActionMenu
                      currentStatus={order.status}
                      disabled={rowState[order._id]?.locked}
                      onChange={(status) =>
                        updateStatus(order._id, status)
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}

          {localOrders.length === 0 && (
            <tr>
              <td
                colSpan={10}
                className="p-6 text-center text-slate-500"
              >
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
