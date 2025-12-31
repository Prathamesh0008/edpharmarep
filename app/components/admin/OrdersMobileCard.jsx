"use client";

import ActionMenu from "./ActionMenu";

export default function OrdersMobileCard({ orders = [], refresh }) {
  async function updateStatus(orderId, status) {
    await fetch("/api/admin/orders/update-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    refresh?.();
  }

  if (!orders.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No orders found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => {
        const key = order._id || order.orderId || index;

        return (
          <div
            key={key}
            className="bg-white rounded-xl shadow p-4 space-y-2 relative overflow-visible"
          >
            {/* TOP ROW */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="font-semibold">
                  {order.orderId}
                </div>

                <div className="text-xs text-gray-500">
                  {order.customerName ||
                    order.user?.name ||
                    ""}
                </div>

                <div className="text-xs text-gray-500">
                  {order.email ||
                    order.user?.email ||
                    ""}
                </div>
              </div>

              {/* ✅ FIXED ACTION MENU */}
<div className="relative z-[9999] pointer-events-auto w-full max-w-[140px]">
                <ActionMenu
                  currentStatus={order.status}
                  onChange={(status) =>
                    updateStatus(order._id, status)
                  }
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="text-xs text-gray-500">
              Address:{" "}
              {order.address
                ? `${order.address.street || ""} ${
                    order.address.city || ""
                  }`
                : "—"}
            </div>

            {/* AMOUNT */}
            <div className="flex justify-between text-sm pt-2">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold">
                €{order.amount ?? 0}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}