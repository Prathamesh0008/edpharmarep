"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Clock,
  Truck,
  XCircle,
  MapPin,
  Phone,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle,
  CreditCard,
  ShoppingBag,
  Calendar,
  User,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

/* ---------- helpers ---------- */
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

function formatShortDate(d) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
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
      icon: <Clock className="w-4 h-4" />,
      color: "text-amber-600",
      bg: "bg-gradient-to-r from-amber-50/80 to-orange-50/80",
      border: "border-amber-200",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
    };
  if (s.includes("processing"))
    return {
      label: "Processing",
      icon: <Package className="w-4 h-4" />,
      color: "text-blue-600",
      bg: "bg-gradient-to-r from-blue-50/80 to-indigo-50/80",
      border: "border-blue-200",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    };
  if (s.includes("shipped"))
    return {
      label: "Shipped",
      icon: <Truck className="w-4 h-4" />,
      color: "text-emerald-600",
      bg: "bg-gradient-to-r from-emerald-50/80 to-teal-50/80",
      border: "border-emerald-200",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
    };
  if (s.includes("delivered"))
    return {
      label: "Delivered",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-green-600",
      bg: "bg-gradient-to-r from-green-50/80 to-emerald-50/80",
      border: "border-green-200",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.1)]",
    };
  if (s.includes("cancel"))
    return {
      label: "Cancelled",
      icon: <XCircle className="w-4 h-4" />,
      color: "text-rose-600",
      bg: "bg-gradient-to-r from-rose-50/80 to-pink-50/80",
      border: "border-rose-200",
      glow: "shadow-[0_0_20px_rgba(244,63,94,0.1)]",
    };
  return {
    label: status || "Pending",
    icon: <Clock className="w-4 h-4" />,
    color: "text-slate-600",
    bg: "bg-gradient-to-r from-slate-50/80 to-gray-50/80",
    border: "border-slate-200",
    glow: "shadow-[0_0_20px_rgba(100,116,139,0.1)]",
  };
}

// Enhanced loading skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-6 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button skeleton */}
        <div className="h-5 w-32 bg-slate-200 rounded-lg animate-pulse mb-8"></div>
        
        {/* Header skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-7 w-64 bg-slate-300 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-32 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Items skeleton */}
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-slate-300 rounded mb-6 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-slate-300 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-20 space-y-1">
                      <div className="h-5 w-full bg-slate-300 rounded animate-pulse"></div>
                      <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary and address skeleton */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-slate-300 rounded mb-6 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between py-2">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-slate-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-48 bg-slate-300 rounded mb-6 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-5 w-40 bg-slate-300 rounded animate-pulse"></div>
                <div className="h-20 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-10 w-full bg-slate-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = params?.id;
  const orderId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    let mounted = true;

    if (!orderId) {
      console.log("No order ID available yet");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError("");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (!mounted) return;

        if (!res.ok || !data.ok) {
          setError(data?.message || "Failed to load order");
          setOrder(null);
          return;
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.name === "AbortError") {
          setError("Request timeout. Please try again.");
        } else {
          setError("Failed to load order. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [orderId, router]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="relative bg-gradient-to-br from-white to-slate-50/90 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-10 text-center max-w-md w-full shadow-2xl shadow-blue-500/5">
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              {error ? "Oops!" : "Order Not Found"}
            </h2>
            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              {error 
                ? error 
                : "The order you're looking for doesn't exist or you don't have permission to view it."
              }
            </p>
            <Link
              href="/orders"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0A4C89] to-[#0A5CA8] px-7 py-3.5 text-sm font-semibold text-white hover:from-[#0A4C89]/90 hover:to-[#0A5CA8]/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const meta = statusMeta(order.status);
  const totalItems = order.items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-6 pb-20">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/orders"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#0A4C89] transition-all duration-200 hover:-translate-x-0.5"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-0.5 transition-transform duration-200"
              />
              Back to Orders
            </Link>
            <ChevronRight size={16} className="text-slate-300" />
            <span className="text-sm font-medium text-slate-500 truncate">
              Order #{order.orderId}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0A4C89] px-4 py-2 rounded-lg hover:bg-slate-100/50 transition-all duration-200">
              <Printer size={16} />
              Print
            </button>
            <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0A4C89] px-4 py-2 rounded-lg hover:bg-slate-100/50 transition-all duration-200">
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        {/* Order Header Card */}
        <div className="relative bg-gradient-to-br from-white to-slate-50/90 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-7 mb-8 shadow-lg shadow-blue-500/5">
          {/* Status glow effect */}
          <div className={`absolute -top-3 right-6 ${meta.glow} ${meta.bg} border ${meta.border} rounded-full px-4 py-1.5 flex items-center gap-2 z-10`}>
            {meta.icon}
            <span className={`text-sm font-semibold ${meta.color}`}>
              {meta.label}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ShoppingBag size={16} />
                <span>Order ID</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{order.orderId}</h1>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={16} />
                <span>Order Date</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Package size={16} />
                <span>Items</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items Section */}
          <section className="space-y-6">
            <div className="bg-gradient-to-br from-white to-slate-50/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-7 shadow-lg shadow-blue-500/5">
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  Order Items ({order.items?.length || 0})
                </h2>
                <span className="text-sm font-medium text-slate-500">
                  {totalItems} total items
                </span>
              </div>
              
              <div className="space-y-4">
                {order.items?.map((i, index) => (
                  <div
                    key={i.slug}
                    className="group relative bg-gradient-to-r from-white to-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-5 hover:border-blue-200/70 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {/* Item number badge */}
                    <div className="absolute -left-2 -top-2 w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                      {index + 1}
                    </div>
                    
                    <div className="flex gap-5">
                      {/* Product Image */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                          {i.image ? (
                            <Image
                              src={i.image}
                              alt={i.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              priority={index === 0}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100/50 to-indigo-100/50">
                              <ImageIcon className="w-8 h-8 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                              {i.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                              <span>Quantity:</span>
                              <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                {i.qty}
                              </span>
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg text-slate-900">
                              ₹{Number(i.price || 0) * Number(i.qty || 0)}
                            </p>
                            <p className="text-xs text-slate-500">
                              ₹{i.price || 0} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Summary & Address Section */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-white to-slate-50/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-7 shadow-lg shadow-blue-500/5">
              <div className="flex items-center gap-3 mb-7">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ₹{order.totals?.totalPrice ?? 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium text-emerald-600">FREE</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-medium text-slate-900">₹0.00</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 mt-2">
                  <div>
                    <span className="font-bold text-lg text-slate-900">Total</span>
                    <p className="text-xs text-slate-500">Inclusive of all taxes</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-2xl text-[#0A4C89]">
                      ₹{order.totals?.totalPrice ?? 0}
                    </span>
                    <p className="text-xs text-slate-500">
                      {order.totals?.totalDistinct ?? 0} distinct items
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gradient-to-br from-white to-slate-50/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-7 shadow-lg shadow-blue-500/5">
              <div className="flex items-center gap-3 mb-7">
                <div className="p-2 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-violet-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Delivery Address</h2>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-lg">
                      {order.address?.fullName}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Recipient</p>
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-xl border border-blue-100/50">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {order.address?.address}
                      </p>
                      <p className="text-slate-600 mt-1">
                        {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                      </p>
                      <p className="text-slate-500 text-sm mt-2">
                        {order.address?.country}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 rounded-xl border border-emerald-100/50">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900">
                        {order.address?.phone}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">Primary contact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Need help with your order?{" "}
            <Link href="/contact" className="text-[#0A4C89] font-medium hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}