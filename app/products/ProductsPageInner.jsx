// "use client";

// import { useLanguage } from "@/context/LanguageContext";
// import Link from "next/link";
// import Image from "next/image";
// import { useState, useEffect } from "react";

// export default function ProductsPageInner() {
//   const { products, loading, language } = useLanguage();
//   const [selectedBrand, setSelectedBrand] = useState("All");

//   // Get unique brands
//   const brands = ["All", ...new Set(products.map(p => p.brand))];
  
//   // Filter products by brand
//   const filteredProducts = selectedBrand === "All" 
//     ? products 
//     : products.filter(p => p.brand === selectedBrand);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-xl">Loading products...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!products || products.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-xl text-red-600">No products found!</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">
//         Products ({filteredProducts.length})
//       </h1>
      
//       {/* Brand Filter */}
//       <div className="mb-6 flex flex-wrap gap-2">
//         {brands.map(brand => (
//           <button
//             key={brand}
//             onClick={() => setSelectedBrand(brand)}
//             className={`px-4 py-2 rounded-lg transition-all ${
//               selectedBrand === brand
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {brand === "All" ? "All Products" : brand}
//           </button>
//         ))}
//       </div>

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {filteredProducts.map((product) => (
//           <Link
//             key={product.slug}
//             href={`/product/${product.slug}`}
//             className="border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
//           >
//             <div className="relative h-48 bg-gray-50">
//               <Image
//                 src={product.image || "/placeholder.jpg"}
//                 alt={product.name}
//                 fill
//                 className="object-contain p-4"
//               />
//             </div>
//             <div className="p-4">
//               <h2 className="font-semibold text-lg mb-1 line-clamp-2">
//                 {product.name}
//               </h2>
//               <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//               <p className="text-sm text-gray-600 mb-3">{product.dosage}</p>
//               <div className="flex items-center justify-between">
//                 <span className="text-xl font-bold text-blue-600">
//                   €{product.price}
//                 </span>
//                 <span className="text-xs text-gray-400">{product.form}</span>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { COMPOUNDS } from "../data/compounds";
import { useSearchParams } from "next/navigation";
import { useCart } from "../components/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import pricingData from "../data/pricing"; // Import pricing data

// BRAND THEMES (keep as is)
const BRAND_THEMES = {
  "ED Ajanta Pharma": {
    name: "Ajanta Pharma",
    logo: "/logo/ajanta.webp",
    primary: "#0A2A73",
    secondary: "#2A7DB8",
    accent: "#1C5EB7",
    lightBg: "#E8EEF5",
    extraLight: "#F0F5FA",
    bgImage: "/bg/bg1.png",
    bgUpImage: "/bg/bgup.png",
    bgDownImage: "/bg/bgdown.png",
    gradient: "linear-gradient(135deg, #0A2A73 0%, #2A7DB8 100%)",
    priceGradient: "linear-gradient(135deg, #0A2A73 0%, #1C5EB7 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #0A2A73 0%, #1C5EB7 50%, #2A7DB8 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(10, 42, 115, 0.25)",
    buttonHover: "#0F3A8E",
  },
  "ED Centurion Remedies": {
    name: "Centurion Remedies",
    logo: "/logo/cen.png",
    primary: "#FFB800",
    secondary: "#FFD966",
    accent: "#E6A400",
    lightBg: "#FFF8E5",
    extraLight: "#FFF9E8",
    bgImage: "/bg/bg5.png",
    gradient: "linear-gradient(135deg, #FFB800 0%, #FFD966 100%)",
    priceGradient: "linear-gradient(135deg, #FFB800 0%, #E6A400 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #FFB800 0%, #E6A400 50%, #FFD966 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(255, 184, 0, 0.25)",
    buttonHover: "#E6A400",
    imageBorderColor: "#FFFFFF",
    imageBorderStyle: "embossed",
  },
  "ED Sunrise Remedies": {
    name: "Sunrise Remedies",
    logo: "/bg/sunrise.png",
    primary: "#E86A0C",
    secondary: "#F6B15C",
    accent: "#F08529",
    lightBg: "#FEF1E5",
    extraLight: "#FEF4E8",
    bgImage: "/bg/bg4.png",
    gradient: "linear-gradient(135deg, #E86A0C 0%, #F6B15C 100%)",
    priceGradient: "linear-gradient(135deg, #E86A0C 0%, #F08529 100%)",
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
    lightBg: "#E6E9F0",
    extraLight: "#EDF0F5",
    bgImage: "/bg/bg6.png",
    gradient: "linear-gradient(135deg, #081A3E 0%, #1C4A8C 100%)",
    priceGradient: "linear-gradient(135deg, #081A3E 0%, #122A5C 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #081A3E 0%, #122A5C 50%, #1C4A8C 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(8, 26, 62, 0.25)",
    buttonHover: "#0D234F",
  },
  "Healing Pharma": {
    name: "Healing Pharma",
    logo: "/logo/Healing.png",
    primary: "#2E7D32",
    secondary: "#4CAF50",
    accent: "#1B5E20",
    lightBg: "#E8F5E9",
    extraLight: "#F1F8E9",
    bgImage: "/bg/healing-bg.png",
    gradient: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)",
    priceGradient: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #2E7D32 0%, #1B5E20 50%, #4CAF50 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(46, 125, 50, 0.25)",
    buttonHover: "#1B5E20",
    imageBorderColor: "#FFFFFF",
    imageBorderStyle: "embossed",
  },
  "Hab Pharma": {
    name: "Hab Pharma",
    logo: "/logo/Hab.png",
    primary: "#1565C0",
    secondary: "#1976D2",
    accent: "#0D47A1",
    lightBg: "#E3F2FD",
    extraLight: "#E1F5FE",
    bgImage: "/bg/hab-bg.png",
    gradient: "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
    priceGradient: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
    compoundHeaderGradient:
      "linear-gradient(135deg, #1565C0 0%, #0D47A1 50%, #1976D2 100%)",
    compoundHeaderShadow: "0 4px 20px rgba(21, 101, 192, 0.25)",
    buttonHover: "#0D47A1",
    imageBorderColor: "#FFFFFF",
    imageBorderStyle: "embossed",
  },
};

const BRAND_ORDER = [
  "ED Ajanta Pharma",
  "ED Centurion Remedies",
  "ED Sunrise Remedies",
  "Healing Pharma",
  "Hab Pharma",
];

const makeId = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Helper function to normalize text for comparison
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
// Helper function to remove language suffix from slug (en, ar, zh, etc.)
const getBaseSlug = (slug) => {
  if (!slug) return slug;
  // Remove language suffixes like -en, -ar, -zh, -bg, -bs, -de, -el, -es, -fr, -hr, -ja, -mk, -nl, -pt, -ro, -sq, -sr
  return slug.replace(/-(en|ar|zh|bg|bs|de|el|es|fr|hr|ja|mk|nl|pt|ro|sq|sr)$/, '');
};
// Helper function to check if product has pricing
const hasProductPricing = (productSlug) => {
  const baseSlug = getBaseSlug(productSlug);
  return pricingData.hasOwnProperty(baseSlug);
};

// Helper function to get product price for minimum quantity
const getProductPrice = (productSlug) => {
  const baseSlug = getBaseSlug(productSlug);
  if (!pricingData[baseSlug]) return null;
  
  const pricingTiers = pricingData[baseSlug];
  if (!Array.isArray(pricingTiers) || pricingTiers.length === 0) return null;
  
  const minTier = pricingTiers.find(tier => tier.min === 1) || pricingTiers[0];
  return {
    price: minTier.price,
    tier: minTier
  };
};

// Smooth Product Image Gallery Component
const ProductImageGallery = ({ product, theme, isMobile = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({});
  const [imageError, setImageError] = useState({});
  const [thumbLoaded, setThumbLoaded] = useState({});
  const [thumbError, setThumbError] = useState({});
  const intervalRef = useRef(null);

  const images = useMemo(() => {
  const mainImage = product?.image || "/placeholder.jpg";
  const galleryImages = product?.additionalImages || [];
  return [mainImage, ...galleryImages].filter(Boolean);
}, [product]);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length]);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 5000);
  };

  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
    setImageError(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const getProductName = () => {
    if (!product) return '';
    if (product.name && typeof product.name === 'object') {
      return product.name.en || product.slug || '';
    }
    return product.name || product.slug || '';
  };

  const productName = getProductName();

  const CircularLoader = ({ size = 'md', color = theme?.primary || '#3B82F6' }) => {
    const sizeClasses = {
      sm: 'w-6 h-6 border-2',
      md: 'w-10 h-10 sm:w-12 sm:h-12 border-3',
      lg: 'w-16 h-16 sm:w-20 sm:h-20 border-4'
    };
    const selectedSize = isMobile ? sizeClasses.sm : sizeClasses[size];
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-20">
        <div className="relative">
          <div
            className={`${selectedSize} rounded-full border-t-transparent animate-spin`}
            style={{
              borderColor: `${color}20`,
              borderTopColor: color,
            }}
          />
          {!isMobile && (
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: color }}
            />
          )}
          {!isMobile && (
            <span
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap"
              style={{ color }}
            >
              Loading...
            </span>
          )}
        </div>
      </div>
    );
  };

  const ErrorFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
      <div className="text-center">
        <svg
          className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-xs sm:text-sm text-gray-500">Failed to load</p>
      </div>
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${isMobile ? 'h-60 sm:h-88' : 'h-40 sm:h-88'}`}>
      <style jsx>{`
        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 0.5rem;
          transform: translateZ(0);
        }
        .image-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: scale(0.98);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .image-slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 10;
        }
        .navigation-dot {
          transition: all 0.3s ease;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .image-slide, .navigation-dot, .animate-spin, .animate-ping {
            animation: none;
            transition: none;
          }
        }
      `}</style>

      <div className="image-container cursor-pointer">
        {images.map((imgSrc, index) => (
          <div
            key={index}
            className={`image-slide ${index === currentImageIndex ? 'active' : ''}`}
          >
            {!imageLoaded[index] && !imageError[index] && (
              <CircularLoader size="lg" color={theme.primary} />
            )}
            {imageError[index] && <ErrorFallback />}
            <Image
              src={imgSrc}
              alt={`${productName} - View ${index + 1}`}
              fill
              className={`object-contain transition-opacity duration-300 ${
                imageLoaded[index] && !imageError[index] ? 'opacity-100' : 'opacity-0'
              }`}
              sizes={isMobile ? "60vw" : "40vw"}
              priority={false}
              loading="lazy"
              quality={85}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
          </div>
        ))}
        {images.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`navigation-dot w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  index === currentImageIndex ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  backgroundColor: index === currentImageIndex 
                    ? theme.primary 
                    : `${theme.secondary}80`
                }}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {isMobile && images.length > 1 && (
        <div className="flex gap-2 justify-center mt-3">
          {images.map((imgSrc, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative w-8 h-8 rounded overflow-hidden border ${
                  index === currentImageIndex 
                    ? 'border-opacity-100' 
                    : 'border-opacity-30 border-gray-300'
                }`}
                style={{
                  borderColor: index === currentImageIndex ? theme.primary : 'transparent'
                }}
              >
                {!thumbLoaded[index] && !thumbError[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{
                        borderColor: `${theme.primary}30`,
                        borderTopColor: theme.primary,
                      }}
                    />
                  </div>
                )}
                {thumbError[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <Image
                  src={imgSrc}
                  alt={`Thumbnail ${index + 1}`}
                  width={32}
                  height={32}
                  className={`object-contain w-full h-full transition-opacity duration-200 ${
                    thumbLoaded[index] && !thumbError[index] ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => {
                    setThumbLoaded(prev => ({ ...prev, [index]: true }));
                    setThumbError(prev => ({ ...prev, [index]: false }));
                  }}
                  onError={() => {
                    setThumbError(prev => ({ ...prev, [index]: true }));
                    setThumbLoaded(prev => ({ ...prev, [index]: true }));
                  }}
                />
              </button>
          ))}
        </div>
      )}
    </div>
  );
};

