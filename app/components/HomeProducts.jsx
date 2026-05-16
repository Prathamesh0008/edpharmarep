"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import pricingData from "../data/pricing"; // Import pricing data
import { useCart } from "./CartContext"; // Import cart context
import { getPriceByQuantity } from "@/app/utils/getPriceByQuantity"; // Import price utility
import { ShoppingCart, Check } from "lucide-react"; // Import icons

/* ---------------- BRANDS ---------------- */
const brands = [
  {
    key: "ED Ajanta Pharma",
    logo: "/logo/ajanta.webp",
  },
  { key: "ED Sunrise Remedies", logo: "/logo/sunrise.png" },
  { key: "ED Centurion Remedies", logo: "/logo/cen.png" },
  {
    key: "Healing Pharma",
    logo: "/logo/HealingLogo.png",
  },
  {
    key: "Hab Pharma",
    logo: "/logo/Hab.png",
  },
];

// Helper function to remove language suffix from slug for pricing
const getBaseSlug = (slug) => {
  if (!slug) return slug;
  return slug.replace(/-(en|ar|zh|bg|bs|de|el|es|fr|hr|ja|mk|nl|pt|ro|sq|sr)$/, '');
};

// Helper function to check if product has pricing
const hasProductPricing = (productSlug) => {
  const baseSlug = getBaseSlug(productSlug);
  return pricingData.hasOwnProperty(baseSlug);
};

// Helper function to safely get string from translation object
const getTranslationString = (translation, language) => {
  if (!translation) return '';
  if (typeof translation === 'string') return translation;
  if (typeof translation === 'object') {
    return translation[language] || translation.en || '';
  }
  return '';
};

/* ---------------- LOADING SPINNER COMPONENT ---------------- */
const LoadingSpinner = ({ themeColor = "#0A2A73" }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white z-20">
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 rounded-full animate-ping opacity-20" 
          style={{ backgroundColor: themeColor, width: '48px', height: '48px', margin: 'auto' }}
        />
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: themeColor,
                borderRightColor: i === 1 ? themeColor : 'transparent',
                borderBottomColor: i === 2 ? themeColor : 'transparent',
                animationDuration: `${1 + i * 0.2}s`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.8 - i * 0.2,
              }}
            />
          ))}
        </div>
        <span className="mt-2 text-[8px] sm:text-[10px] md:text-xs font-medium text-slate-500 animate-pulse hidden sm:block">
          Loading...
        </span>
      </div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-spin, .animate-ping, .animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

/* ---------------- IMAGE WITH LOADING STATE ---------------- */
const ImageWithLoading = ({ src, alt, fill, className, sizes, priority, loading = "lazy", themeColor }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {isLoading && !hasError && <LoadingSpinner themeColor={themeColor} />}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-20">
          <div className="text-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[8px] sm:text-[10px] mt-1 text-slate-500">Failed to load</p>
          </div>
        </div>
      )}
      <Image
        src={hasError ? "/placeholder.jpg" : src}
        alt={alt}
        fill={fill}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : loading}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

/* ---------------- SMOOTH PRODUCT IMAGE GALLERY ---------------- */
const SmoothProductImageGallery = ({ product, themeColor, isCompact = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  const images = useMemo(() => {
    const imageArray = [
      product?.image,
      ...(product?.additionalImages || []),
    ];
    const validImages = imageArray.filter(img => img && img.trim() !== "");
    return validImages.length ? validImages : ["/placeholder.jpg"];
  }, [product]);

  useEffect(() => {
    if (images.length <= 1) return;

    const rotateImage = () => {
      setIsTransitioning(true);
      setCurrentImageIndex(prev => (prev + 1) % images.length);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    };

    intervalRef.current = setInterval(rotateImage, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [images.length]);

  const handleThumbnailClick = (index) => {
    if (index === currentImageIndex || isTransitioning) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 2000);
    }, 800);
  };

  const getProductName = () => {
    if (!product) return 'Product';
    if (typeof product.name === 'object') {
      return product.name.en || product.name.fr || 'Product';
    }
    return product.name || 'Product';
  };

  return (
    <div className="relative w-full h-full group overflow-hidden">
      <style jsx>{`
        .image-container { position: relative; width: 100%; height: 100%; overflow: hidden; }
        .image-slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transform: scale(0.98); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); will-change: transform, opacity; }
        .image-slide.active { opacity: 1; transform: scale(1); z-index: 10; }
        .image-slide.inactive { opacity: 0; transform: scale(0.98); z-index: 1; }
        .navigation-dot { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); will-change: transform, background-color; }
        @media (prefers-reduced-motion: reduce) {
          .image-slide, .navigation-dot { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>
      <div className="image-container">
        {images.map((imgSrc, index) => (
          <div key={index} className={`image-slide ${index === currentImageIndex ? 'active' : 'inactive'}`}>
            <ImageWithLoading
              src={imgSrc}
              alt={`${getProductName()} - View ${index + 1}`}
              fill
              className="object-contain p-3 sm:p-4 md:p-5 lg:p-6 transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
              loading="lazy"
              themeColor={themeColor}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none"></div>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`navigation-dot w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? 'scale-125' : 'scale-100 hover:scale-110'}`}
                style={{ backgroundColor: index === currentImageIndex ? themeColor : `${themeColor}80` }}
                aria-label={`View image ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
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
      <div className="rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-md shadow-xl ring-1 ring-slate-100/50 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 w-full max-w-6xl mx-2 sm:mx-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
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
                  active ? "scale-[1.02] border-[#0A2A73] shadow-xl md:shadow-2xl" : "border-gray-200 hover:border-gray-300",
                ].join(" ")}
              >
                <div className="relative h-3/4 w-3/4 mx-auto">
                  <ImageWithLoading
                    src={b.logo}
                    alt={b.key}
                    fill
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, (max-width: 1024px) 280px, 320px"
                    className={["object-contain transition-all duration-300", active ? "opacity-100 scale-105" : "opacity-85 group-hover:opacity-100 group-hover:scale-105"].join(" ")}
                    priority={active}
                    themeColor={BRAND}
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

