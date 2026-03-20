// app/loading.js
"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Only show loader if loading takes more than 200ms
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
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



// // app/loading.tsx

// export default function Loading() {
//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      
//       <div className="flex flex-col items-center gap-6">
        
//         {/* Animated Spinner */}
//         <div className="relative">
//           <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
//           <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-gray-800 rounded-full animate-spin"></div>
//         </div>

//         {/* Brand Text */}
//         <div className="text-center">
//           <h2 className="text-xl font-semibold tracking-wide text-gray-800">
//             ED Pharma
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Loading, please wait...
//           </p>
//         </div>

//       </div>

//     </div>
//   );
// }