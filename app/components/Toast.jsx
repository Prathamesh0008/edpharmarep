"use client";

import { useCart } from "./CartContext";


export default function Toast() {
  const { toast } = useCart();
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[2000]">
      <div className="px-4 py-3 rounded-xl bg-black text-white text-sm shadow-lg">
        {toast.message}
      </div>
    </div>
  );
}
