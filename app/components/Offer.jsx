"use client";
import { useState, useEffect } from "react";

const Offer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const colors = {
    primary: "#20396f",
    accent: "#326a9f",
  };

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 5000); 
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted || !isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div 
        // 👇 I REMOVED THE DUPLICATE LINE HERE
        className="relative flex flex-col w-full max-w-[450px] bg-white shadow-2xl rounded-xl overflow-hidden h-auto md:h-[450px]"
        style={{ 
          animation: "scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-3 z-10 p-2 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* TOP SECTION */}
        <div 
          className="flex flex-col items-center justify-center text-white py-8 md:py-0 md:h-[40%] text-center px-4"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` 
          }}
        >
          <p className="mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-80">
            Wholesale Partner
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ED PHARMA
          </h2>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col items-center justify-between p-6 md:h-[60%] md:p-8 text-center bg-white gap-4 md:gap-0">
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 leading-tight">
              New Distributor Offer
            </h3>
            <p className="text-sm text-slate-600 px-2 leading-relaxed">
              Open a trade account and get 
              <span className="font-bold text-slate-900"> Tier-1 Pricing</span> on 
              your first bulk order.
            </p>
          </div>

          <div className="w-full border-y border-dashed border-gray-200 py-3 md:py-4">
             <span 
               className="block text-3xl font-black"
               style={{ color: colors.primary }}
             >
               5% NET OFF
             </span>
             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
               First Invoice Only
             </span>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="w-full py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] active:scale-[0.98] rounded shadow-md"
            style={{ backgroundColor: colors.accent }}
          >
            Request Catalog
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Offer;