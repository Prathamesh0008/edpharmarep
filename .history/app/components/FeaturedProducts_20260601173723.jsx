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
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id || product.slug}
              className="group relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`absolute -inset-1 bg-gradient-to-br from-blue-500/10 via-transparent to-sky-400/10 rounded-xl blur-lg transition-opacity duration-300 ${
                hoveredCard === index ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
              <div className={`relative block bg-gradient-to-b from-white to-gray-50 border rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full ${
                hoveredCard === index ? 'scale-[1.01] sm:scale-[1.02] border-blue-200' : 'border-gray-200/50'
              }`}>
                {/* Premium badge */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-[#0A2A73]/10 to-blue-500/10 backdrop-blur-sm text-[10px] font-semibold text-[#0A2A73]">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#0A2A73] rounded-full"></div>
                    {sectionText.featuredBadge}
                  </span>
                </div>

                {/* Product Image */}
                <Link href={`/product/${product.slug}`} prefetch={false}>
                  <div className="relative h-36 sm:h-44 md:h-52 lg:h-56 rounded-t-lg sm:rounded-t-xl overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent z-10"></div>
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name || "Product image"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className={`object-contain p-3 sm:p-4 transition-transform duration-300 ${
                        hoveredCard === index ? 'scale-105' : 'scale-100'
                      }`}
                      priority={index === 0}
                      loading={index > 0 ? "lazy" : "eager"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A73]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                {/* Product Content */}
                <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="inline-block">
                      
                    </div>

                    <Link href={`/product/${product.slug}`} prefetch={false} className="block">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-[#0A2A73] transition-colors">
                        {stripMgWord(product.name)}
                      </h3>
                    </Link>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-700">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#0A2A73] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="break-words">
                          <span className="font-medium">{sectionText.dosageLabel}</span> {product.dosage}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-700">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#0A2A73] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="break-words">
                          <span className="font-medium">{sectionText.formLabel}</span> {product.form}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-700">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="break-words">
                          <span className="font-medium">{sectionText.packLabel}</span> {product.pack_size}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-3 flex flex-col xs:flex-row gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 text-center rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#0A2A73] hover:bg-blue-800 transition-colors whitespace-nowrap"
                        prefetch={false}
                      >
                        {sectionText.viewDetails}
                      </Link>
                      
                      <Link
                        href={`/contact?product=${encodeURIComponent(product.slug)}`}
                        className="flex-1 text-center rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold border border-[#0A2A73] text-[#0A2A73] hover:bg-blue-50 transition-colors whitespace-nowrap"
                        prefetch={false}
                      >
                        {sectionText.enquire}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-[#0A2A73] to-blue-500 transform origin-left transition-transform duration-300 ${
                  hoveredCard === index ? 'scale-x-100' : 'scale-x-0'
                }`}></div>
              </div>
            </div>
          ))}
        </div> */}

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

