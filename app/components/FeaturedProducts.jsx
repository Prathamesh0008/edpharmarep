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
    

        {/* Stats Section */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm p-3 sm:p-4">
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

