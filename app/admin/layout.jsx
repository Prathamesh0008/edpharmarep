"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/users", label: "Users", Icon: Users },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin()) router.replace("/");
  }, [loading, user, isAdmin, router]);

  const activeHref = useMemo(() => {
    return NAV_ITEMS.find((item) => pathname?.startsWith(item.href))?.href;
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("bio-user");
    localStorage.removeItem("auth_token");
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-base text-slate-700">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!user || !isAdmin()) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-72 bg-white/95 backdrop-blur border-r border-slate-200 z-40
        transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="h-16 flex items-center px-5 border-b border-slate-200">
          <div>
            <p className="text-xs font-medium text-slate-500 tracking-wide">CONTROL PANEL</p>
            <p className="text-base font-bold text-slate-900">EdPharma Admin</p>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-slate-200">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
          <p className="text-xs text-emerald-600 mt-1">Administrator</p>
        </div>

        <nav className="p-4 space-y-2 text-sm">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = activeHref === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center gap-3 text-left px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-3 md:hidden text-slate-700"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-slate-900">EdPharma Admin Panel</span>
          </div>
          <span className="hidden sm:inline text-xs sm:text-sm text-slate-600 truncate max-w-[40vw]">{user.email}</span>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
