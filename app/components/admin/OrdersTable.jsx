"use client";

import { useEffect, useState } from "react";
import ActionMenu from "./ActionMenu";
import OrderDetailsModal from "./OrderDetailsModal";

export default function OrdersTable({ orders = [] }) {
  const [localOrders, setLocalOrders] = useState([]);
  const [rowState, setRowState] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

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

    setLocalOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left whitespace-nowrap">Order</th>
            <th className="p-3 text-left whitespace-nowrap">Customer</th>
            <th className="p-3 text-center whitespace-nowrap">Status</th>
            <th className="p-3 text-center whitespace-nowrap">Amount</th>
            <th className="p-3 text-center whitespace-nowrap">Items</th>
            <th className="p-3 text-center whitespace-nowrap">Date & Time</th>
            <th className="p-3 text-center whitespace-nowrap">Payment</th>
            <th className="p-3 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody>
          {localOrders.map((order, index) => {
            const rowKey = order._id || order.orderId || index;
            const customerName = order.customer?.name || order.address?.fullName || "Guest";
            const customerEmail = order.customer?.email || order.userEmail || "-";

            return (
              <tr key={rowKey} className="border-b align-middle hover:bg-slate-50/70 transition-colors">
                <td className="p-3 text-left">
                  <div className="font-semibold text-slate-900">{order.orderId || "-"}</div>
                  <div className="text-xs text-slate-500">{order.transactionId || "No transaction id"}</div>
                </td>

                <td className="p-3 text-left">
                  <div className="font-medium text-slate-900">{customerName}</div>
                  <div className="text-xs text-slate-500">{customerEmail}</div>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                    {order.status}
                  </span>
                </td>

                <td className="p-3 font-semibold text-center whitespace-nowrap">€{order.totals?.totalPrice ?? 0}</td>

                <td className="p-3 text-center text-slate-600">
                  <span className="font-medium">{(order.items || []).length}</span> items
                </td>

                <td className="p-3 text-center whitespace-nowrap">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</td>

                <td className="p-3 text-center whitespace-nowrap capitalize">{order.paymentMethod || "-"}</td>

                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs hover:bg-slate-50 font-medium"
                    >
                      View Details
                    </button>
                    <ActionMenu
                      currentStatus={order.status}
                      disabled={rowState[order._id]?.locked}
                      onChange={(status) => updateStatus(order._id, status)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}

          {localOrders.length === 0 && (
            <tr>
              <td colSpan={8} className="p-8 text-center text-slate-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
