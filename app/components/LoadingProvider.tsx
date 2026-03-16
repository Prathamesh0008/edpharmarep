// app/components/LoadingProvider.tsx

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Small delay to show the fade-out animation
      setTimeout(() => {
        setShowContent(true);
      }, 800);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {!showContent ? (
        <>
          {/* Blur Overlay */}
          <div 
            className={`fixed inset-0 z-[9999] transition-all duration-1000 ${
              isLoading ? "backdrop-blur-xl bg-white/30" : "backdrop-blur-0 bg-transparent pointer-events-none"
            }`}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>
            
            {/* Animated particles/glow effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            
            {/* Loading Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
              <div className="flex flex-col items-center space-y-12">
                {/* Brand Section with Blur Animation */}
                <div className="text-center space-y-4">
                  <h1 className="text-5xl font-light tracking-[0.45em] text-gray-800 animate-fade-in-up">
                    <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                      ED PHARMA
                    </span>
                  </h1>
                  <p className="text-sm text-gray-500 tracking-[0.35em] uppercase animate-fade-in-up animation-delay-300">
                    Pharmaceutical Excellence
                  </p>
                </div>

                {/* Professional Spinner with Progress Ring */}
                <div className="relative flex items-center justify-center">
                  {/* Base Circle with Blur */}
                  <div className="w-36 h-36 rounded-full border-2 border-gray-200/50 backdrop-blur-sm"></div>
                  
                  {/* Rotating Arc with Gradient */}
                  <div className="absolute w-36 h-36 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
                  
                  {/* Inner Circle with Progress */}
                  <div className="absolute w-28 h-28 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-light text-gray-700">{progress}%</div>
                      <div className="text-xs text-gray-400 mt-1">LOADING</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar with Blur Effect */}
                <div className="w-64 space-y-3">
                  <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-200 to-blue-900 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  {/* Loading Dots */}
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>  

                {/* Loading Message with Blur */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500 animate-pulse">
                    Preparing your experience
                  </p>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full">
                    {progress < 30 && "Initializing..."}
                    {progress >= 30 && progress < 60 && "Loading resources..."}
                    {progress >= 60 && progress < 90 && "Almost there..."}
                    {progress >= 90 && "Ready!"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content with Blur Effect */}
          <div 
            className={`transition-all duration-1000 ${
              isLoading ? "blur-sm scale-95 opacity-50" : "blur-0 scale-100 opacity-100"
            }`}
          >
            {children}
          </div>
        </>
      ) : (
        children
      )}
    </LoadingContext.Provider>
  );
}