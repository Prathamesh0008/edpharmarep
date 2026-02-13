// app/components/CartDrawer.jsx
"use client";

import { useCart } from "./CartContext";
import { useEffect, useMemo, useState } from "react";
import { getLoggedInUser } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import ProductQuickView from "./ProductQuickView";
import QuantitySelector from "./QuantitySelector";
import {
  ShoppingCart,
  X,
  Trash2,
  Euro, // Changed from IndianRupee to Euro
  Package,
} from "lucide-react";

export default function CartDrawer() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cartOpen, 
    closeDrawer, 
    cartItems, 
    updateQuantity,
    removeFromCart,
    INITIAL_BULK_QUANTITY,
    INCREMENT_STEP,
    totals 
  } = useCart();

  const [openItem, setOpenItem] = useState(null);
  const [isRemoving, setIsRemoving] = useState(null);
  const isCartPage = pathname.startsWith("/cart");

  /* ================= DERIVED STATE ================= */
  const { subtotal } = useMemo(() => {
    const total = cartItems.reduce((acc, i) => acc + i.qty * (i.price || 0), 0);
    return { subtotal: total };
  }, [cartItems]);

  /* ================= SIDE EFFECTS ================= */
  useEffect(() => {
    if (cartOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [cartOpen]);

  useEffect(() => {
    if (!cartOpen) {
      setOpenItem(null);
      setIsRemoving(null);
    }
  }, [cartOpen]);

  const handleRemove = (slug) => {
    setIsRemoving(slug);
    setTimeout(() => {
      removeFromCart(slug);
      setIsRemoving(null);
    }, 300);
  };

  const handleQuantityChange = (slug, newQuantity) => {
    updateQuantity(slug, newQuantity);
  };

  if (isCartPage) {
    return null;
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[999] bg-slate-900/45 backdrop-blur-sm
          transition-opacity duration-300
          ${cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* DRAWER */}
      <aside
        className="fixed top-0 right-0 z-[1000] h-full w-[94%] sm:w-[440px]
          flex flex-col rounded-l-3xl
          transition-transform duration-300 ease-out
          bg-gradient-to-b from-[#f5f9ff] via-white/90 to-[#edf3ff]"
        style={{
          transform: cartOpen ? "translateX(0%)" : "translateX(110%)",
        }}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur-md px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
              <ShoppingCart size={18} />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold text-slate-900">
                Shopping Cart
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">
                  {cartItems.length} product{cartItems.length !== 1 ? 's' : ''}
                </p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  B2B Bulk
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={closeDrawer}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center mt-16 text-gray-500">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-3">
                <ShoppingCart size={22} />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Cart is empty
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Add products to see them here
              </p>
            </div>
          )}

          {cartItems.map((item) => {
            const batchCount = Math.ceil(item.qty / INITIAL_BULK_QUANTITY);
            const isBeingRemoved = isRemoving === item.slug;
            const itemTotal = item.qty * (item.price || 0);
            
            return (
              <div
                key={item.slug}
                className={`flex gap-4 p-3.5 border border-slate-100 rounded-2xl bg-white/80 shadow-sm hover:shadow-md transition-all duration-300 ${
                  isBeingRemoved ? 'opacity-50 scale-95' : ''
                }`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenItem(item)}
                  className="flex gap-3 flex-1 cursor-pointer"
                >
                  <div className="relative w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shrink-0">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="font-semibold text-sm text-slate-900 line-clamp-2">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <Euro size={13} /> {/* Changed from IndianRupee to Euro */}
                          <span>{item.price?.toLocaleString()}/unit</span>
                        </p>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {batchCount} batch{batchCount !== 1 ? 'es' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls with Manual Input */}
                    <div className="flex items-center justify-between mt-3">
                      <QuantitySelector
                        quantity={item.qty}
                        onQuantityChange={(newQty) => handleQuantityChange(item.slug, newQty)}
                        minQuantity={INITIAL_BULK_QUANTITY}
                        incrementStep={INCREMENT_STEP}
                        size="sm"
                        showUnitLabel={false}
                      />
                      
                      <div className="text-right ml-2">
                        <p className="text-xs text-gray-500">Total</p>
                        <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                          €{itemTotal.toLocaleString()} {/* Changed from ₹ to € */}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.slug)}
                  disabled={isBeingRemoved}
                  className="self-start text-xs text-red-500 hover:text-red-600 hover:underline inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBeingRemoved ? (
                    <>
                      <X size={14} className="animate-spin" />
                      <span>Removing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* BULK INFO */}
        {cartItems.length > 0 && (
          <div className="px-5 py-3 border-t border-blue-100 bg-blue-50/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-blue-600" />
                <span className="text-blue-800 font-medium">Bulk Order Summary</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600">
                  Min order: <span className="font-semibold">{INITIAL_BULK_QUANTITY}</span> units
                </div>
                <div className="text-xs text-gray-600">
                  +/- <span className="font-semibold">{INCREMENT_STEP}</span> units per click
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  You can also type quantity manually
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 bg-white/85 backdrop-blur-md px-5 py-4">
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Units</span>
                <span className="font-semibold text-slate-900">
                  {totals.totalQty.toLocaleString()} units
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Batches</span>
                <span className="font-semibold text-slate-900">
                  {totals.totalBulkUnits} batch{totals.totalBulkUnits !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  €{subtotal.toLocaleString()} {/* Changed from ₹ to € */}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const user = getLoggedInUser(); 
                if (!user) {
                  alert("Please login to proceed");
                  return;
                }
                closeDrawer();
                router.push("/cart");
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0A4C89] via-[#0D5FA8] to-[#1B78D1] text-white text-sm font-semibold shadow-lg shadow-[#0A4C89]/25 hover:shadow-xl hover:shadow-[#0A4C89]/30 hover:translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A4C89]"
            >
              Go to checkout
            </button>
          </div>
        )}
      </aside>

      <ProductQuickView
        open={!!openItem}
        item={openItem}
        onClose={() => setOpenItem(null)}
        onGoToProduct={(slug) => {
          closeDrawer();
          router.push(`/products/${slug}`);
        }}
      />
    </>
  );
}