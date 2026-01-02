"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import { getLoggedInUser } from "@/lib/auth";
import { useState, useEffect } from "react";
import LoginPopup from "../components/LoginPopup";
import { 
  ShoppingCart, 
  Trash2, 
  IndianRupee, 
  Package, 
  LogIn,
  Minus,
  Plus,
  X 
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { 
    cartItems, 
    incrementBulk, 
    decrementBulk, 
    removeFromCart, 
    totals,
    BULK_QUANTITY 
  } = useCart();
  
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isRemoving, setIsRemoving] = useState(null);

  const hasItems = cartItems.length > 0;

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getLoggedInUser();
        setIsUserLoggedIn(!!user);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsUserLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleCheckout = () => {
    if (!isUserLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    router.push("/checkout");
  };

  const handleLoginSuccess = (user) => {
    console.log("Login successful", user);
    setIsUserLoggedIn(true);
    setShowLoginPopup(false);
    router.push("/checkout");
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleRemove = (slug) => {
    setIsRemoving(slug);
    // Small delay for animation
    setTimeout(() => {
      removeFromCart(slug);
      setIsRemoving(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff] relative">
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={handleCloseLoginPopup}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* ===== PAGE TITLE ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
              <ShoppingCart size={16} className="sm:size-[18px]" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A4C89] tracking-tight">
                Your Cart
              </h1>
              {hasItems && (
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                  <p className="text-xs text-gray-500">
                    Review items before checkout
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    B2B Bulk
                  </span>
                </div>
              )}
            </div>
          </div>

          {hasItems && (
            <div className="flex flex-col sm:items-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Package size={12} className="sm:size-[14px]" />
                {totals.totalBulkUnits} batch{totals.totalBulkUnits !== 1 ? 'es' : ''}
              </span>
              <span className="text-xs text-gray-500 mt-1 text-right">
                {totals.totalQty} total units
              </span>
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* ===== EMPTY STATE ===== */
          <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16 md:py-20 bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm mx-2 sm:mx-0">
            <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#0A4C89]/8 text-[#0A4C89] mb-3">
              <ShoppingCart size={22} className="sm:size-[26px]" />
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
              Your cart is empty
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 px-4">
              Add products to continue shopping
            </p>

            <Link
              href="/products"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#0A4C89] to-[#0D5FA8] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          /* ===== CART GRID ===== */
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 sm:gap-6 lg:gap-8 items-start">
            {/* ================= LEFT: ITEMS ================= */}
            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => {
                const batchCount = Math.ceil(item.qty / BULK_QUANTITY);
                const isBeingRemoved = isRemoving === item.slug;
                
                return (
                  <div
                    key={item.slug}
                    className={`bg-white/80 border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 ${
                      isBeingRemoved ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {/* IMAGE */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100 overflow-hidden shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                        />
                      </div>

                      {/* INFO */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                              {item.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                <IndianRupee size={12} className="sm:size-[14px]" />
                                <span>{item.price?.toLocaleString()} / unit</span>
                              </p>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {batchCount} batch{batchCount > 1 ? 'es' : ''}
                              </span>
                            </div>
                          </div>

                          {/* ITEM TOTAL - MOBILE TOP RIGHT */}
                          <div className="flex justify-between sm:flex-col sm:items-end sm:min-w-[100px]">
                            <div className="sm:hidden">
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="font-semibold text-gray-900 text-sm">
                                ₹{(item.qty * (item.price || 0)).toLocaleString()}
                              </p>
                            </div>
                            <div className="hidden sm:block text-right">
                              <p className="text-xs text-gray-500">Item total</p>
                              <p className="font-semibold text-gray-900 text-sm md:text-base">
                                ₹{(item.qty * (item.price || 0)).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">({item.qty} units)</p>
                            </div>
                          </div>
                        </div>

                        {/* QTY + REMOVE */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                          {/* QTY CONTROLS */}
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <span>Bulk units:</span>
                              <span className="font-semibold">{BULK_QUANTITY}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-slate-50 border border-slate-200 px-2 py-1.5">
                              <button
                                onClick={() => decrementBulk(item.slug)}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-200 transition"
                                aria-label={`Decrease ${item.name} quantity by ${BULK_QUANTITY} units`}
                              >
                                <Minus size={12} className="sm:size-[14px]" />
                              </button>

                              <span className="min-w-[36px] sm:min-w-[40px] text-center font-semibold text-gray-900 text-sm">
                                {item.qty}
                              </span>

                              <button
                                onClick={() => incrementBulk(item.slug)}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-200 transition"
                                aria-label={`Increase ${item.name} quantity by ${BULK_QUANTITY} units`}
                              >
                                <Plus size={12} className="sm:size-[14px]" />
                              </button>
                            </div>
                          </div>

                          {/* REMOVE BUTTON */}
                          <button
                            onClick={() => handleRemove(item.slug)}
                            disabled={isBeingRemoved}
                            className="inline-flex items-center justify-center sm:justify-start gap-1 text-xs sm:text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            {isBeingRemoved ? (
                              <>
                                <X size={12} className="sm:size-[14px] animate-spin" />
                                <span>Removing...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 size={12} className="sm:size-[14px]" />
                                <span>Remove</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= RIGHT: SUMMARY ================= */}
            <div className="lg:sticky lg:top-24">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg p-4 sm:p-5 md:p-6">
                <div className="pointer-events-none absolute inset-px rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0A4C89]/8 via-transparent to-[#0D5FA8]/14" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                    <h2 className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2 text-slate-900">
                      <span className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
                        <ShoppingCart size={14} className="sm:size-[16px]" />
                      </span>
                      <span>Order Summary</span>
                    </h2>
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500">
                      {totals.totalDistinct} item{totals.totalDistinct > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    {/* Bulk Info Badge */}
                    <div className="p-2 sm:p-3 bg-blue-50/50 rounded-lg border border-blue-100 mb-2 sm:mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-blue-800">Bulk Order</span>
                        <span className="text-xs text-blue-600">{BULK_QUANTITY} units/batch</span>
                      </div>
                    </div>
                    
                    <Row label="Total Units" value={`${totals.totalQty}`} />
                    <Row label="Total Batches" value={`${totals.totalBulkUnits}`} />
                    <Row
                      label="Subtotal"
                      value={`₹${totals.totalPrice.toLocaleString()}`}
                    />
                    <Row
                      label="Shipping"
                      value="Calculated at checkout"
                      muted
                    />

                    <hr className="border-slate-100 my-2 sm:my-3" />

                    <Row
                      label="Total"
                      value={`₹${totals.totalPrice.toLocaleString()}`}
                      bold
                      highlight
                    />
                  </div>

                  {/* Login prompt for non-logged in users */}
                  {!isLoading && !isUserLoggedIn && (
                    <div className="my-3 sm:my-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800 mb-1 sm:mb-2">
                        <LogIn size={14} className="sm:size-[16px]" />
                        <span className="text-xs sm:text-sm font-medium">Login required</span>
                      </div>
                      <p className="text-xs text-yellow-700 mb-2">
                        Please login to proceed with checkout
                      </p>
                      <button
                        onClick={() => setShowLoginPopup(true)}
                        className="text-xs font-medium text-[#0A4C89] hover:underline"
                      >
                        Click here to login
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className={[
                      "mt-3 sm:mt-4 w-full py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold",
                      "bg-gradient-to-r from-[#0A4C89] via-[#0D5FA8] to-[#1B78D1]",
                      "text-white shadow-lg shadow-[#0A4C89]/30",
                      "hover:shadow-xl hover:shadow-[#0A4C89]/35 hover:translate-y-0.5",
                      "transition-all duration-150 active:scale-[0.98]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A4C89]",
                      isLoading ? "opacity-70 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Checking authentication...
                      </span>
                    ) : isUserLoggedIn ? (
                      "Proceed to checkout"
                    ) : (
                      "Login to checkout"
                    )}
                  </button>

                  <Link
                    href="/products"
                    className="block text-center text-xs sm:text-sm text-[#0A4C89] mt-3 sm:mt-4 font-medium hover:text-[#0D5FA8] underline-offset-4 hover:underline"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>

              {/* Mobile Help Text */}
              <div className="mt-4 sm:hidden p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                <p className="text-xs text-gray-600 text-center">
                  <span className="font-medium">Tip:</span> Swipe left on items to remove
                </p>
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
    <div className="flex justify-between py-1 sm:py-1.5">
      <span className={`text-xs sm:text-sm ${muted ? "text-gray-500" : "text-gray-600"}`}>
        {label}
      </span>
      <span
        className={[
          "text-xs sm:text-sm",
          bold ? "font-semibold" : "font-medium",
          highlight ? "text-[#0A4C89]" : "text-slate-900",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}







// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useCart } from "../components/CartContext";
// import { getLoggedInUser } from "@/lib/auth";
// import { useState, useEffect } from "react";
// import LoginPopup from "../components/LoginPopup"; // Adjust path as needed
// import { ShoppingCart, Trash2, IndianRupee, Package, LogIn } from "lucide-react";

// export default function CartPage() {
//   const router = useRouter();
//   const { cartItems, updateQty, removeFromCart, totals } = useCart();
//   const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);

//   const hasItems = cartItems.length > 0;

//   // Check if user is logged in
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const user = await getLoggedInUser();
//         setIsUserLoggedIn(!!user);
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         setIsUserLoggedIn(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     checkAuth();
//   }, []);

//   const handleCheckout = () => {
//     if (!isUserLoggedIn) {
//       setShowLoginPopup(true);
//       return;
//     }
//     router.push("/checkout");
//   };

//   // Handle successful login from popup
//   const handleLoginSuccess = (user) => {
//     console.log("Login successful", user);
//     setIsUserLoggedIn(true);
//     setShowLoginPopup(false);
//     // Redirect to checkout after successful login
//     router.push("/checkout");
//   };

//   // Close login popup
//   const handleCloseLoginPopup = () => {
//     setShowLoginPopup(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff] relative">
//       {/* Login Popup */}
//       <LoginPopup 
//         isOpen={showLoginPopup}
//         onClose={handleCloseLoginPopup}
//         onLoginSuccess={handleLoginSuccess}
//       />
      
//       <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
//         {/* ===== PAGE TITLE ===== */}
//         <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
//           <div className="flex items-center gap-2">
//             <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
//               <ShoppingCart size={18} />
//             </span>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-[#0A4C89] tracking-tight">
//                 Your Cart
//               </h1>
//               {hasItems && (
//                 <p className="text-xs md:text-sm text-gray-500">
//                   Review items before secure checkout
//                 </p>
//               )}
//             </div>
//           </div>

//           {hasItems && (
//             <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
//               <Package size={14} />
//               {totals.totalQty} items
//             </span>
//           )}
//         </div>

//         {cartItems.length === 0 ? (
//           /* ===== EMPTY STATE ===== */
//           <div className="flex flex-col items-center justify-center text-center py-16 md:py-20 bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-100 shadow-sm">
//             <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0A4C89]/8 text-[#0A4C89] mb-3">
//               <ShoppingCart size={26} />
//             </div>
//             <p className="text-lg font-semibold text-gray-800 mb-1">
//               Your cart is empty
//             </p>
//             <p className="text-sm text-gray-500 mb-6">
//               Add products to continue shopping
//             </p>

//             <Link
//               href="/products"
//               className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0A4C89] to-[#0D5FA8] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition"
//             >
//               Browse products
//             </Link>
//           </div>
//         ) : (
//           /* ===== CART GRID ===== */
//           <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
//             {/* ================= LEFT: ITEMS ================= */}
//             <div className="space-y-4">
//               {cartItems.map((item) => (
//                 <div
//                   key={item.slug}
//                   className="flex flex-col sm:flex-row gap-4 bg-white/80 border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition"
//                 >
//                   {/* IMAGE */}
//                   <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shrink-0">
//                     <Image
//                       src={item.image || "/placeholder.jpg"}
//                       alt={item.name}
//                       fill
//                       className="object-contain p-2"
//                     />
//                   </div>

//                   {/* INFO */}
//                   <div className="flex-1 flex flex-col justify-between">
//                     <div>
//                       <p className="font-semibold text-gray-900 line-clamp-2">
//                         {item.name}
//                       </p>
//                       <p className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500">
//                         <IndianRupee size={14} />
//                         <span>{item.price?.toLocaleString()} / unit</span>
//                       </p>
//                     </div>

//                     {/* QTY + REMOVE */}
//                     <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
//                       {/* QTY */}
//                       <div className="inline-flex items-center gap-3 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1.5">
//                         <button
//                           onClick={() => updateQty(item.slug, -50)}
//                           className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-200 transition text-lg leading-none"
//                         >
//                           −
//                         </button>

//                         <span className="min-w-[40px] text-center font-semibold text-gray-900 text-sm">
//                           {item.qty}
//                         </span>

//                         <button
//                           onClick={() => updateQty(item.slug, +50)}
//                           className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-200 transition text-lg leading-none"
//                         >
//                           +
//                         </button>
//                       </div>

//                       {/* REMOVE */}
//                       <button
//                         onClick={() => removeFromCart(item.slug)}
//                         className="inline-flex items-center gap-1 text-xs sm:text-sm text-red-500 hover:text-red-600 hover:underline"
//                       >
//                         <Trash2 size={14} />
//                         <span>Remove</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* ITEM TOTAL */}
//                   <div className="sm:min-w-[130px] flex sm:flex-col justify-between sm:items-end text-right">
//                     <p className="text-xs text-gray-500 sm:mb-1">Item total</p>
//                     <p className="font-semibold text-gray-900 text-sm sm:text-base">
//                       ₹{(item.qty * (item.price || 0)).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ================= RIGHT: SUMMARY ================= */}
//             <div className="lg:sticky lg:top-24">
//               <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_16px_40px_rgba(15,23,42,0.12)] p-5 sm:p-6">
//                 <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-[#0A4C89]/8 via-transparent to-[#0D5FA8]/14" />

//                 <div className="relative">
//                   <div className="flex items-center justify-between gap-2 mb-4">
//                     <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-slate-900">
//                       <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
//                         <ShoppingCart size={16} />
//                       </span>
//                       <span>Order Summary</span>
//                     </h2>
//                     <span className="text-[11px] font-medium text-gray-500">
//                       {totals.totalDistinct} product
//                       {totals.totalDistinct > 1 ? "s" : ""}
//                     </span>
//                   </div>

//                   <div className="space-y-3 text-sm">
//                     <Row label="Items" value={`${totals.totalQty}`} />
//                     <Row
//                       label="Subtotal"
//                       value={`₹${totals.totalPrice.toLocaleString()}`}
//                     />
//                     <Row
//                       label="Shipping"
//                       value="Calculated at checkout"
//                       muted
//                     />

//                     <hr className="border-slate-100" />

//                     <Row
//                       label="Total"
//                       value={`₹${totals.totalPrice.toLocaleString()}`}
//                       bold
//                       highlight
//                     />
//                   </div>

//                   {/* Login prompt for non-logged in users */}
//                   {!isLoading && !isUserLoggedIn && (
//                     <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
//                       <div className="flex items-center gap-2 text-yellow-800 mb-2">
//                         <LogIn size={16} />
//                         <span className="text-sm font-medium">Login required</span>
//                       </div>
//                       <p className="text-xs text-yellow-700">
//                         Please login to proceed with checkout
//                       </p>
//                       <button
//                         onClick={() => setShowLoginPopup(true)}
//                         className="mt-2 inline-block text-xs font-medium text-[#0A4C89] hover:underline"
//                       >
//                         Click here to login
//                       </button>
//                     </div>
//                   )}

//                   <button
//                     onClick={handleCheckout}
//                     className={[
//                       "mt-5 w-full py-3.5 rounded-xl text-sm sm:text-base font-semibold",
//                       "bg-gradient-to-r from-[#0A4C89] via-[#0D5FA8] to-[#1B78D1]",
//                       "text-white shadow-lg shadow-[#0A4C89]/30",
//                       "hover:shadow-xl hover:shadow-[#0A4C89]/35 hover:translate-y-0.5",
//                       "transition-transform duration-150",
//                       "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A4C89]",
//                       isLoading ? "opacity-70 cursor-not-allowed" : "",
//                     ].join(" ")}
//                   >
//                     {isLoading ? (
//                       "Checking authentication..."
//                     ) : isUserLoggedIn ? (
//                       "Proceed to checkout"
//                     ) : (
//                       "Login to checkout"
//                     )}
//                   </button>

//                   <Link
//                     href="/products"
//                     className="block text-center text-xs sm:text-sm text-[#0A4C89] mt-4 font-medium hover:text-[#0D5FA8] underline-offset-4 hover:underline"
//                   >
//                     Continue shopping
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* small helper row component */
// function Row({ label, value, bold, muted, highlight }) {
//   return (
//     <div className="flex justify-between text-sm">
//       <span className={muted ? "text-gray-500" : "text-gray-600"}>{label}</span>
//       <span
//         className={[
//           bold ? "font-semibold" : "",
//           highlight ? "text-[#0A4C89]" : "text-slate-900",
//         ].join(" ")}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }