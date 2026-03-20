"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RouteLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timeoutId;

    const handleRouteChangeStart = () => {
      // Show loader only if navigation takes more than 200ms
      timeoutId = setTimeout(() => {
        setLoading(true);
      }, 200);
    };

    const handleRouteChangeComplete = () => {
      // Clear the timeout and hide loader immediately
      clearTimeout(timeoutId);
      setLoading(false);
    };

    // For Next.js App Router, we need to use the router events
    // Since App Router doesn't have router events, we use a different approach
    
    // Option 1: Track navigation using a flag
    let isNavigating = false;
    
    const originalPush = router.push;
    const originalReplace = router.replace;
    
    // Override router methods to detect navigation start
    router.push = (...args) => {
      isNavigating = true;
      handleRouteChangeStart();
      return originalPush.apply(router, args);
    };
    
    router.replace = (...args) => {
      isNavigating = true;
      handleRouteChangeStart();
      return originalReplace.apply(router, args);
    };
    
    // Clean up on component unmount
    return () => {
      clearTimeout(timeoutId);
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

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