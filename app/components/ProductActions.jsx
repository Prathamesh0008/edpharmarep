"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

export default function ProductActions({ product, theme }) {
  const { addBulkToCart, BULK_QUANTITY } = useCart();
  const [batchCount, setBatchCount] = useState(1); // Number of batches

  const totalUnits = batchCount * BULK_QUANTITY;

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
          onClick={() => {
            // Add product BATCH_COUNT times (each batch = BULK_QUANTITY units)
            for (let i = 0; i < batchCount; i++) {
              addBulkToCart(product);
            }
          }}
          className="px-8 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition"
          style={{ backgroundColor: theme.primary }}
        >
          Add {batchCount} Batch{batchCount > 1 ? 'es' : ''} ({totalUnits} units)
        </button>

        <button
          disabled
          className="px-8 py-3 rounded-xl opacity-70 cursor-not-allowed"
          style={{
            border: `2px solid ${theme.primary}`,
            color: theme.primary,
          }}
        >
          Buy Now
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
//   const { addToCart } = useCart();
//   const [qty, setQty] = useState(50);

//   return (
//     <div className="mt-8 flex flex-col gap-6">
//       {/* Quantity */}
//       <div className="flex items-center gap-4 justify-center md:justify-start">
//         <button
//           onClick={() => setQty(Math.max(50, qty - 50))}
//           className="px-4 py-2 rounded-lg border text-lg font-semibold"
//         >
//           −
//         </button>

//         <span className="text-lg font-semibold">{qty}</span>

//         <button
//           onClick={() => setQty(qty + 50)}
//           className="px-4 py-2 rounded-lg border text-lg font-semibold"
//         >
//           +
//         </button>
//       </div>

//       {/* Actions */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <button
//           onClick={() =>
//             addToCart(product, qty, {
//               toast: true,
//               openDrawer: true,
//             })
//           }
//           className="px-8 py-3 text-white rounded-xl shadow-md"
//           style={{ backgroundColor: theme.primary }}
//         >
//           Add to Cart
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
//     </div>
//   );
// }
