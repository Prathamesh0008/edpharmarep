"use client";

import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function RightSidebar({ open, onClose }) {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200
          transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}
      >
        {/* HEADER */}
        <div className="p-6 font-bold text-lg border-b">
          Admin Panel
        </div>

        {/* NAV ITEMS + LOGOUT */}
        <nav className="p-4 space-y-2">
          <SidebarItem
            href="/admin"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <SidebarItem
            href="/admin/orders"
            icon={<ShoppingBag size={18} />}
            label="Orders"
          />
          <SidebarItem
            href="/admin/products"
            icon={<Package size={18} />}
            label="Products"
          />

          {/* ✅ LOGOUT INSIDE SIDEBAR */}
          <LogoutButton />
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}