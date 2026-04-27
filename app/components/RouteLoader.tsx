"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Also detect pathname changes (navigation completion)
  useEffect(() => {
    // When pathname changes, navigation is complete
    setLoading(false);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Horizontal Dots Loader */}
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
