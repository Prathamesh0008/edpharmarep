//app/components/HomeProducts.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { products as allProducts } from "../data/products";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

/* ---------------- BRANDS ---------------- */
const brands = [
  {
    key: "ED Ajanta Pharma",
    logo: "/logo/ajanta.webp",
  },
  { key: "ED Sunrise Remedies", logo: "/logo/sunrise.png" },
  { key: "ED Centurion Remedies", logo: "/logo/cen.png" },
];

/* ---------------- SMOOTH PRODUCT IMAGE GALLERY ---------------- */
const SmoothProductImageGallery = ({ product, themeColor, isCompact = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  // Get product images
  const images = useMemo(() => {
    const imageArray = [
      product?.image || "/placeholder.jpg",
      product?.additionalImages?.[0] || "/placeholder.jpg",
      product?.additionalImages?.[1] || "/placeholder.jpg",
    ];
    return imageArray.filter(img => img && img.trim() !== "");
  }, [product]);

  // Auto-rotation with smooth transitions - FASTER VERSION
  useEffect(() => {
    if (images.length <= 1) return;

    const rotateImage = () => {
      setIsTransitioning(true);
      setCurrentImageIndex(prev => (prev + 1) % images.length);
      
      // Clear any existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      // Reset transitioning state after animation completes - FASTER
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 400); // Faster: 400ms
    };

    intervalRef.current = setInterval(rotateImage, 1000); // Faster: 2 seconds between images

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [images.length]);

  const handleThumbnailClick = (index) => {
    if (index === currentImageIndex || isTransitioning) return;
    
    // Reset auto-rotation timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    
    // Restart auto-rotation after manual interaction - FASTER
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 2000); // Faster: 2 seconds
    }, 800); // Faster: 800ms
  };

  return (
    <div className="relative w-full h-full group overflow-hidden">
      <style jsx>{`
        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .image-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: scale(0.98);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); // Faster: 0.4s
          will-change: transform, opacity;
        }
        
        .image-slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 10;
        }
        
        .image-slide.inactive {
          opacity: 0;
          transform: scale(0.98);
          z-index: 1;
        }
        
        .navigation-dot {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); // Faster: 0.2s
          will-change: transform, background-color;
        }
        
        .image-indicator {
          animation: gentlePulse 1s ease-in-out infinite; // Faster: 1s
        }
        
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        /* Prevent animation on reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .image-slide,
          .navigation-dot,
          .image-indicator {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* Main Image Container */}
      <div className="image-container">
        {images.map((imgSrc, index) => (
          <div
            key={index}
            className={`image-slide ${index === currentImageIndex ? 'active' : 'inactive'}`}
          >
            <Image
              src={imgSrc}
              alt={`${product.name} - View ${index + 1}`}
              fill
              className="object-contain p-3 sm:p-4 md:p-5 lg:p-6 transition-transform duration-200 group-hover:scale-105" // Added duration-200
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
        
        {/* Image Navigation Dots - Compact for homepage */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`navigation-dot w-1.5 h-1.5 rounded-full ${
                  index === currentImageIndex 
                    ? 'scale-125' 
                    : 'scale-100 hover:scale-110'
                }`}
                style={{
                  backgroundColor: index === currentImageIndex 
                    ? themeColor 
                    : `${themeColor}80`
                }}
                aria-label={`View image ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
        )}

        {/* Auto-rotation Indicator - Show on hover */}
        {images.length > 1 && (
          <div className="absolute top-1.5 right-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"> {/* Added duration-200 */}
            <div 
              className="px-1.5 py-0.5 rounded-full text-[8px] font-medium backdrop-blur-sm bg-white/90 image-indicator"
              style={{ color: themeColor }}
            >
              <div className="flex items-center gap-0.5">
                <svg 
                  className="w-2 h-2" 
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
                <span>Auto</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- RESPONSIVE LOGO STRIP ---------------- */
function LogoStrip({ activeBrand, setActiveBrand }) {
  const BRAND = "#0A2A73";

  return (
    <div className="w-full flex justify-center mt-6 sm:mt-8 md:mt-10">
      <div className="rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-md shadow-xl ring-1 ring-slate-100/50 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 w-full max-w-5xl mx-2 sm:mx-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {brands.map((b) => {
            const active = b.key === activeBrand;

            return (
              <button
                key={b.key}
                onClick={() => setActiveBrand(b.key)}
                className={[
                  "relative group transition-all duration-300 cursor-pointer",
                  "h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 rounded-2xl md:rounded-3xl",
                  "bg-gradient-to-b from-white via-white to-gray-50/50",
                  "shadow-lg hover:shadow-xl md:shadow-xl md:hover:shadow-2xl",
                  "border-2",
                  active
                    ? "scale-[1.02] border-[#0A2A73] shadow-xl md:shadow-2xl"
                    : "border-gray-200 hover:border-gray-300",
                ].join(" ")}
              >
                <div className="relative h-3/4 w-3/4 mx-auto">
                  <Image 
                    src={b.logo} 
                    alt={b.key} 
                    fill 
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, (max-width: 1024px) 280px, 320px"
                    className={[
                      "object-contain transition-all duration-300",
                      active ? "opacity-100 scale-105" : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
                    ].join(" ")}
                    priority={active}
                  />
                </div>
                
                {active && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-[#0A2A73] rounded-full flex items-center justify-center shadow-md sm:shadow-lg">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- RESPONSIVE HOME PRODUCTS ---------------- */
export default function HomeProducts({ activeBrand, setActiveBrand }) {
  const { t } = useLanguage();
  const BRAND = "#0A2A73";
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const brandProducts = allProducts.filter(
    (p) => p.brand === activeBrand
  );

  // Pre-calculate text lengths for consistent layout
  const showingAllText = t?.homeProducts?.header?.showingAll 
    ? t.homeProducts.header.showingAll.replace('{count}', brandProducts.length)
    : `Showing all ${brandProducts.length} products`;

  const productCountText = t?.homeProducts?.buttons?.productsCount 
    ? t.homeProducts.buttons.productsCount.replace('{count}', brandProducts.length)
    : `${brandProducts.length} Products`;

  // Handle product hover for image rotation
  const handleProductMouseEnter = (productId) => {
    setHoveredProductId(productId);
  };

  const handleProductMouseLeave = () => {
    setHoveredProductId(null);
  };

  return (
    <section className="relative py-10 sm:py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <LogoStrip
          activeBrand={activeBrand}
          setActiveBrand={setActiveBrand}
        />

        {/* HEADER - Fixed heights to prevent layout shift */}
        <div className="mt-10 sm:mt-12 relative">
          <div className="absolute -inset-3 sm:-inset-4 md:-inset-6 bg-gradient-to-r from-blue-50/20 to-transparent backdrop-blur-xs sm:backdrop-blur-sm rounded-xl sm:rounded-2xl -z-10"></div>
          
          <div className="relative flex flex-col gap-4 sm:gap-5 md:gap-6 sm:flex-row sm:items-end sm:justify-between p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 min-h-[20px] sm:min-h-[24px]">
                <div className="w-2 h-0.1 sm:w-7 sm:h-01 md:w-4 md:h-1 bg-gradient-to-r from-[#0A2A73] to-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-semibold text-[#0A2A73] uppercase tracking-wide inline-block min-w-[120px] sm:min-w-[140px] whitespace-nowrap">
                  {t?.homeProducts?.header?.tag || "All Products"}
                </span>
              </div>
              
              {/* Fixed height for brand name */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight min-h-[32px] sm:min-h-[38px] md:min-h-[44px] flex items-center">
                {activeBrand.replace("ED ", "")}
              </h2>
              
              {/* Fixed height for product count text */}
              <p className="mt-1 text-xs sm:text-sm text-slate-600 min-h-[18px] sm:min-h-[20px] flex items-center">
                {showingAllText}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0 min-h-[40px]">
              {/* Product count badge - fixed width with truncation */}
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 border border-blue-100 min-w-[100px] sm:min-w-[120px] text-center">
                <span className="text-xs sm:text-sm font-semibold text-[#0A2A73] whitespace-nowrap overflow-hidden text-ellipsis block">
                  {productCountText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID - Fixed heights for consistent layout */}
        {brandProducts.length > 0 ? (
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {brandProducts.map((p) => {
              // Pre-calculate text for this product card
              const detailsText = t?.homeProducts?.productCard?.details || "Details";
              const enquireText = t?.homeProducts?.productCard?.enquire || "Enquire";
              const dosageLabel = t?.homeProducts?.productCard?.dosage || "Dosage:";
              const formLabel = t?.homeProducts?.productCard?.form || "Form:";
              const packLabel = t?.homeProducts?.productCard?.pack || "Pack:";

              return (
                <article
                  key={p.slug}  
                  className="group relative rounded-xl sm:rounded-2xl md:rounded-3xl bg-white border shadow-sm hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
                  style={{ borderColor: "rgba(10,42,115,0.15)" }}
                  onMouseEnter={() => handleProductMouseEnter(p.slug)}
                  onMouseLeave={handleProductMouseLeave}
                >
                  {/* IMAGE - Fixed aspect ratio with animation */}
                  <div className="relative aspect-square h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 2xl:h-60 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl bg-gradient-to-b from-slate-50 to-white border-b overflow-hidden flex-shrink-0">
                    <SmoothProductImageGallery 
                      product={p} 
                      themeColor={BRAND} 
                      isCompact={true}
                    />
                  </div>

                  {/* CONTENT - Fixed heights for text sections */}
                  <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-2 sm:gap-3 md:gap-4 flex-grow">
                    {/* CATEGORY - Fixed height with truncation */}
                    <div className="min-h-[24px] sm:min-h-[26px] md:min-h-[28px] flex items-center">
                      <span
                        className="inline-block text-[9px] sm:text-[10px] md:text-[11px] font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border truncate max-w-full"
                        style={{
                          borderColor: BRAND + "30",
                          color: BRAND,
                          backgroundColor: BRAND + "10"
                        }}
                        title={p.category}
                      >
                        {p.category}
                      </span>
                    </div>

                    {/* NAME - Fixed height with line clamp */}
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] overflow-hidden">
                      {p.name}
                    </h3>

                    {/* META INFO - Fixed height container */}
                    <div className="min-h-[60px] sm:min-h-[65px] md:min-h-[70px] flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-[11px] md:text-[12px] text-slate-700">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 min-h-[24px] sm:min-h-[26px] md:min-h-[28px]">
                        <span className="font-semibold mr-1 whitespace-nowrap">
                          {dosageLabel}
                        </span> 
                        <span className="truncate max-w-[60px] sm:max-w-[70px] md:max-w-[80px]" title={p.dosage}>
                          {p.dosage}
                        </span>
                      </span>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 min-h-[24px] sm:min-h-[26px] md:min-h-[28px]">
                        <span className="font-semibold mr-1 whitespace-nowrap">
                          {formLabel}
                        </span> 
                        <span className="truncate max-w-[60px] sm:max-w-[70px] md:max-w-[80px]" title={p.form}>
                          {p.form}
                        </span>
                      </span>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 min-h-[24px] sm:min-h-[26px] md:min-h-[28px]">
                        <span className="font-semibold mr-1 whitespace-nowrap">
                          {packLabel}
                        </span> 
                        <span className="truncate max-w-[60px] sm:max-w-[70px] md:max-w-[80px]" title={p.pack_size}>
                          {p.pack_size}
                        </span>
                      </span>
                    </div>

                    {/* ACTION BUTTONS - Fixed height with text overflow handling */}
                    <div className="mt-auto pt-1 sm:pt-2 flex gap-1.5 sm:gap-2 md:gap-3 min-h-[36px] sm:min-h-[40px] md:min-h-[44px]">
                      <Link
                        href={`/product/${p.slug}`}
                        className="flex-1 min-w-0 flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl px-1 sm:px-2 md:px-3 text-[10px] sm:text-xs md:text-sm font-semibold text-white transition hover:opacity-90 min-h-[32px] sm:min-h-[36px]"
                        style={{ backgroundColor: BRAND }}
                      >
                        <span className="truncate whitespace-nowrap px-1">
                          {detailsText}
                        </span>
                      </Link>

                      <Link
                        href={`/contact?product=${encodeURIComponent(p.slug)}`}
                        className="flex-1 min-w-0 flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl px-1 sm:px-2 md:px-3 text-[10px] sm:text-xs md:text-sm font-semibold border bg-white transition hover:bg-slate-50 min-h-[32px] sm:min-h-[36px] text-center"
                        style={{ borderColor: BRAND, color: BRAND }}
                      >
                        <span className="truncate whitespace-nowrap px-1">
                          {enquireText}
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE - Fixed height with pre-calculated text */
          <div className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 text-center min-h-[200px] sm:min-h-[250px] flex flex-col justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-1 sm:mb-2 min-h-[24px] sm:min-h-[28px] md:min-h-[32px] flex items-center justify-center">
              {(t?.homeProducts?.header?.noProducts || "No products found")} {activeBrand}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-3 sm:mb-4 min-h-[40px] sm:min-h-[48px] flex items-center justify-center">
              {t?.homeProducts?.header?.tryAnotherBrand || "Please try selecting another brand or check back later."}
            </p>
            <div className="min-h-[36px] sm:min-h-[40px] md:min-h-[44px]">
              <button
                onClick={() => setActiveBrand(brands[0].key)}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white min-h-[36px] sm:min-h-[40px] md:min-h-[44px]"
                style={{ backgroundColor: BRAND }}
              >
                <span className="truncate whitespace-nowrap">
                  {t?.homeProducts?.buttons?.viewBrandProducts 
                    ? t.homeProducts.buttons.viewBrandProducts.replace('{brand}', brands[0].key.replace("ED ", ""))
                    : `View ${brands[0].key.replace("ED ", "")} Products`
                  }
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}




// //app/components/HomeProducts.jsx
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { products as allProducts } from "../data/products";
// import React from "react";
// import { useLanguage } from "@/context/LanguageContext"; // ADD THIS IMPORT

// /* ---------------- BRANDS ---------------- */
// const brands = [
//   {
//     key: "ED Ajanta Pharma",
//     logo: "/logo/ajanta.webp",
//   },
//   { key: "ED Sunrise Remedies", logo: "/logo/sunrise.png" },
//   { key: "ED Centurion Remedies", logo: "/logo/cen.png" },
// ];

// /* ---------------- RESPONSIVE LOGO STRIP ---------------- */
// function LogoStrip({ activeBrand, setActiveBrand, translations }) {
//   const BRAND = "#0A2A73";

//   return (
//     <div className="w-full flex justify-center mt-6 sm:mt-8 md:mt-10">
//       <div className="rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-md shadow-xl ring-1 ring-slate-100/50 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 w-full max-w-5xl mx-2 sm:mx-4">
//         <div className="grid grid-cols-1 -mt-30 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
//           {brands.map((b) => {
//             const active = b.key === activeBrand;

//             return (
//               <button
//                 key={b.key}
//                 onClick={() => setActiveBrand(b.key)}
//                 className={[
//                   "relative group transition-all duration-300 cursor-pointer",
//                   "h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 rounded-2xl md:rounded-3xl",
//                   "bg-gradient-to-b from-white via-white to-gray-50/50",
//                   "shadow-lg hover:shadow-xl md:shadow-xl md:hover:shadow-2xl",
//                   "border-2",
//                   active
//                     ? "scale-[1.02] border-[#0A2A73] shadow-xl md:shadow-2xl"
//                     : "border-gray-200 hover:border-gray-300",
//                 ].join(" ")}
//               >
//                 <div className="relative h-3/4 w-3/4 mx-auto">
//                   <Image 
//                     src={b.logo} 
//                     alt={b.key} 
//                     fill 
//                     sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, (max-width: 1024px) 280px, 320px"
//                     className={[
//                       "object-contain transition-all duration-300",
//                       active ? "opacity-100 scale-105" : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
//                     ].join(" ")}
//                     priority={active}
//                   />
//                 </div>
                
//                 {/* Active indicator - responsive sizing */}
//                 {active && (
//                   <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-[#0A2A73] rounded-full flex items-center justify-center shadow-md sm:shadow-lg">
//                     <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- RESPONSIVE HOME PRODUCTS ---------------- */
// export default function HomeProducts({ activeBrand, setActiveBrand }) {
//   const { t } = useLanguage(); // ADD LANGUAGE CONTEXT
//   const BRAND = "#0A2A73";

//   // Get translations from context, fallback to English
//   const homeProductsTranslations = t?.homeProducts || {
//     header: {
//       tag: "All Products",
//       showingAll: "Showing all {count} products",
//       noProducts: "No products found",
//       tryAnotherBrand: "Please try selecting another brand or check back later.",
//       viewBrandProducts: "View {brand} Products"
//     },
//     productCard: {
//       category: "Category",
//       dosage: "Dosage:",
//       form: "Form:",
//       pack: "Pack:",
//       details: "Details",
//       enquire: "Enquire"
//     },
//     buttons: {
//       viewBrandProducts: "View {brand} Products",
//       productsCount: "{count} Products"
//     }
//   };

//   // Get ALL products for the selected brand (no limit)
//   const brandProducts = allProducts.filter(
//     (p) => p.brand === activeBrand
//   );

//   return (
//     <section className="relative py-10 sm:py-14 md:py-16">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
//         <LogoStrip
//           activeBrand={activeBrand}
//           setActiveBrand={setActiveBrand}
//           translations={homeProductsTranslations}
//         />

//         {/* HEADER - Responsive design */}
//         <div className="mt-10 sm:mt-12 relative">
//           {/* Blur background */}
//           <div className="absolute -inset-3 sm:-inset-4 md:-inset-6 bg-gradient-to-r from-blue-50/20 to-transparent backdrop-blur-xs sm:backdrop-blur-sm rounded-xl sm:rounded-2xl -z-10"></div>
          
//           {/* Content */}
//           <div className="relative flex flex-col gap-4 sm:gap-5 md:gap-6 sm:flex-row sm:items-end sm:justify-between p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
//                 <div className="w-6 h-0.5 sm:w-7 sm:h-1 md:w-8 md:h-1 bg-gradient-to-r from-[#0A2A73] to-blue-500 rounded-full"></div>
//                 <span className="text-xs sm:text-sm font-semibold text-[#0A2A73] uppercase tracking-wide">
//                   {homeProductsTranslations.header.tag}
//                 </span>
//               </div>
              
//               <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
//                 {activeBrand.replace("ED ", "")}
//               </h2>
//               <p className="mt-1 text-xs sm:text-sm text-slate-600">
//                 {homeProductsTranslations.header.showingAll.replace('{count}', brandProducts.length)}
//               </p>
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0">
//               {/* Product count badge - responsive */}
//               <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 border border-blue-100">
//                 <span className="text-xs sm:text-sm font-semibold text-[#0A2A73] whitespace-nowrap">
//                   {homeProductsTranslations.buttons.productsCount.replace('{count}', brandProducts.length)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* PRODUCT GRID - Fully responsive */}
//         {brandProducts.length > 0 ? (
//           <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
//             {brandProducts.map((p) => (
//               <article
//                 key={p.slug}  
//                 className="group relative rounded-xl sm:rounded-2xl md:rounded-3xl bg-white border shadow-sm hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 overflow-hidden"
//                 style={{ borderColor: "rgba(10,42,115,0.15)" }}
//               >
//                 {/* IMAGE - Responsive heights */}
//                 <div className="relative aspect-square h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 2xl:h-60 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl bg-gradient-to-b from-slate-50 to-white border-b overflow-hidden">
//                   <Image
//                     src={p.image}
//                     alt={p.name}
//                     fill
//                     sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                     className="object-contain p-3 sm:p-4 md:p-5 lg:p-6 transition-transform duration-300 group-hover:scale-105"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
//                 </div>

//                 {/* CONTENT - Responsive padding and text */}
//                 <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-2 sm:gap-3 md:gap-4">
//                   {/* CATEGORY */}
//                   <span
//                     className="w-fit text-[9px] sm:text-[10px] md:text-[11px] font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border"
//                     style={{
//                       borderColor: BRAND + "30",
//                       color: BRAND,
//                       backgroundColor: BRAND + "10"
//                     }}
//                   >
//                     {p.category}
//                   </span>

//                   {/* NAME */}
//                   <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
//                     {p.name}
//                   </h3>

//                   {/* META - Responsive text and spacing */}
//                   <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-[11px] md:text-[12px] text-slate-700">
//                     <span className="rounded-full bg-slate-100 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 whitespace-nowrap">
//                       <span className="font-semibold">{homeProductsTranslations.productCard.dosage}</span> {p.dosage}
//                     </span>
//                     <span className="rounded-full bg-slate-100 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 whitespace-nowrap">
//                       <span className="font-semibold">{homeProductsTranslations.productCard.form}</span> {p.form}
//                     </span>
//                     <span className="rounded-full bg-slate-100 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 whitespace-nowrap">
//                       <span className="font-semibold">{homeProductsTranslations.productCard.pack}</span> {p.pack_size}
//                     </span>
//                   </div>

//                   {/* ACTIONS - Responsive button sizing */}
//                   <div className="mt-1 sm:mt-2 flex gap-1.5 sm:gap-2 md:gap-3">
//                     <Link
//                       href={`/product/${p.slug}`}
//                       className="flex-1 text-center rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold text-white transition hover:opacity-90"
//                       style={{ backgroundColor: BRAND }}
//                     >
//                       {homeProductsTranslations.productCard.details}
//                     </Link>

//                     <Link
//                       href={`/contact?product=${encodeURIComponent(p.slug)}`}
//                       className="flex-1 text-center rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold border bg-white transition hover:bg-slate-50"
//                       style={{ borderColor: BRAND, color: BRAND }}
//                     >
//                       {homeProductsTranslations.productCard.enquire}
//                     </Link>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         ) : (
//           /* EMPTY STATE - Responsive */
//           <div className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 text-center">
//             <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
//               <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-1 sm:mb-2">
//               {homeProductsTranslations.header.noProducts} {activeBrand}
//             </h3>
//             <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-3 sm:mb-4">
//               {homeProductsTranslations.header.tryAnotherBrand}
//             </p>
//             <button
//               onClick={() => setActiveBrand(brands[0].key)}
//               className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white"
//               style={{ backgroundColor: BRAND }}
//             >
//               {homeProductsTranslations.buttons.viewBrandProducts.replace('{brand}', brands[0].key.replace("ED ", ""))}
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }