"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Download, LogOut, ChevronRight, User, ChevronDown, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import LoginPopup from "./LoginPopup";
import { useLanguage } from "@/context/LanguageContext";


/* ================= NAVBAR ================= */

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems, getCartBadgeCount } = useCart();
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

  const cartCount = getCartBadgeCount();

  /* ---------- LANGUAGES CONFIG ---------- */
  const LANGUAGE_MAPPING = {
    "ar": { label: "العربية", flag: "sa" },
    "sq": { label: "Shqip", flag: "al" },
    "bs": { label: "Bosanski", flag: "ba" },
    "bg": { label: "Български", flag: "bg" },
    "zh": { label: "中文", flag: "cn" },
    "hr": { label: "Hrvatski", flag: "hr" },
    "nl": { label: "Nederlands", flag: "nl" },
    "en": { label: "English", flag: "us" },
    "fr": { label: "Français", flag: "fr" },
    "de": { label: "Deutsch", flag: "de" },
    "el": { label: "Ελληνικά", flag: "gr" },
    "ja": { label: "日本語", flag: "jp" },
    "mk": { label: "Македонски", flag: "mk" },
    "pt": { label: "Português", flag: "pt" },
    "ro": { label: "Română", flag: "ro" },
    "sr": { label: "Српски", flag: "rs" },
    "es": { label: "Español", flag: "es" },
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
    contact: "Contact",
    blog: "Blog"
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-[1000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-[60px] flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center cursor-pointer flex-shrink-0">
            <img
              src="/ED_5.svg"
              alt="ED Pharma"
              className="h-10 sm:h-10 lg:h-11 w-auto object-contain"
            />
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-slate-700 font-medium">
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
            <NavLink href="/blog" isActive={isActiveLink('/blog')}>
              {currentTranslations.blog || "Blog"}
            </NavLink>
            <NavLink href="/contact" isActive={isActiveLink('/contact')}>
              {currentTranslations.contact || "Contact"}
            </NavLink>

            {/* ================= DESKTOP ACTIONS ================= */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* DOWNLOAD PDF - Hide on smaller desktop */}
              <a
                href="/ED.pdf"
                download
                className="hidden lg:flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-700 rounded-full 
                  hover:bg-blue-50 transition-colors cursor-pointer text-sm"
              >
                <Download size={16} />
                {t?.en?.download || "Download"}
              </a>

              {/* LANGUAGE SELECTOR - DESKTOP */}
              <div ref={languageRef} className="relative">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 border border-gray-300 rounded-lg 
                    hover:border-blue-400 hover:bg-blue-50 min-w-[70px] lg:min-w-[100px] transition-colors cursor-pointer"
                >
                  <img
                    src={`https://flagcdn.com/w20/${currentLanguageInfo.flag}.png`}
                    alt={currentLanguageInfo.label}
                    className="w-4 h-3 lg:w-5 lg:h-4 rounded-sm"
                  />
                  <span className="text-xs lg:text-sm font-medium">{language.toUpperCase()}</span>
                  <ChevronDown size={14} className="lg:size-4" />
                </button>

                {languageOpen && (
                  <div className="absolute right-0 mt-2 w-56 lg:w-64 bg-white rounded-xl shadow-xl border z-[999] max-h-[400px] overflow-y-auto">
                    <div className="p-2 lg:p-3 border-b">
                      <p className="font-semibold text-xs lg:text-sm">Select Language</p>
                    </div>
                    <div className="p-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 text-xs lg:text-sm rounded-lg 
                            ${language === lang.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                        >
                          <img
                            src={`https://flagcdn.com/w20/${lang.flag}.png`}
                            alt={lang.label}
                            className="w-4 h-3 lg:w-5 lg:h-4 rounded-sm"
                          />
                          <span className="truncate">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CART */}
              <button
                onClick={() => router.push("/cart")}
                className="relative text-xl lg:text-2xl hover:scale-105 transition-transform cursor-pointer p-1"
                title="Cart"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* LOGIN / PROFILE */}
              {username ? (
                <div className="relative profile-menu-container">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-blue-200 
                      text-blue-700 font-semibold hover:bg-blue-50 min-w-[100px] lg:min-w-[120px] justify-center transition-colors cursor-pointer text-xs lg:text-sm"
                  >
                    <User size={14} className="lg:size-4" />
                    <span className="truncate">{username.length > 8 ? `${username.substring(0, 6)}...` : username}</span>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 lg:w-48 bg-white rounded-xl shadow-xl border z-[999]">
                      <div className="p-2 lg:p-3 border-b">
                        <p className="font-semibold text-xs lg:text-sm truncate">{username}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm hover:bg-gray-50 border-b transition-colors cursor-pointer"
                      >
                        <PackageIcon />
                        <span className="truncate">{t?.en?.orders || "Orders"}</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm hover:bg-gray-50 border-b transition-colors cursor-pointer"
                      >
                        <User size={14} />
                        <span className="truncate">{t?.en?.profile || "Profile"}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span className="truncate">{t?.en?.logout || "Logout"}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="text-blue-600 font-semibold hover:text-blue-700 px-2 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm transition-colors cursor-pointer"
                >
                  {t?.en?.login || "Login"}
                </button>
              )}
            </div>
          </div>

          {/* ================= MOBILE MENU BUTTONS ================= */}
          <div className="flex items-center gap-1 sm:gap-2 md:hidden">
            {/* CART */}
            <button
              onClick={() => router.push("/cart")}
              className="relative text-xl sm:text-2xl text-blue-700 hover:text-blue-800 p-1 transition-colors cursor-pointer"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* MENU TOGGLE */}
            <button 
              onClick={() => setMenuOpen(true)} 
              className="text-blue-700 hover:text-blue-800 p-1.5 sm:p-2 transition-colors cursor-pointer"
            >
              <Menu size={24} className="sm:size-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/40 z-[999] cursor-pointer" />

          <div className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[1001] shadow-2xl flex flex-col">
            <div className="p-4 sm:p-5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  {username ? (
                    <p className="font-semibold text-sm sm:text-base">{t?.en?.hi || "Hi"}, {username.length > 12 ? `${username.substring(0, 10)}...` : username}</p>
                  ) : (
                    <p className="font-semibold text-sm sm:text-base">Guest User</p>
                  )}
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-1.5 sm:p-2 cursor-pointer">
                  <X size={22} className="sm:size-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-1">
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
              <MobileLink href="/blog" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/blog')}>
                {currentTranslations.blog || "Blog"}
              </MobileLink>
              <MobileLink href="/contact" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/contact')}>
                {currentTranslations.contact || "Contact"}
              </MobileLink>
              <MobileLink href="/orders" onClick={() => setMenuOpen(false)} isActive={isActiveLink('/orders')}>
                {t?.en?.orders || "My Orders"}
              </MobileLink>

              {/* ================= LANGUAGE SELECTOR - MOBILE DROPDOWN ================= */}
              <div className="pt-4 border-t mt-2">
                <div 
                  ref={mobileLanguageRef} 
                  className="relative w-full"
                >
                  <button
                    onClick={() => setMobileLanguageOpen(!mobileLanguageOpen)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Globe size={18} className="sm:size-5 text-blue-600" />
                      <span className="text-sm sm:text-base font-semibold text-gray-700">
                        {t?.en?.language || "Language"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={`https://flagcdn.com/w20/${currentLanguageInfo.flag}.png`}
                          alt={currentLanguageInfo.label}
                          className="w-4 h-3 sm:w-5 sm:h-4 rounded-sm"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                          {language.toUpperCase()}
                        </span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`sm:size-5 transition-transform duration-200 ${mobileLanguageOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Mobile Language Dropdown Menu */}
                  {mobileLanguageOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-[1002] max-h-[300px] overflow-y-auto animate-fade-in">
                      <div className="sticky top-0 bg-white p-2 sm:p-3 border-b">
                        <p className="font-semibold text-xs sm:text-sm text-gray-700">
                          Select your language
                        </p>
                      </div>
                      <div className="p-2">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg 
                              ${language === lang.code 
                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                                : 'hover:bg-gray-50'
                              } transition-all duration-200 cursor-pointer`}
                          >
                            <img
                              src={`https://flagcdn.com/w20/${lang.flag}.png`}
                              alt={lang.label}
                              className="w-5 h-4 sm:w-6 sm:h-5 rounded-sm object-cover"
                            />
                            <span className="flex-1 text-left font-medium">{lang.label}</span>
                            {language === lang.code && (
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <a
                href="/ED.pdf"
                download
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-blue-700 font-semibold hover:bg-blue-50 rounded-xl transition-colors cursor-pointer text-sm sm:text-base"
                onClick={() => setMenuOpen(false)}
              >
                <Download size={18} className="sm:size-5" />
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
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl w-full text-left transition-colors cursor-pointer text-sm sm:text-base"
                  >
                    <LogOut size={18} className="sm:size-5" />
                    {t?.en?.logout || "Logout"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsPopupOpen(true);
                  }}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-xl w-full text-left transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <User size={18} className="sm:size-5" />
                  {t?.en?.login || "Login"} / Register
                </button>
              )}
            </div>

            
            
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-[60px]" />

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
      className={`text-xs lg:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
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
      className={`block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl transition-colors cursor-pointer ${
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
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  );
}