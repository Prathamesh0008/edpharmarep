// app/admin/layout.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext"; // Add this import

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false); // ✅ ADDED
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth(); // Use AuthContext

  // 🔒 AUTH GUARD (UPDATED)
  useEffect(() => {
    // Skip if still loading
    if (loading) return;

    // Check if user is authenticated and is admin
    if (!user || !isAdmin()) {
      router.replace("/"); // Redirect to home if not admin
    }
  }, [user, isAdmin, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl">Loading Admin Panel...</div>
      </div>
    );
  }

  // Don't render admin layout if not admin (will redirect in useEffect)
  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ===== MOBILE OVERLAY ===== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full md:h-auto
          w-64
          bg-white
          border-r
          z-40
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-4 border-b font-semibold">
          EdPharma Admin
        </div>

        {/* Admin Info */}
        <div className="px-4 py-3 border-b">
          <p className="text-sm text-gray-600">Logged in as:</p>
          <p className="font-medium truncate">{user.email}</p>
          <p className="text-xs text-green-600 mt-1">Administrator</p>
        </div>

        {/* Sidebar Links */}
        <nav className="p-3 space-y-1 text-sm">
          <Link
            href="/admin/dashboard"
            className="block px-3 py-2 rounded hover:bg-slate-100 flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <span>📊</span> Dashboard
          </Link>

          <Link
            href="/admin/orders"
            className="block px-3 py-2 rounded hover:bg-slate-100 flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <span>📦</span> Orders
          </Link>

          <Link
            href="/admin/products"
            className="block px-3 py-2 rounded hover:bg-slate-100 flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <span>💊</span> Products
          </Link>

          <Link
            href="/admin/users"
            className="block px-3 py-2 rounded hover:bg-slate-100 flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <span>👥</span> Users
          </Link>
          
          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("bio-user");
              router.push("/");
              window.location.reload(); // Refresh to clear context
            }}
            className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-red-600 flex items-center gap-2 mt-4"
          >
            <span>🚪</span> Logout
          </button>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR (MOBILE HEADER) */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-xl mr-3 md:hidden"
              aria-label="Open Menu"
            >
              ☰
            </button>
            <span className="font-semibold">EdPharma Admin Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:inline">
              {user.email}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("bio-user");
                router.push("/");
                window.location.reload();
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}








// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function AdminLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [checked, setChecked] = useState(false); // ✅ ADDED
//   const router = useRouter();

//   // 🔒 AUTH GUARD (ONLY LOGIC ADDED)
//   useEffect(() => {
//     const userStr = localStorage.getItem("bio-user");

//     // ❌ not logged in
//     if (!userStr) {
//       router.replace("/login");
//       return;
//     }

//     const user = JSON.parse(userStr);

//     // ❌ not admin
//     if (user.role !== "admin") {
//       router.replace("/login");
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-50 flex">

//       {/* ===== MOBILE OVERLAY ===== */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* ===== SIDEBAR ===== */}
//       <aside
//         className={`
//           fixed md:static
//           top-0 left-0
//           h-full md:h-auto
//           w-64
//           bg-white
//           border-r
//           z-40
//           transform transition-transform duration-300
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//         `}
//       >
//         {/* Sidebar Header */}
//         <div className="h-14 flex items-center px-4 border-b font-semibold">
//           EdPharma Admin
//         </div>

//         {/* Sidebar Links */}
//         <nav className="p-3 space-y-1 text-sm">
//           <Link
//             href="/admin"
//             className="block px-3 py-2 rounded hover:bg-slate-100"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Dashboard
//           </Link>

//           <Link
//             href="/admin/orders"
//             className="block px-3 py-2 rounded hover:bg-slate-100"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Orders
//           </Link>

//           <Link
//             href="/admin/products"
//             className="block px-3 py-2 rounded hover:bg-slate-100"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Products
//           </Link>

//           <Link
//             href="/admin/users"
//             className="block px-3 py-2 rounded hover:bg-slate-100"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Users
//           </Link>
//         </nav>
//       </aside>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="flex-1 flex flex-col min-w-0">

//         {/* TOP BAR (MOBILE HEADER) */}
//         <header className="h-14 bg-white border-b flex items-center px-4 md:hidden">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="text-xl mr-3"
//             aria-label="Open Menu"
//           >
//             ☰
//           </button>
//           <span className="font-semibold">EdPharma Admin</span>
//         </header>

//         {/* PAGE CONTENT */}
//         <main className="flex-1 overflow-x-hidden">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



