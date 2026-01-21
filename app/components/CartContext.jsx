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
const INITIAL_BULK_QUANTITY = 100; // Initial bulk quantity
const INCREMENT_STEP = 10; // Step for + and - buttons

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
      isBulkAdd = true,
    } = options;

    // CRITICAL FIX: Validate and ensure product has all required properties
    const validatedProduct = {
      ...product,
      // Ensure these properties always exist
      name: product.name || "Unknown Product",
      slug: product.slug || product.id || `product-${Date.now()}`,
      price: Number(product.price) || 0, // Convert to number, default to 0
      image: product.image || "/placeholder.jpg",
      brand: product.brand || "Unknown Brand",
    };

    console.log("🛒 Cart adding validated product:", {
      name: validatedProduct.name,
      price: validatedProduct.price,
      originalPrice: product.price
    });

    setCartItems((prev) => {
      const existing = prev.find((p) => p.slug === validatedProduct.slug);

      if (existing) {
        // When product exists, add INCREMENT_STEP units on subsequent adds
        return prev.map((p) =>
          p.slug === validatedProduct.slug
            ? { 
                ...p, 
                qty: p.qty + INCREMENT_STEP,
                // Update price if it was 0 before
                price: p.price === 0 ? validatedProduct.price : p.price,
                displayQty: 1
              }
            : p
        );
      }

      // First time add: use INITIAL_BULK_QUANTITY (100)
      return [...prev, { 
        ...validatedProduct, 
        qty: INITIAL_BULK_QUANTITY,
        displayQty: 1,
        bulkUnit: INITIAL_BULK_QUANTITY
      }];
    });

    if (shouldOpenDrawer) openDrawer();
    if (shouldToast) showToast(`Added ${INITIAL_BULK_QUANTITY} units: ${validatedProduct.name}`);
  };

  /* ---------- UPDATE QTY (B2B VERSION) ---------- */
  const updateQty = (slug, delta, isBulkUpdate = true) => {
    setCartItems((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;

        // For B2B: increment/decrement by INCREMENT_STEP (10 units)
        const incrementAmount = isBulkUpdate ? INCREMENT_STEP : 1;
        const newQty = p.qty + (delta * incrementAmount);
        
        // Minimum should be INITIAL_BULK_QUANTITY (100 units) for bulk items
        const minQty = isBulkUpdate ? INITIAL_BULK_QUANTITY : 1;
        
        return {
          ...p,
          qty: Math.max(minQty, newQty), // Min 100 units for bulk
          displayQty: 1 // Always 1 for cart badge
        };
      })
    );
  };

  /* ---------- BULK SPECIFIC FUNCTIONS ---------- */
  const addBulkToCart = (product) => {
    return addToCart(product, INITIAL_BULK_QUANTITY, { isBulkAdd: true });
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

    // Calculate bulk units (how many "batches" of INITIAL_BULK_QUANTITY)
    const totalBulkUnits = cartItems.reduce((s, i) => {
      return s + Math.ceil(i.qty / INITIAL_BULK_QUANTITY);
    }, 0);

    return { 
      totalDistinct, 
      totalQty, 
      totalPrice,
      totalBulkUnits,
      initialBulkQuantity: INITIAL_BULK_QUANTITY,
      incrementStep: INCREMENT_STEP
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
        getCartBadgeCount,
        INITIAL_BULK_QUANTITY,
        INCREMENT_STEP
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

// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// /* ================= CONTEXT ================= */

// const CartContext = createContext(null);
// const LS_KEY = "edpharma_cart_v1";
// const BULK_QUANTITY = 100; // B2B bulk quantity increment

// /* ================= PROVIDER ================= */

// export function CartProvider({ children }) {
//   const [cartOpen, setCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const [toast, setToast] = useState(null);

//   const openDrawer = () => {
//     console.log("🟥 openDrawer() called");
//     setCartOpen(true);
//   };

//   useEffect(() => {
//     console.log("🟨 CartProvider mount");
//   }, []);

//   const closeDrawer = () => setCartOpen(false);

//   /* ---------- LOAD FROM LOCALSTORAGE ---------- */
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(LS_KEY);
//       if (raw) setCartItems(JSON.parse(raw));
//     } catch (err) {
//       console.error("Cart load error", err);
//     }
//   }, []);

//   /* ---------- SAVE TO LOCALSTORAGE ---------- */
//   useEffect(() => {
//     try {
//       localStorage.setItem(LS_KEY, JSON.stringify(cartItems));
//     } catch (err) {
//       console.error("Cart save error", err);
//     }
//   }, [cartItems]);

//   /* ---------- TOAST ---------- */
//   const showToast = (message) => {
//     const id = Date.now();
//     setToast({ message, id });
//     setTimeout(() => {
//       setToast((t) => (t?.id === id ? null : t));
//     }, 1800);
//   };

//   /* ---------- ADD TO CART (B2B VERSION) ---------- */
//   // In CartContext.jsx - MODIFY the addToCart function:
// /* ---------- ADD TO CART (B2B VERSION) ---------- */
// const addToCart = (product, qty = 1, options = {}) => {
//   const {
//     openDrawer: shouldOpenDrawer = false,
//     toast: shouldToast = true,
//     isBulkAdd = true,
//   } = options;

//   // CRITICAL FIX: Validate and ensure product has all required properties
//   const validatedProduct = {
//     ...product,
//     // Ensure these properties always exist
//     name: product.name || "Unknown Product",
//     slug: product.slug || product.id || `product-${Date.now()}`,
//     price: Number(product.price) || 0, // Convert to number, default to 0
//     image: product.image || "/placeholder.jpg",
//     brand: product.brand || "Unknown Brand",
//   };

//   console.log("🛒 Cart adding validated product:", {
//     name: validatedProduct.name,
//     price: validatedProduct.price,
//     originalPrice: product.price
//   });

//   setCartItems((prev) => {
//     const existing = prev.find((p) => p.slug === validatedProduct.slug);

//     if (existing) {
//       return prev.map((p) =>
//         p.slug === validatedProduct.slug
//           ? { 
//               ...p, 
//               qty: p.qty + BULK_QUANTITY,
//               // Update price if it was 0 before
//               price: p.price === 0 ? validatedProduct.price : p.price,
//               displayQty: 1
//             }
//           : p
//       );
//     }

//     return [...prev, { 
//       ...validatedProduct, 
//       qty: BULK_QUANTITY,
//       displayQty: 1,
//       bulkUnit: BULK_QUANTITY
//     }];
//   });

//   if (shouldOpenDrawer) openDrawer();
//   if (shouldToast) showToast(`Added ${BULK_QUANTITY} units: ${validatedProduct.name}`);
// };

//   /* ---------- UPDATE QTY (B2B VERSION) ---------- */
//   const updateQty = (slug, delta, isBulkUpdate = true) => {
//     setCartItems((prev) =>
//       prev.map((p) => {
//         if (p.slug !== slug) return p;

//         // For B2B: increment/decrement by BULK_QUANTITY (50 units)
//         const incrementAmount = isBulkUpdate ? BULK_QUANTITY : 1;
//         const newQty = p.qty + (delta * incrementAmount);
        
//         // Minimum should be BULK_QUANTITY (50 units)
//         const minQty = isBulkUpdate ? BULK_QUANTITY : 1;
        
//         return {
//           ...p,
//           qty: Math.max(minQty, newQty), // Min 50 units
//           displayQty: 1 // Always 1 for cart badge
//         };
//       })
//     );
//   };

//   /* ---------- BULK SPECIFIC FUNCTIONS ---------- */
//   const addBulkToCart = (product) => {
//     return addToCart(product, BULK_QUANTITY, { isBulkAdd: true });
//   };

//   const incrementBulk = (slug) => {
//     updateQty(slug, 1, true);
//   };

//   const decrementBulk = (slug) => {
//     updateQty(slug, -1, true);
//   };

//   /* ---------- REMOVE ---------- */
//   const removeFromCart = (slug) =>
//     setCartItems((prev) => prev.filter((p) => p.slug !== slug));

//   const clearCart = () => setCartItems([]);

//   /* ---------- TOTALS (B2B VERSION) ---------- */
//   const totals = useMemo(() => {
//     const totalDistinct = cartItems.length;
//     const totalQty = cartItems.reduce(
//       (s, i) => s + (Number(i.qty) || 0),
//       0
//     );
//     const totalPrice = cartItems.reduce((s, i) => {
//       const price = Number(i.price) || 0;
//       return s + price * i.qty;
//     }, 0);

//     // Calculate bulk units (how many "batches" of BULK_QUANTITY)
//     const totalBulkUnits = cartItems.reduce((s, i) => {
//       return s + Math.ceil(i.qty / BULK_QUANTITY);
//     }, 0);

//     return { 
//       totalDistinct, 
//       totalQty, 
//       totalPrice,
//       totalBulkUnits,
//       bulkQuantity: BULK_QUANTITY
//     };
//   }, [cartItems]);

//   /* ---------- GET CART BADGE COUNT ---------- */
//   const getCartBadgeCount = () => {
//     // For cart badge: show count of distinct products (always 1 per product)
//     return cartItems.length;
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartOpen,
//         openDrawer,
//         closeDrawer,
//         cartItems,
//         addToCart,
//         addBulkToCart,
//         updateQty,
//         incrementBulk,
//         decrementBulk,
//         removeFromCart,
//         clearCart,
//         toast,
//         totals,
//         getCartBadgeCount, // Use this for cart badge
//         BULK_QUANTITY,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// /* ================= HOOK ================= */

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider");
//   }
//   return context;
// };