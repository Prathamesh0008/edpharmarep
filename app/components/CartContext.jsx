"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ================= CONTEXT ================= */

const CartContext = createContext(null);
const LS_KEY = "edpharma_cart_v1";
const BULK_QUANTITY = 50; // B2B bulk quantity increment

/* ================= PROVIDER ================= */

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  const openDrawer = () => {
    console.log("🟥 openDrawer() called");
    setCartOpen(true);
  };

  useEffect(() => {
    console.log("🟨 CartProvider mount");
  }, []);

  const closeDrawer = () => setCartOpen(false);

  /* ---------- LOAD FROM LOCALSTORAGE ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setCartItems(JSON.parse(raw));
    } catch (err) {
      console.error("Cart load error", err);
    }
  }, []);

  /* ---------- SAVE TO LOCALSTORAGE ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error("Cart save error", err);
    }
  }, [cartItems]);

  /* ---------- TOAST ---------- */
  const showToast = (message) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 1800);
  };

  /* ---------- ADD TO CART (B2B VERSION) ---------- */
  const addToCart = (product, qty = 1, options = {}) => {
    const {
      openDrawer: shouldOpenDrawer = false,
      toast: shouldToast = true,
      isBulkAdd = true, // Default to bulk add for B2B
    } = options;

    setCartItems((prev) => {
      const existing = prev.find((p) => p.slug === product.slug);

      if (existing) {
        // If product exists, add BULK_QUANTITY (50 units)
        return prev.map((p) =>
          p.slug === product.slug
            ? { 
                ...p, 
                qty: p.qty + BULK_QUANTITY, // Add 50 more units
                // Keep display properties
                displayQty: 1 // For cart badge - always 1
              }
            : p
        );
      }

      // First time add - add BULK_QUANTITY (50 units)
      return [...prev, { 
        ...product, 
        qty: BULK_QUANTITY, // Actual quantity = 50
        displayQty: 1, // For cart badge - always 1
        bulkUnit: BULK_QUANTITY // Store bulk unit
      }];
    });

    if (shouldOpenDrawer) openDrawer();
    if (shouldToast) showToast(`Added ${BULK_QUANTITY} units: ${product.name}`);
  };

  /* ---------- UPDATE QTY (B2B VERSION) ---------- */
  const updateQty = (slug, delta, isBulkUpdate = true) => {
    setCartItems((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;

        // For B2B: increment/decrement by BULK_QUANTITY (50 units)
        const incrementAmount = isBulkUpdate ? BULK_QUANTITY : 1;
        const newQty = p.qty + (delta * incrementAmount);
        
        // Minimum should be BULK_QUANTITY (50 units)
        const minQty = isBulkUpdate ? BULK_QUANTITY : 1;
        
        return {
          ...p,
          qty: Math.max(minQty, newQty), // Min 50 units
          displayQty: 1 // Always 1 for cart badge
        };
      })
    );
  };

  /* ---------- BULK SPECIFIC FUNCTIONS ---------- */
  const addBulkToCart = (product) => {
    return addToCart(product, BULK_QUANTITY, { isBulkAdd: true });
  };

  const incrementBulk = (slug) => {
    updateQty(slug, 1, true);
  };

  const decrementBulk = (slug) => {
    updateQty(slug, -1, true);
  };

  /* ---------- REMOVE ---------- */
  const removeFromCart = (slug) =>
    setCartItems((prev) => prev.filter((p) => p.slug !== slug));

  const clearCart = () => setCartItems([]);

  /* ---------- TOTALS (B2B VERSION) ---------- */
  const totals = useMemo(() => {
    const totalDistinct = cartItems.length;
    const totalQty = cartItems.reduce(
      (s, i) => s + (Number(i.qty) || 0),
      0
    );
    const totalPrice = cartItems.reduce((s, i) => {
      const price = Number(i.price) || 0;
      return s + price * i.qty;
    }, 0);

    // Calculate bulk units (how many "batches" of BULK_QUANTITY)
    const totalBulkUnits = cartItems.reduce((s, i) => {
      return s + Math.ceil(i.qty / BULK_QUANTITY);
    }, 0);

    return { 
      totalDistinct, 
      totalQty, 
      totalPrice,
      totalBulkUnits,
      bulkQuantity: BULK_QUANTITY
    };
  }, [cartItems]);

  /* ---------- GET CART BADGE COUNT ---------- */
  const getCartBadgeCount = () => {
    // For cart badge: show count of distinct products (always 1 per product)
    return cartItems.length;
  };

  return (
    <CartContext.Provider
      value={{
        cartOpen,
        openDrawer,
        closeDrawer,
        cartItems,
        addToCart,
        addBulkToCart,
        updateQty,
        incrementBulk,
        decrementBulk,
        removeFromCart,
        clearCart,
        toast,
        totals,
        getCartBadgeCount, // Use this for cart badge
        BULK_QUANTITY,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};