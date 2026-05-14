"use client";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const customerName = order.customer?.name || order.address?.fullName || "Guest";
  const customerEmail = order.customer?.email || order.userEmail || "-";
  const customerPhone = order.customer?.phone || order.address?.phone || "-";
  const customerAddress =
    order.customer?.fullAddress ||
    (order.address ? `${order.address.address || ""}, ${order.address.city || ""}` : "-");

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl">
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Order Details</h3>
            <p className="text-sm text-slate-600">Order ID: {order.orderId || "-"}</p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 space-y-1">
              <p className="text-xs text-slate-500">Customer</p>
              <p className="font-medium">{customerName}</p>
              <p className="text-sm text-slate-600">{customerEmail}</p>
              <p className="text-sm text-slate-600">{customerPhone}</p>
              <p className="text-sm text-slate-600">{customerAddress}</p>
            </div>

            <div className="rounded-xl border p-4 space-y-1">
              <p className="text-xs text-slate-500">Order Info</p>
              <p className="text-sm text-slate-700">Status: {order.status || "-"}</p>
              <p className="text-sm text-slate-700">Payment: {order.paymentMethod || "-"}</p>
              <p className="text-sm text-slate-700">Transaction: {order.transactionId || "-"}</p>
              <p className="text-sm text-slate-700">
                Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="px-4 py-3 border-b bg-slate-50 text-sm font-medium">Products Ordered</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white border-b">
                  <tr>
                    <th className="text-left p-3">Product</th>
                    <th className="text-center p-3">Qty</th>
                    <th className="text-center p-3">Price</th>
                    <th className="text-center p-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const qty = Number(item.qty || 0);
                    const price = Number(item.price || 0);
                    return (
                      <tr key={`${item.slug || item.name || "item"}-${idx}`} className="border-b last:border-b-0">
                        <td className="p-3">{item.name || item.slug || "Product"}</td>
                        <td className="p-3 text-center">{qty}</td>
                        <td className="p-3 text-center">€{price.toFixed(2)}</td>
                        <td className="p-3 text-center">€{(qty * price).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-500">
                        No product items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border p-4 flex items-center justify-between">
            <span className="text-sm text-slate-600">Total Amount</span>
            <span className="text-lg font-semibold text-slate-900">€{Number(order.totals?.totalPrice ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
