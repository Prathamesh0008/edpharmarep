// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Search, X } from "lucide-react";

// export default function SearchBar({ theme, search, setSearch }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div ref={ref} className="relative">
//       {/* SEARCH ICON */}
//       {!open && (
//         <button
//           onClick={() => setOpen(true)}
//           className="p-2 rounded-full hover:bg-gray-100 transition"
//         >
//           <Search className="w-5 h-5 text-gray-600" />
//         </button>
//       )}

//       {/* SEARCH INPUT */}
//       {open && (
//         <div
//           className="
//             absolute right-0 top-0
//             w-[260px] sm:w-[320px] md:w-[400px]
//             bg-white border border-gray-200
//             rounded-xl shadow-lg
//             flex items-center
//             px-3 py-2
//             animate-in fade-in slide-in-from-top-2
//           "
//         >
//           <Search className="w-4 h-4 text-gray-400 mr-2" />

//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             autoFocus
//             placeholder="Search products..."
//             className="flex-1 text-sm outline-none"
//           />

//           <button onClick={() => setOpen(false)}>
//             <X className="w-4 h-4 text-gray-400 hover:text-black" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
