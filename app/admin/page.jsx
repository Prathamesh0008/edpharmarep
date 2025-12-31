import StatCard from "../components/admin/StatCard";
import OrdersTable from "../components/admin/OrdersTable";
import OrdersMobileCard from "../components/admin/OrdersMobileCard";
import LogoutButton from "../components/LogoutButton";

async function getOrders() {
  const res = await fetch("http://localhost:3000/api/admin/orders", {
    cache: "no-store",
  });

  const data = await res.json();

  // ✅ API returns ARRAY
  return Array.isArray(data) ? data : [];
}

export default async function AdminPage() {
  const orders = await getOrders();

  const total = orders.length;
  const pending = orders.filter(o => o.status === "Pending").length;
  const approved = orders.filter(o => o.status === "Approved").length;
  const shipped = orders.filter(o => o.status === "Shipped").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-2xl border p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">
            EdPharma Order Console
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <div className="font-medium">Super Admin</div>
              <div className="text-xs text-slate-500">
                admin@edpharma.com
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Orders" value={total} />
          <StatCard title="Pending Review" value={pending} />
          <StatCard title="Approved" value={approved} />
          <StatCard title="Shipped" value={shipped} />
        </div>
      </div>

      <div className="hidden md:block">
        <OrdersTable orders={orders} />
      </div>

      <div className="md:hidden">
        <OrdersMobileCard orders={orders} />
      </div>
    </div>
  );
}
