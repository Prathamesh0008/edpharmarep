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
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      // ✅ MAIN FIX: API returns ARRAY, not { orders }
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
      : orders.filter((o) => o.status === active);

  if (loading) {
    return <div className="p-6">Loading orders…</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-visible">
      <h1 className="text-2xl font-bold">
        EdPharma Order Console
      </h1>

      <OrdersFilters active={active} setActive={setActive} />

      {/* MOBILE */}
      <div className="block md:hidden">
        <OrdersMobileCard orders={filteredOrders} refresh={fetchOrders} />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <OrdersTable orders={filteredOrders} refresh={fetchOrders} />
      </div>
    </div>
  );
}
