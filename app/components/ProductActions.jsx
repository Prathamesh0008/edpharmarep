// app/components/ProductActions.jsx
"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";

export default function ProductActions({ product, theme }) {
  const router = useRouter();
  const { addBulkToCart, BULK_QUANTITY } = useCart();
  const [batchCount, setBatchCount] = useState(1); // Number of batches
  const [loading, setLoading] = useState(false);

  const totalUnits = batchCount * BULK_QUANTITY;

  const handleAddToCart = () => {
    // Add product BATCH_COUNT times (each batch = BULK_QUANTITY units)
    for (let i = 0; i < batchCount; i++) {
      addBulkToCart(product);
    }
  };

  const handleBuyNow = async () => {
    setLoading(true);
    
    try {
      // Clear any existing cart items for single product checkout
      // If you want to keep cart context, you can add this product first
      for (let i = 0; i < batchCount; i++) {
        addBulkToCart(product);
      }
      
      // Navigate to checkout page
      router.push(`/checkout?product=${encodeURIComponent(product.slug || product.id)}&quantity=${totalUnits}`);
      
    } catch (error) {
      console.error("Error in Buy Now:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Bulk Quantity Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Batch Size:</span>
          <span className="text-sm font-semibold text-[#0A4C89]">
            {BULK_QUANTITY} units per batch
          </span>
        </div>
        
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <button
            onClick={() => setBatchCount(Math.max(1, batchCount - 1))}
            className="w-10 h-10 rounded-lg border text-lg font-semibold hover:bg-gray-50 transition"
          >
            −
          </button>

          <div className="text-center">
            <div className="text-lg font-semibold">{batchCount} batch</div>
            <div className="text-sm text-gray-500">{totalUnits} units total</div>
          </div>

          <button
            onClick={() => setBatchCount(batchCount + 1)}
            className="w-10 h-10 rounded-lg border text-lg font-semibold hover:bg-gray-50 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          className="px-8 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition"
          style={{ backgroundColor: theme.primary }}
        >
          Add {batchCount} Batch{batchCount > 1 ? 'es' : ''} ({totalUnits} units)
        </button>

        <button
          onClick={handleBuyNow}
          disabled={loading}
          className="px-8 py-3 rounded-xl border-2 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          style={{
            borderColor: theme.primary,
            color: theme.primary,
            backgroundColor: loading ? "rgba(255,255,255,0.7)" : "white",
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Buy Now (${totalUnits} units)`
          )}
        </button>
      </div>

      {/* Bulk Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800 text-center">
          <span className="font-semibold">B2B Purchase:</span> Minimum order {BULK_QUANTITY} units per product
        </p>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useCart } from "./CartContext";

// export default function ProductActions({ product, theme }) {
//   const { addBulkToCart, BULK_QUANTITY } = useCart();
//   const [batchCount, setBatchCount] = useState(1); // Number of batches

//   const totalUnits = batchCount * BULK_QUANTITY;

//   return (
//     <div className="mt-8 flex flex-col gap-6">
//       {/* Bulk Quantity Selector */}
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium text-gray-700">Batch Size:</span>
//           <span className="text-sm font-semibold text-[#0A4C89]">
//             {BULK_QUANTITY} units per batch
//           </span>
//         </div>
        
//         <div className="flex items-center gap-4 justify-center md:justify-start">
//           <button
//             onClick={() => setBatchCount(Math.max(1, batchCount - 1))}
//             className="w-10 h-10 rounded-lg border text-lg font-semibold hover:bg-gray-50 transition"
//           >
//             −
//           </button>

//           <div className="text-center">
//             <div className="text-lg font-semibold">{batchCount} batch</div>
//             <div className="text-sm text-gray-500">{totalUnits} units total</div>
//           </div>

//           <button
//             onClick={() => setBatchCount(batchCount + 1)}
//             className="w-10 h-10 rounded-lg border text-lg font-semibold hover:bg-gray-50 transition"
//           >
//             +
//           </button>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <button
//           onClick={() => {
//             // Add product BATCH_COUNT times (each batch = BULK_QUANTITY units)
//             for (let i = 0; i < batchCount; i++) {
//               addBulkToCart(product);
//             }
//           }}
//           className="px-8 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition"
//           style={{ backgroundColor: theme.primary }}
//         >
//           Add {batchCount} Batch{batchCount > 1 ? 'es' : ''} ({totalUnits} units)
//         </button>

//         <button
//           disabled
//           className="px-8 py-3 rounded-xl opacity-70 cursor-not-allowed"
//           style={{
//             border: `2px solid ${theme.primary}`,
//             color: theme.primary,
//           }}
//         >
//           Buy Now
//         </button>
//       </div>

//       {/* Bulk Info */}
//       <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
//         <p className="text-sm text-blue-800 text-center">
//           <span className="font-semibold">B2B Purchase:</span> Minimum order {BULK_QUANTITY} units per product
//         </p>
//       </div>
//     </div>
//   );
// }




