"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "../data/products";
import { COMPOUNDS } from "../data/compounds";
import { useSearchParams } from "next/navigation";
import { useCart } from "../components/CartContext";

// BRAND THEMES (unchanged)
const BRAND_THEMES = {
  "ED Ajanta Pharma": {
    name: "Ajanta Pharma",
    logo: "/bg/ajanta.png",
    primary: "#0A2A73",
    secondary: "#2A7DB8",
    bgImage: "/bg/bg1.png",
    gradient: "linear-gradient(135deg, #0A2A73 0%, #2A7DB8 100%)",
  },
  "ED Centurion Remedies": {
    name: "Centurion Remedies",
    logo: "/bg/centurion.png",
    primary: "#B69A6B",
    secondary: "#D9C7A2",
    bgImage: "/bg/bg5.png",
    gradient: "linear-gradient(135deg, #B69A6B 0%, #D9C7A2 100%)",
  },
  "ED Sunrise Remedies": {
    name: "Sunrise Remedies",
    logo: "/bg/sunrise.png",
    primary: "#E86A0C",
    secondary: "#F6B15C",
    bgImage: "/bg/bg4.png",
    gradient: "linear-gradient(135deg, #E86A0C 0%, #F6B15C 100%)",
  },
  Nova: {
    name: "Nova",
    logo: "/bg/nova.png",
    primary: "#081A3E",
    secondary: "#1C4A8C",
    bgImage: "/bg/bg6.png",
    gradient: "linear-gradient(135deg, #081A3E 0%, #1C4A8C 100%)",
  },
};

const BRAND_ORDER = [
  "ED Ajanta Pharma",
  "ED Centurion Remedies",
  "ED Sunrise Remedies",
];

