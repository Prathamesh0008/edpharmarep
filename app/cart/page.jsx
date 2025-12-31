"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import { getLoggedInUser } from "@/lib/auth";

import { ShoppingCart, Trash2, IndianRupee, Package } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQty, removeFromCart, totals } = useCart();

  const hasItems = cartItems.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff] ">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* ===== PAGE TITLE ===== */}
        <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
              <ShoppingCart size={18} />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A4C89] tracking-tight">
                Your Cart
              </h1>
              {hasItems && (
                <p className="text-xs md:text-sm text-gray-500">
                  Review items before secure checkout
                </p>
              )}
            </div>
          </div>

          {hasItems && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
              <Package size={14} />
              {totals.totalQty} items
            </span>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* ===== EMPTY STATE ===== */
          <div className="flex flex-col items-center justify-center text-center py-16 md:py-20 bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-100 shadow-sm">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0A4C89]/8 text-[#0A4C89] mb-3">
              <ShoppingCart size={26} />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              Your cart is empty
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Add products to continue shopping
            </p>

            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0A4C89] to-[#0D5FA8] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          /* ===== CART GRID ===== */
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
            {/* ================= LEFT: ITEMS ================= */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.slug}
                  className="flex flex-col sm:flex-row gap-4 bg-white/80 border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* IMAGE */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shrink-0">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500">
                        <IndianRupee size={14} />
                        <span>{item.price?.toLocaleString()} / unit</span>
                      </p>
                    </div>

                    {/* QTY + REMOVE */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      {/* QTY */}
                      <div className="inline-flex items-center gap-3 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1.5">
                        <button
                          onClick={() => updateQty(item.slug, -50)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-200 transition text-lg leading-none"
                        >
                          −
                        </button>

                        <span className="min-w-[40px] text-center font-semibold text-gray-900 text-sm">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => updateQty(item.slug, +50)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-200 transition text-lg leading-none"
                        >
                          +
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeFromCart(item.slug)}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm text-red-500 hover:text-red-600 hover:underline"
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* ITEM TOTAL */}
                  <div className="sm:min-w-[130px] flex sm:flex-col justify-between sm:items-end text-right">
                    <p className="text-xs text-gray-500 sm:mb-1">Item total</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      ₹{(item.qty * (item.price || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= RIGHT: SUMMARY ================= */}
            <div className="lg:sticky lg:top-24">
              <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_16px_40px_rgba(15,23,42,0.12)] p-5 sm:p-6">
                <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-[#0A4C89]/8 via-transparent to-[#0D5FA8]/14" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-slate-900">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
                        <ShoppingCart size={16} />
                      </span>
                      <span>Order Summary</span>
                    </h2>
                    <span className="text-[11px] font-medium text-gray-500">
                      {totals.totalDistinct} product
                      {totals.totalDistinct > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <Row label="Items" value={`${totals.totalQty}`} />
                    <Row
                      label="Subtotal"
                      value={`₹${totals.totalPrice.toLocaleString()}`}
                    />
                    <Row
                      label="Shipping"
                      value="Calculated at checkout"
                      muted
                    />

                    <hr className="border-slate-100" />

                    <Row
                      label="Total"
                      value={`₹${totals.totalPrice.toLocaleString()}`}
                      bold
                      highlight
                    />
                  </div>

                  <button
                    onClick={() => {
                      const user = getLoggedInUser();
                      if (!user) {
                        alert("Please login to continue checkout");
                        return;
                      }
                      router.push("/checkout");
                    }}
                    className={[
                      "mt-5 w-full py-3.5 rounded-xl text-sm sm:text-base font-semibold",
                      "bg-gradient-to-r from-[#0A4C89] via-[#0D5FA8] to-[#1B78D1]",
                      "text-white shadow-lg shadow-[#0A4C89]/30",
                      "hover:shadow-xl hover:shadow-[#0A4C89]/35 hover:translate-y-0.5",
                      "transition-transform duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A4C89]",
                    ].join(" ")}
                  >
                    Proceed to checkout
                  </button>

                  <Link
                    href="/products"
                    className="block text-center text-xs sm:text-sm text-[#0A4C89] mt-4 font-medium hover:text-[#0D5FA8] underline-offset-4 hover:underline"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* small helper row component */
function Row({ label, value, bold, muted, highlight }) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? "text-gray-500" : "text-gray-600"}>{label}</span>
      <span
        className={[
          bold ? "font-semibold" : "",
          highlight ? "text-[#0A4C89]" : "text-slate-900",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
