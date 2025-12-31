"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

export default function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff] px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">

        {/* ICON */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle size={36} />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Order Placed Successfully
        </h1>

        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Thank you for your order. Your order has been confirmed.
        </p>

        {/* ORDER ID */}
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <Package size={18} className="text-[#0A4C89]" />
          <span className="text-gray-600">Order ID:</span>
          <span className="font-semibold text-slate-900">{orderId}</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/orders/${orderId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0A4C89] to-[#0D5FA8] px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:translate-y-0.5 transition"
          >
            View Order
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <ClipboardList size={16} />
            My Orders
          </Link>
        </div>

        {/* FOOTER NOTE */}
        <p className="mt-6 text-[11px] sm:text-xs text-gray-500">
          You can track your order status anytime from the “My Orders” section.
        </p>
      </div>
    </div>
  );
}
