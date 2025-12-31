"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, Users, ShoppingCart, X } from "lucide-react";
import LogoutButton from "../LogoutButton"; // ✅ FIXED

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    if (role !== "admin" && pathname.startsWith("/admin")) {
      router.push("/login");
    }
  }, [pathname, router]);

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 transition 
     ${
       pathname === path
         ? "bg-blue-100 text-blue-700 font-semibold rounded-full"
         : "hover:bg-slate-100 text-slate-700 rounded-full"
     }`;

  if (userRole !== "admin") return null;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className="fixed md:static top-0 left-0 h-full w-64 bg-white z-40 flex flex-col ">
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b ">
          <div className="font-bold">EdPharma Admin</div>
          <button className="md:hidden" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className={linkClass("/admin")}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link href="/admin/orders" className={linkClass("/admin/orders")}>
            <ShoppingCart className="w-5 h-5" />
            Orders
          </Link>

          <Link href="/admin/products" className={linkClass("/admin/products")}>
            <Package className="w-5 h-5" />
            Products
          </Link>

          <Link href="/admin/users" className={linkClass("/admin/users")}>
            <Users className="w-5 h-5" />
            Users
          </Link>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}