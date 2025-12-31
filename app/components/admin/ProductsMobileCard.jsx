"use client";

export default function ProductsMobileCard({ products = [], refresh }) {
  if (!products.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No products found
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      {products.map((p, index) => {
        const key = p._id || p.sku || index;

        return (
          <div
            key={key}
            className="bg-white rounded-xl border p-4 space-y-2"
          >
            <div className="font-semibold">{p.name}</div>

            <div className="text-sm text-gray-500">
              SKU: {p.sku || "—"}
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price</span>
              <span className="font-medium">₹{p.price}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Stock</span>
              <span>{p.stock}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs px-2 py-1 rounded bg-slate-100">
                {p.status}
              </span>

              <button
                onClick={() => alert("Delete logic here")}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}