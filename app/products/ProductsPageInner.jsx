"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { COMPOUNDS } from "../data/compounds";
import { useSearchParams } from "next/navigation";
import { useCart } from "../components/CartContext";
import { useLanguage } from "@/context/LanguageContext";

// BRAND THEMES
const BRAND_THEMES = {
  "ED Ajanta Pharma": {
    name: "Ajanta Pharma",
    logo: "/bg/ajanta.png", //public\Artboard 2.png
    primary: "#0A2A73",
    secondary: "#2A7DB8",
    accent: "#1C5EB7",
    bgImage: "/bg/bg1.png",
     bgUpImage: "/bg/bgup.png",    // Top right image
    bgDownImage: "/bg/bgdown.png", // Bottom left image
    gradient: "linear-gradient(135deg, #0A2A73 0%, #2A7DB8 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #0A2A73 0%, #1C5EB7 50%, #2A7DB8 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(10, 42, 115, 0.25)",
    buttonHover: "#0F3A8E",
  },
  "ED Centurion Remedies": {
    name: "Centurion Remedies",
    logo: "/bg/centurion.png",
    primary: "#FFB800",
    secondary: "#FFD966",
    accent: "#E6A400",
    bgImage: "/bg/bg5.png",
    gradient: "linear-gradient(135deg, #FFB800 0%, #FFD966 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #FFB800 0%, #E6A400 50%, #FFD966 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(255, 184, 0, 0.25)",
    buttonHover: "#E6A400",
    imageBorderColor: "#FFFFFF", // Add this for white border
    imageBorderStyle: "embossed", // Add this to identify style
  },
  "ED Sunrise Remedies": {
    name: "Sunrise Remedies",
    logo: "/bg/sunrise.png",
    primary: "#E86A0C",
    secondary: "#F6B15C",
    accent: "#F08529",
    bgImage: "/bg/bg4.png",
    gradient: "linear-gradient(135deg, #E86A0C 0%, #F6B15C 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #E86A0C 0%, #F08529 50%, #F6B15C 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(232, 106, 12, 0.25)",
    buttonHover: "#D45F0A",
  },
  Nova: {
    name: "Nova",
    logo: "/bg/nova.png",
    primary: "#081A3E",
    secondary: "#1C4A8C",
    accent: "#122A5C",
    bgImage: "/bg/bg6.png",
    gradient: "linear-gradient(135deg, #081A3E 0%, #1C4A8C 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #081A3E 0%, #122A5C 50%, #1C4A8C 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(8, 26, 62, 0.25)",
    buttonHover: "#0D234F",
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
  const { t, language, getProductsByBrand } = useLanguage();

  // Get translations
  const productsTranslations = t?.productsPage || {
    hero: {
      suffix: "Products",
      subtitle:
        "Browse through our comprehensive range of pharmaceutical products",
    },
    filters: {
      searchPlaceholder:
        "Search products by name, composition, or description...",
      allCompounds: "All Compounds",
      resetButton: "Reset All Filters",
      clearSearch: "Clear Search",
    },
    productCard: {
      viewDetails: "View Details",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      dosageLabel: "Dosage:",
      compositionLabel: "Composition:",
      packSizeLabel: "Pack Size:",
      skusAvailable: "SKUs",
      productsAvailable: "products available",
      productAvailable: "product available",
    },
    emptyState: {
      title: "No Products Found",
      description:
        "We couldn't find any products matching your search criteria.",
    },
  };

  const hero = productsTranslations?.hero || {};
  const filters = productsTranslations?.filters || {};
  const productCard = productsTranslations?.productCard || {};
  const emptyState = productsTranslations?.emptyState || {};

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
  const brandProducts = getProductsByBrand(selectedBrand);
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
    <div className="w-full relative min-h-screen">
      <Navbar />

      {/* Background with brand image */}
      {/* Background with brand image */}
<div className="fixed inset-0 -z-10">
  {/* Brand background image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat"
    style={{
      backgroundImage: `url(${theme.bgImage})`,
    }}
  ></div>
  
  {/* Conditional Ajanta Pharma specific background images */}
  {selectedBrand === "ED Ajanta Pharma" && theme.bgUpImage && theme.bgDownImage && (
    <>
      {/* Top right image */}
      <div 
        className="absolute -top-20 -right-35 w-130 h-200 opacity-80"
        style={{
          backgroundImage: `url(${theme.bgUpImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
          mixBlendMode: 'multiply'
        }}
      ></div>
      
      {/* Bottom left image */}
      <div 
        className="absolute -bottom-20 -left-35 w-110 h-204 opacity-80"
        style={{
          backgroundImage: `url(${theme.bgDownImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom left',
          mixBlendMode: 'multiply'
        }}
      ></div>
    </>
  )}
  
  {/* White overlay for better readability but still showing background */}
  <div className="absolute inset-0 bg-white/30"></div>
</div>

      {/* Floating Brand Selector - White with shadow */}
      <div
        className={`fixed top-18 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-full shadow-xl px-3 sm:px-4 py-2 sm:py-3 border border-gray-100">
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
                  isActive ? "shadow-inner" : "hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: isActive ? `${b.primary}15` : undefined,
                  border: isActive
                    ? `1.5px solid ${b.primary}40`
                    : "1.5px solid transparent",
                }}
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 cursor-pointer">
                  <Image
                    src={b.logo}
                    alt={b.name}
                    fill
                    className="object-contain"
                  />
                </div>
                {isActive && (
                  <span
                    className="text-xs sm:text-sm font-semibold whitespace-nowrap"
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        {/* Brand Logos Grid */}
        <div className="mb-6 sm:mb-8 mt-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {BRAND_ORDER.map((brandKey, index) => {
              const b = BRAND_THEMES[brandKey];
              const isActive = selectedBrand === brandKey;

              return (
                <button
                  key={brandKey}
                  onClick={() => {
                    setSelectedBrand(brandKey);
                    setSearch("");
                    setCategoryFilter("All");
                  }}
                  className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 h-48 transition-all duration-500 transform hover:scale-[1.02] bg-white ${
                    isActive
                      ? "ring-3 sm:ring-4 ring-offset-1 sm:ring-offset-2 scale-[1.02] shadow-2xl"
                      : "hover:shadow-xl"
                  }`}
                  style={{
                    border: `1px solid ${isActive ? b.primary : "#e5e7eb"}`,
                    boxShadow: isActive
                      ? `0 20px 40px ${b.primary}40`
                      : "0 4px 20px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-pulse"
                        style={{
                          backgroundColor: b.primary,
                          boxShadow: `0 0 10px ${b.primary}`,
                        }}
                      ></div>
                    </div>
                  )}

                  <div className="flex items-center justify-center h-full w-full cursor-pointer">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                      <Image
                        src={b.logo}
                        alt={b.name}
                        fill
                        className="object-contain "
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

        {/* Hero Section */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
              <span
                className="bg-clip-text text-transparent drop-shadow-sm"
                style={{ backgroundImage: theme.gradient }}
              >
                {theme.name}
              </span>{" "}
              <span className="text-2xl xs:text-2xl sm:text-5xl block sm:inline text-gray-900">
                {hero.suffix || "Products"}
              </span>
            </h1>

            <p className="text-base xs:text-lg sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
              {hero.subtitle ||
                "Browse through our comprehensive range of pharmaceutical products"}
            </p>
          </div>

          {/* Advanced Filters - White background */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Search Input */}
              {/* <div className="w-full">
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
                    placeholder={
                      filters.searchPlaceholder ||
                      "Search products by name, composition, or description..."
                    }
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-3 focus:ring-offset-1 sm:focus:ring-offset-2 focus:border-transparent transition-all shadow-sm text-gray-900"
                    style={{ "--tw-ring-color": theme.primary }}
                  />
                </div>
              </div> */}

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Compound Select */}
                <div className="relative flex-1">
                  <select
                    value={selectedCompound}
                    onChange={(e) => {
                      setSelectedCompound(e.target.value);
                      scrollToCompound(e.target.value);
                    }}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-3 focus:ring-offset-1 sm:focus:ring-offset-2 focus:border-transparent transition-all appearance-none bg-white shadow-sm text-gray-900"
                    style={{ "--tw-ring-color": theme.primary }}
                  >
                    <option value="" className="text-gray-900">
                      {filters.allCompounds || "All Compounds"}
                    </option>
                    {compoundNames.map((c) => (
                      <option key={c} value={c} className="text-gray-900">
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-3 focus:ring-offset-1 sm:focus:ring-offset-2 focus:border-transparent transition-all appearance-none bg-white shadow-sm text-gray-900"
                    style={{ "--tw-ring-color": theme.primary }}
                  >
                    {brandCategories.map((cat) => (
                      <option key={cat} value={cat} className="text-gray-900">
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
                {/* Compact Compound Header */}
                <div className="mb-6 sm:mb-8">
                  <div className="relative">
                    {/* Main Header Container */}
                    <div
                      className="relative overflow-hidden rounded-xl mb-3 sm:mb-4 group"
                      style={{
                        background: theme.compoundHeaderGradient,
                        boxShadow: theme.compoundHeaderShadow,
                      }}
                    >
                      {/* Top accent line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{
                          background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                        }}
                      ></div>

                      {/* Main content - Compact layout */}
                      <div className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                          {/* Left side - Compound name */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {/* Active indicator dot */}
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <div
                                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
                                    style={{ backgroundColor: theme.secondary }}
                                  ></div>
                                </div>
                              </div>

                              {/* Compound name */}
                              <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate drop-shadow-sm">
                                  {compound}
                                </h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-white/80 text-xs font-medium">
                                    Pharmaceutical Range
                                  </span>
                                  <div className="w-1 h-1 rounded-full bg-white/40"></div>
                                  <span className="text-white/80 text-xs">
                                    {slugs.length} SKUs
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right side - Product count */}
                          <div className="flex-shrink-0">
                            <div
                              className="px-3 py-1.5 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20"
                              style={{
                                boxShadow: `0 2px 8px ${theme.primary}40`,
                              }}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-white font-bold text-sm sm:text-base">
                                  {items.length}
                                </span>
                                <span className="text-white/90 text-xs sm:text-sm whitespace-nowrap">
                                  {items.length !== 1 ? "Products" : "Product"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom shine */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>

                    {/* Optional: Compact filter indicators (only show if filters active) */}
                    {(categoryFilter !== "All" || search.trim()) && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {categoryFilter !== "All" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-white/90 text-gray-700 border border-gray-200">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                              />
                            </svg>
                            {categoryFilter}
                          </span>
                        )}

                        {search.trim() && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-white/90 text-gray-700 border border-gray-200">
                            <svg
                              className="w-3 h-3"
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
                            "{search.substring(0, 10)}
                            {search.length > 10 ? "..." : ""}"
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Products List */}
                <div className="space-y-6 sm:space-y-8">
                  {items.map((p, index) => {
                    const isEven = index % 2 === 0;

                    return (
                      <div
                        key={p.slug}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                      >
                        <div className="p-4 sm:p-6">
                          {/* MOBILE VIEW */}
                          <div className="lg:hidden">
                            <div className="space-y-4 sm:space-y-6">
                              {/* Product Image */}
                              <div className=" sm:rounded-xl p-3 sm:p-4 relative overflow-hidden ">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                                <div className="relative h-60 sm:h-88">
                                  <Image
                                    src={
                                      p.image && p.image.trim() !== ""
                                        ? p.image
                                        : "/placeholder.jpg"
                                    }
                                    alt={p.name}
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="60vw"
                                  />
                                </div>
                              </div>

                              {/* Product Details */}
                              <div className="space-y-3 sm:space-y-4">
                                <div>
                                  <h3
                                    className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 group-hover:scale-[1.02] transition-transform"
                                    style={{ color: theme.primary }}
                                  >
                                    {p.name}
                                  </h3>
                                </div>

                                {/* Specifications */}
                                <div className="space-y-2">
                                  {p.dosage && (
                                    <div className="flex items-start">
                                      <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[70px] sm:min-w-[80px]">
                                        {productCard.dosageLabel || "Dosage:"}
                                      </span>
                                      <span className="text-xs sm:text-sm text-gray-600 ml-2">
                                        {p.dosage}
                                      </span>
                                    </div>
                                  )}
                                  {p.composition && (
                                    <div className="flex items-start">
                                      <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[70px] sm:min-w-[80px]">
                                        {productCard.compositionLabel ||
                                          "Composition:"}
                                      </span>
                                      <span className="text-xs sm:text-sm text-gray-600 ml-2">
                                        {p.composition}
                                      </span>
                                    </div>
                                  )}
                                  {p.pack_size && (
                                    <div className="flex items-start">
                                      <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[70px] sm:min-w-[80px]">
                                        {productCard.packSizeLabel ||
                                          "Pack Size:"}
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
                                    className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all hover:shadow-md active:scale-95"
                                    style={{
                                      borderColor: theme.primary,
                                      color: theme.primary,
                                      backgroundColor: `${theme.primary}08`,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = `${theme.primary}15`;
                                      e.currentTarget.style.boxShadow = `0 4px 12px ${theme.primary}30`;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = `${theme.primary}08`;
                                      e.currentTarget.style.boxShadow = "";
                                    }}
                                  >
                                    {productCard.viewDetails || "View Details"}
                                  </Link>

                                  <button
                                    onClick={() =>
                                      addToCart(p, 50, false, true)
                                    }
                                    className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base text-white transition-all hover:shadow-lg active:scale-95"
                                    style={{
                                      backgroundColor: theme.primary,
                                      boxShadow: `0 2px 10px ${theme.primary}50`,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        theme.buttonHover;
                                      e.currentTarget.style.boxShadow = `0 4px 15px ${theme.primary}70`;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        theme.primary;
                                      e.currentTarget.style.boxShadow = `0 2px 10px ${theme.primary}50`;
                                    }}
                                  >
                                    {productCard.addToCart || "Add to Cart"}
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
                                  <div className=" p-6 w-full relative overflow-hidden group/image">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                                    <div className="relative h-40 sm:h-88 overflow-hidden rounded-lg">
                                      <Image
                                        src={
                                          p.image && p.image.trim() !== ""
                                            ? p.image
                                            : "/placeholder.jpg"
                                        }
                                        alt={p.name}
                                        fill
                                        className="object-cover rounded-lg group-hover/image:scale-105 transition-transform duration-500"
                                        sizes="40vw"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Details Right */}
                                <div className="flex flex-col justify-center">
                                  <div className="space-y-3 sm:space-y-4">
                                    <h3
                                      className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-[1.02] transition-transform"
                                      style={{ color: theme.primary }}
                                    >
                                      {p.name}
                                    </h3>

                                    {/* Specifications List */}
                                    <div className="space-y-2 sm:space-y-3">
                                      {p.dosage && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.dosageLabel ||
                                              "Dosage:"}
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.dosage}
                                          </span>
                                        </div>
                                      )}
                                      {p.composition && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.compositionLabel ||
                                              "Composition:"}
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.composition}
                                          </span>
                                        </div>
                                      )}
                                      {p.pack_size && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.packSizeLabel ||
                                              "Pack Size:"}
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
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all hover:shadow-md active:scale-95"
                                        style={{
                                          borderColor: theme.primary,
                                          color: theme.primary,
                                          backgroundColor: `${theme.primary}08`,
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = `${theme.primary}15`;
                                          e.currentTarget.style.boxShadow = `0 4px 12px ${theme.primary}30`;
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = `${theme.primary}08`;
                                          e.currentTarget.style.boxShadow = "";
                                        }}
                                      >
                                        {productCard.viewDetails ||
                                          "View Details"}
                                      </Link>

                                      <button
                                        onClick={() =>
                                          addToCart(p, 50, false, true)
                                        }
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base text-white transition-all hover:shadow-lg active:scale-95"
                                        style={{
                                          backgroundColor: theme.primary,
                                          boxShadow: `0 2px 10px ${theme.primary}50`,
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            theme.buttonHover;
                                          e.currentTarget.style.boxShadow = `0 4px 15px ${theme.primary}70`;
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            theme.primary;
                                          e.currentTarget.style.boxShadow = `0 2px 10px ${theme.primary}50`;
                                        }}
                                      >
                                        {productCard.addToCart || "Add to Cart"}
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
                                    <h3
                                      className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-[1.02] transition-transform"
                                      style={{ color: theme.primary }}
                                    >
                                      {p.name}
                                    </h3>

                                    {/* Specifications List */}
                                    <div className="space-y-2 sm:space-y-3">
                                      {p.dosage && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.dosageLabel ||
                                              "Dosage:"}
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.dosage}
                                          </span>
                                        </div>
                                      )}
                                      {p.composition && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.compositionLabel ||
                                              "Composition:"}
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.composition}
                                          </span>
                                        </div>
                                      )}
                                      {p.pack_size && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.packSizeLabel ||
                                              "Pack Size:"}
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
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all hover:shadow-md active:scale-95"
                                        style={{
                                          borderColor: theme.primary,
                                          color: theme.primary,
                                          backgroundColor: `${theme.primary}08`,
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = `${theme.primary}15`;
                                          e.currentTarget.style.boxShadow = `0 4px 12px ${theme.primary}30`;
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = `${theme.primary}08`;
                                          e.currentTarget.style.boxShadow = "";
                                        }}
                                      >
                                        {productCard.viewDetails ||
                                          "View Details"}
                                      </Link>

                                      <button
                                        onClick={() =>
                                          addToCart(p, 50, false, true)
                                        }
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base text-white transition-all hover:shadow-lg active:scale-95"
                                        style={{
                                          backgroundColor: theme.primary,
                                          boxShadow: `0 2px 10px ${theme.primary}50`,
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            theme.buttonHover;
                                          e.currentTarget.style.boxShadow = `0 4px 15px ${theme.primary}70`;
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            theme.primary;
                                          e.currentTarget.style.boxShadow = `0 2px 10px ${theme.primary}50`;
                                        }}
                                      >
                                        {productCard.addToCart || "Add to Cart"}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Image Right */}
                                <div className="flex items-center justify-center">
                                  <div className=" p-6 w-full relative overflow-hidden group/image ">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                                    <div className="relative h-40 sm:h-88 overflow-hidden rounded-lg">
                                      <Image
                                        src={
                                          p.image && p.image.trim() !== ""
                                            ? p.image
                                            : "/placeholder.jpg"
                                        }
                                        alt={p.name}
                                        fill
                                        className="object-cover rounded-lg group-hover/image:scale-105 transition-transform duration-500"
                                        sizes="50vw"
                                      />
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
                className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full mb-4 sm:mb-6 bg-white shadow-lg"
                style={{
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
                {emptyState.title || "No Products Found"}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-6 sm:mb-8">
                {emptyState.description ||
                  "We couldn't find any products matching your search criteria."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
                <button
                  onClick={() => setSearch("")}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border font-medium text-sm transition-all hover:shadow-md whitespace-nowrap bg-white"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.primary}08`;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${theme.primary}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `white`;
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  {filters.clearSearch || "Clear Search"}
                </button>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setSelectedCompound(compoundNames[0]);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-white transition-all hover:shadow-lg whitespace-nowrap"
                  style={{
                    background: theme.gradient,
                    boxShadow: `0 4px 15px ${theme.primary}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.buttonHover} 0%, ${theme.secondary} 100%)`;
                    e.currentTarget.style.boxShadow = `0 6px 20px ${theme.primary}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme.gradient;
                    e.currentTarget.style.boxShadow = `0 4px 15px ${theme.primary}40`;
                  }}
                >
                  {filters.resetButton || "Reset All Filters"}
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
              className="p-3 sm:p-4 rounded-full shadow-2xl text-white animate-bounce hover:shadow-3xl transition-all active:scale-90"
              style={{
                background: theme.gradient,
                boxShadow: `0 8px 32px ${theme.primary}60`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 10px 40px ${theme.primary}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 32px ${theme.primary}60`;
              }}
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
