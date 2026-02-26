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
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Mobile Loading Animation */}
          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            {/* Logo with pulse animation */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">ED</span>
              </div>
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>

            {/* Loading text with dots animation */}
            <div className="text-center">
              <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">Loading ED Pharma</p>
              <div className="flex justify-center space-x-1 mt-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>

            {/* Optional: Progress bar for larger screens */}
            <div className="w-32 sm:w-40 md:w-48 h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-blue-600 rounded-full animate-progress"
                style={{ 
                  animation: 'progress 1.5s ease-in-out infinite',
                }}
              ></div>
            </div>

            {/* Mobile-specific message */}
            <p className="text-xs text-gray-500 sm:hidden">Please wait...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </LoadingContext.Provider>
  );
}