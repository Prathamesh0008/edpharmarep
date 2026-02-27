"use client";

import { useState, useEffect, createContext, useContext } from "react";

// Create loading context
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Small delay to show the fade-out animation
      setTimeout(() => {
        setShowContent(true);
      }, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
  <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
    {!showContent ? (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center space-y-8">

          {/* Brand Name ABOVE Circle */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-[0.35em] text-gray-800">
              ED PHARMA
            </h1>
            <p className="text-xs text-gray-500 mt-3 tracking-[0.25em] uppercase">
              Pharmaceutical Excellence
            </p>
          </div>

          {/* Professional Spinner Circle */}
          <div className="relative flex items-center justify-center">

            {/* Base Circle */}
            <div className="w-28 h-28 rounded-full border border-gray-200"></div>

            {/* Rotating Arc */}
            <div className="absolute w-28 h-28 rounded-full border-2 border-t-gray-700 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

          </div>

          {/* Thin Loading Line */}
          <div className="w-48 h-[1px] bg-gray-200 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-gray-700 animate-gray-loading"></div>
          </div>

        </div>
      </div>
    ) : (
      children
    )}
  </LoadingContext.Provider>
);
}