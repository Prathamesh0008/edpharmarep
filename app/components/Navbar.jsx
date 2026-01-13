"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Download, Search, LogOut, ChevronRight, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useCart } from "./CartContext";
import LoginPopup from "./LoginPopup";
import { products } from "@/app/data/products";
import { useLanguage } from "@/context/LanguageContext"; // ADD THIS IMPORT

/* ================= NAVBAR ================= */

export default function Navbar() {
  const router = useRouter();
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
  
  // REMOVE local language state and use LanguageContext instead
  const { language, changeLanguage, availableLanguages, t } = useLanguage(); // ADD THIS

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const cartCount = getCartBadgeCount();

  /* ---------- LANGUAGES CONFIG ---------- */
  // UPDATE THIS to use availableLanguages from context or create a mapping
  const LANGUAGE_MAPPING = {
    "en": { label: "English", flag: "us" },
    "nl": { label: "Dutch", flag: "nl" },
    "fr": { label: "French", flag: "fr" },
    "de": { label: "German", flag: "de" },
    "es": { label: "Spanish", flag: "es" },
    "ar": { label: "Arabic", flag: "sa" },
    "zh": { label: "Chinese", flag: "cn" },
    "ja": { label: "Japanese", flag: "jp" },
    "pt": { label: "Portuguese", flag: "pt" },
    "ro": { label: "Romanian", flag: "ro" },
    "sq": { label: "Albanian", flag: "al" },
    "el": { label: "Greek", flag: "gr" },
    "bg": { label: "Bulgarian", flag: "bg" },
    "mk": { label: "Macedonian", flag: "mk" },
    "sr": { label: "Serbian", flag: "rs" },
    "hr": { label: "Croatian", flag: "hr" },
    "bs": { label: "Bosnian", flag: "ba" },
  };

  // Get current language info
  const currentLanguageInfo = LANGUAGE_MAPPING[language] || LANGUAGE_MAPPING.en;

  // Create LANGUAGES array from mapping
  const LANGUAGES = Object.entries(LANGUAGE_MAPPING).map(([code, info]) => ({
    code,
    label: info.label,
    flag: info.flag
  }));

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

    // REMOVE local language loading - LanguageContext handles this
    // const savedLang = localStorage.getItem("ed-lang");
    // if (savedLang) {
    //   setLanguage(savedLang);
    // }

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
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setSuggestions([]);
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

  /* ---------- LANGUAGE HANDLER ---------- */
  const handleLanguageChange = (code) => {
    changeLanguage(code); // Use context function
    setLanguageOpen(false);
    setMobileLanguageOpen(false);
    setMenuOpen(false);
  };

  /* ---------- SEARCH FUNCTIONS ---------- */
  const handleSearchChange = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const results = products
      .filter((p) => {
        const q = value.toLowerCase().trim();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.composition?.toLowerCase().includes(q) ||
          p.strength?.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);

    setSuggestions(results);
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
    
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSuggestionClick = (item) => {
    console.log("Suggestion clicked:", item);
    
    setQuery("");
    setSuggestions([]);
    setShowDesktopSearch(false);
    setMobileSearchOpen(false);
    
    if (item.slug) {
      router.push(`/product/${item.slug}`);
    } else if (item.id) {
      const fullProduct = products.find(p => p.id === item.id);
      if (fullProduct && fullProduct.slug) {
        router.push(`/product/${fullProduct.slug}`);
      } else if (fullProduct && fullProduct.name) {
        const slug = fullProduct.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        router.push(`/product/${slug}`);
      }
    } else if (item.name) {
      const slug = item.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      router.push(`/product/${slug}`);
    }
  };

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
    }
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

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-[1000] h-[60px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
            <Link href="/" className="flex items-center">
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
  const navLinks = t?.en?.home ? t : { 
    en: { home: "Home", products: "Products", about: "About", terms: "Terms", contact: "Contact" },
    es: { home: "Inicio", products: "Productos", about: "Nosotros", terms: "Términos", contact: "Contacto" },
    // Add other languages as needed
  };

  // Get current language translations
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
          {/* LOGO public\logo.svg*/}
          <Link href="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="ED Pharma"
              className="h-18 w-auto object-contain"
            />
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
            <NavLink href="/">{currentTranslations.home || "Home"}</NavLink>
            <NavLink href="/products">{currentTranslations.products || "Products"}</NavLink>
            <NavLink href="/about">{currentTranslations.about || "About"}</NavLink>
            <NavLink href="/terms">{currentTranslations.terms || "Terms"}</NavLink>
            <NavLink href="/contact">{currentTranslations.contact || "Contact"}</NavLink>

            {/* ================= DESKTOP SEARCH ================= */}
            <div className="flex items-center gap-4">
              <div ref={desktopSearchRef} className="relative">
                <button
                  onClick={toggleDesktopSearch}
                  className="text-blue-700 hover:text-blue-800 transition p-2 rounded-full hover:bg-blue-50"
                  title="Search products"
                >
                  <Search size={22} />
                </button>

                {showDesktopSearch && (
                  <div className="absolute right-0 top-0 mt-12 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-96 z-50">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          autoFocus
                          type="text"
                          placeholder={t?.productsPage?.filters?.searchPlaceholder || "Search products..."}
                          value={query}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          onKeyDown={handleSearch}
                          className="w-full border border-gray-300 rounded-xl pl-11 pr-10 py-2.5 text-sm
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        {query && (
                          <button
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleSearchSubmit}
                        disabled={!query.trim()}
                        className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 
                          disabled:bg-gray-300"
                      >
                        <Search size={18} />
                      </button>
                    </div>

                    {suggestions.length > 0 && (
                      <div className="mt-2 border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                        {suggestions.map((item) => (
                          <button
                            key={item.id || item.name}
                            onClick={() => handleSuggestionClick(item)}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 
                              flex items-center justify-between border-b last:border-b-0"
                          >
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.strength || item.brand || ''}
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* DOWNLOAD PDF */}
              <a
                href="/ED.pdf"
                download
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-700 rounded-full 
                  hover:bg-blue-50"
              >
                <Download size={16} />
                {t?.en?.download || "Download catalogue"}
              </a>

              {/* LANGUAGE SELECTOR */}
              <div ref={languageRef} className="relative">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg 
                    hover:border-blue-400 hover:bg-blue-50 min-w-[100px]"
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
                            ${language === lang.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
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
                className="relative text-2xl hover:scale-105"
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
                      text-blue-700 font-semibold hover:bg-blue-50 min-w-[120px] justify-center"
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
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b"
                      >
                        <PackageIcon />
                        <span>{t?.en?.orders || "My Orders"}</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b"
                      >
                        <User size={14} />
                        <span>{t?.en?.profile || "My Profile"}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
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
                  className="text-blue-600 font-semibold hover:text-blue-700 px-4 py-2"
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
                className="flex items-center gap-1 p-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-full"
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
                          ${language === lang.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
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
                className="text-blue-700 hover:text-blue-800 p-2"
              >
                <Search size={24} />
              </button>
            )}

            {/* CART */}
            <button
              onClick={() => router.push("/cart")}
              className="relative text-2xl text-blue-700 hover:text-blue-800 p-1"
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
                className="text-blue-700 hover:text-blue-800 p-2"
              >
                <Menu size={28} />
              </button>
            )}

            {/* MOBILE SEARCH BAR - SIMPLIFIED */}
            {mobileSearchOpen && (
              <div ref={mobileSearchRef} className="absolute top-0 left-0 right-0 h-[60px] bg-white px-4 flex items-center gap-2 z-[1001] shadow-md">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder={t?.productsPage?.filters?.searchPlaceholder || "Search products..."}
                    value={query}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-10 py-2.5 text-base"
                    style={{ fontSize: '16px' }}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  disabled={!query.trim()}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-300"
                >
                  <Search size={18} />
                </button>
                <button
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setQuery("");
                    setSuggestions([]);
                  }}
                  className="text-blue-700 hover:text-blue-800 p-1"
                >
                  <X size={24} />
                </button>

                {/* MOBILE SUGGESTIONS - SIMPLIFIED */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((item) => (
                      <button
                        key={item.id || item.name}
                        onClick={() => {
                          console.log("Mobile suggestion clicked");
                          handleSuggestionClick(item);
                        }}
                        className="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-blue-50 active:bg-blue-100"
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.strength || item.brand || ''}</div>
                      </button>
                    ))}
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
          <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/40 z-[999]" />
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
                <button onClick={() => setMenuOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-1">
              <MobileLink href="/" onClick={() => setMenuOpen(false)}>{currentTranslations.home || "Home"}</MobileLink>
              <MobileLink href="/products" onClick={() => setMenuOpen(false)}>{currentTranslations.products || "Products"}</MobileLink>
              <MobileLink href="/about" onClick={() => setMenuOpen(false)}>{currentTranslations.about || "About Us"}</MobileLink>
              <MobileLink href="/terms" onClick={() => setMenuOpen(false)}>{currentTranslations.terms || "Terms"}</MobileLink>
              <MobileLink href="/contact" onClick={() => setMenuOpen(false)}>{currentTranslations.contact || "Contact"}</MobileLink>
              <MobileLink href="/orders" onClick={() => setMenuOpen(false)}>{t?.en?.orders || "My Orders"}</MobileLink>

              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-3">Language</p>
                <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg 
                        ${language === lang.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
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
                className="flex items-center gap-3 px-4 py-3 text-blue-700 font-semibold hover:bg-blue-50 rounded-xl"
                onClick={() => setMenuOpen(false)}
              >
                <Download size={20} />
                {t?.en?.download || "Download PDF"}
              </a>

              {username ? (
                <>
                  <MobileLink href="/profile" onClick={() => setMenuOpen(false)}>{t?.en?.profile || "My Profile"}</MobileLink>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl w-full text-left"
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
                  className="flex items-center gap-3 px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-xl w-full text-left"
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

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-700 hover:text-blue-600"
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-base font-semibold text-gray-900 hover:bg-blue-50 rounded-xl"
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