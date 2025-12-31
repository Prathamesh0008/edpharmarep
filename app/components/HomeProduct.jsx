"use client";

import Link from "next/link";
import Image from "next/image";
import { products as allProducts } from "@/data/products";
import React from "react";

/* ---------------- BRANDS ---------------- */
const brands = [
  {
    key: "ED Ajanta Pharma",
    logo: "/logo/ajanta.webp",
  },
  { key: "ED Sunrise Remedies", logo: "/logo/sunrise.png" },
  { key: "ED Centurion Remedies", logo: "/logo/cen.png" },
];

/* ---------------- LOGO STRIP (SAME UI) ---------------- */
function LogoStrip({
  activeBrand,
  setActiveBrand,
}) {
  const BRAND = "#0A2A73";

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="rounded-3xl bg-white/80 backdrop-blur-md shadow-xl ring-1 ring-slate-200 px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {brands.map((b) => {
            const active = b.key === activeBrand;

            return (
              <button
                key={b.key}
                onClick={() => setActiveBrand(b.key)}
                className={[
                  "h-14 w-24 sm:h-45 sm:w-70 rounded-2xl bg-white shadow-sm ring-1 flex items-center justify-center transition-all cursor-pointer",
                  active
                    ? "shadow-md scale-[1.03] border"
                    : "ring-slate-100 hover:ring-slate-300",
                ].join(" ")}
                style={{
                  borderColor: active ? BRAND : "transparent",
                }}
              >
                <div className="relative h-40 w-20 sm:h-full sm:w-full">
                  <Image src={b.logo} alt={b.key} fill className="object-contain" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- HOME PRODUCTS ---------------- */
export default function HomeProducts({
  activeBrand,
  setActiveBrand,
}) {
  const BRAND = "#0A2A73";

  const brandProducts = allProducts.filter(
    (p) => p.brand === activeBrand
  );
  const visible = brandProducts.slice(0, 6);

  return (
    <section className="relative py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <LogoStrip
          activeBrand={activeBrand}
          setActiveBrand={setActiveBrand}
        />

        {/* HEADER */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between backdrop-blur-sm">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold "
              style={{ color: BRAND }}
            >
              Products
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Showing top products from{" "}
              <span className="font-semibold text-slate-900">
                {activeBrand}
              </span>
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition"
            style={{ backgroundColor: BRAND }}
          >
            View All Products →
          </Link>
        </div>

        {/* 🔥 PREMIUM PRODUCT GRID */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article
              key={p.slug}
              className="group relative rounded-3xl bg-white border shadow-sm hover:shadow-xl transition-all"
              style={{ borderColor: "rgba(10,42,115,0.15)" }}
            >
              {/* IMAGE */}
              <div className="relative h-44 rounded-t-3xl bg-gradient-to-b from-slate-50 to-white border-b overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-4">
                {/* CATEGORY */}
                <span
                  className="w-fit text-[11px] font-semibold px-3 py-1 rounded-full border"
                  style={{
                    borderColor: BRAND,
                    color: BRAND,
                  }}
                >
                  {p.category}
                </span>

                {/* NAME */}
                <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                  {p.name}
                </h3>

                {/* META */}
                <div className="flex flex-wrap gap-2 text-[12px] text-slate-700">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    <b>Dosage:</b> {p.dosage}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    <b>Form:</b> {p.form}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    <b>Pack:</b> {p.pack_size}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-2 flex gap-3">
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex-1 text-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition"
                    style={{ backgroundColor: BRAND }}
                  >
                    Details
                  </Link>

                  <Link
                    href={`/contact?product=${encodeURIComponent(p.slug)}`}
                    className="flex-1 text-center rounded-2xl px-4 py-2.5 text-sm font-semibold border bg-white transition"
                    style={{ borderColor: BRAND, color: BRAND }}
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* EMPTY STATE */}
        {visible.length === 0 && (
          <div className="mt-10 rounded-3xl border bg-white p-6">
            No products found for {activeBrand}
          </div>
        )}
      </div>
    </section>
  );
}
