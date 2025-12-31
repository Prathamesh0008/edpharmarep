"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

function StarRow({ value = 4.6, count = 128 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          const isHalf = i === full && half;
          return (
            <span
              key={i}
              className={`text-[14px] ${
                filled || isHalf ? "text-amber-500" : "text-gray-300"
              }`}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">({count} reviews)</span>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-2 text-sm font-medium rounded-xl transition
        ${active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
      `}
    >
      {children}
    </button>
  );
}

export default function ProductQuickView({ open, item, onClose, onGoToProduct }) {
  const [tab, setTab] = useState("details");

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setTab("details");
  }, [open]);

  const meta = useMemo(() => {
    // You can replace these with DB values per product later
    return {
      delivery: "Delivery in 2–5 days • Free above ₹999",
      returnPolicy: "7-day replacement (sealed packs)",
      authenticity: "COA / batch docs available",
      highlights: [
        "Premium packaging & safe transit",
        "Verified supplier chain",
        "Support available on WhatsApp",
      ],
      faq: [
        {
          q: "Is this product genuine and sealed?",
          a: "Yes, we ship factory-sealed packs. Batch details can be shared on request.",
        },
        {
          q: "How fast is delivery?",
          a: "Typically 2–5 business days depending on your location.",
        },
        {
          q: "Can I return it?",
          a: "Replacement is available for damaged/seal issues as per policy.",
        },
      ],
      reviews: [
        { name: "Amit", rating: 5, text: "Packaging was excellent, delivery was quick." },
        { name: "Sara", rating: 4, text: "Good product, support team replied fast." },
        { name: "Rohit", rating: 5, text: "Quality looks premium. Smooth experience." },
      ],
    };
  }, []);

  if (!open || !item) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-[1100] bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div
        className="
          fixed z-[1101] inset-x-0 bottom-0
          sm:inset-y-0 sm:right-0 sm:left-auto sm:bottom-auto
          w-full sm:w-[620px] h-[92vh] sm:h-full
          bg-white
          rounded-t-3xl sm:rounded-none sm:rounded-l-3xl
          shadow-[0_0_60px_rgba(0,0,0,0.25)]
          overflow-hidden
        "
        role="dialog"
        aria-modal="true"
      >
        {/* top bar */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-5 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Product details</p>
            <h3 className="text-[16px] sm:text-[18px] font-semibold text-gray-900 truncate">
              {item.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onGoToProduct?.(item.slug)}
              className="hidden sm:inline-flex px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium"
            >
              Full page →
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* content */}
        <div className="h-[calc(92vh-66px)] sm:h-[calc(100%-66px)] overflow-y-auto">
          {/* hero section */}
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-5">
              {/* image */}
              <div className="rounded-2xl border bg-gray-50 overflow-hidden">
                <div className="relative w-full h-[220px] sm:h-[240px]">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              </div>

              {/* summary */}
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-[18px] sm:text-[20px] font-semibold text-gray-900 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ₹{item.price?.toLocaleString()} / unit
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    In stock
                  </span>
                </div>

                <div className="mt-3">
                  <StarRow />
                </div>

                {/* delivery + trust */}
                <div className="mt-4 space-y-2">
                  <div className="rounded-2xl border p-3">
                    <p className="text-xs text-gray-500">Delivery</p>
                    <p className="text-sm font-medium text-gray-900">
                      {meta.delivery}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="rounded-2xl border p-3">
                      <p className="text-xs text-gray-500">Return</p>
                      <p className="text-sm font-medium text-gray-900">
                        {meta.returnPolicy}
                      </p>
                    </div>
                    <div className="rounded-2xl border p-3">
                      <p className="text-xs text-gray-500">Authenticity</p>
                      <p className="text-sm font-medium text-gray-900">
                        {meta.authenticity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* highlights */}
                <div className="mt-4 rounded-2xl bg-gray-50 border p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Why customers like this
                  </p>
                  <ul className="mt-2 space-y-2">
                    {meta.highlights.map((h, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-emerald-600">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* tabs */}
            <div className="mt-5 flex flex-wrap gap-2">
              <TabButton active={tab === "details"} onClick={() => setTab("details")}>
                Details
              </TabButton>
              <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
                Reviews
              </TabButton>
              <TabButton active={tab === "qa"} onClick={() => setTab("qa")}>
                Q & A
              </TabButton>
            </div>

            {/* tab content */}
            <div className="mt-4">
              {tab === "details" && (
                <div className="space-y-3">
                  <div className="rounded-2xl border p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Product description
                    </p>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                      This is a premium quick view section. Replace this text with
                      your product-specific description (from DB / products file).
                    </p>
                  </div>

                  <div className="rounded-2xl border p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Delivery & handling
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                      <li>• Secure packaging and tamper checks</li>
                      <li>• Tracking shared after dispatch</li>
                      <li>• Support for delivery queries</li>
                    </ul>
                  </div>
                </div>
              )}

              {tab === "reviews" && (
                <div className="space-y-3">
                  {meta.reviews.map((r, idx) => (
                    <div key={idx} className="rounded-2xl border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {r.name}
                        </p>
                        <span className="text-xs text-amber-600 font-semibold">
                          {"★".repeat(r.rating)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === "qa" && (
                <div className="space-y-3">
                  {meta.faq.map((f, idx) => (
                    <div key={idx} className="rounded-2xl border p-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {f.q}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{f.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* mobile full page button */}
            <button
              type="button"
              onClick={() => onGoToProduct?.(item.slug)}
              className="sm:hidden w-full mt-5 py-3 rounded-2xl bg-gray-900 text-white font-semibold"
            >
              Open full product page →
            </button>

            <div className="h-6" />
          </div>
        </div>
      </div>
    </>
  );
}
