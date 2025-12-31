"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Package,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

function formatDate(d) {
  try {
    return new Date(d).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function statusMeta(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("pending"))
    return {
      label: "Pending",
      icon: <Clock className="w-3.5 h-3.5" />,
      pill: "bg-gradient-to-r from-amber-50/80 to-orange-50/70 text-amber-800 border-amber-200/40 shadow-sm",
    };
  if (s.includes("processing"))
    return {
      label: "Processing",
      icon: <Package className="w-3.5 h-3.5" />,
      pill: "bg-gradient-to-r from-blue-50/80 to-indigo-50/70 text-blue-800 border-blue-200/40 shadow-sm",
    };
  if (s.includes("shipped"))
    return {
      label: "Shipped",
      icon: <Truck className="w-3.5 h-3.5" />,
      pill: "bg-gradient-to-r from-emerald-50/80 to-teal-50/70 text-emerald-800 border-emerald-200/40 shadow-sm",
    };
  if (s.includes("cancel"))
    return {
      label: "Cancelled",
      icon: <XCircle className="w-3.5 h-3.5" />,
      pill: "bg-gradient-to-r from-rose-50/80 to-pink-50/70 text-rose-800 border-rose-200/40 shadow-sm",
    };
  return {
    label: status || "Completed",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    pill: "bg-gradient-to-r from-emerald-50/80 to-green-50/70 text-emerald-800 border-emerald-200/40 shadow-sm",
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // search + filter
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      setLoading(true);

      // const user = JSON.parse(localStorage.getItem("bio-user"));

      // if (!user?._id && !user?.id) {
      //   router.push("/");
      //   return;
      // }

      // const res = await fetch("/api/orders/my", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     userId: user._id || user.id, // ✅ safe fallback
      //   }),
      // });
      

      const res = await fetch("/api/orders/my", {
  method: "GET",
  credentials: "include", // ✅ REQUIRED
});

if (res.status === 401) {
  router.push("/login"); // or "/"
  return;
}

const data = await res.json();
setOrders(data.ok ? data.orders : []);


      console.log("ORDERS:", data.ok ? data.orders : []);
    } catch {
      setOrders([]);
    } finally {
      mounted && setLoading(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, []);


  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return orders.filter((o) => {
      const matchText =
        !qq ||
        String(o.orderId || "").toLowerCase().includes(qq) ||
        String(o.address?.fullName || "").toLowerCase().includes(qq) ||
        String(o.address?.phone || "").toLowerCase().includes(qq);

      const matchStatus =
        statusFilter === "All" ||
        String(o.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchText && matchStatus;
    });
  }, [orders, q, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/95 via-white to-blue-50/80 flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-blue-200/50 border-t-blue-400 rounded-xl animate-spin mb-4"></div>
          <p className="text-sm text-slate-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/95 via-white to-blue-50/80 pt-6 pb-16 -mt-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 bg-gradient-to-r from-slate-900 via-[#0A4C89] to-slate-900 bg-clip-text text-[#0A4C89]">
            My Orders
          </h1>
          <p className="text-sm text-slate-600 max-w-md">
            Track your recent purchases and order status
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col lg:flex-row gap-3 mb-8">
          <div className="flex-1 max-w-md">
            <div className="relative bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 ring-1 ring-slate-100/50">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search orders, name, phone..."
                className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 focus:placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <div className="relative bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 ring-1 ring-slate-100/50">
              <Filter className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm text-slate-700"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-2xl p-12 text-center shadow-xl ring-1 ring-slate-100/50">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-medium text-slate-900 mb-3">No orders yet</h2>
            <p className="text-sm text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed">
              Your order history will appear here. Start shopping to track your purchases.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0A4C89]/95 to-[#0A5CA8]/95 px-6 py-3 text-sm font-medium text-white hover:from-[#0A4C89] hover:to-[#0A5CA8] shadow-lg hover:shadow-xl transition-all duration-200 ring-1 ring-[#0A4C89]/30 backdrop-blur-sm"
            >
              Start Shopping →
            </Link>
          </div>
        )}

        {/* ORDERS LIST */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((o) => {
              const meta = statusMeta(o.status);
              const firstItem = o.items?.[0];
              const itemsCount = Array.isArray(o.items) ? o.items.length : 0;

              return (
                <Link key={o.orderId} href={`/orders/${o._id}`} className="block">
                  <div className="group bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-100/50 hover:ring-slate-200/70">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* LEFT CONTENT */}
                      <div className="flex flex-col gap-4 min-w-0 flex-1">
                        {/* ORDER INFO */}
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                              Order ID
                            </p>
                            <h3 className="text-lg font-semibold text-slate-900 leading-tight truncate group-hover:text-[#0A4C89] transition-colors">
                              {o.orderId}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              {formatDate(o.createdAt)}
                            </p>
                          </div>
                          
                          {/* STATUS */}
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded-full px-3 py-1 ${meta.pill} backdrop-blur-sm hover:scale-105 transition-all duration-200 shadow-sm`}>
                            {meta.icon}
                            {meta.label}
                          </span>
                        </div>

                        {/* ITEMS PREVIEW */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50/50 to-blue-50/30 border border-slate-100/50 group-hover:border-slate-200/70 transition-all">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                            {firstItem?.image ? (
                              <Image
                                src={firstItem.image}
                                alt={firstItem.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100/70 to-indigo-100/70">
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-900 text-sm truncate group-hover:text-[#0A4C89] transition-colors">
                              {firstItem?.name || "Multiple items"}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {itemsCount} item{itemsCount !== 1 ? 's' : ''} • Qty: {o.totals?.totalQty ?? 0}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">
                              ₹{Number(o.totals?.totalPrice || 0)}
                            </p>
                          </div>
                        </div>

                        {/* DELIVERY INFO */}
                        <div className="flex items-center gap-2 text-xs text-slate-600 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100/40">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></div>
                          <span className="truncate">
                            Deliver to: {o.address?.fullName || "Customer"}, {o.address?.city || ""}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-col items-end gap-2 pt-2 lg:pt-0">
                        <span className="text-sm font-semibold text-[#0A4C89] group-hover:underline underline-offset-4 transition-all">
                          View Details
                        </span>
                        <span className="text-slate-400 group-hover:text-slate-600 transition-colors w-4 h-4">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
