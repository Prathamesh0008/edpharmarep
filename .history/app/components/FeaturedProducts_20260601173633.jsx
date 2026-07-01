"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useCallback, useMemo } from "react";

const normalizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const stripMgWord = (name) => normalizeText(name).replace(/\bmg\b/gi, "").replace(/\s+/g, " ").trim();

export default function FeaturedProducts() {
  // ✅ ALL HOOKS MUST BE CALLED AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const { t, getProductBySlug, language, products, loading } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Optimize hover handlers - hooks must be declared before any conditional returns
  const handleMouseEnter = useCallback((index) => {
    setHoveredCard(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);
  
  // Get translations from context or use defaults
  const sectionText = t?.featuredProducts || {
    tag: "Premium Selection",
    title: "Featured",
    subtitle: "Pharmaceutical Products",
    description: "Explore our carefully selected range of premium pharmaceutical solutions trusted by healthcare professionals worldwide.",
    viewAll: "View All Products",
    featuredBadge: "Featured",
    categoryLabel: "Category:",
    dosageLabel: "Dosage:",
    formLabel: "Form:",
    packLabel: "Pack:",
    viewDetails: "View Details",
    enquire: "Enquire",
    defaultCategory: "Pharmaceutical",
    stats: {
      products: "200+",
      productsLabel: "Products",
      countries: "40+",
      countriesLabel: "Countries",
      gmp: "GMP",
      gmpLabel: "Certified",
      support: "24/7",
      supportLabel: "Support"
    }
  };

  // Optimize: Memoize the featured products from MongoDB data
  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 3).map(product => {
      const translatedProduct = getProductBySlug(product.slug) || product;
      return {
        id: translatedProduct.id,
        slug: translatedProduct.slug,
        name: translatedProduct.name || product.name,
        category: translatedProduct.category || product.category || sectionText.defaultCategory,
        dosage: translatedProduct.dosage || product.dosage,
        form: translatedProduct.form || product.form,
        pack_size: translatedProduct.pack_size || product.pack_size,
        image: translatedProduct.image || product.image || "/placeholder.jpg",
        additionalImages: translatedProduct.additionalImages || product.additionalImages || []
      };
    });
  }, [products, getProductBySlug, sectionText.defaultCategory]);

  // ✅ NOW conditional returns can come AFTER all hooks
  // Show loading state
  if (loading) {
    return (
      <section className="relative overflow-hidden py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#0A2A73] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading featured products...</p>
            </div>
          </div>
        </div>
      </section>
    );
}
  // Show nothing if no products
  if (!featuredProducts.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 md:py-16">
      {/* Rest of your JSX remains the same */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/10 to-white -z-20"></div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        {/* <div className="relative mb-8 sm:mb-10 md:mb-12 lg:mb-16 backdrop-blur-xs p-3 sm:p-4 md:p-5">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-gradient-to-r from-[#0A2A73] to-blue-500 rounded-full"></div>
              <span className="text-xs sm:text-sm font-semibold text-[#0A2A73] uppercase tracking-wider">
                {sectionText.tag}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {sectionText.title}
                <span className="block text-[#0A2A73] text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-1 sm:mt-2">
                  {sectionText.subtitle}
                </span>
              </h2>
              <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl">
                {sectionText.description}
              </p>
            </div>

            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
              style={{ 
                background: "linear-gradient(135deg, #0A2A73 0%, #1e4fd8 100%)"
              }}
              prefetch={false}
            >
              <span className="whitespace-nowrap">{sectionText.viewAll}</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div> */}

        {/* Product Grid */}
      

        {/* Stats Section */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 backdrop-blur-xs rounded-xl">
            <div className="text-center p-2 sm:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A2A73]">{sectionText.stats.products}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{sectionText.stats.productsLabel}</div>
            </div>
            <div className="text-center p-2 sm:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A2A73]">{sectionText.stats.countries}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{sectionText.stats.countriesLabel}</div>
            </div>
            <div className="text-center p-2 sm:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A2A73]">{sectionText.stats.gmp}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{sectionText.stats.gmpLabel}</div>
            </div>
            <div className="text-center p-2 sm:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A2A73]">{sectionText.stats.support}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{sectionText.stats.supportLabel}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .break-words {
            word-break: break-word;
            overflow-wrap: break-word;
          }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
        @media (max-width: 360px) {
          .whitespace-nowrap {
            white-space: normal;
            word-break: break-word;
          }
        }
      `}</style>
    </section>
  );
}

