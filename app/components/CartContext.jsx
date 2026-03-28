"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProductPricing } from "@/app/data/pricing"; // Import pricing function

/* ================= CONTEXT ================= */

const CartContext = createContext(null);
const LS_KEY = "edpharma_cart_v1";
const INITIAL_BULK_QUANTITY = 100; // Initial bulk quantity
const INCREMENT_STEP = 10; // Step for + and - buttons

// Helper function to extract product name from object or string
const getProductName = (product) => {
  if (!product) return "Unknown Product";
  
  // If name is a string, return it
  if (typeof product.name === 'string') {
    return product.name;
  }
  
  // If name is an object with language keys (like {en: "..."})
  if (product.name && typeof product.name === 'object') {
    // Try to get English version first, then any other language, or fallback to slug
    return product.name.en || 
           product.name[Object.keys(product.name)[0]] || 
           product.slug || 
           "Unknown Product";
  }
  
  // Fallback to slug or default
  return product.slug || "Unknown Product";
};

/* ================= PROVIDER ================= */

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  const openDrawer = () => {
    setCartOpen(true);
  };

  const closeDrawer = () => setCartOpen(false);

  /* ---------- LOAD FROM LOCALSTORAGE ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const loadedItems = JSON.parse(raw);
        // Ensure all items have proper name strings (migrate old data)
        const migratedItems = loadedItems.map(item => ({
          ...item,
          name: typeof item.name === 'object' 
            ? (item.name.en || item.name[Object.keys(item.name)[0]] || item.slug || "Unknown Product")
            : item.name
        }));
        setCartItems(migratedItems);
      }
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

  /* ---------- GET PRICE FOR QUANTITY ---------- */
  const getPriceForQuantity = (product, quantity) => {
    try {
      // If product already has price based on quantity, use that
      if (product.price && typeof product.price === 'number') {
        return product.price;
      }
      
      // Otherwise fetch pricing from pricing.js
      const pricing = getProductPricing(product.slug || product.id);
      if (pricing && pricing.price) {
        return pricing.price;
      }
      
      // Fallback
      return product.price || 0;
    } catch (error) {
      console.error("Error getting price:", error);
      return product.price || 0;
    }
  };

  /* ---------- ADD TO CART (B2B VERSION) ---------- */
  const addToCart = (product, qty = INITIAL_BULK_QUANTITY, options = {}) => {
    const {
      openDrawer: shouldOpenDrawer = false,
      toast: shouldToast = true,
      isBulkAdd = true,
    } = options;

    // Get the correct price based on quantity
    const unitPrice = getPriceForQuantity(product, qty);
    
    // Extract the product name as a string
    const productName = getProductName(product);

    const validatedProduct = {
      ...product,
      name: productName, // Store as string, not object
      slug: product.slug || product.id || `product-${Date.now()}`,
      price: Number(unitPrice) || 0,
      originalPrice: Number(product.price) || 0,
      image: product.image || "/placeholder.jpg",
      brand: product.brand || "Unknown Brand",
    };

    setCartItems((prev) => {
      const existing = prev.find((p) => p.slug === validatedProduct.slug);

      if (existing) {
        // When product exists, add the quantity
        return prev.map((p) =>
          p.slug === validatedProduct.slug
            ? { 
                ...p, 
                qty: p.qty + qty,
                price: Number(unitPrice) || p.price, // Update price based on new total
              }
            : p
        );
      }

      return [...prev, { 
        ...validatedProduct, 
        qty: qty,
      }];
    });

    if (shouldOpenDrawer) openDrawer();
    if (shouldToast) showToast(`Added ${qty} units: ${productName}`);
  };

  /* ---------- UPDATE QTY WITH MANUAL INPUT ---------- */
  const updateQuantity = (slug, newQuantity) => {
    const qty = Math.max(INITIAL_BULK_QUANTITY, Number(newQuantity) || INITIAL_BULK_QUANTITY);
    
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.slug !== slug) return item;
        
        // Get updated price based on new quantity
        const updatedPrice = getPriceForQuantity(item, qty);
        
        return {
          ...item,
          qty,
          price: Number(updatedPrice) || item.price,
        };
      })
    );
  };

  /* ---------- INCREMENT/DECREMENT BY STEP ---------- */
  const incrementBulk = (slug) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.slug !== slug) return item;
        
        const newQty = item.qty + INCREMENT_STEP;
        const updatedPrice = getPriceForQuantity(item, newQty);
        
        return {
          ...item,
          qty: newQty,
          price: Number(updatedPrice) || item.price,
        };
      })
    );
  };

  const decrementBulk = (slug) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.slug !== slug) return item;
        
        const newQty = Math.max(INITIAL_BULK_QUANTITY, item.qty - INCREMENT_STEP);
        const updatedPrice = getPriceForQuantity(item, newQty);
        
        return {
          ...item,
          qty: newQty,
          price: Number(updatedPrice) || item.price,
        };
      })
    );
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

    const totalBulkUnits = cartItems.reduce((s, i) => {
      return s + Math.ceil(i.qty / INITIAL_BULK_QUANTITY);
    }, 0);

    return { 
      totalDistinct, 
      totalQty, 
      totalPrice,
      totalBulkUnits,
    };
  }, [cartItems]);

  /* ---------- GET CART BADGE COUNT ---------- */
  const getCartBadgeCount = () => {
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
        updateQuantity,
        incrementBulk,
        decrementBulk,
        removeFromCart,
        clearCart,
        toast,
        totals,
        getCartBadgeCount,
        INITIAL_BULK_QUANTITY,
        INCREMENT_STEP,
        getPriceForQuantity, // Expose for use in components
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