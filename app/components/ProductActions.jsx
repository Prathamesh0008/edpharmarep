// app/components/ProductActions.jsx
"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";
import QuantitySelector from "./QuantitySelector";

export default function ProductActions({ product, theme }) {
  const router = useRouter();
  const { addToCart, INITIAL_BULK_QUANTITY, INCREMENT_STEP, getPriceForQuantity } = useCart();
  const [quantity, setQuantity] = useState(INITIAL_BULK_QUANTITY);
  const [loading, setLoading] = useState(false);

  // Get the price for current quantity
  const currentUnitPrice = getPriceForQuantity(product, quantity);
  const totalPrice = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      name: product.name || "Product",
      slug: product.slug || product.id || "",
      price: currentUnitPrice,
      image: product.image || "/placeholder.jpg",
      brand: product.brand || "Unknown Brand",
    };
    
    addToCart(productToAdd, quantity, {
      openDrawer: true,
      toast: true,
    });
  };

  const handleBuyNow = async () => {
    setLoading(true);
    
    try {
      const productToAdd = {
        ...product,
        price: currentUnitPrice,
        name: product.name || "Product",
        slug: product.slug || product.id || "",
      };
      
      addToCart(productToAdd, quantity, {
        openDrawer: false,
        toast: false,
      });
      
      router.push(`/checkout?product=${encodeURIComponent(product.slug || product.id)}&quantity=${quantity}`);
      
    } catch (error) {
      console.error("Error in Buy Now:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Price Display */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          €{totalPrice.toLocaleString()} {/* Changed from ₹ to € */}
        </span>
        <span className="text-sm text-gray-500">
          (€{currentUnitPrice.toLocaleString()}/unit) {/* Changed from ₹ to € */}
        </span>
      </div>

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        minQuantity={INITIAL_BULK_QUANTITY}
        incrementStep={INCREMENT_STEP}
        size="lg"
        showUnitLabel={true}
      />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          className="px-8 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition font-semibold cursor-pointer flex-1"
          style={{ backgroundColor: theme.primary }}
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          disabled={loading}
          className="px-8 py-3 rounded-xl border-2 cursor-pointer font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center flex-1"
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
            `Buy Now`
          )}
        </button>
      </div>

      {/* Bulk Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800 text-center">
          <span className="font-semibold">B2B Purchase:</span> Minimum order is {INITIAL_BULK_QUANTITY} units.
          <span className="block text-xs text-blue-600 mt-1">
            Adjust quantity using + and - buttons ({INCREMENT_STEP} units per click) or type manually
          </span>
        </p>
      </div>
    </div>
  );
}