/* ---------------- COMPACT ADD TO CART BUTTON ---------------- */
const AddToCartButton = ({ product, themeColor }) => {
  const { addToCart, cartItems } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const DEFAULT_QUANTITY = 100;
  
  const isInCart = cartItems.some(item => item.slug === product.slug);
  const unitPrice = getPriceByQuantity(getBaseSlug(product.slug), DEFAULT_QUANTITY);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    const cartItem = {
      slug: product.slug,
      name: typeof product.name === 'object' ? product.name.en || product.name.fr || product.name : product.name,
      image: product.image || "/placeholder.jpg",
      price: unitPrice,
      qty: DEFAULT_QUANTITY,
      brand: product.brand,
      category: product.category,
    };
    addToCart(cartItem);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsAdding(false);
    }, 2000);
  };
  
  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || isAdded}
      className={[
        "flex items-center justify-center gap-1.5 rounded-lg transition-all duration-300",
        "px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-3.5 md:py-2",
        "text-[11px] sm:text-xs md:text-sm font-semibold",
        "hover:scale-105 active:scale-95 shadow-sm hover:shadow-md w-full",
        "whitespace-nowrap",
        isAdded ? "bg-green-500 text-white hover:bg-green-600" : isInCart ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-white text-[#0A2A73] hover:bg-[#0A2A73] hover:text-white border-2"
      ].join(" ")}
      style={{ borderColor: !isAdded && !isInCart ? themeColor : undefined }}
      title={isInCart ? "Already in cart" : "Add to cart"}
    >
      {isAdded ? (
        <>
          <Check size={14} className="sm:size-4 md:size-4" />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart size={14} className="sm:size-4 md:size-4" />
          <span>{isInCart ? "In Cart" : "Add"}</span>
        </>
      )}
    </button>
  );
};