const makeId = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function ProductsPage() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const brandFromUrl = searchParams.get("brand");

  const [selectedBrand, setSelectedBrand] = useState(
    BRAND_THEMES[brandFromUrl] ? brandFromUrl : "ED Ajanta Pharma"
  );
  const [search, setSearch] = useState("");
  const [selectedCompound, setSelectedCompound] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCompound, setActiveCompound] = useState(null);
  const sectionRefs = useRef({});
  const productsStartRef = useRef(null);

  const theme = BRAND_THEMES[selectedBrand];
  const brandCompounds = COMPOUNDS[selectedBrand] || {};
  const compoundNames = Object.keys(brandCompounds);
  const brandProducts = products.filter((p) => p.brand === selectedBrand);
  const brandCategories = [
    "All",
    ...new Set(brandProducts.map((p) => p.category)),
  ];

  // Initialize
  useEffect(() => {
    if (compoundNames.length > 0) {
      setSelectedCompound(compoundNames[0]);
      setActiveCompound(compoundNames[0]);
    }
  }, [selectedBrand]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (!compoundNames.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCompound(entry.target.dataset.compound);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    compoundNames.forEach((compound) => {
      const el = sectionRefs.current[compound];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selectedBrand]);

  // URL brand change
  useEffect(() => {
    if (brandFromUrl && BRAND_THEMES[brandFromUrl]) {
      setSelectedBrand(brandFromUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [brandFromUrl]);

  // Scroll to compound
  const scrollToCompound = (compound) => {
    const el = document.getElementById(`compound-${makeId(compound)}`);
    if (el) {
      const offset = 120;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToProductsStart = () => {
    if (!productsStartRef.current) return;

    const offset = 140;
    const y =
      productsStartRef.current.getBoundingClientRect().top +
      window.scrollY -
      offset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // GLOBAL FILTER CHECK
  const hasAnyResults = compoundNames.some((compound) => {
    const slugs = brandCompounds[compound] || [];

    const items = brandProducts.filter((p) => {
      const slug = p.slug.toLowerCase();
      const name = p.name.toLowerCase();

      const belongsToCompound = slugs.some((key) => {
        const k = key.toLowerCase();
        return k === slug || k === name;
      });

      if (!belongsToCompound) return false;
      if (categoryFilter !== "All" && p.category !== categoryFilter)
        return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const n = p.name?.toLowerCase() || "";
        const d = p.description?.toLowerCase() || "";
        return n.includes(q) || d.includes(q);
      }

      return true;
    });

    return items.length > 0;
  });
  return (
    // UPDATED: Changed 'min-h-screen' to 'min-h-0' or 'w-full'.
    // Also removed the bg-gradient class from here (moved to the fixed div below).
    <div className="w-full relative">
      <Navbar />

      {/* Background Pattern & Gradient */}
      {/* UPDATED: Added 'bg-gradient-to-b' here so the background stays fixed 
          and full-screen, even if the content is short. */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Floating Brand Selector - Medium Size & Responsive */}
      <div
        className={`fixed top-18 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-full shadow-xl px-3 sm:px-4 py-2 sm:py-3 border">
          {BRAND_ORDER.map((brandKey) => {
            const b = BRAND_THEMES[brandKey];
            const isActive = selectedBrand === brandKey;

            return (
              <button
                key={brandKey}
                onClick={() => {
                  setSelectedBrand(brandKey);
                  setSearch("");
                  setCategoryFilter("All");

                  setTimeout(() => {
                    scrollToProductsStart();
                  }, 50);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: isActive ? `${b.primary}10` : undefined,
                }}
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                  <Image
                    src={b.logo}
                    alt={b.name}
                    fill
                    className="object-contain"
                  />
                </div>
                {isActive && (
                  <span
                    className="text-xs sm:text-sm font-medium whitespace-nowrap"
                    style={{ color: b.primary }}
                  >
                    {b.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input - Full width on mobile */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        {/* ✅ Search Input - DESKTOP ONLY */}
  <div className="hidden md:block w-full">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products by name, composition, or description..."
        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 focus:border-transparent transition-all"
        style={{ "--tw-ring-color": theme.primary }}
      />
    </div>
  </div>

        {/* Brand Logos at the Top - Made more responsive */}
        <div className="mb-6 sm:mb-8 mt-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {BRAND_ORDER.map((brandKey, index) => {
              const b = BRAND_THEMES[brandKey];
              const isActive = selectedBrand === brandKey;

              const isFirstLogo = index === 0;
              const isSecondLogo = index === 1;
              const isThirdLogo = index === 2;

              return (
                <button
                  key={brandKey}
                  onClick={() => {
                    setSelectedBrand(brandKey);
                    setSearch("");
                    setCategoryFilter("All");
                  }}
                  // UPDATED: Fixed height (h-48) matches desktop view on all screens
                  className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 h-48 transition-all duration-500 transform hover:scale-[1.02] ${
                    isActive
                      ? "ring-2 sm:ring-4 ring-offset-1 sm:ring-offset-2 scale-[1.02]"
                      : "hover:shadow-lg sm:hover:shadow-xl"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${b.primary}15 0%, ${b.secondary}15 100%)`,
                    border: `1px solid ${isActive ? b.primary : "transparent"}`,
                    outlineColor: b.primary,
                  }}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                      <div
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: b.primary }}
                      ></div>
                    </div>
                  )}

                  <div className="flex items-center justify-center h-full w-full cursor-pointer">
                    {/* UPDATED: Fixed width/height classes matching the original lg: values */}
                    <div
                      className={`relative flex items-center justify-center transition-all duration-300 
                      ${isFirstLogo ? "w-40 h-40" : ""}
                      ${isSecondLogo ? "w-36 h-36" : ""}
                      ${isThirdLogo ? "w-60 h-32" : ""}
                    `}
                    >
                      <Image
                        src={b.logo}
                        alt={b.name}
                        fill
                        className="object-contain drop-shadow-md"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* Hero Section Below Logos */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-10">
            {/* UPDATED: Increased base size from text-2xl to text-3xl for mobile */}
            <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: theme.gradient }}
              >
                {theme.name}
              </span>{" "}
              <span className="text-2xl xs:text-2xl sm:text-5xl block sm:inline">
                Products
              </span>
            </h1>

            {/* UPDATED: Increased base size from text-sm to text-base for mobile */}
            <p className="text-base xs:text-lg sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Browse through our comprehensive range of pharmaceutical products
            </p>
          </div>
          {/* Advanced Filters - Made responsive */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Search Input - Full width on mobile */}
              {/* <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name, composition, or description..."
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 focus:border-transparent transition-all"
          style={{ '--tw-ring-color': theme.primary }}
        />
      </div>
    </div> */}

              {/* Filters Row - Stack on mobile, row on sm+ */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Compound Select */}
                <div className="relative flex-1">
                  <select
                    value={selectedCompound}
                    onChange={(e) => {
                      setSelectedCompound(e.target.value);
                      scrollToCompound(e.target.value);
                    }}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 focus:border-transparent transition-all appearance-none bg-white"
                    style={{ "--tw-ring-color": theme.primary }}
                  >
                    <option value="">All Compounds</option>
                    {compoundNames.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 8l4 4 4-4"
                      />
                    </svg>
                  </div>
                </div>

                {/* Category Select */}
                <div className="relative flex-1">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 focus:border-transparent transition-all appearance-none bg-white"
                    style={{ "--tw-ring-color": theme.primary }}
                  >
                    {brandCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 8l4 4 4-4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Sections */}
        <div ref={productsStartRef} className="pt-4 sm:pt-8">
          {compoundNames.map((compound) => {
            const slugs = brandCompounds[compound] || [];

            let items = brandProducts.filter((p) => {
              const slug = p.slug.toLowerCase();
              const name = p.name.toLowerCase();
              const belongsToCompound = slugs.some((key) => {
                const k = key.toLowerCase();
                return k === slug || k === name;
              });

              if (!belongsToCompound) return false;
              if (categoryFilter !== "All" && p.category !== categoryFilter)
                return false;
              if (search.trim()) {
                const q = search.toLowerCase();
                const n = p.name?.toLowerCase() || "";
                const d = p.description?.toLowerCase() || "";
                return n.includes(q) || d.includes(q);
              }
              return true;
            });

            if (!items.length) return null;

            return (
              <section
                key={compound}
                id={`compound-${makeId(compound)}`}
                data-compound={compound}
                ref={(el) => (sectionRefs.current[compound] = el)}
                className="scroll-mt-24 sm:scroll-mt-32 mb-10 sm:mb-16"
              >
                {/* Compound Header */}
                <div className="mb-6 sm:mb-10">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-0 mb-4 sm:mb-6">
                    <div>
                      <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">
                        {compound}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
                        {items.length} product{items.length !== 1 ? "s" : ""}{" "}
                        available
                      </p>
                    </div>
                    <div
                      className="px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
                      style={{
                        backgroundColor: `${theme.primary}15`,
                        color: theme.primary,
                      }}
                    >
                      {slugs.length} SKUs
                    </div>
                  </div>
                  <div
                    className="h-1 w-16 sm:w-24 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                </div>

                {/* Products List */}
                <div className="space-y-6 sm:space-y-8">
                  {items.map((p, index) => {
                    const isEven = index % 2 === 0;

                    return (
                      <div
                        key={p.slug}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden border border-gray-100 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300"
                      >
                        <div className="p-4 sm:p-6">
                          {/* MOBILE VIEW */}
                          <div className="lg:hidden">
                            <div className="space-y-4 sm:space-y-6">
                              {/* Product Image */}
                              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                <div className="relative h-60 sm:h-88">
                                  <Image
                                    src={
                                      p.image && p.image.trim() !== ""
                                        ? p.image
                                        : "/placeholder.jpg"
                                    }
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                    sizes="60vw"
                                  />
                                </div>
                                {/* <div className="text-center mt-3">
                                  <span className="px-2 py-1 text-xs font-medium rounded"
                                        style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                                    {p.category}
                                  </span>
                                </div> */}
                              </div>

                              {/* Product Details */}
                              <div className="space-y-3 sm:space-y-4">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                                    {p.name}
                                  </h3>
                                </div>

                                {/* Specifications */}
                                <div className="space-y-2">
                                  {p.dosage && (
                                    <div className="flex items-start">
                                      <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[70px] sm:min-w-[80px]">
                                        Dosage:
                                      </span>
                                      <span className="text-xs sm:text-sm text-gray-600 ml-2">
                                        {p.dosage}
                                      </span>
                                    </div>
                                  )}
                                  {p.composition && (
                                    <div className="flex items-start">
                                      <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[70px] sm:min-w-[80px]">
                                        Composition:
                                      </span>
                                      <span className="text-xs sm:text-sm text-gray-600 ml-2">
                                        {p.composition}
                                      </span>
                                    </div>
                                  )}
                                  {p.pack_size && (
                                    <div className="flex items-start">
                                      <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[70px] sm:min-w-[80px]">
                                        Pack Size:
                                      </span>
                                      <span className="text-xs sm:text-sm text-gray-600 ml-2">
                                        {p.pack_size}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {p.description && (
                                  <p className="text-gray-600 text-xs sm:text-sm pt-3 border-t border-gray-100 line-clamp-2">
                                    {p.description}
                                  </p>
                                )}

                                {/* Action Buttons - Mobile */}
                                <div className="flex flex-col gap-2 sm:gap-3 pt-3 sm:pt-4">
                                  <Link
                                    href={`/product/${p.slug}`}
                                    className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all hover:bg-gray-50"
                                    style={{
                                      borderColor: theme.primary,
                                      color: theme.primary,
                                    }}
                                  >
                                    View Details
                                  </Link>

                                  <button
                                    onClick={() =>
                                      addToCart(p, 50, false, true)
                                    }
                                    className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base text-white transition-all hover:opacity-90"
                                    style={{
                                      backgroundColor: theme.primary,
                                    }}
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* DESKTOP VIEW */}
                          <div className="hidden lg:grid lg:grid-cols-2 gap-6 sm:gap-8">
                            {isEven ? (
                              <>
                                {/* Image Left */}
                                <div className="flex items-center justify-center">
                                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 w-full">
                                    <div className="relative h-40 sm:h-88">
                                      <Image
                                        src={
                                          p.image && p.image.trim() !== ""
                                            ? p.image
                                            : "/placeholder.jpg"
                                        }
                                        alt={p.name}
                                        fill
                                        className="object-cover"
                                        sizes="40vw"
                                      />
                                    </div>
                                    <div className="text-center mt-4">
                                      {/* <span className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                            style={{ backgroundColor: theme.primary }}>
                                        {p.category}
                                      </span> */}
                                    </div>
                                  </div>
                                </div>

                                {/* Details Right */}
                                <div className="flex flex-col justify-center">
                                  <div className="space-y-3 sm:space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                                      {p.name}
                                    </h3>

                                    {/* Specifications List */}
                                    <div className="space-y-2 sm:space-y-3">
                                      {p.dosage && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            Dosage:
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.dosage}
                                          </span>
                                        </div>
                                      )}
                                      {p.composition && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            Composition:
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.composition}
                                          </span>
                                        </div>
                                      )}
                                      {p.pack_size && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            Pack Size:
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.pack_size}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {p.description && (
                                      <div className="pt-3 border-t border-gray-100">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                          {p.description}
                                        </p>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                                      <Link
                                        href={`/product/${p.slug}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all hover:bg-gray-50"
                                        style={{
                                          borderColor: theme.primary,
                                          color: theme.primary,
                                        }}
                                      >
                                        View Details
                                      </Link>

                                      <button
                                        onClick={() =>
                                          addToCart(p, 50, false, true)
                                        }
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base text-white transition-all hover:opacity-90"
                                        style={{
                                          backgroundColor: theme.primary,
                                        }}
                                      >
                                        Add to Cart
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                {/* Details Left */}
                                <div className="flex flex-col justify-center">
                                  <div className="space-y-3 sm:space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                                      {p.name}
                                    </h3>

                                    {/* Specifications List */}
                                    <div className="space-y-2 sm:space-y-3">
                                      {p.dosage && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            Dosage:
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.dosage}
                                          </span>
                                        </div>
                                      )}
                                      {p.composition && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            Composition:
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.composition}
                                          </span>
                                        </div>
                                      )}
                                      {p.pack_size && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            Pack Size:
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.pack_size}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {p.description && (
                                      <div className="pt-3 border-t border-gray-100">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                          {p.description}
                                        </p>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                                      <Link
                                        href={`/product/${p.slug}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all hover:bg-gray-50"
                                        style={{
                                          borderColor: theme.primary,
                                          color: theme.primary,
                                        }}
                                      >
                                        View Details
                                      </Link>

                                      <button
                                        onClick={() =>
                                          addToCart(p, 50, false, true)
                                        }
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base text-white transition-all hover:opacity-90"
                                        style={{
                                          backgroundColor: theme.primary,
                                        }}
                                      >
                                        Add to Cart
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Image Right */}
                                <div className="flex items-center justify-center">
                                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 w-full">
                                    <div className="relative h-40 sm:h-88">
                                      <Image
                                        src={
                                          p.image && p.image.trim() !== ""
                                            ? p.image
                                            : "/placeholder.jpg"
                                        }
                                        alt={p.name}
                                        fill
                                        className="object-cover"
                                        sizes="50vw"
                                      />
                                    </div>
                                    <div className="text-center mt-4">
                                      <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                        style={{
                                          backgroundColor: theme.primary,
                                        }}
                                      >
                                        {p.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Empty State */}
          {compoundNames.length > 0 && !hasAnyResults && (
            <div className="text-center py-12 sm:py-20 px-4">
              <div
                className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full mb-4 sm:mb-6"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}15 100%)`,
                  border: `2px dashed ${theme.primary}40`,
                }}
              >
                <svg
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  style={{ color: theme.primary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                No Products Found
              </h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-6 sm:mb-8">
                We couldn't find any products matching your search criteria.
              </p>

              {/* UPDATED CONTAINER: Stacks on mobile (col), Row on Desktop (sm:row) */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
                <button
                  onClick={() => setSearch("")}
                  // UPDATED: w-full on mobile, w-auto on sm+ (desktop)
                  className="
                    w-full sm:w-auto
                    px-6
                    py-2.5
                    rounded-lg
                    border
                    font-medium
                    text-sm
                    transition-all
                    hover:bg-gray-50
                    whitespace-nowrap
                  "
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  Clear Search
                </button>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setSelectedCompound(compoundNames[0]);
                  }}
                  // UPDATED: w-full on mobile, w-auto on sm+ (desktop)
                  className="
                    w-full sm:w-auto
                    px-6
                    py-2.5
                    rounded-lg
                    font-medium
                    text-sm
                    text-white
                    transition-all
                    hover:shadow-md
                    whitespace-nowrap
                  "
                  style={{ background: theme.gradient }}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Floating Action Button for Mobile */}
          <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 lg:hidden">
            <button
              onClick={() =>
                scrollToCompound(activeCompound || compoundNames[0])
              }
              className="p-3 sm:p-4 rounded-full shadow-2xl text-white animate-bounce"
              style={{ background: theme.gradient }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 11l7-7 7 7M5 19l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
