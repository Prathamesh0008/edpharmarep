"use client";

import { useEffect, useState } from "react";

export default function GlobalLoader() {
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Hide loader after page is fully loaded
    const handleLoad = () => {
      setFadeOut(true);
      setTimeout(() => setShowLoader(false), 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Fallback timer
    const timer = setTimeout(() => {
      handleLoad();
    }, 2000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, []);

  if (!showLoader) return null;

  return (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce"></div>
        </div>
        <p className="text-gray-700 font-semibold tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}
