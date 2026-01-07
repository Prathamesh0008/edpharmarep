"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { products } from "../data/products";
import { useState, useCallback, useMemo } from "react";

export default function FeaturedProducts() {
  const { t, getProductBySlug, language } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState(null);
  
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

  // Optimize: Memoize the featured products with translations
  const featuredProducts = useMemo(() => {
    return products.slice(0, 3).map(product => {
      // Get translated product data
      const translatedProduct = getProductBySlug(product.slug);
      
      // Fall back to English product data if translation not available
      if (!translatedProduct) {
        return {
          ...product,
          name: product.name,
          category: product.category || sectionText.defaultCategory,
          dosage: product.dosage,
          form: product.form,
          pack_size: product.pack_size
        };
      }
      
      // Use translated data
      return {
        ...product,
        name: translatedProduct.name || product.name,
        category: translatedProduct.category || product.category || sectionText.defaultCategory,
        dosage: translatedProduct.dosage || product.dosage,
        form: translatedProduct.form || product.form,
        pack_size: translatedProduct.pack_size || product.pack_size
      };
    });
  }, [getProductBySlug, products, sectionText.defaultCategory]);

  // Optimize hover handlers
  const handleMouseEnter = useCallback((index) => {
    setHoveredCard(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  return (
    <section className="relative  overflow-hidden">
      {/* Background decorative elements - simplified */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/10 to-white -z-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with enhanced design */}
        <div className="relative mb-12 md:mb-16 backdrop-blur-xs p-5">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#0A2A73] to-blue-500 rounded-full"></div>
              <span className="text-sm font-semibold text-[#0A2A73] uppercase tracking-wider">
                {sectionText.tag}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {sectionText.title}
                <span className="block text-[#0A2A73]">{sectionText.subtitle}</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                {sectionText.description}
              </p>
            </div>

            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-3 rounded-xl px-8 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              style={{ 
                background: "linear-gradient(135deg, #0A2A73 0%, #1e4fd8 100%)"
              }}
              prefetch={false}
            >
              <span>{sectionText.viewAll}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Enhanced Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Card glow effect on hover - simplified for performance */}
              <div className={`absolute -inset-2 bg-gradient-to-br from-blue-500/10 via-transparent to-sky-400/10 rounded-2xl blur-xl transition-opacity duration-300 ${
                hoveredCard === index ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
              <div className={`relative block bg-gradient-to-b from-white to-gray-50 border rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full ${
                hoveredCard === index ? 'scale-[1.02] border-blue-200' : 'border-gray-200/50'
              }`}>
                {/* Premium badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0A2A73]/10 to-blue-500/10 backdrop-blur-sm text-xs font-semibold text-[#0A2A73]">
                    <div className="w-1.5 h-1.5 bg-[#0A2A73] rounded-full"></div>
                    {sectionText.featuredBadge}
                  </span>
                </div>

                {/* Product Image with enhanced overlay */}
                <Link href={`/product/${product.slug}`} prefetch={false}>
                  <div className="relative h-56 sm:h-64 md:h-72 rounded-t-2xl sm:rounded-t-3xl overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent z-10"></div>
                    
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name || "Product image"}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className={`object-contain p-6 transition-transform duration-300 ${
                        hoveredCard === index ? 'scale-105' : 'scale-100'
                      }`}
                      priority={index === 0}
                      loading={index > 0 ? "lazy" : "eager"}
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A73]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                {/* Product Content */}
                <div className="p-5 sm:p-6 md:p-7">
                  <div className="space-y-4">
                    {/* Category */}
                    <div className="inline-block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A2A73] bg-blue-50 px-3 py-1.5 rounded-full">
                        {product.category || sectionText.defaultCategory}
                      </span>
                    </div>

                    {/* Product Name */}
                    <Link href={`/product/${product.slug}`} prefetch={false} className="block">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-[#0A2A73] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Quick Specifications - simplified */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-[#0A2A73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span><span className="font-medium">{sectionText.dosageLabel}</span> {product.dosage}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-[#0A2A73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span><span className="font-medium">{sectionText.formLabel}</span> {product.form}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span><span className="font-medium">{sectionText.packLabel}</span> {product.pack_size}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex gap-3">
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 text-center rounded-xl px-4 py-3 text-sm font-semibold text-white bg-[#0A2A73] hover:bg-blue-800 transition-colors"
                        prefetch={false}
                      >
                        {sectionText.viewDetails}
                      </Link>
                      
                      <Link
                        href={`/contact?product=${encodeURIComponent(product.slug)}`}
                        className="flex-1 text-center rounded-xl px-4 py-3 text-sm font-semibold border border-[#0A2A73] text-[#0A2A73] hover:bg-blue-50 transition-colors"
                        prefetch={false}
                      >
                        {sectionText.enquire}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A2A73] to-blue-500 transform origin-left transition-transform duration-300 ${
                  hoveredCard === index ? 'scale-x-100' : 'scale-x-0'
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats or additional info */}
        <div className="mt-16 pt-8 border-t border-gray-200 ">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 backdrop-blur-xs rounded-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A2A73]">{sectionText.stats.products}</div>
              <div className="text-sm text-gray-600 mt-1">{sectionText.stats.productsLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A2A73]">{sectionText.stats.countries}</div>
              <div className="text-sm text-gray-600 mt-1">{sectionText.stats.countriesLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A2A73]">{sectionText.stats.gmp}</div>
              <div className="text-sm text-gray-600 mt-1">{sectionText.stats.gmpLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A2A73]">{sectionText.stats.support}</div>
              <div className="text-sm text-gray-600 mt-1">{sectionText.stats.supportLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}