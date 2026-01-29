// app/product/[slug]/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import ProductActions from "../../components/ProductActions";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState, use } from "react";

export default function ProductPage({ params }) {
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { t, language, getProductBySlug } = useLanguage();

  console.log("DEBUG Product Detail: Current language:", language);
  console.log("DEBUG Product Detail: Translations:", t?.productDetail);

  // Get translations from context, fallback to English structure
  const productDetailTranslations = t?.productDetail || {
    notFound: "Product not found",
    backButton: "← Back to Products",
    labels: {
      category: "Category",
      brand: "Brand",
      price: "Price",
      dosage: "Dosage",
      composition: "Composition",
      form: "Form",
      packSize: "Pack Size",
      sideEffects: "Side Effects",
      administration: "Administration",
      warnings: "Warnings",
      howItWorks: "How It Works",
      tips: "Tips",
    },
    sections: {
      overview: "Product Overview",
      sideEffects: "Possible Side Effects",
      administration: "How to Use",
      warnings: "Important Warnings",
      howItWorks: "How It Works",
      howToUse: "How to use",
      tips: "Usage Tips",
    },
  };

  const labels = productDetailTranslations?.labels || {};
  const sections = productDetailTranslations?.sections || {};

  // Default product images (you can replace with actual product images)
  const productImages = [
    product?.image || "/placeholder.jpg",
    product?.additionalImages?.[0] || "/placeholder.jpg",
    product?.additionalImages?.[1] || "/placeholder.jpg",
  ];

  useEffect(() => {
    if (slug) {
      // Get translated product using getProductBySlug from context
      const translated = getProductBySlug(slug);
      setProduct(translated);
    }
  }, [slug, getProductBySlug, language]);

  // Auto-rotate images effect
  useEffect(() => {
    if (productImages.length > 1) {
      const interval = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % productImages.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [productImages.length]);

  if (!slug) {
    return (
      <div className="p-8 sm:p-12 md:p-20 text-center text-lg sm:text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 sm:p-12 md:p-20 text-center text-lg sm:text-xl text-gray-600">
        {productDetailTranslations.notFound || "Product not found"}
      </div>
    );
  }

  /* ================= BRAND THEMES ================= */
  const BRAND_THEMES = {
    "ED Ajanta Pharma": {
      primary: "#0A2A73",
      secondary: "#2A7DB8",
      bg: "/bg/bg6.png",
      light: "#EFF6FF",
    },
    "ED Sunrise Remedies": {
      primary: "#E86A0C",
      secondary: "#F6B15C",
      bg: "/bg/bg4.png",
      light: "#FEF3E2",
    },
    "ED Centurion Remedies": {
      primary: "#B69A6B",
      secondary: "#D9C7A2",
      bg: "/bg/bg5.png",
      light: "#F9F7F0",
    },
  };

  // Use brand from translated product or fallback
  const productBrand = product.brand || "ED Ajanta Pharma";
  const theme = BRAND_THEMES[productBrand] || {
    primary: "#1E3A8A",
    secondary: "#3B82F6",
    bg: "/bg/bg1.png",
    light: "#EFF6FF",
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 🔵 FIXED BACKGROUND */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <div
          className="w-full h-full"
          style={{ backgroundColor: theme.primary }}
        />
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 md:pt-8">
        <Link
          href={`/products?brand=${encodeURIComponent(productBrand)}`}
          className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium transition-colors px-2 py-1.5 sm:px-0 sm:py-0"
        >
          <span className="truncate">
            {productDetailTranslations.backButton || "← Back to Products"}
          </span>
        </Link>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 md:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          {/* Product Header */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6 md:gap-8">
              {/* Product Image Gallery */}
              <div className="flex-shrink-0 w-full lg:w-auto">
                {/* Main Image Container */}
                <div className="relative w-full max-w-xs mx-auto sm:max-w-sm bg-[#fafaf9] md:max-w-md lg:w-[28rem] lg:max-w-full aspect-square rounded-xl overflow-hidden border-4 border-white shadow-lg mb-3 sm:mb-4">
                  {productImages.map((imgSrc, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 ${
                        index === activeImage
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0"
                      }`}
                      style={{
                        transition: "none", // Remove transitions
                      }}
                    >
                      <Image
                        src={imgSrc}
                        alt={`${product.name || "Product Image"} - View ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain pointer-cursor"
                        priority={index === 0}
                      />
                    </div>
                  ))}

                  {/* Image Navigation Dots */}
                  {productImages.length > 1 && (
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                            index === activeImage ? "scale-125" : "scale-100"
                          }`}
                          style={{
                            backgroundColor:
                              index === activeImage
                                ? theme.primary
                                : theme.secondary + "80",
                            transition: "none", // Remove transitions
                          }}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {productImages.length > 1 && (
                  <div className="flex gap-2 sm:gap-3 justify-center overflow-x-auto py-2 px-4 md:overflow-visible">
                    {productImages.map((imgSrc, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 ${
                          index === activeImage
                            ? "border-opacity-100 scale-105 shadow-md"
                            : "border-opacity-30 border-gray-300"
                        }`}
                        style={{
                          borderColor:
                            index === activeImage
                              ? theme.primary
                              : "transparent",
                          transition: "none", // Remove transitions
                        }}
                      >
                        <Image
                          src={imgSrc}
                          alt={`Thumbnail ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Image Rotation Indicator */}
                {productImages.length > 1 && (
                  <div className="mt-3 sm:mt-4 text-center">
                    <div
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: theme.primary + "10",
                        color: theme.primary,
                      }}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="hidden xs:inline">
                        Click thumbnails to view
                      </span>
                      <span className="xs:hidden">Click to view</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                {/* Product Name */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 break-words">
                  {product.name || "Product Name"}
                </h1>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {product.description}
                  </p>
                )}

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {product.category && (
                    <DetailCard
                      label={labels.category}
                      value={product.category}
                      theme={theme}
                    />
                  )}

                  {product.brand && (
                    <DetailCard
                      label={labels.brand}
                      value={product.brand.replace("ED ", "")}
                      theme={theme}
                    />
                  )}

                  {product.dosage && (
                    <DetailCard
                      label={labels.dosage}
                      value={product.dosage}
                      theme={theme}
                    />
                  )}

                  {product.composition && (
                    <DetailCard
                      label={labels.composition}
                      value={product.composition}
                      theme={theme}
                    />
                  )}

                  {product.form && (
                    <DetailCard
                      label={labels.form}
                      value={product.form}
                      theme={theme}
                    />
                  )}

                  {product.packSize && (
                    <DetailCard
                      label={labels.packSize}
                      value={product.packSize}
                      theme={theme}
                    />
                  )}
                </div>

                {/* Price */}
                {product.price && (
                  <div className="mb-4 sm:mb-6">
                    <div className="inline-flex items-baseline flex-wrap">
                      <span className="text-sm text-gray-500 mr-2">
                        {labels.price}:
                      </span>
                      <span
                        className="text-2xl sm:text-3xl font-bold"
                        style={{ color: theme.primary }}
                      >
                        ₹ {product.price}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 sm:mt-6">
                  <ProductActions product={product} theme={theme} />
                </div>
              </div>
            </div>
          </div>

          {/* Product Sections */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="space-y-6 sm:space-y-8 md:space-y-10">
              {product.overview &&
                Array.isArray(product.overview) &&
                product.overview.length > 0 && (
                  <Section
                    title={sections.overview || "Product Overview"}
                    items={product.overview}
                    theme={theme}
                  />
                )}

              {product.how_it_works &&
                Array.isArray(product.how_it_works) &&
                product.how_it_works.length > 0 && (
                  <Section
                    title={sections.howItWorks || "How It Works"}
                    items={product.how_it_works}
                    theme={theme}
                  />
                )}

              {product.administration &&
                Array.isArray(product.administration) &&
                product.administration.length > 0 && (
                  <Section
                    title={sections.administration || "How to Use"}
                    items={product.administration}
                    theme={theme}
                  />
                )}

              {product.sideEffects &&
                Array.isArray(product.sideEffects) &&
                product.sideEffects.length > 0 && (
                  <Section
                    title={sections.sideEffects || "Possible Side Effects"}
                    items={product.sideEffects}
                    theme={theme}
                  />
                )}

              {product.warnings &&
                Array.isArray(product.warnings) &&
                product.warnings.length > 0 && (
                  <Section
                    title={sections.warnings || "Important Warnings"}
                    items={product.warnings}
                    theme={theme}
                  />
                )}

              {product.tips &&
                Array.isArray(product.tips) &&
                product.tips.length > 0 && (
                  <Section
                    title={sections.tips || "Usage Tips"}
                    items={product.tips}
                    theme={theme}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= DETAIL CARD COMPONENT ================= */
function DetailCard({ label, value, theme }) {
  return (
    <div
      className="p-3 sm:p-4 rounded-lg border"
      style={{
        borderColor: `${theme.primary}20`,
        backgroundColor: `${theme.primary}05`,
      }}
    >
      <div
        className="text-xs font-medium uppercase tracking-wide mb-1"
        style={{ color: theme.primary }}
      >
        {label}
      </div>
      <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">
        {value}
      </div>
    </div>
  );
}

/* ================= REUSABLE SECTION ================= */
function Section({ title, items, theme }) {
  return (
    <section className="border-t border-gray-100 first:border-t-0 pt-4 sm:pt-6 md:pt-8 first:pt-0">
      <h2
        className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
        style={{ color: theme.primary }}
      >
        <div
          className="w-1.5 h-5 sm:h-6 rounded-full flex-shrink-0"
          style={{ backgroundColor: theme.primary }}
        />
        <span className="break-words">{title}</span>
      </h2>

      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start">
            <div
              className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2"
              style={{ backgroundColor: theme.primary }}
            />
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
              {item}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
