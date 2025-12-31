//app\components\CompanyProductSection.jsx
"use client";

import { useState } from "react";
import { COMPANIES } from "@/app/data/companies";
import { products } from "@/app/data/products";
import Link from "next/link";

export default function CompanyProductSection() {
  const [activeCompany, setActiveCompany] = useState(COMPANIES[0].id);

  const filteredProducts = products
  .filter(
    (p) =>
      p.company &&
      p.company.toLowerCase().trim() ===
        activeCompany.toLowerCase().trim()
  )
  .slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">

      <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-10">
        Company-wise Products
      </h2>

      {/* COMPANY LOGO TABS (Fully Responsive) */}
      <div className="flex gap-4 justify-center overflow-x-auto no-scrollbar pb-4 w-full">
        {COMPANIES.map((company) => (
          <button
            key={company.id}
            onClick={() => setActiveCompany(company.id)}
            className={` 
              flex justify-center items-center 
              rounded-2xl border transition-all shrink-0
              w-40 h-20 sm:w-48 sm:h-24
              ${
                activeCompany === company.id
                  ? "bg-blue-50 border-blue-600 shadow-md "
                  : "bg-white border-slate-300 hover:shadow-sm hover:bg-blue-50/40"
              }
            `}
          >
            <img
              src={company.logo}
              alt={company.name}
              className={`w-12 h-12 sm:w-16 sm:h-16 object-contain transition-all scale-[1.02]
              ${activeCompany === company.id ? "opacity-100" : "opacity-60"}`}
            />
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
  {filteredProducts.map((product) => (
    <div
      key={product.id}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition p-4"
    >
      {/* IMAGE */}
<div className="w-full h-40 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
  <img
    src="/productbottle.jpg"
    alt={product.name}
    className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
  />
</div>


      {/* NAME */}
      <h3 className="font-semibold text-blue-700 mt-3 text-sm leading-tight">
        {product.name}
      </h3>

      {/* STRENGTH */}
      <p className="text-slate-500 text-xs">{product.strength}</p>

      {/* PRICE */}
      <p className="text-blue-700 font-bold text-sm mt-2">
        ₹{product.price}
      </p>

      {/* BUTTON */}
      <button className="w-full bg-blue-600 text-white text-xs py-2 mt-3 rounded-lg hover:bg-blue-700 transition">
        View Product
      </button>
    </div>
  ))}
</div>

      {/* VIEW ALL BUTTON */}
      <div className="flex justify-center mt-12">
        <Link
          href="/products"
          className="px-8 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md transition"
        >
          View All Products →
        </Link>
      </div>
    </section>
  );
}
