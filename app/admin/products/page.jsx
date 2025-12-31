"use client";

import { useMemo, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { PRODUCTS as DEMO_PRODUCTS } from "../../data/adminDemo";
import { Plus, Trash2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔍 Search
  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return products.filter((p) =>
      `${p.name} ${p.sku} ${p.status}`.toLowerCase().includes(qq)
    );
  }, [products, q]);

  // 📊 Columns
  const columns = [
    { key: "name", label: "PRODUCT" },
    { key: "sku", label: "SKU" },
    { key: "price", label: "PRICE" },
    { key: "stock", label: "STOCK" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTIONS" },
  ];

  // 🔁 Update status
  function updateStatus(id, status) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status } : p
      )
    );
  }

  // 🗑️ Delete
  function confirmDelete() {
    setProducts((prev) =>
      prev.filter((p) => p.id !== deleteId)
    );
    setDeleteId(null);
  }

  // ➕ Add product
  function addProduct(newP) {
    setProducts((prev) => [
      { ...newP, id: `PRD-${Date.now()}` },
      ...prev,
    ]);
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="rounded-2xl bg-white/85 border border-slate-200 shadow-sm p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900">
            Products
          </div>
          <div className="text-sm text-slate-600">
            Manage product status & inventory
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / SKU / status..."
            className="w-full sm:w-80 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          />
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* DATA TABLE (DESKTOP + MOBILE handled internally) */}
      <div className="w-full">
        <DataTable
          columns={columns}
          rows={filtered}
          renderCell={(key, row) => {
            if (key === "price") {
              return (
                <span className="font-semibold">
                  ₹{row.price.toLocaleString("en-IN")}
                </span>
              );
            }

            if (key === "status") {
              return (
                <select
                  value={row.status}
                  onChange={(e) =>
                    updateStatus(row.id, e.target.value)
                  }
                  className="rounded-xl border border-slate-200 px-2 py-1 text-sm bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              );
            }

            if (key === "actions") {
              return (
                <button
                  onClick={() => setDeleteId(row.id)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              );
            }

            return row[key];
          }}
          mobileCardTitle={(row) => row.name}
          mobileCardLines={(row) => [
            { label: "SKU", value: row.sku },
            { label: "Price", value: `₹${row.price}` },
            { label: "Stock", value: String(row.stock) },
            { label: "Status", value: row.status },
          ]}
        />
      </div>

      {/* ADD PRODUCT MODAL */}
      {open && (
        <AddProductModal
          onClose={() => setOpen(false)}
          onCreate={(p) => {
            addProduct(p);
            setOpen(false);
          }}
        />
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white border p-5">
            <div className="text-lg font-semibold">
              Delete Product?
            </div>
            <div className="text-sm text-slate-600 mt-2">
              This action cannot be undone.
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- ADD PRODUCT MODAL ---------- */

function AddProductModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white border p-5">
        <div className="text-lg font-semibold">
          Add Product
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-xl"
          />
          <input
            placeholder="SKU"
            onChange={(e) => setSku(e.target.value)}
            className="border p-2 rounded-xl"
          />
          <input
            type="number"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded-xl"
          />
          <input
            type="number"
            placeholder="Stock"
            onChange={(e) => setStock(e.target.value)}
            className="border p-2 rounded-xl"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onCreate({
                name,
                sku,
                price: Number(price),
                stock: Number(stock),
                status: "Draft",
              })
            }
            className="bg-slate-900 text-white px-4 py-2 rounded-xl"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}