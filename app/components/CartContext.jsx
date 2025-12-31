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

  /* ---------- ADD TO CART ---------- */
  const addToCart = (product, qty = 1, options = {}) => {
  const {
    openDrawer: shouldOpenDrawer = false,
    toast: shouldToast = true,
  } = options;

  setCartItems((prev) => {
    const existing = prev.find((p) => p.slug === product.slug);

    // 🟢 If product already in cart → +1 only
    if (existing) {
      return prev.map((p) =>
        p.slug === product.slug
          ? { ...p, qty: p.qty + 1 }
          : p
      );
    }

    // 🟢 First time add → qty = 1
    return [...prev, { ...product, qty: 1 }];
  });

  if (shouldOpenDrawer) openDrawer();
  if (shouldToast) showToast(`Added: ${product.name}`);
};


  /* ---------- UPDATE QTY ---------- */
  const updateQty = (slug, delta) => {
  setCartItems((prev) =>
    prev.map((p) => {
      if (p.slug !== slug) return p;

      const newQty = p.qty + delta;
      
      return {
        ...p,
        qty: Math.max(1, newQty), // ⛔ min 1 product
      };
    })
  );
};


  /* ---------- REMOVE ---------- */
  const removeFromCart = (slug) =>
    setCartItems((prev) => prev.filter((p) => p.slug !== slug));

  const clearCart = () => setCartItems([]);

  /* ---------- TOTALS ---------- */
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

    return { totalDistinct, totalQty, totalPrice };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartOpen,
        openDrawer,
        closeDrawer,
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        toast,
        totals,
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
