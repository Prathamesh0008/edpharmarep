"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

export default function ProductActions({ product, theme }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(50);

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Quantity */}
      <div className="flex items-center gap-4 justify-center md:justify-start">
        <button
          onClick={() => setQty(Math.max(50, qty - 50))}
          className="px-4 py-2 rounded-lg border text-lg font-semibold"
        >
          −
        </button>

        <span className="text-lg font-semibold">{qty}</span>

        <button
          onClick={() => setQty(qty + 50)}
          className="px-4 py-2 rounded-lg border text-lg font-semibold"
        >
          +
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() =>
            addToCart(product, qty, {
              toast: true,
              openDrawer: true,
            })
          }
          className="px-8 py-3 text-white rounded-xl shadow-md"
          style={{ backgroundColor: theme.primary }}
        >
          Add to Cart
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
    </div>
  );
}
