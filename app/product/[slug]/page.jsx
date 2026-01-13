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
      tips: "Tips"
    },
    sections: {
      overview: "Product Overview",
      sideEffects: "Possible Side Effects",
      administration: "How to Use", 
      warnings: "Important Warnings",
      howItWorks: "How It Works",
      howToUse: "How to use",
      tips: "Usage Tips"
    }
  };

  const labels = productDetailTranslations?.labels || {};
  const sections = productDetailTranslations?.sections || {};

  useEffect(() => {
    if (slug) {
      // Get translated product using getProductBySlug from context
      const translated = getProductBySlug(slug);
      setProduct(translated);
    }
  }, [slug, getProductBySlug, language]);

  if (!slug) {
    return (
      <div className="p-20 text-center text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-20 text-center text-xl text-gray-600">
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
      light: "#EFF6FF"
    },
    "ED Sunrise Remedies": {
      primary: "#E86A0C",
      secondary: "#F6B15C",
      bg: "/bg/bg4.png",
      light: "#FEF3E2"
    },
    "ED Centurion Remedies": {
      primary: "#B69A6B",
      secondary: "#D9C7A2",
      bg: "/bg/bg5.png",
      light: "#F9F7F0"
    },
  };

  // Use brand from translated product or fallback
  const productBrand = product.brand || "ED Ajanta Pharma";
  const theme = BRAND_THEMES[productBrand] || {
    primary: "#1E3A8A",
    secondary: "#3B82F6",
    bg: "/bg/bg1.png",
    light: "#EFF6FF"
  };

  // Debug banner - remove after testing
  const DebugBanner = () => (
    <div className="fixed top-20 right-4 z-50 bg-red-100 p-2 rounded shadow text-xs">
      <div>Lang: {language}</div>
      <div>Has product: {product ? "Yes" : "No"}</div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-50">
      <DebugBanner />

      {/* 🔵 FIXED BACKGROUND */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <div 
          className="w-full h-full"
          style={{ backgroundColor: theme.primary }}
        />
      </div>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link
          href={`/products?brand=${encodeURIComponent(productBrand)}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {productDetailTranslations.backButton || "← Back to Products"}
        </Link>
      </div>

      {/* Main Product Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Product Header */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name || "Product Image"}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                {/* Product Name */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {product.name || "Product Name"}
                </h1>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {product.category && (
                    <DetailCard label={labels.category} value={product.category} theme={theme} />
                  )}
                  
                  {product.brand && (
                    <DetailCard 
                      label={labels.brand} 
                      value={product.brand.replace("ED ", "")} 
                      theme={theme} 
                    />
                  )}
                  
                  {product.dosage && (
                    <DetailCard label={labels.dosage} value={product.dosage} theme={theme} />
                  )}
                  
                  {product.composition && (
                    <DetailCard label={labels.composition} value={product.composition} theme={theme} />
                  )}
                  
                  {product.form && (
                    <DetailCard label={labels.form} value={product.form} theme={theme} />
                  )}
                  
                  {product.packSize && (
                    <DetailCard label={labels.packSize} value={product.packSize} theme={theme} />
                  )}
                </div>

                {/* Price */}
                {product.price && (
                  <div className="mb-6">
                    <div className="inline-flex items-baseline">
                      <span className="text-sm text-gray-500 mr-2">{labels.price}:</span>
                      <span 
                        className="text-3xl font-bold"
                        style={{ color: theme.primary }}
                      >
                        ₹ {product.price}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6">
                  <ProductActions product={product} theme={theme} />
                </div>
              </div>
            </div>
          </div>

          {/* Product Sections */}
          <div className="p-6 md:p-8">
            <div className="space-y-10">
              {product.overview && Array.isArray(product.overview) && product.overview.length > 0 && (
                <Section
                  title={sections.overview || "Product Overview"}
                  items={product.overview}
                  theme={theme}
                />
              )}

              {product.how_it_works && Array.isArray(product.how_it_works) && product.how_it_works.length > 0 && (
                <Section
                  title={sections.howItWorks || "How It Works"}
                  items={product.how_it_works}
                  theme={theme}
                />
              )}

              {product.administration && Array.isArray(product.administration) && product.administration.length > 0 && (
                <Section
                  title={sections.administration || "How to Use"}
                  items={product.administration}
                  theme={theme}
                />
              )}

              {product.sideEffects && Array.isArray(product.sideEffects) && product.sideEffects.length > 0 && (
                <Section
                  title={sections.sideEffects || "Possible Side Effects"}
                  items={product.sideEffects}
                  theme={theme}
                />
              )}

              {product.warnings && Array.isArray(product.warnings) && product.warnings.length > 0 && (
                <Section
                  title={sections.warnings || "Important Warnings"}
                  items={product.warnings}
                  theme={theme}
                />
              )}

              {product.tips && Array.isArray(product.tips) && product.tips.length > 0 && (
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
      className="p-4 rounded-lg border"
      style={{ 
        borderColor: `${theme.primary}20`,
        backgroundColor: `${theme.primary}05`
      }}
    >
      <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: theme.primary }}>
        {label}
      </div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}

/* ================= REUSABLE SECTION ================= */
function Section({ title, items, theme }) {
  return (
    <section className="border-t border-gray-100 first:border-t-0 pt-8 first:pt-0">
      <h2
        className="text-xl font-bold mb-6 flex items-center gap-3"
        style={{ color: theme.primary }}
      >
        <div 
          className="w-2 h-6 rounded-full"
          style={{ backgroundColor: theme.primary }}
        />
        {title}
      </h2>

      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start">
            <div 
              className="flex-shrink-0 w-2 h-2 rounded-full mr-3 mt-2"
              style={{ backgroundColor: theme.primary }}
            />
            <div className="text-gray-700 leading-relaxed">
              {item}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}