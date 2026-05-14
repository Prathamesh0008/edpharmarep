"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StatCard from "@/app/components/admin/StatCard";
import OrdersTable from "@/app/components/admin/OrdersTable";
import OrdersMobileCard from "@/app/components/admin/OrdersMobileCard";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders", { credentials: "include" });
        const data = await res.json();
        if (!alive) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        if (!alive) return;
        setOrders([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => String(o.status || "").toLowerCase() === "pending").length;
    const approved = orders.filter((o) => String(o.status || "").toLowerCase() === "approved").length;
    const shipped = orders.filter((o) => String(o.status || "").toLowerCase() === "shipped").length;
    return { total, pending, approved, shipped };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
      .slice(0, 8);
  }, [orders]);

  if (loading) return <div className="p-6 text-slate-600">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">Track order flow and quickly jump to management pages.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/orders" className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm">
            Manage Orders
          </Link>
          <Link href="/admin/products" className="px-3 py-2 rounded-xl border border-slate-300 text-sm">
            Manage Products
          </Link>
          <Link href="/admin/users" className="px-3 py-2 rounded-xl border border-slate-300 text-sm">
            View Users
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats.total} color="blue" />
        <StatCard title="Pending" value={stats.pending} color="yellow" />
        <StatCard title="Approved" value={stats.approved} color="green" />
        <StatCard title="Shipped" value={stats.shipped} color="purple" />
      </div>

      <div className="space-y-3 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-blue-700 hover:underline">
            View all
          </Link>
        </div>

        <div className="hidden md:block">
          <OrdersTable orders={recentOrders} />
        </div>
        <div className="md:hidden">
          <OrdersMobileCard orders={recentOrders} />
        </div>
      </div>
    </div>
  );
}