/* ---------------- RESPONSIVE HOME PRODUCTS ---------------- */
export default function HomeProducts({ activeBrand, setActiveBrand }) {
  const { t, language, products, loading } = useLanguage();
  const BRAND = "#0A2A73";
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const getTrans = (transObj, fallback = '') => {
    if (!transObj) return fallback;
    if (typeof transObj === 'string') return transObj;
    if (typeof transObj === 'object') {
      return transObj[language] || transObj.en || Object.values(transObj)[0] || fallback;
    }
    return fallback;
  };

  // Filter products from MongoDB by brand AND check if they have pricing
  const brandProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products
      .filter((p) => p.brand === activeBrand)
      .filter((p) => hasProductPricing(p.slug));
  }, [products, activeBrand]);

  const homeProductsTrans = t?.homeProducts || {
    header: {
      tag: "",
      showingAll: "Showing all {count} products",
      noProductsInStock: "No products in stock for",
      tryAnotherBrand: "Please try selecting another brand or check back later."
    },
    buttons: {
      productsCount: "{count} Products",
      viewBrandProducts: "View {brand} Products"
    },
    productCard: {
      details: "Details",
      enquire: "Enquire",
      addToCart: "Add",
      dosage: "Dosage:",
      form: "Form:",
      pack: "Pack:"
    }
  };

  const headerTag = getTrans(homeProductsTrans?.header?.tag, "All Products");
  const showingAllBase = getTrans(homeProductsTrans?.header?.showingAll, "Showing all {count} products");
  const showingAllText = showingAllBase.replace('{count}', brandProducts.length.toString());
  const productCountBase = getTrans(homeProductsTrans?.buttons?.productsCount, "{count} Products");
  const productCountText = productCountBase.replace('{count}', brandProducts.length.toString());
  const noProductsText = getTrans(homeProductsTrans?.header?.noProductsInStock, "No products in stock for");
  const tryAnotherText = getTrans(homeProductsTrans?.header?.tryAnotherBrand, "Please try selecting another brand or check back later.");
  const viewBrandBase = getTrans(homeProductsTrans?.buttons?.viewBrandProducts, "View {brand} Products");
  const viewBrandText = viewBrandBase.replace('{brand}', brands[0].key.replace("ED ", ""));
  const detailsText = getTrans(homeProductsTrans?.productCard?.details, "Details");
  const enquireText = getTrans(homeProductsTrans?.productCard?.enquire, "Enquire");
  const dosageLabel = getTrans(homeProductsTrans?.productCard?.dosage, "Dosage:");
  const formLabel = getTrans(homeProductsTrans?.productCard?.form, "Form:");
  const packLabel = getTrans(homeProductsTrans?.productCard?.pack, "Pack:");

  const handleProductMouseEnter = (productId) => setHoveredProductId(productId);
  const handleProductMouseLeave = () => setHoveredProductId(null);
  const normalizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const stripDosageFromName = (name) =>
    normalizeText(name).replace(/\bmg\b/gi, "").replace(/\s+/g, " ").trim();

  // Show loading state
  if (loading) {
    return (
      <section className="relative py-10 sm:py-14 md:py-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#0A2A73] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-10 sm:py-14 md:py-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <LogoStrip activeBrand={activeBrand} setActiveBrand={setActiveBrand} />

        <div className="mt-10 sm:mt-12 relative">
          <div className="absolute -inset-3 sm:-inset-4 md:-inset-6 bg-gradient-to-r from-blue-50/20 to-transparent backdrop-blur-xs sm:backdrop-blur-sm rounded-xl sm:rounded-2xl -z-10"></div>
          
          <div className="relative flex flex-col gap-4 sm:gap-5 md:gap-6 sm:flex-row sm:items-end sm:justify-between p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-slate-900 leading-tight min-h-[32px] sm:min-h-[38px] md:min-h-[44px] flex items-center">
                {activeBrand.replace("ED ", "")}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 min-h-[18px] sm:min-h-[20px] flex items-center">
                {showingAllText}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0 min-h-[40px]"></div>
          </div>
        </div>

        {brandProducts.length > 0 ? (
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-7">
            {brandProducts.map((p, index) => {
              const uniqueKey = `${activeBrand}-${p.slug}-${index}`;
              const productName = stripDosageFromName(typeof p.name === "object" ? p.name.en || p.name.fr || "" : p.name);
              const productDosage = normalizeText(p.dosage);
              const productForm = normalizeText(p.form);
              const productPackSize = normalizeText(p.pack_size);
              const unitPrice = getPriceByQuantity(getBaseSlug(p.slug), 100);
              return (
                <article
                  key={uniqueKey}
                  className="group relative rounded-lg sm:rounded-xl bg-white border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col"
                  style={{ borderColor: "rgba(10,42,115,0.15)" }}
                  onMouseEnter={() => handleProductMouseEnter(uniqueKey)}
                  onMouseLeave={handleProductMouseLeave}
                >
                  <div className="relative aspect-square h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 rounded-t-lg sm:rounded-t-xl bg-gradient-to-b from-slate-50 to-white border-b overflow-hidden flex-shrink-0">
                    <SmoothProductImageGallery product={p} themeColor={BRAND} isCompact={true} />
                  </div>

                  <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-2.5 sm:gap-3 md:gap-4 flex-grow">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight line-clamp-2 overflow-hidden">
                      {productName}
                    </h3>

                    <div className="space-y-2 text-[11px] sm:text-xs md:text-sm text-slate-700">
                      <span className="inline-flex w-full items-center rounded-full bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 min-h-[28px] sm:min-h-[32px]">
                        <span className="font-semibold mr-1.5 shrink-0 whitespace-nowrap">{dosageLabel}</span>
                        <span className="truncate min-w-0" title={productDosage}>{productDosage}</span>
                      </span>
                      <span className="inline-flex w-full items-center rounded-full bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 min-h-[28px] sm:min-h-[32px]">
                        <span className="font-semibold mr-1.5 shrink-0 whitespace-nowrap">{formLabel}</span>
                        <span className="truncate min-w-0" title={productForm}>{productForm}</span>
                      </span>
                      <span className="inline-flex w-full items-center rounded-full bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 min-h-[28px] sm:min-h-[32px]">
                        <span className="font-semibold mr-1.5 shrink-0 whitespace-nowrap">{packLabel}</span>
                        <span className="truncate min-w-0" title={productPackSize}>{productPackSize}</span>
                      </span>
                    </div>

                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold">Price: </span>
                      <span className="text-sm sm:text-base font-bold text-emerald-800">
                        €{Number(unitPrice || 0).toFixed(2)}
                      </span>
                      <span className="text-[11px] sm:text-xs text-emerald-700 ml-1">/ unit (100+ qty)</span>
                    </div>

                    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 sm:gap-3">
                      <Link href={`/product/${p.slug}`} className="flex items-center justify-center rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-3.5 md:py-2 text-[11px] sm:text-xs md:text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: BRAND }}>
                        <span className="truncate whitespace-nowrap">{detailsText}</span>
                      </Link>
                      <Link href={`/contact?product=${encodeURIComponent(p.slug)}`} className="flex items-center justify-center rounded-md sm:rounded-lg px-2 py-1.5 text-[10px] sm:text-xs font-semibold border bg-white transition hover:bg-slate-50" style={{ borderColor: BRAND, color: BRAND }}>
                        <span className="truncate whitespace-nowrap">{enquireText}</span>
                      </Link>
                    </div>

                    <div>
                      <AddToCartButton product={p} themeColor={BRAND} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 text-center min-h-[200px] sm:min-h-[250px] flex flex-col justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-9 9 9 9 0 019-9z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-1 sm:mb-2 min-h-[24px] sm:min-h-[28px] md:min-h-[32px] flex items-center justify-center">
              {noProductsText} {activeBrand}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-3 sm:mb-4 min-h-[40px] sm:min-h-[48px] flex items-center justify-center">
              {tryAnotherText}
            </p>
            <div className="min-h-[36px] sm:min-h-[40px] md:min-h-[44px]">
              <button onClick={() => setActiveBrand(brands[0].key)} className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white min-h-[36px] sm:min-h-[40px] md:min-h-[44px]" style={{ backgroundColor: BRAND }}>
                <span className="truncate whitespace-nowrap">{viewBrandText}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}




// // app/components/HomeProducts.jsx
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { products as allProducts } from "../data/products";
// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useLanguage } from "@/context/LanguageContext";
// import pricingData from "../data/pricing"; // Import pricing data
// import { useCart } from "./CartContext"; // Import cart context
// import { getPriceByQuantity } from "@/app/utils/getPriceByQuantity"; // Import price utility
// import { ShoppingCart, Check } from "lucide-react"; // Import icons

// /* ---------------- BRANDS ---------------- */
// const brands = [
//   {
//     key: "ED Ajanta Pharma",
//     logo: "/logo/ajanta.webp",
//   },
//   { key: "ED Sunrise Remedies", logo: "/logo/sunrise.png" },
//   { key: "ED Centurion Remedies", logo: "/logo/cen.png" },
//   // Add new brands
//   {
//     key: "Healing Pharma",
//     logo: "/logo/HealingLogo.png",
//   },
//   {
//     key: "Hab Pharma",
//     logo: "/logo/Hab.png",
//   },
// ];

// // Helper function to check if product has pricing
// const hasProductPricing = (productSlug) => {
//   return pricingData.hasOwnProperty(productSlug);
// };

// // Helper function to safely get string from translation object
// const getTranslationString = (translation, language) => {
//   if (!translation) return '';
//   if (typeof translation === 'string') return translation;
//   if (typeof translation === 'object') {
//     // If it's an object with language keys, return the current language or fallback to en
//     return translation[language] || translation.en || '';
//   }
//   return '';
// };

// /* ---------------- LOADING SPINNER COMPONENT ---------------- */
// const LoadingSpinner = ({ themeColor = "#0A2A73" }) => {
//   return (
//     <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white z-20">
//       <div className="relative flex flex-col items-center">
//         {/* Pulse ring */}
//         <div className="absolute inset-0 rounded-full animate-ping opacity-20" 
//           style={{ backgroundColor: themeColor, width: '48px', height: '48px', margin: 'auto' }}
//         />
        
//         {/* Spinner */}
//         <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
//           <div className="absolute top-0 left-0 w-full h-full">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-transparent animate-spin"
//                 style={{
//                   borderTopColor: themeColor,
//                   borderRightColor: i === 1 ? themeColor : 'transparent',
//                   borderBottomColor: i === 2 ? themeColor : 'transparent',
//                   animationDuration: `${1 + i * 0.2}s`,
//                   animationDelay: `${i * 0.1}s`,
//                   opacity: 0.8 - i * 0.2,
//                 }}
//               />
//             ))}
//           </div>
          
//           {/* Inner dot */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div 
//               className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full animate-pulse"
//               style={{ backgroundColor: themeColor }}
//             />
//           </div>
//         </div>
        
//         {/* Loading text - visible only on larger screens */}
//         <span className="mt-2 text-[8px] sm:text-[10px] md:text-xs font-medium text-slate-500 animate-pulse hidden sm:block">
//           Loading...
//         </span>
//       </div>
      
//       {/* CSS for animations */}
//       <style jsx>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-spin {
//           animation: spin linear infinite;
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .animate-spin, .animate-ping, .animate-pulse {
//             animation: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// /* ---------------- IMAGE WITH LOADING STATE ---------------- */
// const ImageWithLoading = ({ src, alt, fill, className, sizes, priority, themeColor }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);

//   return (
//     <div className="relative w-full h-full">
//       {/* Loading Spinner */}
//       {isLoading && !hasError && <LoadingSpinner themeColor={themeColor} />}
      
//       {/* Error State */}
//       {hasError && (
//         <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-20">
//           <div className="text-center">
//             <svg 
//               className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-slate-400" 
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={1.5} 
//                 d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
//               />
//             </svg>
//             <p className="text-[8px] sm:text-[10px] mt-1 text-slate-500">Failed to load</p>
//           </div>
//         </div>
//       )}

//       {/* Actual Image */}
//       <Image
//         src={hasError ? "/placeholder.jpg" : src}
//         alt={alt}
//         fill={fill}
//         className={`${className} transition-opacity duration-300 ${
//           isLoading ? 'opacity-0' : 'opacity-100'
//         }`}
//         sizes={sizes}
//         priority={priority}
//         onLoad={() => setIsLoading(false)}
//         onError={() => {
//           setIsLoading(false);
//           setHasError(true);
//         }}
//       />
//     </div>
//   );
// };

// /* ---------------- SMOOTH PRODUCT IMAGE GALLERY ---------------- */
// const SmoothProductImageGallery = ({ product, themeColor, isCompact = false }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const intervalRef = useRef(null);
//   const transitionTimeoutRef = useRef(null);

//   // Get product images
//   const images = useMemo(() => {
//     const imageArray = [
//       product?.image || "/placeholder.jpg",
//       product?.additionalImages?.[0] || "/placeholder.jpg",
//       product?.additionalImages?.[1] || "/placeholder.jpg",
//     ];
//     return imageArray.filter(img => img && img.trim() !== "");
//   }, [product]);

//   // Auto-rotation with smooth transitions - FASTER VERSION
//   useEffect(() => {
//     if (images.length <= 1) return;

//     const rotateImage = () => {
//       setIsTransitioning(true);
//       setCurrentImageIndex(prev => (prev + 1) % images.length);
      
//       // Clear any existing timeout
//       if (transitionTimeoutRef.current) {
//         clearTimeout(transitionTimeoutRef.current);
//       }
      
//       // Reset transitioning state after animation completes - FASTER
//       transitionTimeoutRef.current = setTimeout(() => {
//         setIsTransitioning(false);
//       }, 400);
//     };

//     intervalRef.current = setInterval(rotateImage, 3000);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//       if (transitionTimeoutRef.current) {
//         clearTimeout(transitionTimeoutRef.current);
//       }
//     };
//   }, [images.length]);

//   const handleThumbnailClick = (index) => {
//     if (index === currentImageIndex || isTransitioning) return;
    
//     // Reset auto-rotation timer
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
    
//     setIsTransitioning(true);
//     setCurrentImageIndex(index);
    
//     // Restart auto-rotation after manual interaction
//     setTimeout(() => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//       intervalRef.current = setInterval(() => {
//         setCurrentImageIndex(prev => (prev + 1) % images.length);
//       }, 2000);
//     }, 800);
//   };

//   // Get product name safely
//   const getProductName = () => {
//     if (!product) return 'Product';
//     if (typeof product.name === 'object') {
//       return product.name.en || product.name.fr || 'Product';
//     }
//     return product.name || 'Product';
//   };

//   return (
//     <div className="relative w-full h-full group overflow-hidden">
//       <style jsx>{`
//         .image-container {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//         }
        
//         .image-slide {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           opacity: 0;
//           transform: scale(0.98);
//           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//           will-change: transform, opacity;
//         }
        
//         .image-slide.active {
//           opacity: 1;
//           transform: scale(1);
//           z-index: 10;
//         }
        
//         .image-slide.inactive {
//           opacity: 0;
//           transform: scale(0.98);
//           z-index: 1;
//         }
        
//         .navigation-dot {
//           transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
//           will-change: transform, background-color;
//         }
        
//         .image-indicator {
//           animation: gentlePulse 1s ease-in-out infinite;
//         }
        
//         @keyframes gentlePulse {
//           0%, 100% { opacity: 0.7; }
//           50% { opacity: 1; }
//         }
        
//         @media (prefers-reduced-motion: reduce) {
//           .image-slide,
//           .navigation-dot,
//           .image-indicator {
//             transition-duration: 0.01ms !important;
//             animation-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//           }
//         }
//       `}</style>

//       {/* Main Image Container */}
//       <div className="image-container">
//         {images.map((imgSrc, index) => (
//           <div
//             key={index}
//             className={`image-slide ${index === currentImageIndex ? 'active' : 'inactive'}`}
//           >
//             <ImageWithLoading
//               src={imgSrc}
//               alt={`${getProductName()} - View ${index + 1}`}
//               fill
//               className="object-contain p-3 sm:p-4 md:p-5 lg:p-6 transition-transform duration-200 group-hover:scale-105"
//               sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//               priority={index === 0}
//               themeColor={themeColor}
//             />
//           </div>
//         ))}
        
//         {/* Gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none"></div>
        
//         {/* Image Navigation Dots - Compact for homepage */}
//         {images.length > 1 && (
//           <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex gap-1">
//             {images.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleThumbnailClick(index)}
//                 className={`navigation-dot w-1.5 h-1.5 rounded-full ${
//                   index === currentImageIndex 
//                     ? 'scale-125' 
//                     : 'scale-100 hover:scale-110'
//                 }`}
//                 style={{
//                   backgroundColor: index === currentImageIndex 
//                     ? themeColor 
//                     : `${themeColor}80`
//                 }}
//                 aria-label={`View image ${index + 1}`}
//                 disabled={isTransitioning}
//               />
//             ))}
//           </div>
//         )}

        
//       </div>
//     </div>
//   );
// };

// /* ---------------- RESPONSIVE LOGO STRIP ---------------- */
// function LogoStrip({ activeBrand, setActiveBrand }) {
//   const BRAND = "#0A2A73";

//   return (
//     <div className="w-full flex justify-center mt-6 sm:mt-8 md:mt-10">
//       <div className="rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-md shadow-xl ring-1 ring-slate-100/50 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 w-full max-w-6xl mx-2 sm:mx-4">
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
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
//                   <ImageWithLoading
//                     src={b.logo}
//                     alt={b.key}
//                     fill
//                     sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, (max-width: 1024px) 280px, 320px"
//                     className={[
//                       "object-contain transition-all duration-300",
//                       active ? "opacity-100 scale-105" : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
//                     ].join(" ")}
//                     priority={active}
//                     themeColor={BRAND}
//                   />
//                 </div>
                
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

// /* ---------------- COMPACT ADD TO CART BUTTON ---------------- */
// const AddToCartButton = ({ product, themeColor }) => {
//   const { addToCart, cartItems } = useCart();
//   const [isAdded, setIsAdded] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
  
//   // Default bulk quantity from cart context (usually 100)
//   const DEFAULT_QUANTITY = 100;
  
//   // Check if product is already in cart
//   const isInCart = cartItems.some(item => item.slug === product.slug);
  
//   // Get unit price based on default quantity
//   const unitPrice = getPriceByQuantity(product.slug, DEFAULT_QUANTITY);
  
//   const handleAddToCart = (e) => {
//     e.preventDefault(); // Prevent navigation
//     e.stopPropagation(); // Prevent event bubbling
    
//     if (isAdding) return;
    
//     setIsAdding(true);
    
//     // Prepare cart item
//     const cartItem = {
//       slug: product.slug,
//       name: typeof product.name === 'object' ? product.name.en || product.name.fr || product.name : product.name,
//       image: product.image || "/placeholder.jpg",
//       price: unitPrice,
//       qty: DEFAULT_QUANTITY,
//       brand: product.brand,
//       category: product.category,
//     };
    
//     // Add to cart
//     addToCart(cartItem);
    
//     // Show success state
//     setIsAdded(true);
    
//     // Reset after animation
//     setTimeout(() => {
//       setIsAdded(false);
//       setIsAdding(false);
//     }, 2000);
//   };
  
//   return (
//     <button
//       onClick={handleAddToCart}
//       disabled={isAdding || isAdded}
//       className={[
//         "flex items-center justify-center gap-1.5 rounded-lg transition-all duration-300",
//         "px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-3.5 md:py-2",
//         "text-[11px] sm:text-xs md:text-sm font-semibold",
//         "hover:scale-105 active:scale-95 shadow-sm hover:shadow-md w-full",
//         "whitespace-nowrap",
//         isAdded 
//           ? "bg-green-500 text-white hover:bg-green-600" 
//           : isInCart
//             ? "bg-amber-500 text-white hover:bg-amber-600"
//             : "bg-white text-[#0A2A73] hover:bg-[#0A2A73] hover:text-white border-2"
//       ].join(" ")}
//       style={{ 
//         borderColor: !isAdded && !isInCart ? themeColor : undefined,
//       }}
//       title={isInCart ? "Already in cart" : "Add to cart"}
//     >
//       {isAdded ? (
//         <>
//           <Check size={14} className="sm:size-4 md:size-4" />
//           <span>Added!</span>
//         </>
//       ) : (
//         <>
//           <ShoppingCart size={14} className="sm:size-4 md:size-4" />
//           <span>{isInCart ? "In Cart" : "Add"}</span>
//         </>
//       )}
//     </button>
//   );
// };

// /* ---------------- RESPONSIVE HOME PRODUCTS ---------------- */
// export default function HomeProducts({ activeBrand, setActiveBrand }) {
//   const { t, language } = useLanguage();
//   const BRAND = "#0A2A73";
//   const [hoveredProductId, setHoveredProductId] = useState(null);

//   // Helper function to safely get translation string within component
//   const getTrans = (transObj, fallback = '') => {
//     if (!transObj) return fallback;
//     if (typeof transObj === 'string') return transObj;
//     if (typeof transObj === 'object') {
//       // Try current language, then English, then any first value, then fallback
//       return transObj[language] || transObj.en || Object.values(transObj)[0] || fallback;
//     }
//     return fallback;
//   };

//   // Filter products by brand AND check if they have pricing
//   const brandProducts = allProducts
//     .filter((p) => p.brand === activeBrand)
//     .filter((p) => hasProductPricing(p.slug)); // Only show products with pricing

//   // Get translations safely with proper fallbacks
//   const homeProductsTrans = t?.homeProducts || {
//     header: {
//       tag: "",
//       showingAll: "Showing all {count} products",
//       noProductsInStock: "No products in stock for",
//       tryAnotherBrand: "Please try selecting another brand or check back later."
//     },
//     buttons: {
//       productsCount: "{count} Products",
//       viewBrandProducts: "View {brand} Products"
//     },
//     productCard: {
//       details: "Details",
//       enquire: "Enquire",
//       addToCart: "Add",
//       dosage: "Dosage:",
//       form: "Form:",
//       pack: "Pack:"
//     }
//   };

//   // Pre-calculate text lengths for consistent layout - ensure they're strings
//   const headerTag = getTrans(homeProductsTrans?.header?.tag, "All Products");
  
//   const showingAllBase = getTrans(homeProductsTrans?.header?.showingAll, "Showing all {count} products");
//   const showingAllText = showingAllBase.replace('{count}', brandProducts.length.toString());
  
//   const productCountBase = getTrans(homeProductsTrans?.buttons?.productsCount, "{count} Products");
//   const productCountText = productCountBase.replace('{count}', brandProducts.length.toString());

//   const noProductsText = getTrans(homeProductsTrans?.header?.noProductsInStock, "No products in stock for");
  
//   const tryAnotherText = getTrans(homeProductsTrans?.header?.tryAnotherBrand, "Please try selecting another brand or check back later.");
  
//   const viewBrandBase = getTrans(homeProductsTrans?.buttons?.viewBrandProducts, "View {brand} Products");
//   const viewBrandText = viewBrandBase.replace('{brand}', brands[0].key.replace("ED ", ""));

//   // Product card translations
//   const detailsText = getTrans(homeProductsTrans?.productCard?.details, "Details");
//   const enquireText = getTrans(homeProductsTrans?.productCard?.enquire, "Enquire");
//   const addToCartText = getTrans(homeProductsTrans?.productCard?.addToCart, "Add");
//   const dosageLabel = getTrans(homeProductsTrans?.productCard?.dosage, "Dosage:");
//   const formLabel = getTrans(homeProductsTrans?.productCard?.form, "Form:");
//   const packLabel = getTrans(homeProductsTrans?.productCard?.pack, "Pack:");

//   // Handle product hover for image rotation
//   const handleProductMouseEnter = (productId) => {
//     setHoveredProductId(productId);
//   };

//   const handleProductMouseLeave = () => {
//     setHoveredProductId(null);
//   };

//   return (
//     <section className="relative py-10 sm:py-14 md:py-0">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
//         <LogoStrip
//           activeBrand={activeBrand}
//           setActiveBrand={setActiveBrand}
//         />

//         {/* HEADER - Fixed heights to prevent layout shift */}
//         <div className="mt-10 sm:mt-12 relative">
//           <div className="absolute -inset-3 sm:-inset-4 md:-inset-6 bg-gradient-to-r from-blue-50/20 to-transparent backdrop-blur-xs sm:backdrop-blur-sm rounded-xl sm:rounded-2xl -z-10"></div>
          
//           <div className="relative flex flex-col gap-4 sm:gap-5 md:gap-6 sm:flex-row sm:items-end sm:justify-between p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
//             <div className="flex-1">
              
//               {/* Fixed height for brand name */}
//               <h2 className="text-xl sm:text-2xl md:text-3xl  text-slate-900 leading-tight min-h-[32px] sm:min-h-[38px] md:min-h-[44px] flex items-center">
//                 {activeBrand.replace("ED ", "")}
//               </h2>
              
//               {/* Fixed height for product count text */}
//               <p className="mt-1 text-xs sm:text-sm text-slate-600 min-h-[18px] sm:min-h-[20px] flex items-center">
//                 {showingAllText}
//               </p>
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0 min-h-[40px]">
//               {/* Product count badge - fixed width with truncation */}
//               {/* <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 border border-blue-100 min-w-[100px] sm:min-w-[120px] text-center">
//                 <span className="text-xs sm:text-sm font-semibold text-[#0A2A73] whitespace-nowrap overflow-hidden text-ellipsis block">
//                   {productCountText}
//                 </span>
//               </div> */}
//             </div>
//           </div>
//         </div>

//         {/* PRODUCT GRID - 2 columns on all screen sizes up to large screens */}
//         {/* PRODUCT GRID - 2 columns on mobile, original layout on larger screens */}
// {brandProducts.length > 0 ? (
//   <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
//             {brandProducts.map((p, index) => {
//               // Create a truly unique key by combining brand, slug, and index
//               const uniqueKey = `${activeBrand}-${p.slug}-${index}`;
              
//               return (
//                 <article
//                   key={uniqueKey}
//                   className="group relative rounded-xl sm:rounded-2xl md:rounded-3xl bg-white border shadow-sm hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
//                   style={{ borderColor: "rgba(10,42,115,0.15)" }}
//                   onMouseEnter={() => handleProductMouseEnter(uniqueKey)}
//                   onMouseLeave={handleProductMouseLeave}
//                 >
//                   {/* IMAGE - Fixed aspect ratio with animation */}
//                   <div className="relative aspect-square h-44 sm:h-48 md:h-52 lg:h-56 xl:h-60 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl bg-gradient-to-b from-slate-50 to-white border-b overflow-hidden flex-shrink-0">
//                     <SmoothProductImageGallery 
//                       product={p} 
//                       themeColor={BRAND} 
//                       isCompact={true}
//                     />
//                   </div>

//                   {/* CONTENT - Fixed heights for text sections */}
//                   <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 md:gap-5 flex-grow">
//                     {/* CATEGORY - Fixed height with truncation */}
//                     <div className="min-h-[28px] flex items-center">
//                       <span
//                         className="inline-block text-[10px] sm:text-[11px] md:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border truncate max-w-full"
//                         style={{
//                           borderColor: BRAND + "30",
//                           color: BRAND,
//                           backgroundColor: BRAND + "10"
//                         }}
//                         title={p.category}
//                       >
//                         {p.category}
//                       </span>
//                     </div>

//                     {/* NAME - Fixed height with line clamp */}
//                     <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] overflow-hidden">
//                       {typeof p.name === 'object' ? p.name.en || p.name.fr || '' : p.name}
//                     </h3>

//                     {/* META INFO - Fixed height container */}
//                     <div className="min-h-[70px] sm:min-h-[75px] md:min-h-[80px] flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm text-slate-700">
//                       <span className="inline-flex items-center rounded-full bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 min-h-[28px] sm:min-h-[32px]">
//                         <span className="font-semibold mr-1.5 whitespace-nowrap">
//                           {dosageLabel}
//                         </span> 
//                         <span className="truncate max-w-[70px] sm:max-w-[80px] md:max-w-[100px]" title={p.dosage}>
//                           {p.dosage}
//                         </span>
//                       </span>
//                       <span className="inline-flex items-center rounded-full bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 min-h-[28px] sm:min-h-[32px]">
//                         <span className="font-semibold mr-1.5 whitespace-nowrap">
//                           {formLabel}
//                         </span> 
//                         <span className="truncate max-w-[70px] sm:max-w-[80px] md:max-w-[100px]" title={p.form}>
//                           {p.form}
//                         </span>
//                       </span>
//                       <span className="inline-flex items-center rounded-full bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 min-h-[28px] sm:min-h-[32px]">
//                         <span className="font-semibold mr-1.5 whitespace-nowrap">
//                           {packLabel}
//                         </span> 
//                         <span className="truncate max-w-[70px] sm:max-w-[80px] md:max-w-[100px]" title={p.pack_size}>
//                           {p.pack_size}
//                         </span>
//                       </span>
//                     </div>

//                     {/* ACTION BUTTONS - Details and Enquire buttons in a row */}
//                     <div className="grid grid-cols-2 gap-2 sm:gap-3">
//                       {/* Details Button */}
//                       <Link
//                         href={`/product/${p.slug}`}
//                         className="flex items-center justify-center rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-3.5 md:py-2 text-[11px] sm:text-xs md:text-sm font-semibold text-white transition hover:opacity-90"
//                         style={{ backgroundColor: BRAND }}
//                       >
//                         <span className="truncate whitespace-nowrap">
//                           {detailsText}
//                         </span>
//                       </Link>

//                       {/* Enquire Button */}
//                       <Link
//                         href={`/contact?product=${encodeURIComponent(p.slug)}`}
//                         className="flex items-center justify-center rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-3.5 md:py-2 text-[11px] sm:text-xs md:text-sm font-semibold border bg-white transition hover:bg-slate-50"
//                         style={{ borderColor: BRAND, color: BRAND }}
//                       >
//                         <span className="truncate whitespace-nowrap">
//                           {enquireText}
//                         </span>
//                       </Link>
//                     </div>

//                     {/* Add to Cart Button - Below the other two buttons */}
//                     <div className="mt-1">
//                       <AddToCartButton product={p} themeColor={BRAND} />
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>
//         ) : (
//           /* EMPTY STATE - Fixed height with pre-calculated text */
//           <div className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 text-center min-h-[200px] sm:min-h-[250px] flex flex-col justify-center">
//             <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0">
//               <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-9 9 9 9 0 019-9z" />
//               </svg>
//             </div>
//             <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-1 sm:mb-2 min-h-[24px] sm:min-h-[28px] md:min-h-[32px] flex items-center justify-center">
//               {noProductsText} {activeBrand}
//             </h3>
//             <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-3 sm:mb-4 min-h-[40px] sm:min-h-[48px] flex items-center justify-center">
//               {tryAnotherText}
//             </p>
//             <div className="min-h-[36px] sm:min-h-[40px] md:min-h-[44px]">
//               <button
//                 onClick={() => setActiveBrand(brands[0].key)}
//                 className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white min-h-[36px] sm:min-h-[40px] md:min-h-[44px]"
//                 style={{ backgroundColor: BRAND }}
//               >
//                 <span className="truncate whitespace-nowrap">
//                   {viewBrandText}
//                 </span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
