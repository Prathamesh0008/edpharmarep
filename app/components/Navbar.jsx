"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Download, Search, LogOut, ChevronRight, User, ChevronDown, Sparkles, Tag, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import LoginPopup from "./LoginPopup";
import { products } from "@/app/data/products";
import { useLanguage } from "@/context/LanguageContext";
import { COMPOUNDS } from "@/app/data/compounds";

/* ================= NAVBAR ================= */

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current path for active state
  const { cartItems, getCartBadgeCount } = useCart();
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const languageRef = useRef(null);
  const mobileLanguageRef = useRef(null);

  /* ---------- STATES ---------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileLanguageOpen, setMobileLanguageOpen] = useState(false);
  
  const { language, changeLanguage, availableLanguages, t } = useLanguage();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const cartCount = getCartBadgeCount();

  /* ---------- LANGUAGES CONFIG ---------- */
  const LANGUAGE_MAPPING = {
    "ar": { label: "Arabic", flag: "sa" },
    "sq": { label: "Albanian", flag: "al" },
    "bs": { label: "Bosnian", flag: "ba" },
    "bg": { label: "Bulgarian", flag: "bg" },
    "zh": { label: "Chinese", flag: "cn" },
    "hr": { label: "Croatian", flag: "hr" },
    "nl": { label: "Dutch", flag: "nl" },
    "en": { label: "English", flag: "us" },
    "fr": { label: "French", flag: "fr" },
    "de": { label: "German", flag: "de" },
    "el": { label: "Greek", flag: "gr" },
    "ja": { label: "Japanese", flag: "jp" },
    "mk": { label: "Macedonian", flag: "mk" },
    "pt": { label: "Portuguese", flag: "pt" },
    "ro": { label: "Romanian", flag: "ro" },
    "sr": { label: "Serbian", flag: "rs" },
    "es": { label: "Spanish", flag: "es" },
  };

  // Get current language info
  const currentLanguageInfo = LANGUAGE_MAPPING[language] || LANGUAGE_MAPPING.en;

  // Create LANGUAGES array from mapping
  const LANGUAGES = Object.entries(LANGUAGE_MAPPING).map(([code, info]) => ({
    code,
    label: info.label,
    flag: info.flag
  }));

  /* ---------- POPULAR SEARCHES ---------- */
  const popularSearches = [
    "Sildenafil",
    "Tadalafil",
    "Vardenafil",
    "Cenforce",
    "Kamagra",
    "Vidalista",
    "Ajanta",
    "Centurion",
    "Sunrise"
  ];

  /* ---------- BRAND CONFIG ---------- */
  const BRAND_CONFIG = {
    "ED Ajanta Pharma": {
      name: "Ajanta Pharma",
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      hoverBgColor: "hover:bg-blue-100",
      popularProducts: ["Kamagra", "Tadalis", "Valif"]
    },
    "ED Centurion Remedies": {
      name: "Centurion Remedies",
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      hoverBgColor: "hover:bg-green-100",
      popularProducts: ["Cenforce", "Vidalista", "Vilitra"]
    },
    "ED Sunrise Remedies": {
      name: "Sunrise Remedies",
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      hoverBgColor: "hover:bg-purple-100",
      popularProducts: ["Malegra", "Tadarise", "Zhewitra"]
    }
  };

  /* ---------- CREATE SEARCH INDEX ---------- */
  useEffect(() => {
    const index = [];
    
    // Add all products
    products.forEach(product => {
      index.push({
        type: 'product',
        id: product.id,
        name: product.name,
        brand: product.brand,
        composition: product.composition,
        strength: product.strength,
        slug: product.slug,
        product: product
      });
    });

    // Add compounds from COMPOUNDS data
    Object.entries(COMPOUNDS).forEach(([brand, compounds]) => {
      Object.entries(compounds).forEach(([compoundName, slugs]) => {
        slugs.forEach(slug => {
          // Find the corresponding product
          const product = products.find(p => p.slug === slug);
          if (product) {
            index.push({
              type: 'compound',
              id: `${compoundName}-${slug}`,
              name: compoundName,
              brand: brand,
              composition: compoundName,
              slug: slug,
              product: product,
              brandName: brand
            });
          }
        });
      });
    });

    setSearchIndex(index);
  }, []);

  /* ---------- USER AUTH SYNC ---------- */
  useEffect(() => {
    setMounted(true);
    
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("bio-user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUsername(user.username || user.name || user.email || "User");
        } else {
          setUsername("");
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUsername("");
      }
    };

    loadUser();

    window.addEventListener('storage', loadUser);
    const interval = setInterval(loadUser, 1000);
    
    return () => {
      window.removeEventListener('storage', loadUser);
      clearInterval(interval);
    };
  }, []);

  /* ---------- CLICK OUTSIDE HANDLER ---------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target)) {
        setShowDesktopSearch(false);
        setSelectedBrand(null);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setSuggestions([]);
        setSelectedBrand(null);
      }
      if (languageOpen && languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
      if (mobileLanguageOpen && mobileLanguageRef.current && !mobileLanguageRef.current.contains(event.target)) {
        setMobileLanguageOpen(false);
      }
      if (profileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [profileMenuOpen, languageOpen, mobileLanguageOpen]);

  /* ---------- ENHANCED SEARCH FUNCTION ---------- */
  const performSearchLogic = (searchValue, brandFilter = null) => {
    if (!searchValue.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      setSelectedBrand(null);
      return;
    }

    setIsSearching(true);
    
    // Use setTimeout for debouncing
    setTimeout(() => {
      const q = searchValue.toLowerCase().trim();
      
      // Step 1: Find all matching compounds in the search index
      const matchingCompounds = searchIndex.filter(item => 
        item.type === 'compound' && 
        item.composition && 
        item.composition.toLowerCase().includes(q)
      );

      // Step 2: If we found compounds, get unique products
      let results = [];
      
      if (matchingCompounds.length > 0) {
        // Group by brand
        const brands = {};
        
        matchingCompounds.forEach(compound => {
          const brand = compound.brandName;
          if (!brands[brand]) {
            brands[brand] = [];
          }
          if (!brands[brand].some(p => p.id === compound.product.id)) {
            brands[brand].push(compound.product);
          }
        });

        // Apply brand filter if selected
        if (brandFilter && brands[brandFilter]) {
          results = brands[brandFilter].slice(0, 8);
        } else {
          // Get 2-3 products from each brand
          Object.keys(brands).forEach(brand => {
            const brandProducts = brands[brand].slice(0, 3);
            results.push(...brandProducts);
          });
          
          // Sort and limit results
          results = results.slice(0, 9);
        }
      } else {
        // If no compounds found, do regular search
        results = searchIndex
          .map(item => {
            let score = 0;
            const searchFields = [
              { field: item.name, weight: 3 },
              { field: item.composition, weight: 4 },
              { field: item.slug, weight: 2 },
              { field: item.brand, weight: 1 },
              { field: item.strength, weight: 1 }
            ];

            searchFields.forEach(({ field, weight }) => {
              if (field && field.toLowerCase().includes(q)) {
                if (field.toLowerCase() === q) score += weight * 2;
                else if (field.toLowerCase().startsWith(q)) score += weight * 1.5;
                else score += weight;
              }
            });

            return { ...item, score };
          })
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.product)
          .filter((product, index, self) => 
            index === self.findIndex(p => p.id === product.id)
          )
          .slice(0, 8);
      }

      setSuggestions(results);
      setIsSearching(false);
    }, 300);
  };

  /* ---------- SEARCH FUNCTIONS ---------- */
  const handleSearchChange = (value) => {
    setQuery(value);
    setSelectedBrand(null); // Reset brand filter when typing
    performSearchLogic(value);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      performSearch();
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      performSearch();
    }
  };

  const performSearch = () => {
    const searchQuery = query.trim();
    if (!searchQuery) return;

    setShowDesktopSearch(false);
    setMobileSearchOpen(false);
    setSuggestions([]);
    setQuery("");
    setSelectedBrand(null);
    
    // Navigate to products page with search query
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleQuickSearch = (term) => {
    // This will immediately perform the search and navigate
    setShowDesktopSearch(false);
    setMobileSearchOpen(false);
    setQuery("");
    setSuggestions([]);
    setSelectedBrand(null);
    
    // Navigate directly to products page with search
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  const handleBrandFilter = (brandName) => {
    setSelectedBrand(brandName);
    // Re-run search with brand filter
    performSearchLogic(query, brandName);
  };

  const clearBrandFilter = () => {
    setSelectedBrand(null);
    performSearchLogic(query);
  };

  const handleBrandQuickSearch = (brandName, productLine = "") => {
    const searchTerm = productLine ? `${productLine} ${query}`.trim() : query;
    setShowDesktopSearch(false);
    setMobileSearchOpen(false);
    setQuery("");
    setSuggestions([]);
    setSelectedBrand(null);
    
    router.push(`/products?search=${encodeURIComponent(searchTerm)}&brand=${encodeURIComponent(brandName)}`);
  };

  const handleSuggestionClick = (item) => {
    setQuery("");
    setSuggestions([]);
    setShowDesktopSearch(false);
    setMobileSearchOpen(false);
    setSelectedBrand(null);
    
    if (item.slug) {
      router.push(`/product/${item.slug}`);
    } else if (item.id) {
      const fullProduct = products.find(p => p.id === item.id);
      if (fullProduct && fullProduct.slug) {
        router.push(`/product/${fullProduct.slug}`);
      }
    }
  };

  /* ---------- HELPER FUNCTIONS ---------- */
  const highlightMatch = (text, query) => {
    if (!query.trim() || !text) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="text-blue-600 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getMatchType = (item) => {
    const currentQuery = query.toLowerCase().trim();
    const matchedItem = searchIndex.find(indexItem => 
      indexItem.product?.id === item.id
    );
    
    if (!matchedItem) return 'product';
    
    if (matchedItem.type === 'compound') {
      return 'compound';
    }
    
    return 'product';
  };

  const getBrandInfo = (brandName) => {
    return BRAND_CONFIG[brandName] || {
      name: brandName,
      color: "gray",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
      hoverBgColor: "hover:bg-gray-100"
    };
  };

  const getBrandsFromSuggestions = () => {
    const brands = new Set();
    suggestions.forEach(item => {
      if (item.brand) {
        brands.add(item.brand);
      }
    });
    return Array.from(brands);
  };

  /* ---------- TOGGLE FUNCTIONS ---------- */
  const toggleDesktopSearch = () => {
    setShowDesktopSearch(!showDesktopSearch);
    if (!showDesktopSearch) {
      setTimeout(() => {
        const input = desktopSearchRef.current?.querySelector('input');
        input?.focus();
      }, 10);
    } else {
      setQuery("");
      setSuggestions([]);
      setSelectedBrand(null);
    }
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    if (!mobileSearchOpen) {
      setTimeout(() => {
        const input = mobileSearchRef.current?.querySelector('input');
        input?.focus();
      }, 10);
    } else {
      setQuery("");
      setSuggestions([]);
      setSelectedBrand(null);
    }
  };

  /* ---------- RENDER SUGGESTIONS ---------- */
  const renderSuggestions = () => {
    if (isSearching && suggestions.length === 0) {
      return (
        <div className="mt-4 text-center py-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm text-gray-500">Searching across all brands...</p>
        </div>
      );
    }

    if (suggestions.length > 0) {
      const brands = getBrandsFromSuggestions();
      const isCompoundSearch = searchIndex.some(item => 
        item.type === 'compound' && 
        item.composition && 
        item.composition.toLowerCase().includes(query.toLowerCase().trim())
      );

      return (
        <>
          {/* Brand Filters Section */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <p className="text-sm font-medium text-gray-700">Filter by Brand</p>
              </div>
              {selectedBrand && (
                <button
                  onClick={clearBrandFilter}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                >
                  <X size={12} />
                  Clear filter
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {brands.map(brand => {
                const brandInfo = getBrandInfo(brand);
                const isActive = selectedBrand === brand;
                const brandProducts = suggestions.filter(item => item.brand === brand);
                
                return (
                  <button
                    key={brand}
                    onClick={() => handleBrandFilter(brand)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1.5 cursor-pointer
                      ${isActive ? 
                        `${brandInfo.bgColor} ${brandInfo.textColor} ${brandInfo.borderColor} font-semibold` : 
                        `bg-white ${brandInfo.textColor} ${brandInfo.borderColor} hover:${brandInfo.bgColor.replace('bg-', '')}`
                      }`}
                    title={`Show ${brandProducts.length} products from ${brandInfo.name}`}
                  >
                    <Tag size={10} />
                    <span>{brandInfo.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${isActive ? 'bg-white' : brandInfo.bgColor}`}>
                      {brandProducts.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {suggestions.length} {suggestions.length === 1 ? 'product' : 'products'} found
                {selectedBrand && ` in ${getBrandInfo(selectedBrand).name}`}
              </p>
              {query.trim() && !selectedBrand && brands.length > 1 && (
                <p className="text-xs text-gray-500">
                  Showing results from {brands.length} brands
                </p>
              )}
            </div>
            <button
              onClick={handleSearchSubmit}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Products List */}
          <div className="mt-2 border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {suggestions.map((item) => {
              const matchType = getMatchType(item);
              const matchedItem = searchIndex.find(indexItem => 
                indexItem.product?.id === item.id
              );
              const brandInfo = getBrandInfo(item.brand);

              return (
                <button
                  key={item.id || item.name}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 
                    flex items-start justify-between border-b last:border-b-0
                    transition-colors duration-150 active:bg-blue-100 group cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <div className={`p-1 rounded mt-1 ${matchType === 'compound' ? 'bg-green-100' : 'bg-blue-100'}`}>
                        {matchType === 'compound' ? (
                          <Sparkles size={12} className="text-green-600" />
                        ) : (
                          <Search size={12} className="text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-left">
                          {highlightMatch(item.name, query)}
                        </div>
                        <div className="text-xs text-gray-500 flex flex-col mt-1">
                          <div className="flex items-center gap-2">
                            {item.strength && (
                              <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                                {item.strength}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded ${brandInfo.bgColor} ${brandInfo.textColor} ${brandInfo.borderColor}`}>
                              {brandInfo.name}
                            </span>
                          </div>
                          {matchedItem && matchedItem.type === 'compound' && (
                            <span className="text-green-600 text-xs mt-1 flex items-center gap-1">
                              <Sparkles size={10} />
                              Contains: {matchedItem.composition}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-2" />
                </button>
              );
            })}
          </div>

          {/* Quick Brand Actions for Compound Searches */}
          {isCompoundSearch && brands.length > 1 && !selectedBrand && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">QUICK ACTIONS:</p>
              <div className="grid grid-cols-3 gap-2">
                {brands.slice(0, 3).map(brand => {
                  const brandInfo = getBrandInfo(brand);
                  const popularProduct = brandInfo.popularProducts?.[0] || "";
                  
                  return (
                    <button
                      key={brand}
                      onClick={() => handleBrandQuickSearch(brandInfo.name, popularProduct)}
                      className={`px-2 py-2 text-xs rounded-lg border ${brandInfo.bgColor} ${brandInfo.borderColor} ${brandInfo.hoverBgColor} transition-colors cursor-pointer`}
                    >
                      <div className="font-semibold">{brandInfo.name.split(' ')[0]}</div>
                      <div className="text-xs opacity-75 mt-0.5">{popularProduct}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      );
    }

    if (query.trim() && !isSearching) {
      return (
        <div className="mt-4 text-center py-8">
          <Search size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No results found for "{query}"</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Try searching by compound or brand name</p>
          
          {/* Brand suggestions when no results */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Browse by brand:</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(BRAND_CONFIG).slice(0, 3).map(([brandKey, brandInfo]) => (
                <button
                  key={brandKey}
                  onClick={() => handleQuickSearch(brandInfo.name)}
                  className={`px-3 py-2 text-xs rounded-lg border ${brandInfo.bgColor} ${brandInfo.borderColor} ${brandInfo.hoverBgColor} transition-colors cursor-pointer`}
                >
                  <div className="font-semibold">{brandInfo.name.split(' ')[0]}</div>
                  <div className="text-xs opacity-75 mt-0.5">{brandInfo.popularProducts[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Show popular searches when empty
    if (!query.trim()) {
      return (
        <div className="mt-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Browse by brand:</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(BRAND_CONFIG).map(([brandKey, brandInfo]) => (
                <button
                  key={brandKey}
                  onClick={() => handleQuickSearch(brandInfo.name)}
                  className={`px-3 py-2 text-sm rounded-lg border ${brandInfo.bgColor} ${brandInfo.borderColor} ${brandInfo.hoverBgColor} transition-colors cursor-pointer`}
                >
                  <div className="font-semibold">{brandInfo.name.split(' ')[0]}</div>
                  <div className="text-xs opacity-75 mt-0.5">{brandInfo.popularProducts[0]}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Popular compound searches:</p>
            <div className="flex flex-wrap gap-2">
              {["Sildenafil", "Tadalafil", "Vardenafil"].map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(term)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 
                    text-gray-700 hover:text-blue-700 rounded-full transition-colors
                    border border-gray-200 hover:border-blue-300 cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  /* ---------- HANDLERS ---------- */
  const handleLoginSuccess = (user) => {
    localStorage.setItem("bio-user", JSON.stringify(user));
    setUsername(user.username || user.name || user.email || "User");
    setIsPopupOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("bio-user");
    setUsername("");
    setProfileMenuOpen(false);
    router.push("/");
  };

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setLanguageOpen(false);
    setMobileLanguageOpen(false);
    setMenuOpen(false);
  };

  // Function to check if a link is active
  const isActiveLink = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-[1000] h-[60px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
            <Link href="/" className="flex items-center cursor-pointer">
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </nav>
        <div className="h-[64px]" />
      </>
    );
  }

  // Use translations from context
  const currentTranslations = t?.en || { 
    home: "Home", 
    products: "Products", 
    about: "About", 
    terms: "Terms", 
    contact: "Contact" 
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-[1000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center cursor-pointer">
            <img
              src="/Edlogoo.png"
              alt="ED Pharma"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
            <NavLink href="/" isActive={isActiveLink('/')}>
              {currentTranslations.home || "Home"}
            </NavLink>
            <NavLink href="/products" isActive={isActiveLink('/products')}>
              {currentTranslations.products || "Products"}
            </NavLink>
            <NavLink href="/about" isActive={isActiveLink('/about')}>
              {currentTranslations.about || "About"}
            </NavLink>
            <NavLink href="/terms" isActive={isActiveLink('/terms')}>
              {currentTranslations.terms || "Terms"}
            </NavLink>
            <NavLink href="/contact" isActive={isActiveLink('/contact')}>
              {currentTranslations.contact || "Contact"}
            </NavLink>

            {/* ================= ENHANCED DESKTOP SEARCH ================= */}
            <div className="flex items-center gap-4">
              <div ref={desktopSearchRef} className="relative">
                <button
                  onClick={toggleDesktopSearch}
                  className="text-blue-700 hover:text-blue-800 transition p-2 rounded-full hover:bg-blue-50
                    relative group cursor-pointer"
                  title="Search products"
                >
                  <Search size={22} />
                  {query.trim() && showDesktopSearch && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs 
                      font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      !
                    </span>
                  )}
                </button>

                {showDesktopSearch && (
                  <div className="absolute right-0 top-0 mt-12 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-[500px] z-50 ">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search compounds, brands, products..."
                          value={query}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          onKeyDown={handleSearch}
                          className="w-full border border-gray-300 rounded-xl pl-11 pr-10 py-3 text-sm
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                            placeholder-gray-400"
                        />
                        {query && (
                          <button
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleSearchSubmit}
                        disabled={!query.trim()}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl 
                          hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-300 disabled:from-gray-300 
                          disabled:to-gray-400 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Search size={18} />
                      </button>
                    </div>

                    {/* Render enhanced suggestions */}
                    {renderSuggestions()}
                  </div>
                )}
              </div>

              {/* DOWNLOAD PDF */}
              <a
                href="/ED.pdf"
                download
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-700 rounded-full 
                  hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Download size={16} />
                {t?.en?.download || "Download catalogue"}
              </a>

              {/* LANGUAGE SELECTOR */}
              <div ref={languageRef} className="relative">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg 
                    hover:border-blue-400 hover:bg-blue-50 min-w-[100px] transition-colors cursor-pointer"
                >
                  <img
                    src={`https://flagcdn.com/w20/${currentLanguageInfo.flag}.png`}
                    alt={currentLanguageInfo.label}
                    className="w-6 h-4 rounded-sm"
                  />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                  <ChevronDown size={16} />
                </button>

                {languageOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border z-[999] max-h-[400px] overflow-y-auto">
                    <div className="p-3 border-b">
                      <p className="font-semibold text-sm">Select Language</p>
                    </div>
                    <div className="p-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg 
                            ${language === lang.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                        >
                          <img
                            src={`https://flagcdn.com/w20/${lang.flag}.png`}
                            alt={lang.label}
                            className="w-5 h-4 rounded-sm"
                          />
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CART */}
              <button
                onClick={() => router.push("/cart")}
                className="relative text-2xl hover:scale-105 transition-transform cursor-pointer"
                title="Cart"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* LOGIN / PROFILE */}
              {username ? (
                <div className="relative profile-menu-container">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 
                      text-blue-700 font-semibold hover:bg-blue-50 min-w-[120px] justify-center transition-colors cursor-pointer"
                  >
                    <User size={16} />
                    {t?.en?.hi || "Hi"}, {username.length > 8 ? `${username.substring(0, 8)}...` : username}
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border z-[999]">
                      <div className="p-3 border-b">
                        <p className="font-semibold text-sm">{username}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b transition-colors cursor-pointer"
                      >
                        <PackageIcon />
                        <span>{t?.en?.orders || "My Orders"}</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b transition-colors cursor-pointer"
                      >
                        <User size={14} />
                        <span>{t?.en?.profile || "My Profile"}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>{t?.en?.logout || "Logout"}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="text-blue-600 font-semibold hover:text-blue-700 px-4 py-2 transition-colors cursor-pointer"
                >
                  {t?.en?.login || "Log In"}
                </button>
              )}
            </div>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="flex items-center gap-3 md:hidden">
            {/* LANGUAGE */}
            <div ref={mobileLanguageRef} className="relative">
              <button
                onClick={() => setMobileLanguageOpen(!mobileLanguageOpen)}
                className="flex items-center gap-1 p-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
              >
                <img
                  src={`https://flagcdn.com/w20/${currentLanguageInfo.flag}.png`}
                  alt={currentLanguageInfo.label}
                  className="w-5 h-4 rounded-sm"
                />
                <ChevronDown size={16} />
              </button>

              {mobileLanguageOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-[1002] max-h-[350px] overflow-y-auto">
                  <div className="p-3 border-b">
                    <p className="font-semibold text-sm">Select Language</p>
                  </div>
                  <div className="p-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg 
                          ${language === lang.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                      >
                        <img
                          src={`https://flagcdn.com/w20/${lang.flag}.png`}
                          alt={lang.label}
                          className="w-5 h-4 rounded-sm"
                        />
                        <span className="text-xs">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SEARCH TOGGLE */}
            {!mobileSearchOpen && (
              <button
                onClick={toggleMobileSearch}
                className="text-blue-700 hover:text-blue-800 p-2 transition-colors cursor-pointer"
              >
                <Search size={24} />
              </button>
            )}

            {/* CART */}
            <button
              onClick={() => router.push("/cart")}
              className="relative text-2xl text-blue-700 hover:text-blue-800 p-1 transition-colors cursor-pointer"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* MENU TOGGLE */}
            {!mobileSearchOpen && (
              <button 
                onClick={() => setMenuOpen(true)} 
                className="text-blue-700 hover:text-blue-800 p-2 transition-colors cursor-pointer"
              >
                <Menu size={28} />
              </button>
            )}

            {/* ENHANCED MOBILE SEARCH BAR */}
            {mobileSearchOpen && (
              <div ref={mobileSearchRef} className="absolute top-0 left-0 right-0 min-h-[60px] bg-white px-4 flex items-center gap-2 z-[1001] shadow-md">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search compounds, brands..."
                    value={query}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-10 py-2.5 text-base"
                    style={{ fontSize: '16px' }}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  disabled={!query.trim()}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Search size={18} />
                </button>
                <button
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setQuery("");
                    setSuggestions([]);
                    setSelectedBrand(null);
                  }}
                  className="text-blue-700 hover:text-blue-800 p-1 transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>

                {/* MOBILE SUGGESTIONS - Full height overlay */}
                {(suggestions.length > 0 || query.trim()) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto z-50">
                    <div className="p-4">
                      {renderSuggestions()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/40 z-[999] cursor-pointer" />

            
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[1001] shadow-2xl flex flex-col">
            <div className="p-5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  {username ? (
                    <p className="font-semibold">{t?.en?.hi || "Hi"}, {username.length > 12 ? `${username.substring(0, 12)}...` : username}</p>
                  ) : (
                    <p className="font-semibold">Guest User</p>
                  )}
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-1">
              <MobileLink href="/" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/')}>
                {currentTranslations.home || "Home"}
              </MobileLink>
              <MobileLink href="/products" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/products')}>
                {currentTranslations.products || "Products"}
              </MobileLink>
              <MobileLink href="/about" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/about')}>
                {currentTranslations.about || "About Us"}
              </MobileLink>
              <MobileLink href="/terms" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/terms')}>
                {currentTranslations.terms || "Terms"}
              </MobileLink>
              <MobileLink href="/contact" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/contact')}>
                {currentTranslations.contact || "Contact"}
              </MobileLink>
              <MobileLink href="/orders" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/orders')}>
                {t?.en?.orders || "My Orders"}
              </MobileLink>

              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-3">Language</p>
                <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg 
                        ${language === lang.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                    >
                      <img
                        src={`https://flagcdn.com/w20/${lang.flag}.png`}
                        alt={lang.label}
                        className="w-5 h-4 rounded-sm"
                      />
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="/ED.pdf"
                download
                className="flex items-center gap-3 px-4 py-3 text-blue-700 font-semibold hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                <Download size={20} />
                {t?.en?.download || "Download PDF"}
              </a>

              {username ? (
                <>
                  <MobileLink href="/profile" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/profile')}>
                    {t?.en?.profile || "My Profile"}
                  </MobileLink>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl w-full text-left transition-colors cursor-pointer"
                  >
                    <LogOut size={20} />
                    {t?.en?.logout || "Logout"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsPopupOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-xl w-full text-left transition-colors cursor-pointer"
                >
                  <User size={20} />
                  {t?.en?.login || "Login"} / Register
                </button>
              )}
            </div>

            <div className="p-5 border-t bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} ED Pharma. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-[64px]" />

      {/* LOGIN MODAL */}
      <LoginPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

/* ================= HELPERS ================= */

function NavLink({ href, children, isActive }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors cursor-pointer ${
        isActive 
          ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1' 
          : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick, isActive }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 text-base font-semibold rounded-xl transition-colors cursor-pointer ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-900 hover:bg-blue-50'
      }`}
    >
      {children}
    </Link>
  );
}

function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  );
}