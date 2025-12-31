export default function OrdersList({ orders }) {
  return (
    <div className="space-y-3 relative overflow-visible">
      <h2 className="text-xl font-bold">Orders</h2>

      {orders.map(order => (
        <div
          key={order.id}
          className="
            bg-white 
            rounded-xl 
            shadow 
            p-4 
            text-lg 
            font-semibold
            relative
            overflow-visible
          "
        >
          {order.id}

          {/* 👉 If dropdown/menu exists later, it will work properly */}
        </div>
      ))}
    </div>
  );
}