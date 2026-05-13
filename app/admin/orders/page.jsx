"use client";

import { useEffect, useState } from "react";
import OrdersFilters from "@/app/components/admin/OrdersFilters";
import OrdersTable from "@/app/components/admin/OrdersTable";
import OrdersMobileCard from "@/app/components/admin/OrdersMobileCard";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders", { credentials: "include" });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    active === "All"
      ? orders
      : orders.filter(
          (o) =>
            String(o.status || "").toLowerCase() ===
            String(active || "").toLowerCase()
        );

  if (loading) {
    return <div className="p-6 text-slate-600">Loading orders...</div>;
  }

  return (
    <div className="space-y-6 overflow-x-visible">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white border border-slate-800 p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Order Console</h1>
        <p className="text-sm text-slate-200 mt-1">
          Manage all customer orders, status updates, and payment details.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
        <OrdersFilters active={active} setActive={setActive} />
      </div>

      <div className="block md:hidden">
        <OrdersMobileCard orders={filteredOrders} refresh={fetchOrders} />
      </div>

      <div className="hidden md:block">
        <OrdersTable orders={filteredOrders} refresh={fetchOrders} />
      </div>
    </div>
  );
}