const smoothScrollCSS = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .compound-section {
    animation: fadeInUp 0.6s ease-out;
    will-change: opacity, transform;
  }
  * {
    scroll-behavior: smooth;
  }
  @media (prefers-reduced-motion: reduce) {
    .compound-section {
      animation: none;
    }
  }
`;

export default function ProductsPageInner() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const brandFromUrl = searchParams.get("brand");
  // ✅ IMPORTANT: products added here for API data
  const { t, language, getProductsByBrand, products } = useLanguage();

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
      outOfStock: "Out of Stock",
      buyNow: "Buy Now",
      priceLabel: "Price:",
      startingFrom: "Starting from",
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
    BRAND_THEMES[brandFromUrl] ? brandFromUrl : "ED Ajanta Pharma",
  );
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCompound, setSelectedCompound] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCompound, setActiveCompound] = useState(null);
  const sectionRefs = useRef({});
  const productsStartRef = useRef(null);

  // ✅ FIXED: brandProducts from API data instead of getProductsByBrand
  const brandProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (selectedBrand === "All") return products;
    return products.filter(p => p.brand === selectedBrand);
  }, [products, selectedBrand]);

  // Debug log
  useEffect(() => {
    console.log("🔴 brandProducts length:", brandProducts.length);
    console.log("🔴 selectedBrand:", selectedBrand);
    console.log("🔴 total products:", products?.length);
  }, [brandProducts, selectedBrand, products]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Optimized scroll handler
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(lastScrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Memoized theme
  const theme = useMemo(() => BRAND_THEMES[selectedBrand], [selectedBrand]);

 const brandCompounds = COMPOUNDS[selectedBrand] || {};
let compoundNames = Object.keys(brandCompounds);

// Fallback: If no compounds, create "All Products"
if (compoundNames.length === 0 && brandProducts.length > 0) {
  compoundNames = ["All Products"];
  brandCompounds["All Products"] = brandProducts.map(p => p.slug);
}
  const brandCategories = [
    "All",
    ...new Set(brandProducts.map((p) => p.category)),
  ];

  // Helper function to get product name in current language
  const getProductName = useMemo(() => {
    return (product) => {
      if (!product) return '';
      if (product.name && typeof product.name === 'object') {
        return product.name[language] || product.name.en || product.slug || '';
      }
      return product.name || product.slug || '';
    };
  }, [language]);

  // Simple product match function
  // Replace your existing productMatchesIdentifier with this:
const productMatchesIdentifier = useCallback((product, identifier) => {
  if (!product || !identifier) return false;
  
  // Normalize both for comparison
  const productSlug = normalizeText(product.slug || '');
  const identifierNormalized = normalizeText(identifier);
  
  // Check if product slug contains the identifier or vice versa
  return productSlug === identifierNormalized || 
         productSlug.includes(identifierNormalized) ||
         identifierNormalized.includes(productSlug);
}, []);

  // Simple search function
  const searchInProduct = useCallback((product, searchQuery) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const currentName = getProductName(product).toLowerCase();
    if (currentName.includes(query)) return true;
    if (product.composition?.toLowerCase().includes(query)) return true;
    if (product.category?.toLowerCase().includes(query)) return true;
    if (product.dosage?.toLowerCase().includes(query)) return true;
    return false;
  }, [getProductName]);

  // Initialize
  useEffect(() => {
    if (compoundNames.length > 0) {
      setSelectedCompound(compoundNames[0]);
      setActiveCompound(compoundNames[0]);
    }
  }, [selectedBrand]);

  // Simplified Intersection Observer
  useEffect(() => {
    if (!compoundNames.length) return;
    let observer;
    let animationFrameId;
    const handleIntersection = (entries) => {
      animationFrameId = requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setActiveCompound(entry.target.dataset.compound);
            }, 100);
          }
        });
      });
    };
    observer = new IntersectionObserver(
      handleIntersection,
      { 
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
      }
    );
    setTimeout(() => {
      compoundNames.forEach((compound) => {
        const el = sectionRefs.current[compound];
        if (el) observer.observe(el);
      });
    }, 50);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [selectedBrand, compoundNames]);

  // URL brand change
  useEffect(() => {
    if (brandFromUrl && BRAND_THEMES[brandFromUrl]) {
      setSelectedBrand(brandFromUrl);
    }
  }, [brandFromUrl]);

  // Smooth scroll to compound
  const scrollToCompound = useCallback((compound) => {
    const el = document.getElementById(`compound-${makeId(compound)}`);
    if (el) {
      const offset = 120;
      const startPosition = window.scrollY;
      const targetPosition = el.getBoundingClientRect().top + window.scrollY - offset;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let startTime = null;
      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      const scrollAnimation = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        window.scrollTo(0, startPosition + distance * easeProgress);
        if (timeElapsed < duration) {
          requestAnimationFrame(scrollAnimation);
        }
      };
      requestAnimationFrame(scrollAnimation);
    }
  }, []);

  const scrollToProductsStart = useCallback(() => {
    if (!productsStartRef.current) return;
    const offset = 140;
    const y =
      productsStartRef.current.getBoundingClientRect().top +
      window.scrollY -
      offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  // Memoized filtered products for each compound
 const filteredProductsByCompound = useMemo(() => {
  const result = {};
  
  compoundNames.forEach(compound => {
    const identifiers = brandCompounds[compound] || [];
    
    let items = brandProducts.filter((product) => {
      // For "All Products" compound, show all products
      if (compound === "All Products") return true;
      
      const belongsToCompound = identifiers.some(identifier => 
        productMatchesIdentifier(product, identifier)
      );
      
      if (!belongsToCompound) return false;
      if (categoryFilter !== "All" && product.category !== categoryFilter) return false;
      if (debouncedSearch.trim()) {
        return searchInProduct(product, debouncedSearch);
      }
      return true;
    });
    
    result[compound] = items;
  });
  
  return result;
}, [compoundNames, brandCompounds, brandProducts, productMatchesIdentifier, categoryFilter, debouncedSearch, searchInProduct]);

  // Check if any compound has results
  const hasAnyResults = useMemo(() => {
    return Object.values(filteredProductsByCompound).some(items => items.length > 0);
  }, [filteredProductsByCompound]);

  // Get current filtered items for active compound
  const getFilteredItems = useCallback((compound) => {
    return filteredProductsByCompound[compound] || [];
  }, [filteredProductsByCompound]);

  // Handle Add to Cart click - only for in-stock products
  const handleAddToCart = (product) => {
    if (hasProductPricing(product.slug)) {
      addToCart(product, 100, false, true);
    }
  };

  // Loading state
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen">
      <style jsx global>{smoothScrollCSS}</style>
      <Navbar />

      {/* Background with brand image */}
      <div className="fixed inset-0 -z-10 cursor-pointer">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat "
          style={{
            backgroundImage: `url(${theme.bgImage})`,
          }}
        ></div>
        {selectedBrand === "ED Ajanta Pharma" &&
          theme.bgUpImage &&
          theme.bgDownImage && (
            <>
              <div
                className="absolute -top-20 -right-35 w-130 h-200 opacity-80"
                style={{
                  backgroundImage: `url(${theme.bgUpImage})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top right",
                  mixBlendMode: "multiply",
                }}
              ></div>
              <div
                className="absolute -bottom-20 -left-35 w-110 h-204 opacity-80"
                style={{
                  backgroundImage: `url(${theme.bgDownImage})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom left",
                  mixBlendMode: "multiply",
                }}
              ></div>
            </>
          )}
        <div className="absolute inset-0 bg-white/30"></div>
      </div>

      {/* Floating Brand Selector */}
      <div
        className={`fixed top-18 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 pointer-events-none translate-y-2"
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-2 bg-white cursor-pointer rounded-full shadow-xl px-3 sm:px-4 py-2 sm:py-3 border border-gray-100">
          {BRAND_ORDER.map((brandKey) => {
            const b = BRAND_THEMES[brandKey];
            const isActive = selectedBrand === brandKey;
            return (
              <button
                key={brandKey}
                onClick={() => {
                  setSelectedBrand(brandKey);
                  setSearchInput("");
                  setCategoryFilter("All");
                  setTimeout(() => {
                    scrollToProductsStart();
                  }, 50);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 ${
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
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 ">
        {/* Brand Logos Grid */}
        <div className="mb-6 sm:mb-8 mt-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 ">
            {BRAND_ORDER.map((brandKey, index) => {
              const b = BRAND_THEMES[brandKey];
              const isActive = selectedBrand === brandKey;
              return (
                <button
                  key={brandKey}
                  onClick={() => {
                    setSelectedBrand(brandKey);
                    setSearchInput("");
                    setCategoryFilter("All");
                  }}
                  className={`relative overflow-hidden cursor-pointer rounded-xl sm:rounded-2xl p-3 sm:p-4 h-32 sm:h-36 md:h-40 transition-all duration-300 transform ${
                    isActive
                      ? "ring-2 sm:ring-3 ring-offset-1 sm:ring-offset-2 shadow-2xl scale-105 z-10"
                      : "hover:shadow-xl hover:scale-102"
                  }`}
                  style={{
                    border: `2px solid ${isActive ? b.primary : "#e5e7eb"}`,
                    boxShadow: isActive
                      ? `0 10px 25px -5px ${b.primary}40`
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    backgroundColor: 'white',
                  }}
                >
                  {isActive && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
                      <div
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
                        style={{
                          backgroundColor: b.primary,
                          boxShadow: `0 0 10px ${b.primary}`,
                        }}
                      ></div>
                    </div>
                  )}
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                      <Image
                        src={b.logo}
                        alt={b.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/95 shadow-sm whitespace-nowrap" 
                      style={{ color: b.primary, border: `1px solid ${b.primary}30` }}>
                      {b.name}
                    </span>
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
              <div className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none ">
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
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={
                      filters.searchPlaceholder ||
                      "Search products by name, composition, or description..."
                    }
                    className="w-full cursor-pointer pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm text-gray-900"
                    style={{ "--tw-ring-color": theme.primary }}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 ">
                <div className="relative flex-1">
                  <select
                    value={selectedCompound}
                    onChange={(e) => {
                      setSelectedCompound(e.target.value);
                      scrollToCompound(e.target.value);
                    }}
                    className="w-full cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 appearance-none bg-white shadow-sm text-gray-900"
                    style={{ "--tw-ring-color ": theme.primary }}
                  >
                    <option value="" className="text-gray-900 ">
                      {filters.allCompounds || "All Compounds"}
                    </option>
                    {compoundNames.map((c) => (
                      <option key={c} value={c} className="text-gray-900 ">
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4  w-4 sm:h-5 sm:w-5 text-gray-400"
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
                <div className="relative flex-1">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 appearance-none bg-white shadow-sm text-gray-900"
                    style={{ "--tw-ring-color": theme.primary }}
                  >
                    {brandCategories.map((cat) => (
                      <option key={cat} value={cat} className="text-gray-900 ">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ">
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
          {compoundNames.map((compound, index) => {
            const items = getFilteredItems(compound);
            if (!items.length) return null;

            return (
              <section
                key={compound}
                id={`compound-${makeId(compound)}`}
                data-compound={compound}
                ref={(el) => {
                  sectionRefs.current[compound] = el;
                }}
                className={`compound-section scroll-mt-24 sm:scroll-mt-32 mb-10 sm:mb-16 transition-opacity duration-500 ${
                  activeCompound === compound ? 'opacity-100' : 'opacity-95'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Compound Header */}
                <div className="mb-6 sm:mb-8 transition-all duration-300 transform hover:scale-[1.01]">
                  <div className="relative">
                    <div
                      className="relative overflow-hidden rounded-xl mb-3 sm:mb-4"
                      style={{
                        background: theme.compoundHeaderGradient,
                        boxShadow: theme.compoundHeaderShadow,
                      }}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{
                          background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                        }}
                      ></div>
                      <div className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <div
                                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                                    style={{ backgroundColor: theme.secondary }}
                                  ></div>
                                </div>
                              </div>
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
                                    {(brandCompounds[compound] || []).length} SKUs
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
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
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  {items.map((p, itemIndex) => {
                    const isEven = itemIndex % 2 === 0;
                    const productName = getProductName(p);
                    const hasPricing = hasProductPricing(p.slug);
                    const isInStock = hasPricing;
                    const priceInfo = isInStock ? getProductPrice(p.slug) : null;

                    return (
                      <div
                        key={`${compound}-${p.slug}-${itemIndex}`}
                        className={`bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 ${
                          isInStock 
                            ? 'hover:shadow-2xl transform hover:-translate-y-1' 
                            : 'opacity-80'
                        }`}
                        style={{
                          animationDelay: `${itemIndex * 50}ms`,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        <div className="p-4 sm:p-6">
                          {/* MOBILE VIEW */}
                          <div className="lg:hidden">
                            <div className="space-y-4 sm:space-y-6">
                              <div className="sm:rounded-xl p-3 sm:p-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                                <ProductImageGallery product={p} theme={theme} isMobile={true} />
                              </div>
                              <div className="space-y-3 sm:space-y-4">
                                <div>
                                  <h3
                                    className="text-lg sm:text-xl font-bold mb-1 sm:mb-2"
                                    style={{ color: theme.primary }}
                                  >
                                    {productName}
                                  </h3>
                                </div>
                                {isInStock && priceInfo && (
                                  <div 
                                    className="rounded-lg p-3 border shadow-sm"
                                    style={{ 
                                      backgroundColor: theme.lightBg,
                                      borderColor: theme.primary + '30'
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span 
                                        className="text-xs font-medium flex items-center gap-1"
                                        style={{ color: theme.primary }}
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {productCard.priceLabel || "Price:"}
                                      </span>
                                      <div className="text-right">
                                        <span 
                                          className="text-sm font-bold"
                                          style={{ color: theme.primary }}
                                        >
                                          €{priceInfo.price.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">
                                          /unit
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span 
                                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                        style={{ 
                                          backgroundColor: theme.extraLight,
                                          color: theme.primary,
                                          borderColor: theme.primary + '20'
                                        }}
                                      >
                                        {productCard.startingFrom || "Starting from"} {priceInfo.tier.min}+
                                      </span>
                                      <span className="text-[10px] text-gray-400">•</span>
                                      <span className="text-[10px] text-gray-500">
                                        Bulk pricing
                                      </span>
                                    </div>
                                  </div>
                                )}
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
                                    {typeof p.description === 'object' 
                                      ? p.description[language] || p.description.en || p.description
                                      : p.description}
                                  </p>
                                )}
                                <div className="flex flex-col gap-2 sm:gap-3 pt-3 sm:pt-4">
                                  {isInStock ? (
                                    <>
                                      <Link
                                        href={`/product/${p.slug}`}
                                        className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all duration-200 hover:shadow-md"
                                        style={{
                                          borderColor: theme.primary,
                                          color: theme.primary,
                                          backgroundColor: `${theme.primary}08`,
                                        }}
                                      >
                                        {productCard.viewDetails || "View Details"}
                                      </Link>
                                      <button
                                        onClick={() => handleAddToCart(p)}
                                        className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base text-white transition-all duration-200 hover:shadow-lg"
                                        style={{
                                          backgroundColor: theme.primary,
                                          boxShadow: `0 2px 10px ${theme.primary}50`,
                                        }}
                                      >
                                        {productCard.addToCart || "Add to Cart"}
                                      </button>
                                    </>
                                  ) : (
                                    <div
                                      className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base bg-gray-200 text-gray-500 cursor-not-allowed"
                                    >
                                      {productCard.outOfStock || "Out of Stock"}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* DESKTOP VIEW */}
                          <div className="hidden lg:grid lg:grid-cols-2 gap-6 sm:gap-8">
                            {isEven ? (
                              <>
                                <div className="flex items-center justify-center">
                                  <div className="p-6 w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                                    <ProductImageGallery product={p} theme={theme} />
                                  </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                  <div className="space-y-3 sm:space-y-4">
                                    <h3
                                      className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2"
                                      style={{ color: theme.primary }}
                                    >
                                      {productName}
                                    </h3>
                                    <div className="space-y-2 sm:space-y-3">
                                      {p.dosage && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.dosageLabel || "Dosage:"}
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.dosage}
                                          </span>
                                        </div>
                                      )}
                                      {p.composition && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.compositionLabel || "Composition:"}
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.composition}
                                          </span>
                                        </div>
                                      )}
                                      {p.pack_size && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.packSizeLabel || "Pack Size:"}
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
                                          {typeof p.description === 'object'
                                            ? p.description[language] || p.description.en || p.description
                                            : p.description}
                                        </p>
                                      </div>
                                    )}
                                    {isInStock && priceInfo && (
                                      <div 
                                        className="rounded-xl p-4 border shadow-sm"
                                        style={{ 
                                          backgroundColor: theme.lightBg,
                                          borderColor: theme.primary + '30'
                                        }}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span 
                                            className="text-sm font-medium flex items-center gap-1.5"
                                            style={{ color: theme.primary }}
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {productCard.priceLabel || "Price:"}
                                          </span>
                                          <div className="text-right">
                                            <span 
                                              className="text-xl font-bold"
                                              style={{ color: theme.primary }}
                                            >
                                              €{priceInfo.price.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                              /unit
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                          <span 
                                            className="text-xs font-medium px-2.5 py-1 rounded-full border"
                                            style={{ 
                                              backgroundColor: theme.extraLight,
                                              color: theme.primary,
                                              borderColor: theme.primary + '20'
                                            }}
                                          >
                                            {productCard.startingFrom || "Starting from"} {priceInfo.tier.min}+ units
                                          </span>
                                          <span className="text-xs text-gray-400">•</span>
                                          <span className="text-xs text-gray-500">
                                            Volume discounts
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                                      {isInStock ? (
                                        <>
                                          <Link
                                            href={`/product/${p.slug}`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all duration-200 hover:shadow-md"
                                            style={{
                                              borderColor: theme.primary,
                                              color: theme.primary,
                                              backgroundColor: `${theme.primary}08`,
                                            }}
                                          >
                                            {productCard.viewDetails || "View Details"}
                                          </Link>
                                          <button
                                            onClick={() => handleAddToCart(p)}
                                            className="flex-1 inline-flex items-center justify-center cursor-pointer gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base text-white transition-all duration-200 hover:shadow-lg"
                                            style={{
                                              backgroundColor: theme.primary,
                                              boxShadow: `0 2px 10px ${theme.primary}50`,
                                            }}
                                          >
                                            {productCard.addToCart || "Add to Cart"}
                                          </button>
                                        </>
                                      ) : (
                                        <div
                                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base bg-gray-200 text-gray-500 cursor-not-allowed"
                                        >
                                          {productCard.outOfStock || "Out of Stock"}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col justify-center">
                                  <div className="space-y-3 sm:space-y-4">
                                    <h3
                                      className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2"
                                      style={{ color: theme.primary }}
                                    >
                                      {productName}
                                    </h3>
                                    <div className="space-y-2 sm:space-y-3">
                                      {p.dosage && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.dosageLabel || "Dosage:"}
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.dosage}
                                          </span>
                                        </div>
                                      )}
                                      {p.composition && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.compositionLabel || "Composition:"}
                                          </span>
                                          <span className="text-sm text-gray-600 ml-2 sm:ml-3">
                                            {p.composition}
                                          </span>
                                        </div>
                                      )}
                                      {p.pack_size && (
                                        <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-700 min-w-[90px] sm:min-w-[100px]">
                                            {productCard.packSizeLabel || "Pack Size:"}
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
                                          {typeof p.description === 'object'
                                            ? p.description[language] || p.description.en || p.description
                                            : p.description}
                                        </p>
                                      </div>
                                    )}
                                    {isInStock && priceInfo && (
                                      <div 
                                        className="rounded-xl p-4 border shadow-sm"
                                        style={{ 
                                          backgroundColor: theme.lightBg,
                                          borderColor: theme.primary + '30'
                                        }}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span 
                                            className="text-sm font-medium flex items-center gap-1.5"
                                            style={{ color: theme.primary }}
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {productCard.priceLabel || "Price:"}
                                          </span>
                                          <div className="text-right">
                                            <span 
                                              className="text-xl font-bold"
                                              style={{ color: theme.primary }}
                                            >
                                              €{priceInfo.price.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                              /unit
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                          <span 
                                            className="text-xs font-medium px-2.5 py-1 rounded-full border"
                                            style={{ 
                                              backgroundColor: theme.extraLight,
                                              color: theme.primary,
                                              borderColor: theme.primary + '20'
                                            }}
                                          >
                                            {productCard.startingFrom || "Starting from"} {priceInfo.tier.min}+ units
                                          </span>
                                          <span className="text-xs text-gray-400">•</span>
                                          <span className="text-xs text-gray-500">
                                            Volume discounts
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                                      {isInStock ? (
                                        <>
                                          <Link
                                            href={`/product/${p.slug}`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border rounded-lg font-medium text-sm sm:text-base transition-all duration-200 hover:shadow-md"
                                            style={{
                                              borderColor: theme.primary,
                                              color: theme.primary,
                                              backgroundColor: `${theme.primary}08`,
                                            }}
                                          >
                                            {productCard.viewDetails || "View Details"}
                                          </Link>
                                          <button
                                            onClick={() => handleAddToCart(p)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2 cursor-pointer rounded-lg font-medium text-sm sm:text-base text-white transition-all duration-200 hover:shadow-lg"
                                            style={{
                                              backgroundColor: theme.primary,
                                              boxShadow: `0 2px 10px ${theme.primary}50`,
                                            }}
                                          >
                                            {productCard.addToCart || "Add to Cart"}
                                          </button>
                                        </>
                                      ) : (
                                        <div
                                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base bg-gray-200 text-gray-500 cursor-not-allowed"
                                        >
                                          {productCard.outOfStock || "Out of Stock"}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center">
                                  <div className="p-6 w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                                    <ProductImageGallery product={p} theme={theme} />
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
                  onClick={() => setSearchInput("")}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border font-medium text-sm hover:shadow-md whitespace-nowrap bg-white"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                  }}
                >
                  {filters.clearSearch || "Clear Search"}
                </button>
                <button
                  onClick={() => {
                    setSearchInput("");
                    setCategoryFilter("All");
                    setSelectedCompound(compoundNames[0]);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-white hover:shadow-lg whitespace-nowrap"
                  style={{
                    background: theme.gradient,
                    boxShadow: `0 4px 15px ${theme.primary}40`,
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
              className="p-3 sm:p-4 rounded-full shadow-2xl text-white"
              style={{
                background: theme.gradient,
                boxShadow: `0 8px 32px ${theme.primary}60`,
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
